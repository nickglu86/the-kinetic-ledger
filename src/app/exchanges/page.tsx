import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Unavailable } from "@/components/ui/Unavailable";
import { MarketsNav } from "@/features/market/MarketsNav";
import { ExchangeHighlights } from "@/features/exchanges/ExchangeHighlights";
import { ExchangesTable } from "@/features/exchanges/ExchangesTable";
import { getExchanges } from "@/server/data/exchanges";

export const metadata: Metadata = {
  title: "Crypto Exchanges",
  description: "The top 100 crypto spot exchanges ranked by trust score, with 24h trading volume.",
};

export default async function ExchangesPage() {
  const exchanges = await getExchanges();

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <MarketsNav />
      <PageHeader
        eyebrow="Spot exchanges"
        title="Exchanges"
        description={
          <p>
            Where crypto is bought and sold, ranked by CoinGecko&apos;s trust score (1–10): liquidity, security,
            how much volume looks real and how big the exchange is. A high volume alone doesn&apos;t mean an exchange is safe.
          </p>
        }
      />
      {exchanges && exchanges.length > 0 ? (
        <>
          <ExchangeHighlights exchanges={exchanges} />
          <ExchangesTable exchanges={exchanges} />
        </>
      ) : (
        <Unavailable label="Exchanges" className="py-10 items-center" />
      )}
    </main>
  );
}
