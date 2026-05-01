import { ENDPOINTS } from "@/lib/endpoints"
import { fetchData } from "@/lib/fetcher"
import { CoinMarket } from "@/types/api"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/formats";
 
const STABLE_COINS = ["usdt", "usdc", "usds"];

export const LiveTicker = async () => {
    const coins = await fetchData<CoinMarket[]>(ENDPOINTS.coinsMarket(30));
    const filtered =  coins.filter((coin: CoinMarket) => !STABLE_COINS.includes(coin.symbol));

    return (
        <div
            className="w-full bg-surface-container-lowest py-2 overflow-hidden whitespace-nowrap border-b border-outline-variant/10">
            <div className="flex animate-marquee gap-8 items-center px-4 w-max">
                {
                        [...filtered, ...filtered].map(
                            (coin: CoinMarket, index:number) => (
                                <div
                                    key={`${coin.id}-${index}`}
                                    className="flex items-center gap-3 min-w-max bg-surface-container-low px-4 py-1 rounded-lg border-l-4 border-primary shadow-[0_0_15px_rgba(0,255,163,0.1)]"
                                    >
                                    <img className="h-6 w-6 w-full object-contain" src={coin.image} alt={coin.symbol} />
                                    <span className="font-label text-[11px] text-on-surface-variant uppercase tracking-widest">{coin.symbol.toLocaleUpperCase()}</span>
                                    <span className="font-headline font-bold text-on-surface">${formatPrice(coin.current_price)}</span>
                                    <span className={cn("text-xs font-bold", coin?.price_change_percentage_24h >=0 ? "text-primary" : "text-error")} >
                                        {coin?.price_change_percentage_24h >=0 ? "+" : null}
                                        {coin?.price_change_percentage_24h.toFixed(2)}%
                                    </span>
                                </div>
                            )
                        )
                }
            </div>
        </div>
    )
}