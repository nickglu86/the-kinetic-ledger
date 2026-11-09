// One row of CoinGecko /coins/categories. ("Category" in @/types/api is the older,
// partial shape used by the home TrendingSectors strip.)
export interface MarketCategory {
  id: string;
  name: string;
  market_cap: number | null;
  market_cap_change_24h: number | null;
  volume_24h: number | null;
  /** Coin ids of the 3 largest coins, in the same order as top_3_coins. */
  top_3_coins_id: string[];
  /** Image URLs of those coins. */
  top_3_coins: string[];
  updated_at: string;
}

/** A category with a market cap, plus its fixed rank by market cap. */
export interface RankedSector extends MarketCategory {
  market_cap: number;
  rank: number;
}
