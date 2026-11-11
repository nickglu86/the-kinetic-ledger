"use client";

import { useRef } from "react";
import { externalLinkProps } from "@/features/news/shared";
import { Logo } from "@/components/ui/Logo";
import { Pagination } from "@/components/ui/Pagination";
import { PercentChange } from "@/components/ui/PercentChange";
import { SearchInput } from "@/components/ui/SearchInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SortableHeader } from "@/components/ui/SortableHeader";
import { useTableState, type SortDir } from "@/hooks/useTableState";
import { formatMarketCap } from "@/lib/formats";
import type { DefiProtocol } from "./types";

type SortKey = "rank" | "name" | "category" | "tvl" | "change1d" | "change7d";

const PAGE_SIZE = 25;

// Module-level (not inline) so useTableState's memoization works.
const getSortValue = (p: DefiProtocol, key: SortKey) => {
  switch (key) {
    case "rank": return p.rank;
    case "name": return p.name;
    case "category": return p.category;
    case "tvl": return p.tvl;
    case "change1d": return p.change1d;
    case "change7d": return p.change7d;
  }
};

const matches = (p: DefiProtocol, query: string) =>
  p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);

const defaultDir = (key: SortKey): SortDir => (key === "rank" || key === "name" || key === "category" ? "asc" : "desc");

// Top 100 DeFi protocols by TVL. Search matches the name or the category ("lending", "dexs"…).
// Each row opens the protocol on DefiLlama.
export const ProtocolsTable = ({ protocols }: { protocols: DefiProtocol[] }) => {
  const table = useTableState<DefiProtocol, SortKey>({
    items: protocols,
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

  const first = table.totalItems === 0 ? 0 : table.offset + 1;
  const last = table.offset + table.pageItems.length;

  return (
    <section ref={sectionRef} aria-labelledby="protocols-heading" className="space-y-4 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <SectionTitle id="protocols-heading">Top protocols</SectionTitle>
        <SearchInput value={table.query} onChange={table.setQuery} label="Search protocol or category" className="w-full sm:w-72" />
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full sm:min-w-160 text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              {header("#", "rank", "pl-4 w-12")}
              {header("Protocol", "name")}
              {header("Category", "category", "hidden md:table-cell")}
              {header("1d", "change1d", "text-center hidden sm:table-cell")}
              {header("7d", "change7d", "text-center")}
              {header("TVL", "tvl", "text-right pr-4")}
            </tr>
          </thead>
          <tbody>
            {table.pageItems.map((p) => (
              <tr key={p.slug} className="relative bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                <td className="py-3 pl-4 rounded-l-lg font-headline font-bold text-on-surface-variant">{p.rank}</td>
                <td className="py-3 pr-4">
                  {/* Stretched link: the whole row is clickable, one real link per row for keyboard users */}
                  <a
                    href={`https://defillama.com/protocol/${encodeURIComponent(p.slug)}`}
                    {...externalLinkProps}
                    className="flex items-center gap-3 w-fit after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-secondary"
                  >
                    <Logo src={p.logo} name={p.name} className="size-7" />
                    <span>
                      <span className="block font-headline font-bold text-on-surface group-hover:text-secondary transition-colors">
                        {p.name}
                      </span>
                      <span className="block font-label text-[10px] text-on-surface-variant">
                        <span className="md:hidden">{p.category} · </span>
                        {p.chains} {p.chains === 1 ? "chain" : "chains"}
                      </span>
                    </span>
                  </a>
                </td>
                <td className="py-3 text-sm text-on-surface-variant hidden md:table-cell">{p.category}</td>
                <td className="py-3 text-sm text-center hidden sm:table-cell">
                  <PercentChange value={p.change1d} />
                </td>
                <td className="py-3 text-sm text-center">
                  <PercentChange value={p.change7d} />
                </td>
                <td className="py-3 pr-4 rounded-r-lg text-right font-headline text-on-surface">${formatMarketCap(p.tvl)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {table.totalItems === 0 && (
          <p className="py-12 text-center text-sm text-on-surface-variant">
            No protocols match &ldquo;{table.query}&rdquo;.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p aria-live="polite" className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {table.totalItems > 0 ? `Showing ${first}–${last} of ${table.totalItems}` : "No results"}
        </p>
        <Pagination page={table.page} totalPages={table.totalPages} onChange={goToPage} label="Protocol table pages" />
      </div>
    </section>
  );
};
