import Link from "next/link";
import { PercentChange } from "@/components/ui/PercentChange";
import { formatPrice } from "@/lib/formats";
import { CoinDetail } from "./types";

export const CoinHeader = ({ coin }: { coin: CoinDetail }) => {
  const { name, symbol, image, market_cap_rank, market_data } = coin;
  const price = market_data.current_price.usd;

  return (
    <section className="space-y-4 border-b border-outline-variant/10 pb-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Markets
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Decorative: the coin name is right next to it */}
          <img src={image.large} alt="" className="w-14 h-14 rounded-full" />
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-headline font-extrabold text-3xl md:text-4xl tracking-tighter">
                {name}
              </h1>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                {symbol}
              </span>
            </div>
            {market_cap_rank && (
              <span className="inline-block font-label text-[10px] font-bold uppercase tracking-widest text-secondary">
                Rank #{market_cap_rank}
              </span>
            )}
          </div>
        </div>

        <div className="md:text-right">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            Price (USD)
          </p>
          <p className="font-headline font-bold text-4xl tracking-tight text-on-surface">
            {/* No price data: show a dash rather than "$0.00" */}
            {price && price > 0 ? `$${formatPrice(price)}` : "—"}
          </p>
          <p className="text-sm">
            <span className="text-on-surface-variant mr-1">24h</span>
            <PercentChange value={market_data.price_change_percentage_24h} />
          </p>
        </div>
      </div>
    </section>
  );
};
