import type { ReactNode } from "react";
import { PercentChange } from "@/components/ui/PercentChange";
import { clampPercent, formatDate, isNum, supply, usd, usdPrice } from "./format";
import { CoinDetail } from "./types";

// One label/value row of the stats list
const StatRow = ({ label, value, children }: { label: string; value: string; children?: ReactNode }) => (
  <div className="py-3 flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1.5">
    <dt className="text-sm text-on-surface-variant">{label}</dt>
    <dd className="font-headline font-bold text-right">{value}</dd>
    {/* A term can have several descriptions; the extra line takes the full row width */}
    {children && <dd className="w-full">{children}</dd>}
  </div>
);

export const CoinStats = ({ coin }: { coin: CoinDetail }) => {
  const md = coin.market_data;
  const symbol = coin.symbol.toUpperCase();

  // Circulating supply as a share of max supply (only for capped coins)
  const supplyPercent =
    isNum(md.circulating_supply) && isNum(md.max_supply) && md.max_supply > 0
      ? clampPercent((md.circulating_supply / md.max_supply) * 100)
      : null;

  const athDate = formatDate(md.ath_date.usd);

  return (
    <section aria-labelledby="coin-stats-heading" className="bg-surface-container-low rounded-xl px-4 md:px-6 py-2">
      <h2 id="coin-stats-heading" className="sr-only">
        {coin.name} statistics
      </h2>
      <dl className="divide-y divide-outline-variant/15">
        <StatRow label="Market Cap" value={usd(md.market_cap.usd)} />
        <StatRow label="Fully Diluted Valuation" value={usd(md.fully_diluted_valuation.usd)} />
        <StatRow label="24h Trading Volume" value={usd(md.total_volume.usd)} />

        <StatRow label="Circulating Supply" value={supply(md.circulating_supply, symbol)}>
          {supplyPercent !== null && (
            <div className="flex items-center gap-3">
              {/* The percentage next to it carries the same info, so the bar is decorative */}
              <div aria-hidden className="flex-1 h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${supplyPercent}%` }} />
              </div>
              <span className="text-[11px] text-on-surface-variant">{supplyPercent.toFixed(1)}% of max</span>
            </div>
          )}
        </StatRow>

        <StatRow label="Total Supply" value={supply(md.total_supply, symbol)} />
        {/* null max supply means the coin has no cap */}
        <StatRow label="Max Supply" value={isNum(md.max_supply) ? supply(md.max_supply, symbol) : "∞"} />

        <StatRow label="All-Time High" value={usdPrice(md.ath.usd)}>
          <p className="text-[11px] text-on-surface-variant text-right">
            <PercentChange value={md.ath_change_percentage.usd} /> from ATH
            {athDate && <span> · {athDate}</span>}
          </p>
        </StatRow>
      </dl>
    </section>
  );
};
