import { useMemo, useState } from "react";

// Search + sort + pagination for a list that's already fully loaded in the browser.
// Used by the Markets and Rankings tables (250 coins / ~400 sectors: small enough to do it all client-side).

export type SortDir = "asc" | "desc";

export interface SortState<K extends string> {
  key: K;
  dir: SortDir;
}

type SortValue = number | string | null | undefined;

interface TableStateOptions<T, K extends string> {
  items: T[];
  pageSize: number;
  initialSort: SortState<K>;
  /** Value to sort by for a column. null/undefined always sorts last, in both directions. */
  getSortValue: (item: T, key: K) => SortValue;
  /** Search filter. `query` is already trimmed and lowercased. */
  matches: (item: T, query: string) => boolean;
  /** Direction used the first time a column is clicked (e.g. names A→Z, numbers high→low). */
  defaultDir?: (key: K) => SortDir;
}

const isMissing = (value: SortValue) =>
  value === null || value === undefined || (typeof value === "number" && !Number.isFinite(value));

// Note: pass module-level functions for getSortValue/matches/defaultDir. Inline arrow functions
// would be new on every render and make the useMemo below recompute every time.
export function useTableState<T, K extends string>({
  items,
  pageSize,
  initialSort,
  getSortValue,
  matches,
  defaultDir,
}: TableStateOptions<T, K>) {
  const [query, setQueryState] = useState("");
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((item) => matches(item, q)) : items;
  }, [items, query, matches]);

  const sorted = useMemo(() => {
    const factor = sort.dir === "asc" ? 1 : -1;
    // Copy first: Array.sort mutates, and `filtered` may be the original props array.
    return [...filtered].sort((a, b) => {
      const va = getSortValue(a, sort.key);
      const vb = getSortValue(b, sort.key);
      const aMissing = isMissing(va);
      const bMissing = isMissing(vb);
      if (aMissing || bMissing) return aMissing === bMissing ? 0 : aMissing ? 1 : -1;
      if (typeof va === "string" && typeof vb === "string") return va.localeCompare(vb) * factor;
      return ((va as number) - (vb as number)) * factor;
    });
  }, [filtered, sort, getSortValue]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  // Clamp instead of storing a corrected page in state (e.g. after a search shrinks the list).
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * pageSize;

  const setQuery = (value: string) => {
    setQueryState(value);
    setPage(1);
  };

  const toggleSort = (key: K) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: defaultDir?.(key) ?? "desc" },
    );
    setPage(1);
  };

  return {
    query,
    setQuery,
    sort,
    toggleSort,
    page: currentPage,
    setPage,
    totalPages,
    totalItems: sorted.length,
    offset,
    pageItems: sorted.slice(offset, offset + pageSize),
  };
}
