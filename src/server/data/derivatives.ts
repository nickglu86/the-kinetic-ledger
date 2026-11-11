import { cache } from "react";
import { unstable_cache } from "next/cache";
import { REVALIDATE } from "@/lib/cacheTimes";
import { ENDPOINTS } from "@/lib/endpoints";
import { fetchData } from "@/lib/fetcher";
import { safeUrl } from "@/lib/safeUrl";
import type { DerivativesData, DerivativesExchange, PerpCoin, PerpMarket } from "@/features/derivatives/types";
import { getBtcPrice } from "./exchanges";
import { getMarketsData } from "./markets";

// Derivatives (futures) data from CoinGecko: 2 calls, cached 30-60 min.
//
// /derivatives lists every contract on every exchange (~28,000 rows, ~11 MB), far over Next's 2 MB
// cache limit. It's fetched without caching and summarised per coin; only the summary is cached.
//
// Data quality: the long tail of small exchanges reports odd numbers (and at least one reports funding
// rates as a fraction instead of a percent). So per-coin numbers only include the exchanges with the
// most open interest, and funding uses an open-interest-weighted median, which one outlier can't move.

interface RawContract {
  market: string;
  symbol: string;
  index_id: string | null;
  coin_id: string | null;
  price: string | null; // a string in this endpoint
  price_percentage_change_24h: number | null;
  contract_type: string;
  basis: number | null;
  funding_rate: number | null;
  open_interest: number | null;
  volume_24h: number | null;
  last_traded_at: number | null;
}

interface RawDerivativesExchange {
  id: string;
  name: string;
  image: string | null;
  url: string | null;
  open_interest_btc: number | null;
  trade_volume_24h_btc: string | number | null; // CoinGecko sends this one as a string
  number_of_perpetual_pairs: number | null;
  number_of_futures_pairs: number | null;
}

const MAJOR_EXCHANGE_COUNT = 15;
const COIN_COUNT = 100;
const BTC_MARKET_COUNT = 10;
const DAY = 24 * 60 * 60;

const num = (value: unknown): number | null => {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
};

// Median where each value counts as much as its weight: the value at which half the open interest
// sits above and half below.
const weightedMedian = (items: { value: number; weight: number }[]): number | null => {
  const sorted = items.filter((i) => i.weight > 0).sort((a, b) => a.value - b.value);
  const total = sorted.reduce((sum, i) => sum + i.weight, 0);
  let running = 0;
  for (const item of sorted) {
    running += item.weight;
    if (running >= total / 2) return item.value;
  }
  return null;
};

// Shared by the exchange table and the per-coin summary
const getRawExchanges = cache(() =>
  fetchData<RawDerivativesExchange[]>(ENDPOINTS.derivativesExchanges, REVALIDATE.derivativesExchanges),
);

