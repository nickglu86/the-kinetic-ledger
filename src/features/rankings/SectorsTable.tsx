"use client";

import Link from "next/link";
import { useRef } from "react";
import { formatMarketCap } from "@/lib/formats";
import { safeUrl } from "@/lib/safeUrl";
import { PercentChange } from "@/components/ui/PercentChange";
import { SortableHeader } from "@/components/ui/SortableHeader";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { useTableState, type SortDir } from "@/hooks/useTableState";
import type { RankedSector } from "./types";

type SortKey = "rank" | "name" | "change24h" | "marketCap" | "volume";

const PAGE_SIZE = 50;

// Module-level (not inline) so useTableState's memoization works.
const getSortValue = (sector: RankedSector, key: SortKey) => {
  switch (key) {
    case "rank": return sector.rank;
    case "name": return sector.name;
    case "change24h": return sector.market_cap_change_24h;
    case "marketCap": return sector.market_cap;
    case "volume": return sector.volume_24h;
  }
};

const matches = (sector: RankedSector, query: string) => sector.name.toLowerCase().includes(query);

const defaultDir = (key: SortKey): SortDir => (key === "rank" || key === "name" ? "asc" : "desc");

// "binancecoin" -> "binancecoin", "avalanche-2" -> "avalanche 2". Good enough for a tooltip/label.
const coinLabel = (id: string) => id.replace(/-/g, " ");

// The 3 largest coins of a sector, each linking to its coin page.
const TopCoins = ({ sector }: { sector: RankedSector }) => (
  <ul className="flex -space-x-1.5">
    {sector.top_3_coins_id.map((id, i) => {
      const src = safeUrl(sector.top_3_coins[i]);
      if (!src) return null;
      return (
        <li key={id}>
          <Link
            href={`/coins/${id}`}
            title={coinLabel(id)}
            aria-label={coinLabel(id)}
            className="block rounded-full ring-2 ring-surface-container-low hover:ring-secondary focus-visible:outline-none focus-visible:ring-secondary transition-shadow"
          >
            <img src={src} alt="" loading="lazy" className="w-6 h-6 rounded-full bg-surface-container-high" />
          </Link>
        </li>
      );
    })}
  </ul>
);

export const SectorsTable = ({ sectors }: { sectors: RankedSector[] }) => {
  const table = useTableState<RankedSector, SortKey>({
    items: sectors,
    pageSize: PAGE_SIZE,
    initialSort: { key: "rank", dir: "asc" },
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

  // Bar width = market cap relative to the biggest sector, to show scale at a glance.
  const largestCap = sectors[0]?.market_cap ?? 0;
  const first = table.totalItems === 0 ? 0 : table.offset + 1;
  const last = table.offset + table.pageItems.length;

  return (
    <section ref={sectionRef} aria-labelledby="sectors-table-heading" className="space-y-4 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 id="sectors-table-heading" className="font-headline text-lg font-bold uppercase tracking-tight flex items-center gap-2">
          <span aria-hidden className="w-1 h-6 bg-secondary" />
          All Sectors
        </h2>
        <SearchInput value={table.query} onChange={table.setQuery} label="Search sector" className="w-full sm:w-72" />
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full sm:min-w-160 text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              {header("#", "rank", "pl-4 w-12")}
              {header("Sector", "name")}
              <th scope="col" className="pb-2 font-normal hidden sm:table-cell">Top Coins</th>
              {header("24h", "change24h", "text-center")}
              {header("Market Cap", "marketCap", "text-right")}
              {header("24h Volume", "volume", "text-right pr-4 hidden md:table-cell")}
            </tr>
          </thead>
          <tbody>
            {table.pageItems.map((sector) => (
              <tr key={sector.id} className="bg-surface-container-low hover:bg-surface-container-high transition-colors">
                <td className="py-3 pl-4 rounded-l-lg font-headline font-bold text-on-surface-variant">{sector.rank}</td>
                <td className="py-3 pr-4 font-headline font-bold text-on-surface">{sector.name}</td>
                <td className="py-3 hidden sm:table-cell">
                  <TopCoins sector={sector} />
                </td>
                <td className="py-3 text-sm text-center">
                  <PercentChange value={sector.market_cap_change_24h} />
                </td>
                <td className="py-3 text-right font-headline text-on-surface-variant md:rounded-none rounded-r-lg pr-4 md:pr-0">
                  <span className="block">${formatMarketCap(sector.market_cap)}</span>
                  {largestCap > 0 && (
                    <span aria-hidden className="mt-1.5 ml-auto block h-1 w-24 rounded-full bg-surface-container-highest overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-secondary/70"
                        style={{ width: `${Math.max(2, (sector.market_cap / largestCap) * 100)}%` }}
                      />
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4 rounded-r-lg text-right font-headline text-on-surface-variant hidden md:table-cell">
                  {typeof sector.volume_24h === "number" ? `$${formatMarketCap(sector.volume_24h)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {table.totalItems === 0 && (
          <p className="py-12 text-center text-sm text-on-surface-variant">
            No sectors match &ldquo;{table.query}&rdquo;.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p aria-live="polite" className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {table.totalItems > 0 ? `Showing ${first}–${last} of ${table.totalItems}` : "No results"}
        </p>
        <Pagination page={table.page} totalPages={table.totalPages} onChange={goToPage} label="Sector table pages" />
      </div>
    </section>
  );
};
