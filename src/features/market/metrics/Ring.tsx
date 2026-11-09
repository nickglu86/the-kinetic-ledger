import type { ReactNode } from "react";

export interface RingSegment {
  /** 0–100 */
  value: number;
  color: string;
}

interface RingProps {
  segments: RingSegment[];
  /** Rounded ends: nice for a single progress arc, not for a multi-segment donut. */
  rounded?: boolean;
  /** Content in the middle of the ring (HTML, so it uses the site fonts). */
  children?: ReactNode;
}

const SIZE = 64;
const STROKE = 7;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Donut / progress ring drawn with SVG circles. Each segment is a dash on the circle's stroke,
// shifted along by the segments before it. The text in the middle carries the meaning, so the SVG is aria-hidden.
export const Ring = ({ segments, rounded, children }: RingProps) => {
  // Arc length of each segment, and where it starts (= total length of the segments before it)
  const lengths = segments.map((s) => (Math.min(Math.max(s.value, 0), 100) / 100) * CIRCUMFERENCE);
  const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((sum, l) => sum + l, 0));

  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full -rotate-90" aria-hidden>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-surface-container-highest" />
        {segments.map((segment, i) => (
          <circle
            key={i}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={segment.color}
            strokeWidth={STROKE}
            strokeLinecap={rounded ? "round" : "butt"}
            strokeDasharray={`${lengths[i]} ${CIRCUMFERENCE}`}
            strokeDashoffset={-starts[i]}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">{children}</div>
    </div>
  );
};
