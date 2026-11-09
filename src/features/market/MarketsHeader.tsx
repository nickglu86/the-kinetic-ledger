"use client";

import { useState, type ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";

interface MarketsHeaderProps {
  description: ReactNode;
  /** The highlight cards. Rendered on the server and passed in, so this client component only adds the toggle. */
  children: ReactNode;
}

// Page title plus a "Highlights" switch that shows/hides the cards below it (like CoinGecko).
export const MarketsHeader = ({ description, children }: MarketsHeaderProps) => {
  const [showHighlights, setShowHighlights] = useState(true);

  return (
    <>
      <PageHeader eyebrow="Live prices" title="Markets" description={description}>
        <button
          type="button"
          role="switch"
          aria-checked={showHighlights}
          onClick={() => setShowHighlights((v) => !v)}
          className="self-start md:self-auto inline-flex items-center gap-3 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          Highlights
          <span
            aria-hidden
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors",
              showHighlights ? "bg-primary" : "bg-surface-container-highest",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-surface transition-transform",
                showHighlights && "translate-x-5",
              )}
            />
          </span>
        </button>
      </PageHeader>
      {showHighlights && children}
    </>
  );
};
