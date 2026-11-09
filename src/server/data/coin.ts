import { cache } from "react";
import { ENDPOINTS } from "@/lib/endpoints";
import { FetchError, fetchData } from "@/lib/fetcher";
import { ChartPoint, CoinChartData, CoinDetail } from "@/features/coin/types";
import { ChartDays } from "@/features/coin/chartRanges";

// Typed data accessor for one coin. First piece of the src/server/data/ layer.
//
// - Returns null when CoinGecko says the coin doesn't exist (404) -> caller shows the 404 page.
// - Throws on anything else (429 rate limit, 5xx, network) -> nearest error.tsx shows "try again".
// - cache() dedupes calls within one request, so generateMetadata and the page share a single fetch.
export const getCoin = cache(async (id: string): Promise<CoinDetail | null> => {
  try {
    return await fetchData<CoinDetail>(ENDPOINTS.coinDetail(id));
  } catch (error) {
    if (error instanceof FetchError && error.status === 404) return null;
    throw error;
  }
});

// Raw /market_chart response: [timestamp in ms, value] pairs
interface MarketChartResponse {
  prices: [number, number][];
  total_volumes: [number, number][];
}

// Short ranges move fast; a year of daily candles barely changes. Saves API quota.
const CHART_REVALIDATE: Record<ChartDays, number> = { 1: 60, 7: 300, 30: 900, 90: 3600, 365: 3600 };

// ms -> seconds, and drop points that would break the chart: it needs strictly increasing times.
const toChartPoints = (rows: [number, number][]): ChartPoint[] => {
  const points: ChartPoint[] = [];
  for (const [ms, value] of rows) {
    const time = Math.floor(ms / 1000);
    const last = points.at(-1);
    if (!Number.isFinite(value) || (last && time <= last.time)) continue;
    points.push({ time, value });
  }
  return points;
};

// Same contract as getCoin: null for an unknown coin, throws for anything else.
export const getCoinChart = cache(async (id: string, days: ChartDays): Promise<CoinChartData | null> => {
  try {
    const data = await fetchData<MarketChartResponse>(ENDPOINTS.coinMarketChart(id, days), CHART_REVALIDATE[days]);
    return { prices: toChartPoints(data.prices), volumes: toChartPoints(data.total_volumes) };
  } catch (error) {
    if (error instanceof FetchError && error.status === 404) return null;
    throw error;
  }
});
