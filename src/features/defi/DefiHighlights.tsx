import { ACCENTS, StatCard } from "@/components/ui/StatCard";
import { PercentChange } from "@/components/ui/PercentChange";
import { formatMarketCap } from "@/lib/formats";
import type { ChainTvl, DexOverview, StablecoinOverview, TvlPoint } from "./types";

interface DefiHighlightsProps {
  tvl: TvlPoint[] | null;
  chains: ChainTvl[] | null;
  dex: DexOverview | null;
  stablecoins: StablecoinOverview | null;
}

const change = (now: number, before: number | undefined) => (before ? ((now - before) / before) * 100 : null);
const dash = "—";

// Four headline numbers. Each card falls back to a dash if its source failed.
export const DefiHighlights = ({ tvl, chains, dex, stablecoins }: DefiHighlightsProps) => {
  const latest = tvl?.at(-1);
  const dayBefore = tvl?.at(-2);
  const weekBefore = tvl?.at(-8);
  const topChain = chains?.[0];

  return (
    <section aria-label="DeFi highlights" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total value locked"
        accent={ACCENTS.primary}
        value={latest ? `$${formatMarketCap(latest.value)}` : dash}
        detail={
          latest && (
            <span className="flex flex-wrap gap-x-2">
              <span>24h <PercentChange value={change(latest.value, dayBefore?.value)} /></span>
              <span>7d <PercentChange value={change(latest.value, weekBefore?.value)} /></span>
            </span>
          )
        }
      />
      <StatCard
        label="DEX volume · 24h"
        accent={ACCENTS.secondary}
        value={dex ? `$${formatMarketCap(dex.volume24h)}` : dash}
        detail={dex && <span>vs yesterday <PercentChange value={dex.change1d} /></span>}
      />
      <StatCard
        label="Stablecoin supply"
        accent={ACCENTS.tertiary}
        value={stablecoins ? `$${formatMarketCap(stablecoins.totalUsd)}` : dash}
        detail={stablecoins && <span>7d <PercentChange value={stablecoins.change7d} /></span>}
      />
      <StatCard
        label="Largest chain"
        accent={ACCENTS.error}
        value={topChain ? topChain.name : dash}
        detail={topChain && <span>{topChain.share.toFixed(1)}% of all DeFi TVL</span>}
      />
    </section>
  );
};