const getCachedSummary = unstable_cache(
  async (): Promise<DerivativesData> => {
    const [contracts, exchanges] = await Promise.all([
      fetchData<RawContract[]>(ENDPOINTS.derivatives, false),
      fetchData<RawDerivativesExchange[]>(ENDPOINTS.derivativesExchanges, REVALIDATE.derivativesExchanges),
    ]);
    if (!Array.isArray(contracts) || contracts.length < 100) throw new Error("Unexpected /derivatives response");

    const majors = new Set(
      [...exchanges]
        .sort((a, b) => (num(b.open_interest_btc) ?? 0) - (num(a.open_interest_btc) ?? 0))
        .slice(0, MAJOR_EXCHANGE_COUNT)
        .map((e) => e.name),
    );

    // Live perpetuals on major exchanges that report open interest
    const now = Date.now() / 1000;
    const perps = contracts.filter(
      (c) =>
        c.contract_type === "perpetual" &&
        c.index_id &&
        majors.has(c.market) &&
        (num(c.open_interest) ?? 0) > 0 &&
        (c.last_traded_at === null || now - c.last_traded_at < DAY),
    );

    // Group by coin
    const byCoin = new Map<string, RawContract[]>();
    for (const c of perps) {
      const list = byCoin.get(c.index_id!) ?? [];
      list.push(c);
      byCoin.set(c.index_id!, list);
    }

    const coins: PerpCoin[] = [...byCoin.entries()].map(([symbol, list]) => {
      const largest = list.reduce((a, b) => ((num(b.open_interest) ?? 0) > (num(a.open_interest) ?? 0) ? b : a));
      const price = num(largest.price);
      return {
        symbol,
        coinId: list.find((c) => c.coin_id)?.coin_id ?? null,
        price: price !== null && price > 0 ? price : null, // some markets report "0" for very cheap tokens
        change24h: num(largest.price_percentage_change_24h),
        openInterest: list.reduce((sum, c) => sum + (num(c.open_interest) ?? 0), 0),
        volume24h: list.reduce((sum, c) => sum + (num(c.volume_24h) ?? 0), 0),
        fundingRate: weightedMedian(
          list
            .map((c) => ({ value: num(c.funding_rate), weight: num(c.open_interest) ?? 0 }))
            .filter((i): i is { value: number; weight: number } => i.value !== null),
        ),
        markets: list.length,
      };
    });

    const btcMarkets: PerpMarket[] = (byCoin.get("BTC") ?? [])
      .sort((a, b) => (num(b.open_interest) ?? 0) - (num(a.open_interest) ?? 0))
      .slice(0, BTC_MARKET_COUNT)
      .map((c) => ({
        market: c.market,
        symbol: c.symbol,
        price: num(c.price),
        fundingRate: num(c.funding_rate),
        basis: num(c.basis),
        openInterest: num(c.open_interest) ?? 0,
        volume24h: num(c.volume_24h) ?? 0,
      }));

    return {
      coins: coins.sort((a, b) => b.openInterest - a.openInterest).slice(0, COIN_COUNT),
      btcMarkets,
      exchangeCount: majors.size,
    };
  },
  ["coingecko-derivatives-summary"],
  { revalidate: REVALIDATE.derivatives },
);

/** Perpetual futures per coin, plus Bitcoin's largest markets. null on failure. */
export const getDerivatives = cache(async (): Promise<DerivativesData | null> => {
  try {
    const [summary, markets] = await Promise.all([getCachedSummary(), getMarketsData()]);
    // Logos from the top-250 market list (already cached for the ticker and home page: no extra call).
    // Coins outside it show their first letter instead.
    const images = new Map(markets?.coins.map((c) => [c.id, safeUrl(c.image)]) ?? []);
    return {
      ...summary,
      coins: summary.coins.map((c) => ({ ...c, image: c.coinId ? (images.get(c.coinId) ?? null) : null })),
    };
  } catch (error) {
    console.error("[derivatives]", error instanceof Error ? error.message : error);
    return null;
  }
});

/** Derivatives exchanges by open interest, with BTC amounts converted to USD. null on failure. */
export const getDerivativesExchanges = cache(async (): Promise<DerivativesExchange[] | null> => {
  try {
    const [raw, btcPrice] = await Promise.all([getRawExchanges(), getBtcPrice()]);
    return raw.map((e) => {
      const openInterestBtc = num(e.open_interest_btc) ?? 0;
      const volume24hBtc = num(e.trade_volume_24h_btc) ?? 0;
      return {
        id: e.id,
        name: e.name,
        image: safeUrl(e.image),
        url: safeUrl(e.url),
        openInterestBtc,
        volume24hBtc,
        openInterestUsd: btcPrice ? openInterestBtc * btcPrice : null,
        volume24hUsd: btcPrice ? volume24hBtc * btcPrice : null,
        perpetuals: e.number_of_perpetual_pairs ?? 0,
        futures: e.number_of_futures_pairs ?? 0,
      };
    });
  } catch (error) {
    console.error("[derivatives exchanges]", error instanceof Error ? error.message : error);
    return null;
  }
});
