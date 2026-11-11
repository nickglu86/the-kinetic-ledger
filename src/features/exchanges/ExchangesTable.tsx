"use client";

import { useRef } from "react";
import { externalLinkProps } from "@/features/news/shared";
import { Logo } from "@/components/ui/Logo";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SortableHeader } from "@/components/ui/SortableHeader";
import { useTableState, type SortDir } from "@/hooks/useTableState";
import { formatMarketCap } from "@/lib/formats";
import { TrustScore } from "./TrustScore";
import { KycBadge } from "./KycBadge";
import { KYC_CHECKED } from "./kyc";
import type { Exchange } from "./types";

type SortKey = "rank" | "name" | "trust" | "kyc" | "volume" | "country" | "year";

const PAGE_SIZE = 25;

// Module-level (not inline) so useTableState's memoization works.
const getSortValue = (e: Exchange, key: SortKey) => {
  switch (key) {
    case "rank": return e.trustRank;
    case "name": return e.name;
    case "trust": return e.trustScore;
    case "kyc": return e.kyc; // "optional" sorts before "required"; unchecked always last
    case "volume": return e.volume24hBtc;
    case "country": return e.country;
    case "year": return e.yearEstablished;
  }
};

const matches = (e: Exchange, query: string) =>
  e.name.toLowerCase().includes(query) || (e.country?.toLowerCase().includes(query) ?? false);

const defaultDir = (key: SortKey): SortDir =>
  key === "rank" || key === "name" || key === "country" || key === "kyc" ? "asc" : "desc";

// Top 100 spot exchanges, ranked by CoinGecko trust score. Search matches the name or the country.
// Each row opens the exchange's CoinGecko page (trust score breakdown, markets, reserves).
export const ExchangesTable = ({ exchanges }: { exchanges: Exchange[] }) => {
  const table = useTableState<Exchange, SortKey>({
    items: exchanges,
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
    <section ref={sectionRef} aria-labelledby="exchanges-heading" className="space-y-4 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <SectionTitle id="exchanges-heading">Spot exchanges</SectionTitle>
        <SearchInput value={table.query} onChange={table.setQuery} label="Search exchange or country" className="w-full sm:w-72" />
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full sm:min-w-160 text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              {header("#", "rank", "pl-4 w-12")}
              {header("Exchange", "name")}
              {header("Trust", "trust", "hidden sm:table-cell")}
              {header("KYC", "kyc", "hidden sm:table-cell")}
              {header("24h Volume", "volume", "text-right max-md:pr-4")}
              {header("Country", "country", "hidden md:table-cell pl-6")}
              {header("Since", "year", "text-right pr-4 hidden lg:table-cell")}
            </tr>
          </thead>
          <tbody>
            {table.pageItems.map((e) => (
              <tr key={e.id} className="relative bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                <td className="py-3 pl-4 rounded-l-lg font-headline font-bold text-on-surface-variant">{e.trustRank}</td>
                <td className="py-3 pr-4">
                  {/* Stretched link: the whole row is clickable */}
                  <a
                    href={`https://www.coingecko.com/en/exchanges/${encodeURIComponent(e.id)}`}
                    {...externalLinkProps}
                    className="flex items-center gap-3 w-fit after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-secondary"
                  >
                    <Logo src={e.image} name={e.name} className="size-7 rounded-lg" />
                    <span>
                      <span className="block font-headline font-bold text-on-surface group-hover:text-secondary transition-colors">
                        {e.name}
                      </span>
                      {/* Trust and country move under the name where their columns are hidden */}
                      <span className="block font-label text-[10px] text-on-surface-variant md:hidden">
                        <span className="sm:hidden">
                          Trust {e.trustScore ?? "—"}/10 ·{" "}
                          {e.kyc && <>KYC {e.kyc} · </>}
                        </span>
                        {e.country ?? "Unknown country"}
                      </span>
                    </span>
                  </a>
                </td>
                <td className="py-3 hidden sm:table-cell">
                  <TrustScore score={e.trustScore} />
                </td>
                <td className="py-3 hidden sm:table-cell">
                  <KycBadge policy={e.kyc} />
                </td>
                <td className="py-3 text-right font-headline text-on-surface max-md:pr-4 max-md:rounded-r-lg">
                  {e.volume24hUsd !== null ? `$${formatMarketCap(e.volume24hUsd)}` : `₿${formatMarketCap(e.volume24hBtc)}`}
                </td>
                <td className="py-3 pl-6 text-sm text-on-surface-variant hidden md:table-cell max-lg:rounded-r-lg">
                  {e.country ?? "—"}
                </td>
                <td className="py-3 pr-4 rounded-r-lg text-right text-sm text-on-surface-variant hidden lg:table-cell">
                  {e.yearEstablished ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {table.totalItems === 0 && (
          <p className="py-12 text-center text-sm text-on-surface-variant">
            No exchanges match &ldquo;{table.query}&rdquo;.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p aria-live="polite" className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {table.totalItems > 0 ? `Showing ${first}–${last} of ${table.totalItems}` : "No results"}
        </p>
        <Pagination page={table.page} totalPages={table.totalPages} onChange={goToPage} label="Exchange table pages" />
      </div>
      <p className="font-label text-[10px] text-on-surface-variant">
        KYC: checked by hand for the top 25 exchanges ({KYC_CHECKED}). &ldquo;Optional&rdquo; means trading and limited
        withdrawals work without ID. Rules change and often depend on your country, so check the exchange before signing up.
      </p>
    </section>
  );
};
