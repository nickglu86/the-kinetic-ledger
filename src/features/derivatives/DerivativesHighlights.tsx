import { ACCENTS, StatCard } from "@/components/ui/StatCard";
import { formatMarketCap } from "@/lib/formats";
import { FundingRate } from "./FundingRate";
import type { DerivativesData, DerivativesExchange } from "./types";

interface DerivativesHighlightsProps {
  data: DerivativesData | null;
  exchanges: DerivativesExchange[] | null;
}

const sumUsd = (exchanges: DerivativesExchange[] | null, key: "openInterestUsd" | "volume24hUsd") =>
  exchanges && exchanges.every((e) => e[key] !== null) ? exchanges.reduce((sum, e) => sum + (e[key] ?? 0), 0) : null;

export const DerivativesHighlights = ({ data, exchanges }: DerivativesHighlightsProps) => {
  const openInterest = sumUsd(exchanges, "openInterestUsd");
  const volume = sumUsd(exchanges, "volume24hUsd");
  const btc = data?.coins.find((c) => c.symbol === "BTC");
  const eth = data?.coins.find((c) => c.symbol === "ETH");
  const count = exchanges?.length ?? 0;

  return (
    <section aria-label="Derivatives highlights" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Open interest"
        accent={ACCENTS.primary}
        value={openInterest !== null ? `$${formatMarketCap(openInterest)}` : "—"}
        detail={`Top ${count} derivatives exchanges`}
      />
      <StatCard
        label="Volume · 24h"
        accent={ACCENTS.secondary}
        value={volume !== null ? `$${formatMarketCap(volume)}` : "—"}
        detail="Futures and perpetuals"
      />
      <StatCard
        label="BTC funding rate"
        accent={ACCENTS.tertiary}
        value={<FundingRate value={btc?.fundingRate ?? null} />}
        detail={btc && `$${formatMarketCap(btc.openInterest)} open interest`}
      />
      <StatCard
        label="ETH funding rate"
        accent={ACCENTS.error}
        value={<FundingRate value={eth?.fundingRate ?? null} />}
        detail={eth && `$${formatMarketCap(eth.openInterest)} open interest`}
      />
    </section>
  );
};
