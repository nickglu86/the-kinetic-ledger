// Perpetual futures summarised per coin (all major exchanges together)
export interface PerpCoin {
  /** Index symbol, e.g. "BTC" */
  symbol: string;
  /** CoinGecko coin id when known, for a link to the coin page */
  coinId: string | null;
  /** Logo, for coins in the top 250 (added after caching, from the shared market list) */
  image?: string | null;
  /** Price on the market with the most open interest */
  price: number | null;
  change24h: number | null;
  /** USD value of open positions, summed across exchanges */
  openInterest: number;
  volume24h: number;
  /** Funding rate in % per funding period, open-interest-weighted median across exchanges */
  fundingRate: number | null;
  markets: number;
}

// One perpetual contract on one exchange (used for the Bitcoin breakdown)
export interface PerpMarket {
  market: string;
  symbol: string;
  price: number | null;
  fundingRate: number | null;
  /** Futures price vs spot index, in % */
  basis: number | null;
  openInterest: number;
  volume24h: number;
}

export interface DerivativesExchange {
  id: string;
  name: string;
  image: string | null;
  url: string | null;
  openInterestBtc: number;
  volume24hBtc: number;
  openInterestUsd: number | null;
  volume24hUsd: number | null;
  perpetuals: number;
  futures: number;
}

export interface DerivativesData {
  coins: PerpCoin[];
  btcMarkets: PerpMarket[];
  /** How many exchanges the per-coin numbers include */
  exchangeCount: number;
}
