import { cache } from "react";
import { REVALIDATE } from "@/lib/cacheTimes";
import { ENDPOINTS } from "@/lib/endpoints";
import { safeFetch } from "@/lib/fetcher";
import type { FearAndGreedResponse, GlobalData, GlobalResponse } from "@/types/api";

// Global market totals (market cap, volume, dominance). null on failure.
// cache() shares one result between all components in the same render.
export const getGlobal = cache(async (): Promise<GlobalData | null> => {
  const res = await safeFetch<GlobalResponse>(ENDPOINTS.global, REVALIDATE.global);
  return res?.data ?? null;
});

// Fear & Greed history from alternative.me, newest first. Empty on failure.
export const getFearAndGreed = cache(async () => {
  const res = await safeFetch<FearAndGreedResponse>(ENDPOINTS.fearAndGreed, REVALIDATE.fearAndGreed);
  return res?.data ?? [];
});
