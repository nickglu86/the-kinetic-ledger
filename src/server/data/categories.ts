import { cache } from "react";
import { REVALIDATE } from "@/lib/cacheTimes";
import { ENDPOINTS } from "@/lib/endpoints";
import { safeFetch } from "@/lib/fetcher";
import type { MarketCategory, RankedSector } from "@/features/rankings/types";

// All CoinGecko categories (~780). Shared by the home Trending Sectors strip and the Rankings page,
// so both read one cached response. null on failure.
export const getCategories = cache(() => safeFetch<MarketCategory[]>(ENDPOINTS.categories, REVALIDATE.categories));

// Sectors (CoinGecko "categories") ranked by market cap.
// About half of CoinGecko's ~780 categories have no market cap yet; those are dropped.
// The rank is computed once here, so it stays the same when the table is re-sorted by another column.
export const getRankedSectors = async (): Promise<RankedSector[] | null> => {
  const categories = await getCategories();
  if (!categories) return null;

  return categories
    .filter((c): c is MarketCategory & { market_cap: number } => typeof c.market_cap === "number" && c.market_cap > 0)
    .sort((a, b) => b.market_cap - a.market_cap)
    .map((c, i) => ({ ...c, rank: i + 1 }));
};
