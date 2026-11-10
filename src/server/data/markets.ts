import { cache } from "react";
import { REVALIDATE } from "@/lib/cacheTimes";
import { ENDPOINTS } from "@/lib/endpoints";
import { safeFetch } from "@/lib/fetcher";
import type { ChartPoint } from "@/features/coin/types";
import type { MarketCoin } from "@/features/market/types";

// 250 is the most CoinGecko returns per request, so the whole Markets page is one API call.
export const MARKETS_COIN_COUNT = 250;

const HOUR = 3600;
const CHART_HOURS = 24;

type CoinWithSparkline = MarketCoin & { sparkline_in_7d?: { price: number[] } };

export interface MarketsData {
  coins: MarketCoin[];
  /** Hourly total market cap of the top 250 coins over the last 24h. null if it couldn't be built. */
  marketCapTrend: ChartPoint[] | null;
}

// CoinGecko's global market-cap chart is a paid (Pro) endpoint, so we build our own:
// each coin's 7d hourly price sparkline × its circulating supply, summed per hour.
// The top 250 coins are ~95% of the whole market, so the shape is a good proxy for the total.
const buildMarketCapTrend = (coins: CoinWithSparkline[]): ChartPoint[] | null => {
  const lengths = coins.map((c) => c.sparkline_in_7d?.price.length ?? 0);
  const fullLength = Math.max(...lengths);
  if (fullLength < CHART_HOURS + 1) return null;

  // Only coins with a complete history: a newly listed coin with a shorter sparkline
  // would otherwise make the total jump up at the hour it appears.
  const totals = new Array<number>(fullLength).fill(0);
  for (const coin of coins) {
    const prices = coin.sparkline_in_7d?.price;
    const supply = coin.circulating_supply;
    if (!prices || prices.length !== fullLength || !supply) continue;
    prices.forEach((price, i) => (totals[i] += price * supply));
  }

  // Sparklines carry no timestamps. They are hourly and end at the latest update,
  // so count back from that time, one hour per point.
  const latest = Math.max(...coins.map((c) => Date.parse(c.last_updated ?? "") || 0));
  if (!latest) return null;
  const end = Math.floor(latest / 1000 / HOUR) * HOUR;

  const recent = totals.slice(-(CHART_HOURS + 1));
  return recent.map((value, i) => ({ time: end - (recent.length - 1 - i) * HOUR, value }));
};

// The one /coins/markets call for the whole site: the ticker, the home table and metrics, and the
// Markets page all read from it, so it costs one API call per refresh instead of three.
// cache() parses the ~1 MB response once per render, even when several components ask for it.
//
// null on failure: the page shows an "unavailable" card instead of crashing.
// (These pages are pre-rendered at build time, and a throw there would fail the whole build.)
export const getMarketsData = cache(async (): Promise<MarketsData | null> => {
  const raw = await safeFetch<CoinWithSparkline[]>(
    ENDPOINTS.coinsMarket(MARKETS_COIN_COUNT, true),
    REVALIDATE.marketList,
  );
  if (!raw) return null;

  return {
    marketCapTrend: buildMarketCapTrend(raw),
    // Drop the sparklines (~750 KB) before anything is sent to the browser.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to leave it out
    coins: raw.map(({ sparkline_in_7d, ...coin }) => coin),
  };
});
