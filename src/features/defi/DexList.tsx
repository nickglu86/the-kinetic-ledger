import { externalLinkProps } from "@/features/news/shared";
import { Logo } from "@/components/ui/Logo";
import { PercentChange } from "@/components/ui/PercentChange";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Unavailable } from "@/components/ui/Unavailable";
import { formatMarketCap } from "@/lib/formats";
import type { DexOverview } from "./types";

// Decentralised exchanges with the most trading volume in the last 24 hours.
export const DexList = ({ dex }: { dex: DexOverview | null }) => (
  <section aria-labelledby="dex-heading" className="space-y-4">
    <SectionTitle id="dex-heading" aside="24h volume · change vs yesterday">
      Top DEXs
    </SectionTitle>
    {dex && dex.top.length > 0 ? (
      <ol className="bg-surface-container-low rounded-xl p-2 space-y-0.5">
        {dex.top.map((p, i) => (
          <li key={p.slug}>
            <a
              href={`https://defillama.com/protocol/${encodeURIComponent(p.slug)}`}
              {...externalLinkProps}
              className="grid grid-cols-[1.25rem_auto_1fr_auto] items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-container-high transition-colors focus-visible:outline-2 focus-visible:outline-secondary"
            >
              <span className="font-headline text-xs font-bold text-on-surface-variant">{i + 1}</span>
              <Logo src={p.logo} name={p.name} />
              <span className="min-w-0">
                <span className="block font-headline font-bold text-sm text-on-surface truncate">{p.name}</span>
                <span className="block font-label text-[10px] text-on-surface-variant">
                  {p.chains} {p.chains === 1 ? "chain" : "chains"}
                </span>
              </span>
              <span className="text-right">
                <span className="block font-headline text-sm text-on-surface">${formatMarketCap(p.volume24h)}</span>
                <span className="block text-[11px]">
                  <PercentChange value={p.change1d} />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    ) : (
      <Unavailable label="DEX volume" className="py-10 items-center" />
    )}
  </section>
);
