// Shapes the DeFi page works with. The server trims DefiLlama's large responses down to these.

export interface TvlPoint {
  time: number; // unix seconds (start of the day, UTC)
  value: number; // total value locked, USD
}

export interface ChainTvl {
  name: string;
  tvl: number;
  /** Share of total DeFi TVL, 0-100 */
  share: number;
  tokenSymbol: string | null;
  logo: string;
}

export interface DefiProtocol {
  rank: number;
  name: string;
  slug: string;
  logo: string | null;
  category: string;
  chains: number;
  tvl: number;
  change1d: number | null;
  change7d: number | null;
}

export interface DexProtocol {
  name: string;
  slug: string;
  logo: string | null;
  chains: number;
  volume24h: number;
  change1d: number | null;
}

export interface DexOverview {
  volume24h: number;
  change1d: number | null;
  volume7d: number;
  top: DexProtocol[];
}

export interface Stablecoin {
  name: string;
  symbol: string;
  geckoId: string | null;
  mechanism: string | null;
  circulating: number; // USD
  change7d: number | null; // % change in supply over 7 days
  price: number | null;
}

export interface StablecoinOverview {
  /** Total supply of USD-pegged stablecoins */
  totalUsd: number;
  change7d: number | null;
  top: Stablecoin[];
}
