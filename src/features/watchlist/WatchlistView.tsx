"use client";

import Link from "next/link";
import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton";
import { CoinsTable } from "@/features/market/CoinsTable";
import type { MarketCoin } from "@/features/market/types";
import { useWatchlist } from "./store";
import { WatchStar } from "./WatchStar";

// "bitcoin-cash" -> "Bitcoin Cash": a readable name for coins outside the top 250,
// where we only have the id (looking them up would cost an API call per coin).
const prettifyId = (id: string) => id.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const WatchlistView = ({ coins }: { coins: MarketCoin[] }) => {
  const ids = useWatchlist((s) => s.ids);
  const hydrated = useWatchlist((s) => s.hydrated);

  // The saved list is read right after the page loads; until then we don't know if it's empty.
  if (!hydrated) {
    return (
      <Skeleton label="Loading your watchlist">
        <TableSkeleton rows={5} />
      </Skeleton>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-16 px-4 rounded-xl bg-surface-container-low">
        <span aria-hidden className="material-symbols-outlined text-5xl text-[#fbbf24]">star</span>
        <h2 className="font-headline font-bold text-2xl tracking-tight">Your watchlist is empty</h2>
        <p className="font-body text-sm text-on-surface-variant max-w-md">
          Tap the star next to any coin in the market tables or on a coin page, and it shows up here with live prices.
        </p>
        <Link
          href="/markets"
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label text-xs font-bold uppercase tracking-widest hover:brightness-110 transition"
        >
          Browse markets
          <span aria-hidden className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    );
  }

  // Starred coins we have prices for (the shared top-250 list), in the order they were starred
  const byId = new Map(coins.map((coin) => [coin.id, coin]));
  const listed = ids.flatMap((id) => byId.get(id) ?? []);
  const others = ids.filter((id) => !byId.has(id));

  return (
    <div className="space-y-10">
      {listed.length > 0 && <CoinsTable coins={listed} title="Your coins" />}

      {others.length > 0 && (
        <section aria-labelledby="watchlist-others" className="space-y-4">
          <div>
            <h2 id="watchlist-others" className="font-headline text-lg font-bold uppercase tracking-tight flex items-center gap-2">
              <span aria-hidden className="w-1 h-6 bg-tertiary" />
              Outside the top 250
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">Open a coin to see its live price.</p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {others.map((id) => (
              <li key={id} className="flex items-center gap-2 rounded-lg bg-surface-container-low pl-2 pr-4 py-2">
                <WatchStar coinId={id} coinName={prettifyId(id)} />
                <Link href={`/coins/${id}`} className="flex-1 min-w-0 truncate font-headline font-bold text-sm hover:text-secondary transition-colors">
                  {prettifyId(id)}
                </Link>
                <span aria-hidden className="material-symbols-outlined text-sm text-on-surface-variant">arrow_forward</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
