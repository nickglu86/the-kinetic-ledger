import { cn } from "@/lib/utils";

// Funding rate in % per funding period (usually 8 hours), e.g. "+0.0100%".
// Positive (green): longs pay shorts, more traders are betting on a rise. Negative (red): the reverse.
export const FundingRate = ({ value, className }: { value: number | null; className?: string }) => {
  if (value === null) return <span className={cn("text-on-surface-variant", className)}>—</span>;
  return (
    <span className={cn("font-headline tabular-nums", value >= 0 ? "text-primary" : "text-error", className)}>
      {value > 0 ? "+" : ""}
      {value.toFixed(4)}%
    </span>
  );
};
