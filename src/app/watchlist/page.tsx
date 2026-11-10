import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { WatchlistView } from "@/features/watchlist/WatchlistView";
import { getMarketsData } from "@/server/data/markets";

export const metadata: Metadata = {
  title: "Watchlist",
  description: "The coins you starred, with live prices. Saved in your browser, no account needed.",
  // Every visitor's list is different and lives in their browser, so there's nothing useful to index.
  robots: { index: false },
};

// The page itself is the same for everyone: the shared top-250 market list (no extra API call).
// Which of those coins to show is decided in the browser from the saved watchlist.
export default async function WatchlistPage() {
  const markets = await getMarketsData();

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <PageHeader
        eyebrow="Your coins"
        title="Watchlist"
        description="Coins you starred, with live prices. Saved in this browser, so no account is needed."
      />
      <WatchlistView coins={markets?.coins ?? []} />
    </main>
  );
}
