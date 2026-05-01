import { ENDPOINTS } from "@/lib/endpoints";
import { fetchData } from "@/lib/fetcher";
import { formatMarketCap, formatPrice } from "@/lib/formats";
import { cn } from "@/lib/utils";
import { CoinMarket } from "@/types/api";

export const MarketTable = async () => {
    const coins = await fetchData<CoinMarket[]>(ENDPOINTS.coinsMarket(100));

    return (
        <div className="lg:col-span-8 space-y-8">
            <div className="flex items-end justify-between border-b border-outline-variant/10 pb-4">
                <h2 className="font-headline font-extrabold text-3xl tracking-tighter uppercase">Market Rankings</h2>
                <span className="font-label text-primary text-xs font-bold tracking-widest uppercase">Top 10
                    Assets</span>
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
                        {coins.slice(0, 10).map(
                            (coin) => (
                                <tr
                                    key={coin.id}
                                    className="bg-surface-container-low hover:bg-surface-container-high transition-colors group cursor-pointer">
                                    <td className="py-4 pl-4 rounded-l-lg font-headline font-bold text-on-surface-variant">{coin.market_cap_rank}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={coin.image}
                                                className="w-8 h-8 rounded-full  flex items-center justify-center font-bold text-white text-xs"
                                            />
                                            <div>
                                                <div className="font-headline font-bold text-on-surface">{coin.name}</div>
                                                <div
                                                    className="text-[10px] font-label text-on-surface-variant uppercase tracking-tighter">
                                                    {coin.symbol.toLocaleUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 font-headline font-bold">${formatPrice(coin.current_price)}</td>
                                    <td className={cn("py-4 text-primary font-bold text-sm text-center", coin.price_change_percentage_1h_in_currency >= 0 ? "text-primary" : "text-error")}>
                                        {coin.price_change_percentage_1h_in_currency >= 0 ? "+" : null}
                                        {coin.price_change_percentage_1h_in_currency.toFixed(2)}%</td>
                                    <td className={cn("py-4 text-primary font-bold text-sm  text-center", coin.price_change_percentage_24h >= 0 ? "text-primary" : "text-error")}>
                                        {coin.price_change_percentage_24h >= 0 ? "+" : null}
                                        {coin.price_change_percentage_24h.toFixed(2)}%</td>
                                    <td className={cn("py-4 text-primary font-bold text-sm text-center", coin.price_change_percentage_7d_in_currency >= 0 ? "text-primary" : "text-error")}>
                                        {coin.price_change_percentage_7d_in_currency >= 0 ? "+" : null}
                                        {coin.price_change_percentage_7d_in_currency.toFixed(2)}%</td>
                                    <td className="py-4 text-right pr-4 rounded-r-lg font-headline text-on-surface-variant">
                                        ${formatMarketCap(coin.market_cap)}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}