import Link from "next/link";
import { externalLinkProps } from "@/features/news/shared";
import { TrustScore } from "@/features/exchanges/TrustScore";
import type { Exchange } from "@/features/exchanges/types";
import { Logo } from "@/components/ui/Logo";
import { formatMarketCap, formatPrice } from "@/lib/formats";
import { safeUrl } from "@/lib/safeUrl";
import type { CoinDetail, CoinTicker } from "./types";

// Only exchanges CoinGecko rates at least this high count as "trusted". The biggest raw volumes
// often come from small exchanges with inflated numbers, so volume alone isn't a good guide.
const MIN_TRUST_SCORE = 7;
const MAX_ROWS = 8;

interface Market {
  ticker: CoinTicker;
  exchange: Exchange | null;
}

// One row per exchange: its highest-volume pair for this coin.
const bestPairPerExchange = (tickers: CoinTicker[], exchangesById: Map<string, Exchange> | null, trustedOnly: boolean) => {
  const best = new Map<string, Market>();
  for (const ticker of tickers) {
    const volume = ticker.converted_volume.usd ?? 0;
    if (ticker.is_anomaly || ticker.is_stale || volume <= 0) continue;

    const exchange = exchangesById?.get(ticker.market.identifier) ?? null;
    if (trustedOnly && (exchange?.trustScore ?? 0) < MIN_TRUST_SCORE) continue;

    const current = best.get(ticker.market.identifier);
    if (!current || volume > (current.ticker.converted_volume.usd ?? 0)) best.set(ticker.market.identifier, { ticker, exchange });
  }
  return [...best.values()]
    .sort((a, b) => (b.ticker.converted_volume.usd ?? 0) - (a.ticker.converted_volume.usd ?? 0))
    .slice(0, MAX_ROWS);
};

interface CoinMarketsProps {
  coin: CoinDetail;
  /** Top 100 exchanges with trust scores. null if that request failed: then every exchange counts as unrated. */
  exchanges: Exchange[] | null;
}

// "Where to trade": the trusted exchanges with the most volume for this coin.
// If the coin trades only on unrated exchanges, those are shown with a warning instead.
export const CoinMarkets = ({ coin, exchanges }: CoinMarketsProps) => {
  const tickers = coin.tickers ?? [];
  if (tickers.length === 0) return null;

  const exchangesById = exchanges ? new Map(exchanges.map((e) => [e.id, e])) : null;
  const trusted = bestPairPerExchange(tickers, exchangesById, true);
  const markets = trusted.length > 0 ? trusted : bestPairPerExchange(tickers, exchangesById, false);
  if (markets.length === 0) return null;

  return (
    <section aria-labelledby="coin-markets-heading" className="bg-surface-container-low rounded-xl p-6 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="coin-markets-heading" className="font-headline text-lg font-bold uppercase tracking-tight">
          Where to trade {coin.symbol.toUpperCase()}
        </h2>
        <Link href="/exchanges" className="font-label text-[10px] uppercase tracking-widest text-secondary hover:underline">
          All exchanges
        </Link>
      </div>

      {trusted.length === 0 && (
        <p className="flex items-start gap-2 text-xs text-[#fbbf24] font-body">
          <span aria-hidden className="material-symbols-outlined text-base">warning</span>
          None of these exchanges has a CoinGecko trust score of {MIN_TRUST_SCORE} or higher. Check them carefully
          before trading.
        </p>
      )}

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-1">
          <thead>
            <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              <th scope="col" className="pb-1 pl-3 font-normal">Exchange</th>
              <th scope="col" className="pb-1 font-normal text-right hidden sm:table-cell">Price</th>
              <th scope="col" className="pb-1 font-normal text-right">24h Volume</th>
              <th scope="col" className="pb-1 font-normal hidden md:table-cell pl-6">Trust</th>
              <th scope="col" className="pb-1 pr-3 font-normal text-right"><span className="sr-only">Link</span></th>
            </tr>
          </thead>
          <tbody>
            {markets.map(({ ticker, exchange }) => {
              const tradeUrl = safeUrl(ticker.trade_url);
              const name = exchange?.name ?? ticker.market.name;
              const pair = `${ticker.base}/${ticker.target}`;
              return (
                <tr key={ticker.market.identifier} className="bg-surface-container hover:bg-surface-container-high transition-colors">
                  <td className="py-2.5 pl-3 rounded-l-lg">
                    <span className="flex items-center gap-3">
                      <Logo src={exchange?.image} name={name} className="rounded-md" />
                      <span className="min-w-0">
                        <span className="block font-headline font-bold text-sm text-on-surface truncate">{name}</span>
                        <span className="block font-label text-[10px] text-on-surface-variant">{pair}</span>
                      </span>
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-headline text-sm text-on-surface hidden sm:table-cell">
                    {typeof ticker.converted_last.usd === "number" ? `$${formatPrice(ticker.converted_last.usd)}` : "—"}
                  </td>
                  <td className="py-2.5 text-right font-headline text-sm text-on-surface-variant">
                    ${formatMarketCap(ticker.converted_volume.usd ?? 0)}
                  </td>
                  <td className="py-2.5 pl-6 hidden md:table-cell">
                    <TrustScore score={exchange?.trustScore ?? null} />
                  </td>
                  <td className="py-2.5 pr-3 rounded-r-lg text-right">
                    {tradeUrl && (
                      <a
                        href={tradeUrl}
                        {...externalLinkProps}
                        aria-label={`Trade ${pair} on ${name} (opens in a new tab)`}
                        className="inline-flex items-center gap-0.5 font-label text-[11px] font-bold uppercase tracking-wider text-primary hover:underline"
                      >
                        Trade
                        <span aria-hidden className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="font-label text-[10px] text-on-surface-variant">
        Links go to the exchange&apos;s own site. Not a recommendation: always check fees and availability in your country.
      </p>
    </section>
  );
};
