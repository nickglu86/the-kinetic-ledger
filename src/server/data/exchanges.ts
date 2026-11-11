import { cache } from "react";
import { REVALIDATE } from "@/lib/cacheTimes";
import { ENDPOINTS } from "@/lib/endpoints";
import { safeFetch } from "@/lib/fetcher";
import { safeUrl } from "@/lib/safeUrl";
import type { Exchange } from "@/features/exchanges/types";
import { KYC_BY_EXCHANGE } from "@/features/exchanges/kyc";
import { getMarketsData } from "./markets";

interface RawExchange {
  id: string;
  name: string;
  image: string | null;
  url: string | null;
  country: string | null;
  year_established: number | null;
  trust_score: number | null;
  trust_score_rank: number;
  trade_volume_24h_btc: number | null;
}

// Current BTC price from the shared market list (already cached for the ticker and home page,
// so it costs no extra call). Used to turn volumes reported in BTC into dollars.
export const getBtcPrice = cache(async (): Promise<number | null> => {
  const markets = await getMarketsData();
  const btc = markets?.coins.find((c) => c.id === "bitcoin");
  return btc?.current_price ?? null;
});

// The top 100 spot exchanges by CoinGecko trust score. One call per hour, shared by the
// Exchanges page and every coin page's "Where to trade" list. null on failure.
export const getExchanges = cache(async (): Promise<Exchange[] | null> => {
  const [raw, btcPrice] = await Promise.all([
    safeFetch<RawExchange[]>(ENDPOINTS.exchanges, REVALIDATE.exchanges),
    getBtcPrice(),
  ]);
  if (!raw) return null;

  return raw.map((e) => {
    const volume24hBtc = e.trade_volume_24h_btc ?? 0;
    return {
      id: e.id,
      name: e.name,
      image: safeUrl(e.image),
      url: safeUrl(e.url),
      country: e.country,
      yearEstablished: e.year_established,
      trustScore: e.trust_score,
      trustRank: e.trust_score_rank,
      volume24hBtc,
      volume24hUsd: btcPrice ? volume24hBtc * btcPrice : null,
      kyc: KYC_BY_EXCHANGE[e.id] ?? null,
    };
  });
});
