import Link from "next/link";
import { getMarketsData } from "@/server/data/markets";
import { ICoin } from "@/types/api";
import { formatPrice } from "@/lib/formats";
import { PercentChange } from "@/components/ui/PercentChange";

const STABLE_COINS = ["usdt", "usdc", "usds"];

export const LiveTicker = async () => {
  // Top 30 of the shared market list: no extra API call for the ticker.
  const coins = (await getMarketsData())?.coins.slice(0, 30);
  // Lives in the root layout, so a throw here would hit global-error. Just hide the ticker instead.
  if (!coins) return null;

  const filtered = coins.filter(
    (coin: ICoin) => !STABLE_COINS.includes(coin.symbol),
  );

  const Coin = ({ coin, index }: { coin: ICoin, index: number }) => {
    // The list is rendered twice for the seamless loop. Hide the second copy from
    // screen readers and keyboard tabbing so each coin is only announced/focused once.
    const isDuplicate = index >= filtered.length;

    return (
      <Link
        href={`/coins/${coin.id}`}
        aria-hidden={isDuplicate || undefined}
        tabIndex={isDuplicate ? -1 : undefined}
        className="flex items-center gap-3 min-w-max bg-surface-container-low hover:bg-surface-container-high transition-colors px-4 py-1 rounded-lg border-l-4 border-primary shadow-[0_0_15px_rgba(0,255,163,0.1)]"
      >
        <img
          className="h-6 w-6 w-full object-contain"
          src={coin.image}
          alt={coin.symbol}
        />
        <span className="font-label text-[11px] text-on-surface-variant uppercase tracking-widest">
          {coin.symbol.toLocaleUpperCase()}
        </span>
        <span className="font-headline font-bold text-on-surface">
          ${formatPrice(coin.current_price)}
        </span>
        <PercentChange value={coin.price_change_percentage_24h} className="text-xs" />
      </Link>
    );
  };
  return (
    <div className="w-full bg-surface-container-lowest py-2 overflow-hidden whitespace-nowrap border-b border-outline-variant/10">
      {/* Pause the scroll on hover so items are easy to click */}
      <div className="flex animate-marquee hover:[animation-play-state:paused] gap-8 items-center px-4 w-max">
        {[...filtered, ...filtered].map((coin: ICoin, index: number) =>  <Coin coin={coin} index={index} key={index}/>)}
      </div>
    </div>
  );
};

// Same height as the ticker, shown while its prices load (the layout wraps LiveTicker in <Suspense>).
export const LiveTickerSkeleton = () => (
  <div aria-hidden className="w-full bg-surface-container-lowest py-2 overflow-hidden border-b border-outline-variant/10">
    <div className="flex gap-8 px-4 animate-pulse motion-reduce:animate-none">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="h-8 w-44 shrink-0 rounded-lg bg-surface-container-low border-l-4 border-primary/30" />
      ))}
    </div>
  </div>
);
