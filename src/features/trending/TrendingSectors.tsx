import { ENDPOINTS } from "@/lib/endpoints"
import { fetchData } from "@/lib/fetcher"
import { cn } from "@/lib/utils";
import { Category, TrendingResponse } from "@/types/api"

const COLORS = ['#00FFA3', '#00e3fd', '#ac89ff', '#ff716c', '#fbbf24', '#f97316', '#a78bfa'];

export const TrendingSectors = async () => {
    const { categories: trendingCategories } = await fetchData<TrendingResponse>(ENDPOINTS.trending);
    const allCategories = await fetchData<Category[]>(ENDPOINTS.categories);

    const categoriesMap = new Map(allCategories.map(cat => [cat.name, cat]))
    const categories = trendingCategories.map(
        cat => ({
            ...cat,
            ...categoriesMap.get(cat.name)
        })
    );

    // console.log(categories)
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline text-lg font-bold tracking-tight uppercase flex items-center gap-2">
                    <span className="w-1 h-6 bg-secondary"></span>
                    Trending Sectors
                </h2>
                <button className="text-secondary text-xs font-label uppercase tracking-widest hover:underline">View Heatmap</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 overflow-x-auto pb-2">
                {categories.map(
                    (category, index) => (
                        <div 
                            key={category.id}
                            className="bg-surface-container p-4 rounded-lg hover:bg-surface-container-high transition-all cursor-pointer border-t-2 border-secondary flex flex-col justify-between h-full"
                            style={{ borderTopColor: COLORS[index % COLORS.length] }}
                           >
                           <h4 className="font-bold text-sm mb-3">{category.name}</h4>
                                <div className="flex items-center gap-1.5 mt-auto">
                                <div className="flex -space-x-1.5 overflow-hidden">
                                {category.top_3_coins?.map(
                                    (coin,index) => (<img key={index} className="w-7 h-7 rounded-full border border-surface bg-surface-container-lowest flex items-center justify-center text-[8px] font-bold text-primary" src={coin} />)
                                )}
                                </div>
                               <p className={cn("text-[13px] font-bold tracking-tight", category.data.market_cap_change_percentage_24h.usd >= 0 ? "text-primary" : "text-error")}>
                                {category.data.market_cap_change_percentage_24h.usd >= 0 ? "+" : null}{category.data.market_cap_change_percentage_24h.usd.toFixed(2)}%
                                </p>

                            </div>
                
                         </div>

                    ))
                }
            </div>
        </section>
    )
}