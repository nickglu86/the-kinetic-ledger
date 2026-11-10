import Link from "next/link"
import { getCategories } from "@/server/data/categories"
import { getTrending } from "@/server/data/trending"
import { PercentChange } from "@/components/ui/PercentChange";

const COLORS = ['#00FFA3', '#00e3fd', '#ac89ff', '#ff716c', '#fbbf24', '#f97316', '#a78bfa'];

export const TrendingSectors = async () => {
    // Both are cached and shared: trending with the other home sections, categories with the Rankings page.
    const [trending, allCategories] = await Promise.all([getTrending(), getCategories()]);

    // Non-critical strip: hide it if trending fails. If only /categories fails,
    // still render the sectors, just without the top-3 coin icons.
    if (!trending) return null;
    const trendingCategories = trending.categories;

    const categoriesMap = new Map((allCategories ?? []).map(cat => [cat.name, cat]))
    // Trending categories don't include coin icons; take them from the full category list.
    const categories = trendingCategories.map(
        cat => ({
            ...cat,
            top_3_coins: categoriesMap.get(cat.name)?.top_3_coins,
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
                <Link href="/rankings" className="inline-flex items-center gap-1 text-secondary text-xs font-label uppercase tracking-widest hover:underline">
                    All sectors
                    <span aria-hidden className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
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
                               <p className="text-[13px] tracking-tight">
                                <PercentChange value={category.data.market_cap_change_percentage_24h?.usd} />
                                </p>

                            </div>
                
                         </div>

                    ))
                }
            </div>
        </section>
    )
}