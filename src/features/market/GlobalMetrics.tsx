import { safeFetch } from "@/lib/fetcher";
import { ENDPOINTS } from "@/lib/endpoints";
import { formatMarketCap } from "@/lib/formats";
import { getHalvingData } from "@/lib/utils";
import { getMarketsData } from "@/server/data/markets";
import { FearAndGreedResponse, GlobalResponse } from "@/types/api";
import { ChangePill } from "@/components/ui/ChangePill";
import { Unavailable } from "@/components/ui/Unavailable";
import { FearGreedGauge, sentimentColor } from "./FearGreedGauge";
import { MetricCard } from "./metrics/MetricCard";
import { Ring } from "./metrics/Ring";
import { Sparkline } from "./metrics/Sparkline";

const BTC_COLOR = "#f7931a";
const ETH_COLOR = "#627eea";
const OTHERS_COLOR = "#45484c"; // outline-variant
const HALVING_COLOR = "#ac89ff"; // tertiary
const UP_COLOR = "#00FFA3";
const DOWN_COLOR = "#ff716c";

// Block reward now and after the next halving
const REWARD_NOW = 3.125;

const LegendRow = ({ color, label, value, muted }: { color: string; label: string; value: string; muted?: boolean }) => (
  <div className={muted ? "flex items-center justify-between gap-3 text-on-surface-variant" : "flex items-center justify-between gap-3"}>
    <span className="flex items-center gap-1.5">
      <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
    <span className="font-headline font-bold">{value}</span>
  </div>
);

export const GlobalMetrics = async () => {
  // Fetched in parallel; each one can fail on its own and only its card shows "unavailable".
  // getMarketsData is the same request the Markets page makes, so they share one cache entry.
  const [globalRes, fearAndGreedRes, markets] = await Promise.all([
    safeFetch<GlobalResponse>(ENDPOINTS.global),
    safeFetch<FearAndGreedResponse>(ENDPOINTS.fearAndGreed),
    getMarketsData(),
  ]);

  const global = globalRes?.data ?? null;
  const fng = fearAndGreedRes?.data ?? [];
  const { daysLeft, progressPercent } = getHalvingData();

  const btc = global?.market_cap_percentage.btc ?? 0;
  const eth = global?.market_cap_percentage.eth ?? 0;
  const others = Math.max(0, 100 - btc - eth);

  const marketCapChange = global?.market_cap_change_percentage_24h_usd;
  const trend = markets?.marketCapTrend?.map((p) => p.value) ?? [];

  // alternative.me returns newest first: [0] today, [1] yesterday, [7] a week ago
  const fngToday = fng[0] ? Number(fng[0].value) : null;
  const fngYesterday = fng[1]?.value;
  const fngLastWeek = fng[7]?.value;

  return (
    <section aria-label="Market overview" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {global ? (
        <>
          <MetricCard title="Total Market Cap" icon="public" aside={<ChangePill value={marketCapChange} />}>
            <div className="w-full flex items-end justify-between gap-4">
              <div className="shrink-0">
                <p className="font-headline text-2xl font-bold tracking-tight">${formatMarketCap(global.total_market_cap.usd)}</p>
                <p className="mt-1 text-[11px] text-on-surface-variant">
                  24h vol <span className="text-on-surface font-bold">${formatMarketCap(global.total_volume.usd)}</span>
                </p>
              </div>
              <Sparkline
                values={trend}
                color={(marketCapChange ?? 0) < 0 ? DOWN_COLOR : UP_COLOR}
                className="h-12 w-full max-w-40"
              />
            </div>
          </MetricCard>

          <MetricCard title="Dominance" icon="donut_large">
            <div className="w-full flex items-center gap-4">
              <Ring
                segments={[
                  { value: btc, color: BTC_COLOR },
                  { value: eth, color: ETH_COLOR },
                  { value: others, color: OTHERS_COLOR },
                ]}
              >
                <span className="font-headline text-[13px] font-bold">{btc.toFixed(1)}%</span>
                <span className="mt-0.5 font-label text-[8px] uppercase tracking-widest text-on-surface-variant">BTC</span>
              </Ring>
              <div className="flex-1 min-w-0 flex flex-col gap-1 text-xs">
                <LegendRow color={BTC_COLOR} label="Bitcoin" value={`${btc.toFixed(1)}%`} />
                <LegendRow color={ETH_COLOR} label="Ethereum" value={`${eth.toFixed(1)}%`} />
                <LegendRow color={OTHERS_COLOR} label="Others" value={`${others.toFixed(1)}%`} muted />
              </div>
            </div>
          </MetricCard>
        </>
      ) : (
        <>
          <Unavailable label="Total Market Cap" />
          <Unavailable label="Dominance" />
        </>
      )}

      <MetricCard
        title="BTC Halving"
        icon="hourglass_top"
        aside={
          <span className="px-1.5 py-0.5 rounded-md bg-tertiary/10 text-tertiary font-label text-[11px] font-bold">
            {Math.floor(progressPercent)}%
          </span>
        }
      >
        <div className="w-full flex items-center gap-4">
          <Ring segments={[{ value: progressPercent, color: HALVING_COLOR }]} rounded>
            <span className="font-headline text-base font-bold">{daysLeft}</span>
            <span className="mt-0.5 font-label text-[8px] uppercase tracking-widest text-on-surface-variant">days</span>
          </Ring>
          <div className="flex-1 min-w-0">
            <p className="font-headline font-bold">
              ~Apr 2028 <span className="text-xs font-normal text-on-surface-variant">estimated</span>
            </p>
            <p className="mt-1 text-[11px] text-on-surface-variant">
              Reward {REWARD_NOW} → <span className="text-tertiary font-bold">{REWARD_NOW / 2} BTC</span>
            </p>
          </div>
        </div>
      </MetricCard>

      {fngToday !== null ? (
        <MetricCard
          title="Fear & Greed"
          icon="speed"
          aside={
            <span
              className="px-1.5 py-0.5 rounded-md font-label text-[11px] font-bold"
              style={{ color: sentimentColor(fngToday), backgroundColor: `${sentimentColor(fngToday)}1a` }}
            >
              {fng[0].value_classification}
            </span>
          }
        >
          <div className="w-full flex items-center gap-4">
            <FearGreedGauge value={fngToday} />
            <div className="flex-1 min-w-0">
              <p className="font-headline text-2xl font-bold" style={{ color: sentimentColor(fngToday) }}>
                {fngToday}
                <span className="text-xs font-normal text-on-surface-variant"> / 100</span>
              </p>
              <div className="mt-1 text-[11px] text-on-surface-variant">
                {fngYesterday && (
                  <p>Yesterday <span className="text-on-surface font-bold">{fngYesterday}</span></p>
                )}
                {fngLastWeek && (
                  <p>Last week <span className="text-on-surface font-bold">{fngLastWeek}</span></p>
                )}
              </div>
            </div>
          </div>
        </MetricCard>
      ) : (
        <Unavailable label="Fear & Greed Index" />
      )}
    </section>
  );
};
