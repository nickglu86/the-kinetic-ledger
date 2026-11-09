import type { ReactNode } from "react";
import { formatMarketCap } from "@/lib/formats";
import { PercentChange } from "@/components/ui/PercentChange";
import type { RankedSector } from "./types";

// Tiny sectors swing hundreds of percent on a single trade, so only sectors at least this big
// count for "top gainer / loser".
const MIN_MOVER_MARKET_CAP = 100_000_000;

interface CardProps {
  label: string;
  title: string;
  value: ReactNode;
  accent: string;
}

const Card = ({ label, title, value, accent }: CardProps) => (
  <div className="bg-surface-container-low p-4 rounded-xl border-t-2 flex flex-col gap-3" style={{ borderTopColor: accent }}>
    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</p>
    <p className="font-headline font-bold text-on-surface truncate" title={title}>
      {title}
    </p>
    <div className="font-headline text-sm">{value}</div>
  </div>
);

export const SectorHighlights = ({ sectors }: { sectors: RankedSector[] }) => {
  const largest = sectors[0];
  const movers = sectors
    .filter((s) => s.market_cap >= MIN_MOVER_MARKET_CAP && typeof s.market_cap_change_24h === "number")
    .sort((a, b) => (b.market_cap_change_24h ?? 0) - (a.market_cap_change_24h ?? 0));
  const gainer = movers[0];
  const loser = movers.at(-1);

  return (
    <section aria-label="Sector highlights" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {largest && (
        <Card
          label="Largest sector"
          title={largest.name}
          accent="#00FFA3"
          value={<span className="text-on-surface-variant">${formatMarketCap(largest.market_cap)} market cap</span>}
        />
      )}
      {gainer && (
        <Card
          label="Top gainer · 24h"
          title={gainer.name}
          accent="#00e3fd"
          value={<PercentChange value={gainer.market_cap_change_24h} />}
        />
      )}
      {loser && loser !== gainer && (
        <Card
          label="Top loser · 24h"
          title={loser.name}
          accent="#ff716c"
          value={<PercentChange value={loser.market_cap_change_24h} />}
        />
      )}
      <Card
        label="Sectors tracked"
        title={`${sectors.length} sectors`}
        accent="#ac89ff"
        value={<span className="text-on-surface-variant">with a reported market cap</span>}
      />
    </section>
  );
};
