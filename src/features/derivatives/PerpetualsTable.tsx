"use client";

import Link from "next/link";
import { useRef } from "react";
import { Logo } from "@/components/ui/Logo";
import { Pagination } from "@/components/ui/Pagination";
import { PercentChange } from "@/components/ui/PercentChange";
import { SearchInput } from "@/components/ui/SearchInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SortableHeader } from "@/components/ui/SortableHeader";
import { useTableState, type SortDir } from "@/hooks/useTableState";
import { formatMarketCap, formatPrice } from "@/lib/formats";
import { FundingRate } from "./FundingRate";
import type { PerpCoin } from "./types";

type SortKey = "symbol" | "price" | "change" | "funding" | "oi" | "volume";

const PAGE_SIZE = 25;

// Module-level (not inline) so useTableState's memoization works.
const getSortValue = (c: PerpCoin, key: SortKey) => {
  switch (key) {
    case "symbol": return c.symbol;
    case "price": return c.price;
    case "change": return c.change24h;
    case "funding": return c.fundingRate;
    case "oi": return c.openInterest;
    case "volume": return c.volume24h;
  }
};

const matches = (c: PerpCoin, query: string) =>
  c.symbol.toLowerCase().includes(query) || (c.coinId?.includes(query) ?? false);

const defaultDir = (key: SortKey): SortDir => (key === "symbol" ? "asc" : "desc");

// The 100 coins with the most perpetual-futures open interest. Sort by funding to find the most
// crowded longs (highest) or shorts (lowest).
export const PerpetualsTable = ({ coins, exchangeCount }: { coins: PerpCoin[]; exchangeCount: number }) => {
  const table = useTableState<PerpCoin, SortKey>({
    items: coins,
    pageSize: PAGE_SIZE,
    initialSort: { key: "oi", dir: "desc" },
    getSortValue,
    matches,
    defaultDir,
  });
  const sectionRef = useRef<HTMLElement>(null);

  const goToPage = (page: number) => {
    table.setPage(page);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const header = (label: string, key: SortKey, className?: string) => (
    <SortableHeader label={label} sortKey={key} sort={table.sort} onSort={table.toggleSort} className={className} />
  );

  const first = table.totalItems === 0 ? 0 : table.offset + 1;
  const last = table.offset + table.pageItems.length;

  return (
    <section ref={sectionRef} aria-labelledby="perps-heading" className="space-y-4 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <SectionTitle id="perps-heading" aside={`Top ${exchangeCount} exchanges combined`}>
          Perpetual futures
        </SectionTitle>
        <SearchInput value={table.query} onChange={table.setQuery} label="Search coin" className="w-full sm:w-72" />
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full sm:min-w-160 text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              {header("Coin", "symbol", "pl-4")}
              {header("Price", "price", "text-right hidden sm:table-cell")}
              {header("24h", "change", "text-center hidden md:table-cell")}
              {header("Funding", "funding", "text-right")}
              {header("Open Interest", "oi", "text-right max-md:pr-4")}
              {header("24h Volume", "volume", "text-right pr-4 hidden md:table-cell")}
            </tr>
          </thead>
          <tbody>
            {table.pageItems.map((c) => (
              <tr key={c.symbol} className="bg-surface-container-low hover:bg-surface-container-high transition-colors">
                <td className="py-3 pl-4 rounded-l-lg">
                  <span className="flex items-center gap-3">
                    <Logo src={c.image} name={c.symbol} className="size-7" />
                    <span>
                      {c.coinId ? (
                        <Link
                          href={`/coins/${encodeURIComponent(c.coinId)}`}
                          className="font-headline font-bold text-on-surface hover:text-secondary"
                        >
                          {c.symbol}
                        </Link>
                      ) : (
                        <span className="font-headline font-bold text-on-surface">{c.symbol}</span>
                      )}
                      <span className="block font-label text-[10px] text-on-surface-variant">
                        {c.markets} {c.markets === 1 ? "market" : "markets"}
                      </span>
                    </span>
                  </span>
                </td>
                <td className="py-3 text-right font-headline text-sm text-on-surface hidden sm:table-cell">
                  {c.price !== null ? `$${formatPrice(c.price)}` : "—"}
                </td>
                <td className="py-3 text-center text-sm hidden md:table-cell">
                  <PercentChange value={c.change24h} />
                </td>
                <td className="py-3 text-right text-sm">
                  <FundingRate value={c.fundingRate} />
                </td>
                <td className="py-3 text-right font-headline text-on-surface max-md:pr-4 max-md:rounded-r-lg">
                  ${formatMarketCap(c.openInterest)}
                </td>
                <td className="py-3 pr-4 rounded-r-lg text-right font-headline text-on-surface-variant hidden md:table-cell">
                  ${formatMarketCap(c.volume24h)}
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
        <p aria-live="polite" className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {table.totalItems > 0 ? `Showing ${first}–${last} of ${table.totalItems}` : "No results"}
        </p>
        <Pagination page={table.page} totalPages={table.totalPages} onChange={goToPage} label="Perpetuals table pages" />
      </div>
    </section>
  );
};
