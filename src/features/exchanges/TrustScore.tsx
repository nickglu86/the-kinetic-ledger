import { cn } from "@/lib/utils";

// CoinGecko trust score (1-10) as a number plus a 10-segment bar.
// 8+ green, 5-7 amber, below 5 red.
export const TrustScore = ({ score }: { score: number | null }) => {
  if (score === null) return <span className="text-xs text-on-surface-variant">—</span>;

  const color = score >= 8 ? "bg-primary" : score >= 5 ? "bg-[#fbbf24]" : "bg-error";
  return (
    <span className="inline-flex items-center gap-2" title={`Trust score ${score} out of 10`}>
      <span className="font-headline font-bold text-sm text-on-surface w-5 text-right">{score}</span>
      <span className="sr-only">out of 10</span>
      <span aria-hidden className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={cn("w-1.5 h-3 rounded-sm", i < score ? color : "bg-surface-container-highest")} />
        ))}
      </span>
    </span>
  );
};
