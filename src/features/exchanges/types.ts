import type { KycPolicy } from "./kyc";

// A spot exchange as the Exchanges page and "Where to trade" use it.
export interface Exchange {
  /** From the hand-checked list in kyc.ts. null = not checked */
  kyc: KycPolicy | null;
  id: string;
  name: string;
  image: string | null;
  url: string | null;
  country: string | null;
  yearEstablished: number | null;
  /** CoinGecko trust score, 1-10 (liquidity, security, scale…) */
  trustScore: number | null;
  trustRank: number;
  volume24hBtc: number;
  /** Converted with the current BTC price. null if the price wasn't available. */
  volume24hUsd: number | null;
}
