import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Unavailable } from "@/components/ui/Unavailable";
import { MarketsNav } from "@/features/market/MarketsNav";
import { ChainsList } from "@/features/defi/ChainsList";
import { DefiHighlights } from "@/features/defi/DefiHighlights";
import { DexList } from "@/features/defi/DexList";
import { ProtocolsTable } from "@/features/defi/ProtocolsTable";
import { StablecoinsTable } from "@/features/defi/StablecoinsTable";
import { TvlChartCard } from "@/features/defi/TvlChartCard";
import { getChainTvl, getDexOverview, getStablecoins, getTopProtocols, getTvlHistory } from "@/server/data/defi";

export const metadata: Metadata = {
  title: "DeFi",
  description: "Total value locked in DeFi, the largest chains and protocols, DEX volume and stablecoin supply.",
};

// All five DefiLlama requests run in parallel. Each one that fails only hides its own section.
export default async function DefiPage() {
  const [tvl, chains, protocols, dex, stablecoins] = await Promise.all([
    getTvlHistory(),
    getChainTvl(),
    getTopProtocols(),
    getDexOverview(),
    getStablecoins(),
  ]);

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <MarketsNav />
      <PageHeader
        eyebrow="Decentralised finance"
        title="DeFi"
        description={
          <p>
            How much money is locked in DeFi apps, where it sits and how much is traded on decentralised exchanges.
            Data from{" "}
            <a href="https://defillama.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
              DefiLlama
            </a>
            , refreshed every 30 minutes.
          </p>
        }
      />

      <DefiHighlights tvl={tvl} chains={chains} dex={dex} stablecoins={stablecoins} />
      <TvlChartCard points={tvl} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChainsList chains={chains} />
        <DexList dex={dex} />
      </div>

      {protocols ? <ProtocolsTable protocols={protocols} /> : <Unavailable label="Protocols" className="py-10 items-center" />}

      <StablecoinsTable stablecoins={stablecoins} />
    </main>
  );
}
