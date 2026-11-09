// Fear & Greed bands, using alternative.me's own cut-offs.
export const SENTIMENT_BANDS = [
  { max: 24, color: "#ff716c" }, // extreme fear (error)
  { max: 46, color: "#f97316" }, // fear
  { max: 54, color: "#fbbf24" }, // neutral
  { max: 75, color: "#a3e635" }, // greed
  { max: 100, color: "#00FFA3" }, // extreme greed (primary)
];

export const sentimentColor = (value: number) =>
  (SENTIMENT_BANDS.find((band) => value <= band.max) ?? SENTIMENT_BANDS.at(-1)!).color;

const CX = 60;
const CY = 58;
const R = 48;
const GAP = 1.5; // index points left empty between bands

// Index 0 is the far left of the half circle, 100 the far right.
const point = (value: number, radius = R) => {
  const angle = Math.PI * (1 - value / 100);
  return { x: CX + radius * Math.cos(angle), y: CY - radius * Math.sin(angle) };
};

const arc = (from: number, to: number) => {
  const a = point(from);
  const b = point(to);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
};

// Half-circle gauge with a needle. Decorative: the number and label next to it carry the meaning.
export const FearGreedGauge = ({ value }: { value: number }) => {
  const clamped = Math.min(Math.max(value, 0), 100);
  const needle = point(clamped, R - 14);

  return (
    <svg viewBox="0 0 120 64" className="w-28 h-auto shrink-0" aria-hidden>
      {SENTIMENT_BANDS.map((band, i) => {
        // Each band runs from the previous band's max to its own, with a small gap in between
        const from = i === 0 ? 0 : SENTIMENT_BANDS[i - 1].max + GAP / 2;
        const to = band.max === 100 ? 100 : band.max - GAP / 2;
        return <path key={band.max} d={arc(from, to)} stroke={band.color} strokeWidth={8} fill="none" />;
      })}
      <line x1={CX} y1={CY} x2={needle.x} y2={needle.y} stroke="#f8f9fe" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={CX} cy={CY} r={4} fill="#f8f9fe" />
    </svg>
  );
};
