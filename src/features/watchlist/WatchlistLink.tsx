"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWatchlist } from "./store";

// Header shortcut to /watchlist, with the number of starred coins.
export const WatchlistLink = () => {
  const count = useWatchlist((s) => s.ids.length);
  const active = usePathname() === "/watchlist";

  return (
    <Link
      href="/watchlist"
      aria-current={active ? "page" : undefined}
      aria-label={count > 0 ? `Watchlist, ${count} coin${count === 1 ? "" : "s"}` : "Watchlist"}
      title="Watchlist"
      className={cn(
        "relative grid place-items-center size-9 rounded-full transition-colors hover:bg-surface-container-high",
        active ? "text-primary" : "text-on-surface/80 hover:text-primary",
      )}
    >
      <span aria-hidden className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}>
        star
      </span>
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-on-primary font-label text-[10px] font-bold leading-4 text-center"
        >
          {count}
        </span>
      )}
    </Link>
  );
};
