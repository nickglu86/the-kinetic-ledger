import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Unavailable } from "@/components/ui/Unavailable";
import { MarketsNav } from "@/features/market/MarketsNav";
import { BtcMarkets } from "@/features/derivatives/BtcMarkets";
import { DerivativesExchanges } from "@/features/derivatives/DerivativesExchanges";
import { DerivativesHighlights } from "@/features/derivatives/DerivativesHighlights";
import { PerpetualsTable } from "@/features/derivatives/PerpetualsTable";
import { getDerivatives, getDerivativesExchanges } from "@/server/data/derivatives";

export const metadata: Metadata = {
  title: "Derivatives",
  description: "Crypto perpetual futures: funding rates, open interest and volume by coin and exchange.",
};

export default async function DerivativesPage() {
  const [data, exchanges] = await Promise.all([getDerivatives(), getDerivativesExchanges()]);

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <MarketsNav />
      <PageHeader
        eyebrow="Futures & perpetuals"
        title="Derivatives"
        description={
          <p>
            <strong className="text-on-surface">Open interest</strong> is the value of all open futures positions.{" "}
            <strong className="text-on-surface">Funding</strong> is what one side pays the other every few hours (usually 8)
            to keep the price in line with spot: positive means longs pay shorts, so more traders are betting on a rise.
          </p>
        }
      />

      <DerivativesHighlights data={data} exchanges={exchanges} />

      {data ? (
        <PerpetualsTable coins={data.coins} exchangeCount={data.exchangeCount} />
      ) : (
        <Unavailable label="Perpetual futures" className="py-10 items-center" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BtcMarkets markets={data?.btcMarkets ?? null} />
        <DerivativesExchanges exchanges={exchanges} />
      </div>
    </main>
  );
}
