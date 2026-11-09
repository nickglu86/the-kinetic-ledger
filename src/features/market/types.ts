import type { ICoin } from "@/types/api";

// /coins/markets row as used by the Markets page. ICoin plus the extra fields that page uses.
export interface MarketCoin extends ICoin {
  circulating_supply: number | null;
  price_change_percentage_30d_in_currency?: number | null;
  last_updated?: string;
}
