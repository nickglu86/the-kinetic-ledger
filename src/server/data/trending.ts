import { cache } from "react";
import { REVALIDATE } from "@/lib/cacheTimes";
import { ENDPOINTS } from "@/lib/endpoints";
import { safeFetch } from "@/lib/fetcher";
import type { TrendingResponse } from "@/types/api";

// CoinGecko trending coins, NFTs and categories. Used by 4 home sections and the Markets page,
// all reading the same cached response. null on failure.
export const getTrending = cache(() => safeFetch<TrendingResponse>(ENDPOINTS.trending, REVALIDATE.trending));
