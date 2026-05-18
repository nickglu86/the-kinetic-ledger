import { ENDPOINTS } from "@/lib/endpoints";
import { fetchData } from "@/lib/fetcher";
import { ICoin } from "@/types/api";
import { cn } from "@/lib/utils";
import { formatPercent, formatPrice, isPositive } from "@/lib/formats";

const STABLE_COINS = ["usdt", "usdc", "usds"];

export const LiveTicker = async () => {
  const coins = await fetchData<ICoin[]>(ENDPOINTS.coinsMarket(30));
  const filtered = coins.filter(
    (coin: ICoin) => !STABLE_COINS.includes(coin.symbol),
  );

  const Coin = ({ coin, index }: { coin: ICoin, index: number }) => {
    const price24hPercentIsPositive = isPositive(
      coin.price_change_percentage_24h,
    );
    const price24hPercent = formatPercent(coin.price_change_percentage_24h);

    return (
      <div
        key={`${coin.id}-${index}`}
        className="flex items-center gap-3 min-w-max bg-surface-container-low px-4 py-1 rounded-lg border-l-4 border-primary shadow-[0_0_15px_rgba(0,255,163,0.1)]"
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
        <span
          className={cn(
            "text-xs font-bold",
            price24hPercentIsPositive
              ? "text-primary"
              : "text-error",
          )}
        >
          {price24hPercent}
        </span>
      </div>
    );
  };
  return (
    <div className="w-full bg-surface-container-lowest py-2 overflow-hidden whitespace-nowrap border-b border-outline-variant/10">
      <div className="flex animate-marquee gap-8 items-center px-4 w-max">
        {[...filtered, ...filtered].map((coin: ICoin, index: number) =>  <Coin coin={coin} index={index} key={index}/>)}
      </div>
    </div>
  );
};
