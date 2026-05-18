import { ENDPOINTS } from "@/lib/endpoints";
import { fetchData } from "@/lib/fetcher";
import { formatMarketCap, formatPercent, formatPrice, isPositive } from "@/lib/formats";
import { cn } from "@/lib/utils";
import { ICoin } from "@/types/api";

export const MarketTable = async () => {
  const coins = await fetchData<ICoin[]>(ENDPOINTS.coinsMarket(100));
  console.log(coins);

  const Coin = ({coin}:{ coin: ICoin}) => {
    
    const { id, name, image, market_cap_rank } = coin;

    const current_price = formatPrice(coin.current_price);
    const symbol = coin.symbol.toLocaleUpperCase();
         
    const price1hPercentIsPositive = isPositive(coin.price_change_percentage_1h_in_currency)
    const price1hPercent = formatPercent(coin.price_change_percentage_1h_in_currency)

    const price24hPercentIsPositive =  isPositive(coin.price_change_percentage_24h)
    const price24hPercent = formatPercent(coin.price_change_percentage_24h)

    const price7dPercentIsPositive =  isPositive(coin.price_change_percentage_7d_in_currency)
    const price7dPercent = formatPercent(coin.price_change_percentage_7d_in_currency)

    const marketCap = formatMarketCap(coin.market_cap)

    return (
      <tr
        key={id}
        className="bg-surface-container-low hover:bg-surface-container-high transition-colors group cursor-pointer"
      >
        <td className="py-4 pl-4 rounded-l-lg font-headline font-bold text-on-surface-variant">
          {market_cap_rank}
        </td>
        <td className="py-4">
          <div className="flex items-center gap-3">
            <img
              src={image}
              className="w-8 h-8 rounded-full  flex items-center justify-center font-bold text-white text-xs"
            />
            <div>
              <div className="font-headline font-bold text-on-surface">
                {name}
              </div>
              <div className="text-[10px] font-label text-on-surface-variant uppercase tracking-tighter">
                {symbol}
              </div>
            </div>
          </div>
        </td>
        <td className="py-4 font-headline font-bold">
          ${current_price}
        </td>
        <td
          className={cn(
            "py-4 text-primary font-bold text-sm text-center",
            price1hPercentIsPositive
              ? "text-primary"
              : "text-error",
          )}
        >
          {price1hPercent}
        </td>
        <td
          className={cn(
            "py-4 text-primary font-bold text-sm  text-center",
            price24hPercentIsPositive
              ? "text-primary"
              : "text-error",
          )}
        >
          {price24hPercent}
        </td>
        <td
          className={cn(
            "py-4 text-primary font-bold text-sm text-center",
            price7dPercentIsPositive
              ? "text-primary"
              : "text-error",
          )}
        >
          {price7dPercent}
        </td>
        <td className="py-4 text-right pr-4 rounded-r-lg font-headline text-on-surface-variant">
          ${marketCap}
        </td>
      </tr>
    );
  };
  return (
    <div className="lg:col-span-8 space-y-8">
      <div className="flex items-end justify-between border-b border-outline-variant/10 pb-4">
        <h2 className="font-headline font-extrabold text-3xl tracking-tighter uppercase">
          Market Rankings
        </h2>
        <span className="font-label text-primary text-xs font-bold tracking-widest uppercase">
          Top 10 Assets
        </span>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              <th className="pb-2 pl-4">#</th>
              <th className="pb-2">Asset</th>
              <th className="pb-2">Price</th>
              <th className="pb-2 text-center">1h Change</th>
              <th className="pb-2 text-center">24h Change</th>
              <th className="pb-2 text-center">7d Change</th>
              <th className="pb-2 text-right pr-4">Market Cap</th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {coins.slice(0, 10).map((coin) => <Coin coin={coin}  key={coin.id} /> )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
