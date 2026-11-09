import { cn } from "@/lib/utils";

interface ChangePillProps {
  value: number | null | undefined;
  className?: string;
}

// ▲ 2.91% / ▼ 2.91% in a small tinted pill. A dash when there's no value.
export const ChangePill = ({ value, className }: ChangePillProps) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return <span className={cn("text-xs text-on-surface-variant", className)}>—</span>;
  }
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-label text-[11px] font-bold",
        up ? "bg-primary/10 text-primary" : "bg-error/10 text-error",
        className,
      )}
    >
      <span aria-hidden>{up ? "▲" : "▼"}</span>
      <span className="sr-only">{up ? "up" : "down"}</span>
      {Math.abs(value).toFixed(2)}%
    </span>
  );
};
