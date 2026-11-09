import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Unavailable } from "@/components/ui/Unavailable";
import { SectorHighlights } from "@/features/rankings/SectorHighlights";
import { SectorsTable } from "@/features/rankings/SectorsTable";
import { getRankedSectors } from "@/server/data/categories";

export const metadata: Metadata = {
  title: "Sector Rankings",
  description: "Crypto sectors ranked by market cap, with 24h change, volume and their largest coins.",
};

export default async function RankingsPage() {
  const sectors = await getRankedSectors();

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <PageHeader
        eyebrow="Sector rankings"
        title="Rankings"
        description="Every crypto sector ranked by total market cap: Layer 1s, DeFi, memes, AI and more. Sort by 24h change to see where money is moving."
      />
      {sectors && sectors.length > 0 ? (
        <>
          <SectorHighlights sectors={sectors} />
          <SectorsTable sectors={sectors} />
        </>
      ) : (
        <Unavailable label="Sectors" className="py-10 items-center" />
      )}
    </main>
  );
}
