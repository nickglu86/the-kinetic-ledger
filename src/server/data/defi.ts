import { cache } from "react";
import { unstable_cache } from "next/cache";
import { REVALIDATE } from "@/lib/cacheTimes";
import { ENDPOINTS } from "@/lib/endpoints";
import { fetchData } from "@/lib/fetcher";
import { safeUrl } from "@/lib/safeUrl";
import type {
  ChainTvl,
  DefiProtocol,
  DexOverview,
  StablecoinOverview,
  TvlPoint,
} from "@/features/defi/types";

// DeFi data from DefiLlama (free, no key, no monthly limit like CoinGecko's).
// Every getter returns null on failure, so one broken source only hides its own section.
//
// The protocol list (~9 MB) and DEX overview (~2.4 MB) are too big for Next's data cache (2 MB per entry),
// so they're fetched without caching (false) and only the small summary is cached with unstable_cache.

const orNull = async <T>(load: () => Promise<T>): Promise<T | null> => {
  try {
    return await load();
  } catch (error) {
    console.error("[defi]", error instanceof Error ? error.message : error);
    return null;
  }
};

const finite = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

// --- Total TVL history (for the chart and the headline number) ---

const TVL_HISTORY_DAYS = 365;

export const getTvlHistory = cache(() =>
  orNull(async (): Promise<TvlPoint[]> => {
    const rows = await fetchData<{ date: number; tvl: number }[]>(ENDPOINTS.defi.tvlHistory, REVALIDATE.defi);
    return rows
      .slice(-TVL_HISTORY_DAYS)
      .filter((r) => Number.isFinite(r.date) && Number.isFinite(r.tvl))
      .map((r) => ({ time: r.date, value: r.tvl }));
  }),
);

// --- TVL by chain ---

interface RawChain {
  name: string;
  tvl: number;
  tokenSymbol: string | null;
}

const CHAIN_COUNT = 10;

export const getChainTvl = cache(() =>
  orNull(async (): Promise<ChainTvl[]> => {
    const chains = await fetchData<RawChain[]>(ENDPOINTS.defi.chains, REVALIDATE.defi);
    const total = chains.reduce((sum, c) => sum + (finite(c.tvl) ?? 0), 0);
    return chains
      .filter((c) => (finite(c.tvl) ?? 0) > 0)
      .sort((a, b) => b.tvl - a.tvl)
      .slice(0, CHAIN_COUNT)
      .map((c) => ({
        name: c.name,
        tvl: c.tvl,
        tokenSymbol: c.tokenSymbol,
        share: total > 0 ? (c.tvl / total) * 100 : 0,
        // DefiLlama names its chain icons after the lowercased chain name
        logo: `https://icons.llamao.fi/icons/chains/rsz_${encodeURIComponent(c.name.toLowerCase())}`,
      }));
  }),
);

// --- Top protocols by TVL ---

interface RawProtocol {
  name: string;
  slug: string;
  logo: string | null;
  category: string | null;
  chains: string[] | null;
  tvl: number | null;
  change_1d: number | null;
  change_7d: number | null;
}

// Not DeFi: centralised exchange wallets, and "Chain" entries that duplicate chain totals.
// DefiLlama's own headline TVL leaves these out too.
const EXCLUDED_CATEGORIES = new Set(["CEX", "Chain"]);
const PROTOCOL_COUNT = 100;

const getCachedProtocols = unstable_cache(
  async (): Promise<DefiProtocol[]> => {
    const all = await fetchData<RawProtocol[]>(ENDPOINTS.defi.protocols, false);
    if (!Array.isArray(all) || all.length < 100) throw new Error("Unexpected /protocols response");
    return all
      .filter((p) => (finite(p.tvl) ?? 0) > 0 && !EXCLUDED_CATEGORIES.has(p.category ?? ""))
      .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
      .slice(0, PROTOCOL_COUNT)
      .map((p, i) => ({
        rank: i + 1,
        name: p.name,
        slug: p.slug,
        logo: safeUrl(p.logo),
        category: p.category ?? "Other",
        chains: p.chains?.length ?? 0,
        tvl: p.tvl ?? 0,
        change1d: finite(p.change_1d),
        change7d: finite(p.change_7d),
      }));
  },
  ["defillama-top-protocols"],
  { revalidate: REVALIDATE.defi },
);

