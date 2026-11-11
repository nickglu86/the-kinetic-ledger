import { externalLinkProps } from "@/features/news/shared";
import { Logo } from "@/components/ui/Logo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Unavailable } from "@/components/ui/Unavailable";
import { formatMarketCap } from "@/lib/formats";
import type { ChainTvl } from "./types";

// Where DeFi money sits: the largest chains by TVL. The bar is relative to the largest chain
// (Ethereum holds about half of everything, so bars against the total would all be slivers).
// Each row opens the chain's page on DefiLlama.
export const ChainsList = ({ chains }: { chains: ChainTvl[] | null }) => {
  const largest = chains?.[0]?.tvl ?? 0;

  return (
    <section aria-labelledby="chains-heading" className="space-y-4">
      <SectionTitle id="chains-heading" aside="Share of DeFi TVL">
        Top chains
      </SectionTitle>
      {chains && chains.length > 0 ? (
        <ol className="bg-surface-container-low rounded-xl p-2 space-y-0.5">
          {chains.map((chain, i) => (
            <li key={chain.name}>
              <a
                href={`https://defillama.com/chain/${encodeURIComponent(chain.name)}`}
                {...externalLinkProps}
                className="grid grid-cols-[1.25rem_auto_1fr_auto] items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-container-high transition-colors focus-visible:outline-2 focus-visible:outline-secondary"
              >
                <span className="font-headline text-xs font-bold text-on-surface-variant">{i + 1}</span>
                <Logo src={chain.logo} name={chain.name} />
                <span className="min-w-0">
                  <span className="block font-headline font-bold text-sm text-on-surface truncate">{chain.name}</span>
                  <span aria-hidden className="mt-1 block h-1 rounded-full bg-surface-container-highest overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-secondary/70"
                      style={{ width: `${largest > 0 ? Math.max(2, (chain.tvl / largest) * 100) : 0}%` }}
                    />
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-headline text-sm text-on-surface">${formatMarketCap(chain.tvl)}</span>
                  <span className="block font-label text-[10px] text-on-surface-variant">{chain.share.toFixed(1)}%</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <Unavailable label="Chains" className="py-10 items-center" />
      )}
    </section>
  );
};
