import { PercentChange } from "@/components/ui/PercentChange";
import { formatMarketCap, formatPrice } from "@/lib/formats";
import { StatTile } from "./StatTile";
import { CoinDetail } from "./types";

// CoinGecko leaves many of these empty for small coins, so every formatter falls back to a dash.
const DASH = "—";
const isNum = (value: number | null | undefined): value is number => typeof value === "number";

const usd = (value: number | null | undefined) => (isNum(value) ? `$${formatMarketCap(value)}` : DASH);
const usdPrice = (value: number | null | undefined) => (isNum(value) && value > 0 ? `$${formatPrice(value)}` : DASH);
const supply = (value: number | null | undefined, symbol: string) =>
  isNum(value) ? `${formatMarketCap(value)} ${symbol}` : DASH;

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

// Fixed locale and time zone so the server renders the same date regardless of where it runs.
const formatDate = (iso: string | undefined) => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" });
};

export const CoinStats = ({ coin }: { coin: CoinDetail }) => {
  const md = coin.market_data;
  const symbol = coin.symbol.toUpperCase();

  // Circulating supply as a share of max supply (only for capped coins)
  const supplyPercent =
    isNum(md.circulating_supply) && isNum(md.max_supply) && md.max_supply > 0
      ? clampPercent((md.circulating_supply / md.max_supply) * 100)
      : null;

  // Where today's price sits between the 24h low and high
  const low = md.low_24h.usd;
  const high = md.high_24h.usd;
  const price = md.current_price.usd;
  const rangePercent =
    isNum(low) && isNum(high) && isNum(price) && high > low
      ? clampPercent(((price - low) / (high - low)) * 100)
      : null;

  const athDate = formatDate(md.ath_date.usd);

  return (
    <section className="space-y-4">
      <h2 className="font-headline text-lg font-bold uppercase tracking-tight">Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Market Cap" value={usd(md.market_cap.usd)} />
        <StatTile label="24h Volume" value={usd(md.total_volume.usd)} />
        <StatTile label="Fully Diluted Valuation" value={usd(md.fully_diluted_valuation.usd)} />

        <StatTile label="Circulating Supply" value={supply(md.circulating_supply, symbol)}>
          {supplyPercent !== null && (
            <>
              {/* The text below carries the same info, so the bar is decorative */}
              <div aria-hidden className="h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${supplyPercent}%` }} />
              </div>
              <p className="text-[11px] text-on-surface-variant">{supplyPercent.toFixed(1)}% of max supply</p>
            </>
          )}
        </StatTile>

        <StatTile label="Total Supply" value={supply(md.total_supply, symbol)} />
        <StatTile
          label="Max Supply"
          // null max supply means the coin has no cap
          value={isNum(md.max_supply) ? supply(md.max_supply, symbol) : "∞"}
        />

        {/* Two prices don't fit one line for tiny coins ($0.000004840), so low and high get a row each */}
        <StatTile label="24h Range">
          <dl className="space-y-0.5 text-sm">
            {[{ name: "Low", value: low }, { name: "High", value: high }].map(({ name, value }) => (
              <div key={name} className="flex justify-between gap-2">
                <dt className="text-on-surface-variant">{name}</dt>
                <dd className="font-headline font-bold truncate">{usdPrice(value)}</dd>
              </div>
            ))}
          </dl>
          {rangePercent !== null && (
            <div aria-hidden className="relative h-1.5 rounded-full bg-linear-to-r from-error/60 to-primary/60">
              <div
                className="absolute top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-on-surface border-2 border-surface"
                style={{ left: `${rangePercent}%` }}
              />
            </div>
          )}
        </StatTile>

        <StatTile label="All-Time High" value={usdPrice(md.ath.usd)}>
          <p className="text-[11px] text-on-surface-variant">
            <PercentChange value={md.ath_change_percentage.usd} />
            {athDate && <span className="ml-1">· {athDate}</span>}
          </p>
        </StatTile>
      </div>
    </section>
  );
};
