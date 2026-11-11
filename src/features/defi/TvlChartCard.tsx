import { AreaChart } from "@/components/ui/AreaChart";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Unavailable } from "@/components/ui/Unavailable";
import type { TvlPoint } from "./types";

// Total DeFi TVL over the last year, one point per day.
export const TvlChartCard = ({ points }: { points: TvlPoint[] | null }) => (
  <section aria-labelledby="tvl-chart-heading" className="space-y-4">
    <SectionTitle id="tvl-chart-heading" aside="Last 12 months · daily">
      Total value locked
    </SectionTitle>
    {points && points.length > 1 ? (
      <div className="bg-surface-container-low rounded-xl p-4">
        <AreaChart points={points} label="Total value locked in DeFi, daily, last 12 months" className="h-64 md:h-80" />
      </div>
    ) : (
      <Unavailable className="h-64 items-center" />
    )}
  </section>
);