export const getTopProtocols = cache(() => orNull(getCachedProtocols));

// --- DEX volume ---

interface RawDexResponse {
  total24h: number;
  total7d: number;
  change_1d: number | null;
  protocols: {
    name: string;
    displayName?: string;
    slug: string;
    logo: string | null;
    chains: string[] | null;
    total24h: number | null;
    change_1d: number | null;
  }[];
}

const DEX_COUNT = 10;

const getCachedDexOverview = unstable_cache(
  async (): Promise<DexOverview> => {
    const data = await fetchData<RawDexResponse>(ENDPOINTS.defi.dexs, false);
    if (!Array.isArray(data?.protocols)) throw new Error("Unexpected /overview/dexs response");
    return {
      volume24h: finite(data.total24h) ?? 0,
      volume7d: finite(data.total7d) ?? 0,
      change1d: finite(data.change_1d),
      top: data.protocols
        .filter((p) => (finite(p.total24h) ?? 0) > 0)
        .sort((a, b) => (b.total24h ?? 0) - (a.total24h ?? 0))
        .slice(0, DEX_COUNT)
        .map((p) => ({
          name: p.displayName || p.name,
          slug: p.slug,
          logo: safeUrl(p.logo),
          chains: p.chains?.length ?? 0,
          volume24h: p.total24h ?? 0,
          change1d: finite(p.change_1d),
        })),
    };
  },
  ["defillama-dex-overview"],
  { revalidate: REVALIDATE.defi },
);

export const getDexOverview = cache(() => orNull(getCachedDexOverview));

// --- Stablecoins ---

interface RawStablecoin {
  name: string;
  symbol: string;
  gecko_id: string | null;
  pegType: string;
  pegMechanism: string | null;
  price: number | null;
  circulating: { peggedUSD?: number };
  circulatingPrevWeek: { peggedUSD?: number };
}

const STABLECOIN_COUNT = 10;

const pctChange = (now: number | null, before: number | null) =>
  now !== null && before ? ((now - before) / before) * 100 : null;

export const getStablecoins = cache(() =>
  orNull(async (): Promise<StablecoinOverview> => {
    const data = await fetchData<{ peggedAssets: RawStablecoin[] }>(ENDPOINTS.defi.stablecoins, REVALIDATE.defi);
    // Only USD-pegged coins: their supply is already in dollars, so they add up directly.
    const usd = data.peggedAssets.filter((a) => a.pegType === "peggedUSD" && (finite(a.circulating?.peggedUSD) ?? 0) > 0);

    const totalUsd = usd.reduce((sum, a) => sum + (a.circulating.peggedUSD ?? 0), 0);
    const totalPrevWeek = usd.reduce((sum, a) => sum + (finite(a.circulatingPrevWeek?.peggedUSD) ?? 0), 0);

    return {
      totalUsd,
      change7d: pctChange(totalUsd, totalPrevWeek),
      top: usd
        .sort((a, b) => (b.circulating.peggedUSD ?? 0) - (a.circulating.peggedUSD ?? 0))
        .slice(0, STABLECOIN_COUNT)
        .map((a) => ({
          name: a.name,
          symbol: a.symbol,
          geckoId: a.gecko_id,
          mechanism: a.pegMechanism,
          circulating: a.circulating.peggedUSD ?? 0,
          change7d: pctChange(a.circulating.peggedUSD ?? null, finite(a.circulatingPrevWeek?.peggedUSD)),
          price: finite(a.price),
        })),
    };
  }),
);
