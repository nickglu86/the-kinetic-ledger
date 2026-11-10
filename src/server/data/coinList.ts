import { cache } from "react";
import { unstable_cache } from "next/cache";
import { REVALIDATE } from "@/lib/cacheTimes";
import { ENDPOINTS } from "@/lib/endpoints";
import { fetchData } from "@/lib/fetcher";
import { getMarketsData } from "./markets";

// Every CoinGecko coin (~22,800), cached for 6 h. Two jobs:
// 1. Guard: a made-up URL like /coins/abc123 gets a 404 straight away instead of costing a CoinGecko call.
//    ("Not found" answers aren't cached, so a bot trying random ids could otherwise use up the monthly limit.)
// 2. Search: the header search looks names and symbols up here, so typing costs no API calls at all.

/** [id, symbol, name]: arrays instead of objects keep the cached list small (~1.1 MB vs 1.5 MB). */
type CoinListEntry = [id: string, symbol: string, name: string];

// Every CoinGecko id is lowercase letters, digits, ".", "_" or "-" (checked against all ~22,800 ids).
const ID_PATTERN = /^[a-z0-9._-]{1,100}$/;

// The raw response isn't stored (false = no-store); only the compact list is.
// Throws on a bad response, and unstable_cache never caches a throw, so a failure is retried next time.
const getCachedCoinList = unstable_cache(
  async (): Promise<CoinListEntry[]> => {
    const list = await fetchData<{ id: string; symbol: string; name: string }[]>(ENDPOINTS.coinsList, false);
    if (!Array.isArray(list) || list.length < 1000) throw new Error("Unexpected /coins/list response");
    return list.map((coin) => [coin.id, coin.symbol, coin.name]);
  },
  ["coingecko-coin-list"],
  { revalidate: REVALIDATE.coinList },
);

const getCoinList = cache(async (): Promise<CoinListEntry[] | null> => {
  try {
    return await getCachedCoinList();
  } catch {
    return null;
  }
});

// Built once per render: the coin page checks the same id for its metadata, data and chart.
const getCoinIdSet = cache(async (): Promise<Set<string> | null> => {
  const list = await getCoinList();
  return list ? new Set(list.map(([id]) => id)) : null;
});

/**
 * false when the id can't be a CoinGecko coin, so the caller can 404 without an API call.
 * If the list itself can't be loaded, the id is let through and CoinGecko answers as before.
 */
export const isKnownCoinId = async (id: string): Promise<boolean> => {
  if (!ID_PATTERN.test(id)) return false;
  const ids = await getCoinIdSet();
  return ids ? ids.has(id) : true;
};

export interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  /** Only for top-250 coins (the market list has logos and ranks; the full list doesn't). */
  image?: string;
  rank?: number;
}

// Lower is better: exact ticker/name, then ticker prefix, then name prefix, then "contains". -1 = no match.
const matchScore = (query: string, name: string, symbol: string) => {
  const n = name.toLowerCase();
  const s = symbol.toLowerCase();
  if (s === query || n === query) return 0;
  if (s.startsWith(query)) return 1;
  if (n.startsWith(query)) return 2;
  if (n.includes(query) || s.includes(query)) return 3;
  return -1;
};

/**
 * Coins matching a name or ticker. The top 250 come first, ordered by how well they match and then
 * by market cap, so "eth" gives Ethereum before the thousands of small tokens with "eth" in the name.
 * The rest of the ~22,800 coins fill any remaining slots.
 */
export const searchCoins = async (rawQuery: string, limit = 8): Promise<CoinSearchResult[]> => {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const [markets, list] = await Promise.all([getMarketsData(), getCoinList()]);

  const top = (markets?.coins ?? [])
    .map((coin) => ({ coin, score: matchScore(query, coin.name, coin.symbol) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => a.score - b.score || (a.coin.market_cap_rank ?? Infinity) - (b.coin.market_cap_rank ?? Infinity))
    .slice(0, limit)
    .map(({ coin }): CoinSearchResult => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      rank: coin.market_cap_rank ?? undefined,
    }));

  if (top.length >= limit || !list) return top;

  // Long tail: only prefix matches (score ≤ 2), shortest names first; "contains" across 22k coins is mostly noise.
  const seen = new Set(top.map((c) => c.id));
  const rest = list
    .filter(([id]) => !seen.has(id))
    .map(([id, symbol, name]) => ({ id, symbol, name, score: matchScore(query, name, symbol) }))
    .filter(({ score }) => score >= 0 && score <= 2)
    .sort((a, b) => a.score - b.score || a.name.length - b.name.length)
    .slice(0, limit - top.length)
    .map(({ id, name, symbol }): CoinSearchResult => ({ id, name, symbol }));

  return [...top, ...rest];
};
