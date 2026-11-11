import type { Metadata } from "next";
import { CoinsTable } from "@/features/market/CoinsTable";
import { MarketHighlights } from "@/features/market/MarketHighlights";
import { MarketsHeader } from "@/features/market/MarketsHeader";
import { MarketsNav } from "@/features/market/MarketsNav";
import { PercentChange } from "@/components/ui/PercentChange";
import { Unavailable } from "@/components/ui/Unavailable";
import { getGlobal } from "@/server/data/global";
import { getMarketsData, MARKETS_COIN_COUNT } from "@/server/data/markets";

export const metadata: Metadata = {
  title: "Markets",
  description: `Live prices, market caps and 24h changes for the top ${MARKETS_COIN_COUNT} cryptocurrencies.`,
};

// Server Component: fetches everything once (cached ~60s). The client table then handles
// search, sorting and paging in the browser without more API calls.
export default async function MarketsPage() {
  const [markets, global] = await Promise.all([getMarketsData(), getGlobal()]);

  const description = global ? (
    <p>
      The global cryptocurrency market cap today is{" "}
      <strong className="text-on-surface">${(global.total_market_cap.usd / 1e12).toFixed(2)} Trillion</strong>, a{" "}
      <PercentChange value={global.market_cap_change_percentage_24h_usd} /> change in the last 24 hours.
    </p>
  ) : (
    <p>The top {MARKETS_COIN_COUNT} cryptocurrencies by market capitalization.</p>
  );

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <MarketsNav />
      <MarketsHeader description={description}>
        <MarketHighlights
          coins={markets?.coins ?? []}
          marketCapTrend={markets?.marketCapTrend ?? null}
          global={global}
        />
      </MarketsHeader>
      {markets ? (
        <CoinsTable coins={markets.coins} />
      ) : (
        <Unavailable label="All coins" className="py-10 items-center" />
      )}
    </main>
  );
}
