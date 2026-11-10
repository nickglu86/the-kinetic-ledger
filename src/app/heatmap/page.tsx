import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Unavailable } from "@/components/ui/Unavailable";
import { HeatmapView } from "@/features/heatmap/HeatmapView";
import { getMarketsData } from "@/server/data/markets";

const HEATMAP_COINS = 100;

export const metadata: Metadata = {
  title: "Crypto Heatmap",
  description: `The top ${HEATMAP_COINS} cryptocurrencies at a glance: tile size is market cap, colour is the 24h or 7d price change.`,
};

// Reuses the shared top-250 market list, so this page costs no extra API calls.
export default async function HeatmapPage() {
  const markets = await getMarketsData();
  const coins = markets?.coins.slice(0, HEATMAP_COINS) ?? [];

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <PageHeader
        eyebrow="Market overview"
        title="Heatmap"
        description={`The top ${HEATMAP_COINS} coins at a glance. Bigger tiles are bigger coins; green is up, red is down.`}
      />
      {coins.length > 0 ? <HeatmapView coins={coins} /> : <Unavailable label="Heatmap" className="py-10 items-center" />}
    </main>
  );
}
