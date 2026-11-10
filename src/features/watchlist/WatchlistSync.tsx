"use client";

import { useEffect } from "react";
import { useWatchlist } from "./store";

// Mounted once in the root layout. Loads the saved watchlist after hydration,
// and keeps several open tabs in sync when a coin is starred in one of them.
export const WatchlistSync = () => {
  useEffect(() => {
    useWatchlist.persist.rehydrate();

    const onStorage = (e: StorageEvent) => {
      if (e.key === useWatchlist.persist.getOptions().name) useWatchlist.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
};
