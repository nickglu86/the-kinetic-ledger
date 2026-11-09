import { formatPercent, isPositive } from "@/lib/formats";
import { cn } from "@/lib/utils";

interface PercentChangeProps {
  value: number | null | undefined;
  className?: string;
}

// Green/red percent label. Renders "—" in muted color when the API returns null.
export const PercentChange = ({ value, className }: PercentChangeProps) => {
  const hasValue = typeof value === "number";

  return (
    <span
      className={cn(
        "font-bold",
        !hasValue
          ? "text-on-surface-variant"
          : isPositive(value)
            ? "text-primary"
            : "text-error",
        className,
      )}
    >
      {formatPercent(value)}
    </span>
  );
};
