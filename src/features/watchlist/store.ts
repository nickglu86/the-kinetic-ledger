"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  /** Starred coin ids, in the order they were added. */
  ids: string[];
  /** False until the saved list has been read from localStorage (see WatchlistSync). */
  hydrated: boolean;
  toggle: (id: string) => void;
}

// The watchlist lives in this browser only (localStorage), so it works without an account.
// Phase 8–10 can later sync the same list to a user profile.
//
// skipHydration: the server has no localStorage, so it always renders an empty watchlist.
// Reading the saved list before React hydrates would make the first browser render differ
// from the server HTML. WatchlistSync loads it right after hydration instead.
export const useWatchlist = create<WatchlistState>()(
  persist(
    (set) => ({
      ids: [],
      hydrated: false,
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id],
        })),
    }),
    {
      name: "kinetic-watchlist",
      version: 1,
      skipHydration: true,
      partialize: (state) => ({ ids: state.ids }), // save only the ids
      onRehydrateStorage: () => () => useWatchlist.setState({ hydrated: true }),
    },
  ),
);
