import Link from "next/link";
import { ENDPOINTS } from "@/lib/endpoints";
import { safeFetch } from "@/lib/fetcher";
import { formatMarketCap, formatPrice } from "@/lib/formats";
import { ICoin } from "@/types/api";
import { PercentChange } from "@/components/ui/PercentChange";
import { Unavailable } from "@/components/ui/Unavailable";

export const MarketTable = async () => {
  const coins = await safeFetch<ICoin[]>(ENDPOINTS.coinsMarket(100));

  const Coin = ({coin}:{ coin: ICoin}) => {
    
    const { id, name, image, market_cap_rank } = coin;

    const current_price = formatPrice(coin.current_price);
    const symbol = coin.symbol.toLocaleUpperCase();
    const marketCap = formatMarketCap(coin.market_cap)

    return (
      <tr
        key={id}
        className="bg-surface-container-low hover:bg-surface-container-high transition-colors group"
      >
        <td className="py-4 pl-4 rounded-l-lg font-headline font-bold text-on-surface-variant">
          {market_cap_rank}
        </td>
        <td className="py-4">
          {/* A <tr> can't be wrapped in a link, so the asset cell is the link to the coin page */}
          <Link href={`/coins/${id}`} className="flex items-center gap-3 w-fit">
            <img
              src={image}
              alt=""
              className="w-8 h-8 rounded-full  flex items-center justify-center font-bold text-white text-xs"
            />
            <div>
              <div className="font-headline font-bold text-on-surface group-hover:text-secondary transition-colors">
                {name}
              </div>
              <div className="text-[10px] font-label text-on-surface-variant uppercase tracking-tighter">
                {symbol}
              </div>
            </div>
          </Link>
        </td>
        <td className="py-4 font-headline font-bold">
          ${current_price}
        </td>
        <td className="py-4 text-sm text-center">
          <PercentChange value={coin.price_change_percentage_1h_in_currency} />
        </td>
        <td className="py-4 text-sm text-center">
          <PercentChange value={coin.price_change_percentage_24h} />
        </td>
        <td className="py-4 text-sm text-center">
          <PercentChange value={coin.price_change_percentage_7d_in_currency} />
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
      {!coins ? (
        <Unavailable className="py-10 items-center" />
      ) : (
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
      )}
    </div>
  );
};
