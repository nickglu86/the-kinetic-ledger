import { AreaChart } from "@/components/ui/AreaChart";
import type { ChartPoint } from "@/features/coin/types";

// Small 24h total-market-cap chart for the Markets page highlights.
export const MarketCapChart = ({ points }: { points: ChartPoint[] }) => (
  <AreaChart points={points} intraday label="Total crypto market cap, last 24 hours" className="h-36" />
);
