import { cn } from "@/lib/utils";

interface SparklineProps {
  values: number[];
  color: string;
  className?: string;
}

const W = 100;
const H = 40;

// Tiny area chart as plain SVG (server-rendered, no chart library needed for a decoration).
// preserveAspectRatio="none" stretches it to any box; non-scaling-stroke keeps the line 1.5px thick anyway.
export const Sparkline = ({ values, color, className }: SparklineProps) => {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - 2 - ((v - min) / range) * (H - 4); // 2px padding top and bottom
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const line = points.join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={cn("overflow-visible", className)} aria-hidden>
      <polygon points={`0,${H} ${line} ${W},${H}`} fill={color} fillOpacity={0.12} />
      <polyline points={line} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
};
