"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import type { CoinSearchResult } from "@/server/data/coinList";

const DEBOUNCE_MS = 200;

const fetcher = async (url: string): Promise<CoinSearchResult[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return (await res.json()).results;
};

interface CoinSearchProps {
  className?: string;
  autoFocus?: boolean;
  /** Press "/" anywhere to jump to this box (only one instance on the page should set it). */
  shortcut?: boolean;
  /** Called after a result is picked, e.g. to close the mobile search panel. */
  onNavigate?: () => void;
}

// Header coin search: a combobox (WAI-ARIA pattern). Type, use ↑ ↓ to move, Enter to open, Esc to close.
export const CoinSearch = ({ className, autoFocus, shortcut, onNavigate }: CoinSearchProps) => {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Wait until typing pauses before asking the server
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  // "/" focuses the search, like on GitHub or YouTube (but not while typing in another field)
  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      // Don't steal "/" while the user is typing somewhere else
      const target = e.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable=true]")) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const { data: results = [], isLoading, error } = useSWR(
    debounced ? `/api/search?q=${encodeURIComponent(debounced)}` : null,
    fetcher,
    { keepPreviousData: true, revalidateOnFocus: false },
  );

  const showList = open && query.trim().length > 0;
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  const go = (coin: CoinSearchResult) => {
    router.push(`/coins/${coin.id}`);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
    onNavigate?.();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (results.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + results.length) % results.length);
    } else if (e.key === "Enter" && showList && results[activeIndex]) {
      e.preventDefault();
      go(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const optionId = (i: number) => `${listId}-option-${i}`;

  return (
    <div className={cn("relative", className)}>
      <label className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/20 focus-within:border-secondary/60 transition-colors">
        <span aria-hidden className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
        <span className="sr-only">Search coins</span>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results.length > 0 ? optionId(activeIndex) : undefined}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          value={query}
          placeholder="Search coins…"
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          // Delay so a click on a result lands before the list closes
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          className="w-full min-w-0 bg-transparent border-none outline-none text-sm font-label placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:hidden"
        />
        {shortcut && !query && (
          <kbd aria-hidden className="hidden xl:inline font-label text-[10px] text-on-surface-variant border border-outline-variant/40 rounded px-1.5">
            /
          </kbd>
        )}
      </label>

      {showList && (
        <div className="absolute right-0 left-0 lg:left-auto lg:w-80 mt-2 z-50 rounded-xl bg-surface-container-high border border-outline-variant/20 shadow-2xl overflow-hidden">
          <ul id={listId} role="listbox" aria-label="Coins" className="max-h-96 overflow-y-auto py-1">
            {results.map((coin, i) => (
              <li
                key={coin.id}
                id={optionId(i)}
                role="option"
                aria-selected={i === activeIndex}
                // mousedown + preventDefault: keeps focus in the input, so blur doesn't close the list first
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(coin)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 cursor-pointer",
                  i === activeIndex && "bg-surface-container-highest",
                )}
              >
                {coin.image ? (
                  <img src={coin.image} alt="" className="size-6 rounded-full shrink-0" />
                ) : (
                  <span aria-hidden className="size-6 rounded-full shrink-0 grid place-items-center bg-surface-container-highest font-label text-[10px] font-bold uppercase text-on-surface-variant">
                    {coin.symbol.slice(0, 1)}
                  </span>
                )}
                <span className="flex-1 min-w-0 truncate font-headline font-bold text-sm">{coin.name}</span>
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{coin.symbol}</span>
                {coin.rank && <span className="font-label text-[10px] text-secondary w-8 text-right">#{coin.rank}</span>}
              </li>
            ))}
          </ul>
          {results.length === 0 && (
            <p role="status" className="px-4 py-3 text-sm text-on-surface-variant">
              {error ? "Search is unavailable right now." : isLoading || debounced !== query.trim() ? "Searching…" : "No coins found."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
