"use client";

import { cn } from "@/lib/utils";
import { useWatchlist } from "./store";

interface WatchStarProps {
  coinId: string;
  coinName: string;
  className?: string;
  size?: "sm" | "md";
}

// Star toggle for adding a coin to the watchlist.
// relative z-10: in table rows it sits above the row's stretched link, so clicking the star doesn't open the coin.
export const WatchStar = ({ coinId, coinName, className, size = "sm" }: WatchStarProps) => {
  const starred = useWatchlist((s) => s.ids.includes(coinId));
  const toggle = useWatchlist((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={() => toggle(coinId)}
      aria-pressed={starred}
      aria-label={starred ? `Remove ${coinName} from watchlist` : `Add ${coinName} to watchlist`}
      title={starred ? "Remove from watchlist" : "Add to watchlist"}
      className={cn(
        "relative z-10 grid place-items-center rounded-full cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-secondary",
        size === "sm" ? "size-7 -my-1" : "size-9 bg-surface-container-high",
        starred ? "text-[#fbbf24]" : "text-on-surface-variant/50 hover:text-[#fbbf24]",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("material-symbols-outlined", size === "sm" ? "text-lg" : "text-xl")}
        style={{ fontVariationSettings: starred ? "'FILL' 1" : "'FILL' 0" }}
      >
        star
      </span>
    </button>
  );
};
