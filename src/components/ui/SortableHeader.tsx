import { cn } from "@/lib/utils";
import type { SortState } from "@/hooks/useTableState";

interface SortableHeaderProps<K extends string> {
  label: string;
  sortKey: K;
  sort: SortState<K>;
  onSort: (key: K) => void;
  className?: string;
}

// Table header cell with a sort button. aria-sort tells screen readers which column is sorted and how.
export const SortableHeader = <K extends string>({ label, sortKey, sort, onSort, className }: SortableHeaderProps<K>) => {
  const active = sort.key === sortKey;
  const icon = !active ? "unfold_more" : sort.dir === "asc" ? "arrow_upward" : "arrow_downward";

  return (
    <th
      scope="col"
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn("pb-2 font-normal", className)}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-0.5 uppercase tracking-widest cursor-pointer hover:text-on-surface transition-colors",
          active && "text-primary hover:text-primary",
        )}
      >
        {label}
        <span aria-hidden className={cn("material-symbols-outlined text-[14px]", !active && "opacity-40")}>
          {icon}
        </span>
      </button>
    </th>
  );
};
