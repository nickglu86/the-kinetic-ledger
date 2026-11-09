import { cache } from "react";
import { ENDPOINTS } from "@/lib/endpoints";
import { FetchError, fetchData } from "@/lib/fetcher";
import { CoinDetail } from "@/features/coin/types";

// Typed data accessor for one coin. First piece of the src/server/data/ layer.
//
// - Returns null when CoinGecko says the coin doesn't exist (404) -> caller shows the 404 page.
// - Throws on anything else (429 rate limit, 5xx, network) -> nearest error.tsx shows "try again".
// - cache() dedupes calls within one request, so generateMetadata and the page share a single fetch.
export const getCoin = cache(async (id: string): Promise<CoinDetail | null> => {
  try {
    return await fetchData<CoinDetail>(ENDPOINTS.coinDetail(id));
  } catch (error) {
    if (error instanceof FetchError && error.status === 404) return null;
    throw error;
  }
});
