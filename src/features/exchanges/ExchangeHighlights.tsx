import { Logo } from "@/components/ui/Logo";
import { ACCENTS, StatCard } from "@/components/ui/StatCard";
import { formatMarketCap } from "@/lib/formats";
import type { Exchange } from "./types";

const usd = (value: number | null) => (value === null ? "—" : `$${formatMarketCap(value)}`);

// Logo + name. The logo is sized in em so it follows the card's text size (smaller on phones).
const ExchangeName = ({ exchange }: { exchange: Exchange }) => (
  <span className="flex items-start gap-2">
    {/* mt lines the logo up with the first line when a long name wraps */}
    <Logo src={exchange.image} name={exchange.name} className="size-[1.1em] mt-[0.07em] rounded-md" />
    <span className="min-w-0">{exchange.name}</span>
  </span>
);

export const ExchangeHighlights = ({ exchanges }: { exchanges: Exchange[] }) => {
  const totalUsd = exchanges.every((e) => e.volume24hUsd !== null)
    ? exchanges.reduce((sum, e) => sum + (e.volume24hUsd ?? 0), 0)
    : null;
  const largest = [...exchanges].sort((a, b) => b.volume24hBtc - a.volume24hBtc)[0];
  const topRated = exchanges.filter((e) => e.trustScore === 10).length;
  const mostTrusted = exchanges[0]; // the API already sorts by trust score rank

  return (
    <section aria-label="Exchange highlights" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Spot volume · 24h"
        accent={ACCENTS.primary}
        value={usd(totalUsd)}
        detail={`Across the top ${exchanges.length} exchanges`}
      />
      <StatCard
        label="Largest by volume"
        accent={ACCENTS.secondary}
        value={largest ? <ExchangeName exchange={largest} /> : "—"}
        detail={largest && `${usd(largest.volume24hUsd)} in 24h`}
      />
      <StatCard
        label="Most trusted"
        accent={ACCENTS.tertiary}
        value={mostTrusted ? <ExchangeName exchange={mostTrusted} /> : "—"}
        detail={mostTrusted?.trustScore ? `Trust score ${mostTrusted.trustScore}/10` : undefined}
      />
      <StatCard
        label="Rated 10/10"
        accent={ACCENTS.error}
        value={topRated}
        detail="Exchanges with a perfect trust score"
      />
    </section>
  );
};
