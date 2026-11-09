import Link from "next/link";
import { ENDPOINTS } from "@/lib/endpoints";
import { safeFetch } from "@/lib/fetcher";
import { formatPrice } from "@/lib/formats";
import { TrendingResponse } from "@/types/api";
import { PercentChange } from "@/components/ui/PercentChange";
import { Unavailable } from "@/components/ui/Unavailable";

export const TrendingCoins = async () => {
    const trending = await safeFetch<TrendingResponse>(ENDPOINTS.trending);
    if (!trending) return <Unavailable label="Trending" className="bg-surface-container-high p-6" />;

    const { coins } = trending;
    return (
        <div className="bg-surface-container-high rounded-xl p-6 glow-primary">
            <div className="flex justify-between">
                <h3 className="font-headline text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">local_fire_department</span>
                    Trending 15
                </h3>
                {/* <div className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
                    <span className="">Price</span>
                    <span className="ml-5 text-center">24h Change</span>
                </div> */}
            </div>

            <div className="space-y-4">
                {coins.slice(0, 10).map(
                    (coin) => (
                        <Link key={coin.item.id} href={`/coins/${coin.item.id}`} className="flex  justify-between group">
                            <div className="flex items-center  gap-3 w-50">
                                <span className="text-on-surface-variant font-label text-[12px] w-5">{coin.item.market_cap_rank}</span>
                                <img src={coin.item.thumb}
                                    alt=""
                                    className="w-5 h-5 rounded-full  flex items-center justify-center font-bold text-white text-xs"
                                />
                                <div className="text-left">
                                    <p
                                        className="font-headline font-bold text-base group-hover:text-secondary transition-colors">
                                        {coin.item.name}</p>
                                </div>
                            </div>
                            <div>


                            </div>
                            <div className="text-right">
                                                                          <p className="text-[12px] text-on-surface-variant">${formatPrice(coin.item.data.price)}</p>
                      
                                <p className="text-xs">
                                    <PercentChange value={coin.item.data.price_change_percentage_24h?.usd} />
                                </p>
                            </div>
                        </Link>
                    )
                )}

                {/* <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <span className="text-on-surface-variant font-label text-[10px]">02</span>
                        <div>
                            <p
                                className="font-headline font-bold text-sm group-hover:text-secondary transition-colors">
                                Pepe</p>
                            <span
                                className="text-[9px] font-label text-on-surface-variant uppercase px-1.5 py-0.5 bg-surface-container-lowest rounded">Meme</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-primary font-bold text-xs">+32.8%</p>
                        <p className="text-[10px] text-on-surface-variant">$0.000008</p>
                    </div>
                </div>
                <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <span className="text-on-surface-variant font-label text-[10px]">03</span>
                        <div>
                            <p
                                className="font-headline font-bold text-sm group-hover:text-secondary transition-colors">
                                Ondo</p>
                            <span
                                className="text-[9px] font-label text-on-surface-variant uppercase px-1.5 py-0.5 bg-surface-container-lowest rounded">RWA</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-primary font-bold text-xs">+5.4%</p>
                        <p className="text-[10px] text-on-surface-variant">$0.78</p>
                    </div>
                </div> */}

                <button
                    className="w-full py-2 mt-2 bg-surface-container-lowest text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-secondary transition-all rounded">
                    View all trending
                </button>
            </div>
        </div>
    )
}