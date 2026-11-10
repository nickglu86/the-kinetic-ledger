import { cache } from "react";
import { unstable_cache } from "next/cache";
import { REVALIDATE } from "@/lib/cacheTimes";
import { ENDPOINTS } from "@/lib/endpoints";
import { fetchData } from "@/lib/fetcher";

// Guards coin pages and the chart API route: a made-up URL like /coins/abc123 gets a 404 straight away
// instead of costing a CoinGecko call. "Not found" answers aren't cached, so without this a bot trying
// random ids could use up the monthly API limit.

// Every CoinGecko id is lowercase letters, digits, ".", "_" or "-" (checked against all ~22,800 ids).
const ID_PATTERN = /^[a-z0-9._-]{1,100}$/;

// All CoinGecko coin ids, refreshed every 6 h (1 API call each time).
// The raw /coins/list response is ~1.5 MB, so it isn't stored (false = no-store); only the ids (~400 KB) are.
// Throws on a bad response, and unstable_cache never caches a throw, so a failure is retried next time.
const getCachedCoinIds = unstable_cache(
  async (): Promise<string[]> => {
    const list = await fetchData<{ id: string }[]>(ENDPOINTS.coinsList, false);
    if (!Array.isArray(list) || list.length < 1000) throw new Error("Unexpected /coins/list response");
    return list.map((coin) => coin.id);
  },
  ["coingecko-coin-ids"],
  { revalidate: REVALIDATE.coinList },
);

// Built once per render: the coin page checks the same id for its metadata, data and chart.
const getCoinIdSet = cache(async (): Promise<Set<string> | null> => {
  try {
    return new Set(await getCachedCoinIds());
  } catch {
    return null;
  }
});

/**
 * false when the id can't be a CoinGecko coin, so the caller can 404 without an API call.
 * If the id list itself can't be loaded, the id is let through and CoinGecko answers as before.
 */
export const isKnownCoinId = async (id: string): Promise<boolean> => {
  if (!ID_PATTERN.test(id)) return false;
  const ids = await getCoinIdSet();
  return ids ? ids.has(id) : true;
};
