import Link from "next/link";
import { PercentChange } from "@/components/ui/PercentChange";
import { WatchStar } from "@/features/watchlist/WatchStar";
import { clampPercent, isNum, usdPrice } from "./format";
import { CoinDetail } from "./types";

export const CoinHeader = ({ coin }: { coin: CoinDetail }) => {
  const { name, symbol, image, market_cap_rank, market_data } = coin;
  const price = market_data.current_price.usd;
  const low = market_data.low_24h.usd;
  const high = market_data.high_24h.usd;

  // Where today's price sits between the 24h low and high
  const rangePercent =
    isNum(low) && isNum(high) && isNum(price) && high > low
      ? clampPercent(((price - low) / (high - low)) * 100)
      : null;

  return (
    <section className="space-y-5">
      <Link
        href="/markets"
        className="inline-flex items-center gap-1 font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Markets
      </Link>

      <div className="flex items-center gap-3">
        {/* Decorative: the coin name is right next to it */}
        <img src={image.large} alt="" className="w-10 h-10 rounded-full" />
        <h1 className="font-headline font-extrabold text-3xl tracking-tighter">{name}</h1>
        <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
          {symbol}
        </span>
        {market_cap_rank && (
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5 rounded">
            #{market_cap_rank}
          </span>
        )}
        <WatchStar coinId={coin.id} coinName={name} size="md" className="ml-auto" />
      </div>

      <div className="flex items-baseline gap-3 flex-wrap">
        <p className="font-headline font-bold text-4xl tracking-tight text-on-surface">
          {/* No price data: show a dash rather than "$0.00" */}
          {usdPrice(price)}
        </p>
        <PercentChange value={market_data.price_change_percentage_24h} className="text-base" />
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">24h</span>
      </div>

      {rangePercent !== null && (
        <div className="space-y-2">
          {/* The prices below carry the same info, so the bar is decorative */}
          <div aria-hidden className="relative h-1.5 rounded-full bg-linear-to-r from-error/60 to-primary/60">
            <div
              className="absolute top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-on-surface border-2 border-surface"
              style={{ left: `${rangePercent}%` }}
            />
          </div>
          <div className="flex justify-between gap-2 text-xs">
            <p className="font-headline font-bold">
              <span className="sr-only">24h low </span>
              {usdPrice(low)}
            </p>
            <p aria-hidden className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              24h Range
            </p>
            <p className="font-headline font-bold text-right">
              <span className="sr-only">24h high </span>
              {usdPrice(high)}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
