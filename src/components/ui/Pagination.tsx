import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** Names the nav landmark, e.g. "Coins pages". */
  label: string;
}

// First, last, and the pages around the current one, with "…" for the gaps: 1 … 4 5 6 … 12
const pageList = (page: number, total: number): (number | "gap")[] => {
  const pages = [...new Set([1, page - 1, page, page + 1, total])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out: (number | "gap")[] = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) out.push("gap");
    out.push(p);
    prev = p;
  }
  return out;
};

const baseButton =
  "min-w-8 h-8 px-2 inline-flex items-center justify-center rounded-md font-label text-xs font-bold transition-colors";

export const Pagination = ({ page, totalPages, onChange, label }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label={label} className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={cn(baseButton, "text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:pointer-events-none")}
      >
        <span aria-hidden className="material-symbols-outlined text-base">chevron_left</span>
      </button>

      {pageList(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-on-surface-variant">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={cn(
              baseButton,
              p === page
                ? "bg-primary text-surface"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={cn(baseButton, "text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:pointer-events-none")}
      >
        <span aria-hidden className="material-symbols-outlined text-base">chevron_right</span>
      </button>
    </nav>
  );
};
