"use client";

import Link from "next/link";
import { useRef } from "react";
import { formatMarketCap, formatPrice } from "@/lib/formats";
import { PercentChange } from "@/components/ui/PercentChange";
import { SortableHeader } from "@/components/ui/SortableHeader";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { useTableState, type SortDir } from "@/hooks/useTableState";
import { WatchStar } from "@/features/watchlist/WatchStar";
import type { MarketCoin } from "./types";

type SortKey = "rank" | "name" | "price" | "change1h" | "change24h" | "change7d" | "volume" | "marketCap";

const PAGE_SIZE = 50;

// Module-level (not inline) so useTableState's memoization works. See the note in the hook.
const getSortValue = (coin: MarketCoin, key: SortKey) => {
  switch (key) {
    case "rank": return coin.market_cap_rank;
    case "name": return coin.name;
    case "price": return coin.current_price;
    case "change1h": return coin.price_change_percentage_1h_in_currency;
    case "change24h": return coin.price_change_percentage_24h;
    case "change7d": return coin.price_change_percentage_7d_in_currency;
    case "volume": return coin.total_volume;
    case "marketCap": return coin.market_cap;
  }
};

const matches = (coin: MarketCoin, query: string) =>
  coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query);

// Rank and name read naturally low→high / A→Z; every number column starts with the biggest.
const defaultDir = (key: SortKey): SortDir => (key === "rank" || key === "name" ? "asc" : "desc");

interface CoinsTableProps {
  coins: MarketCoin[];
  /** Section heading; the Watchlist page reuses this table. */
  title?: string;
}

export const CoinsTable = ({ coins, title = "All Coins" }: CoinsTableProps) => {
  const table = useTableState<MarketCoin, SortKey>({
    items: coins,
    pageSize: PAGE_SIZE,
    initialSort: { key: "rank", dir: "asc" },
    getSortValue,
    matches,
    defaultDir,
  });
  const sectionRef = useRef<HTMLElement>(null);

  const goToPage = (page: number) => {
    table.setPage(page);
    // Jump back to the top of the table, not the top of the page.
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const header = (label: string, key: SortKey, className?: string) => (
    <SortableHeader label={label} sortKey={key} sort={table.sort} onSort={table.toggleSort} className={className} />
  );

  const first = table.totalItems === 0 ? 0 : table.offset + 1;
  const last = table.offset + table.pageItems.length;

  return (
    // scroll-mt: leave room for the sticky header when scrolling here
    <section ref={sectionRef} aria-labelledby="coins-table-heading" className="space-y-4 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 id="coins-table-heading" className="font-headline text-lg font-bold uppercase tracking-tight flex items-center gap-2">
          <span aria-hidden className="w-1 h-6 bg-primary" />
          {title}
        </h2>
        <SearchInput value={table.query} onChange={table.setQuery} label="Search coin or symbol" className="w-full sm:w-72" />
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full sm:min-w-160 text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              {header("#", "rank", "pl-4 w-20")}
              {header("Asset", "name")}
              {header("Price", "price")}
              {header("1h", "change1h", "text-center hidden md:table-cell")}
              {header("24h", "change24h", "text-center pr-4 sm:pr-0")}
              {header("7d", "change7d", "text-center hidden sm:table-cell")}
              {header("24h Volume", "volume", "text-right hidden lg:table-cell")}
              {header("Market Cap", "marketCap", "text-right pr-4 hidden sm:table-cell")}
            </tr>
          </thead>
          <tbody>
            {table.pageItems.map((coin) => (
              // relative + the link's ::after = the whole row is clickable (same as the home table)
              <tr
                key={coin.id}
                className="relative bg-surface-container-low hover:bg-surface-container-high transition-colors group"
              >
                <td className="py-3 pl-2 rounded-l-lg font-headline font-bold text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <WatchStar coinId={coin.id} coinName={coin.name} />
                    {coin.market_cap_rank ?? "—"}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <Link
                    href={`/coins/${coin.id}`}
                    className="flex items-center gap-3 w-fit after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-secondary"
                  >
                    <img src={coin.image} alt="" loading="lazy" className="w-7 h-7 rounded-full" />
                    <span>
                      <span className="block font-headline font-bold text-on-surface group-hover:text-secondary transition-colors">
                        {coin.name}
                      </span>
                      <span className="block text-[10px] font-label text-on-surface-variant uppercase tracking-tighter">
                        {coin.symbol}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="py-3 font-headline font-bold">${formatPrice(coin.current_price)}</td>
                <td className="py-3 text-sm text-center hidden md:table-cell">
                  <PercentChange value={coin.price_change_percentage_1h_in_currency} />
                </td>
                <td className="py-3 pr-4 sm:pr-0 text-sm text-center rounded-r-lg sm:rounded-none">
                  <PercentChange value={coin.price_change_percentage_24h} />
                </td>
                <td className="py-3 text-sm text-center hidden sm:table-cell">
                  <PercentChange value={coin.price_change_percentage_7d_in_currency} />
                </td>
                <td className="py-3 text-right font-headline text-on-surface-variant hidden lg:table-cell">
                  ${formatMarketCap(coin.total_volume)}
                </td>
                <td className="py-3 pr-4 rounded-r-lg text-right font-headline text-on-surface-variant hidden sm:table-cell">
                  ${formatMarketCap(coin.market_cap)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {table.totalItems === 0 && (
          <p className="py-12 text-center text-sm text-on-surface-variant">
            No coins match &ldquo;{table.query}&rdquo;.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* aria-live: screen readers hear the new count after searching or changing page */}
        <p aria-live="polite" className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {table.totalItems > 0 ? `Showing ${first}–${last} of ${table.totalItems}` : "No results"}
        </p>
        <Pagination page={table.page} totalPages={table.totalPages} onChange={goToPage} label="Coin table pages" />
      </div>
    </section>
  );
};
