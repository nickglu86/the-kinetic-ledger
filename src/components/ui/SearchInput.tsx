import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name; also used as the placeholder. */
  label: string;
  className?: string;
}

export const SearchInput = ({ value, onChange, label, className }: SearchInputProps) => (
  <label
    className={cn(
      "flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/20 focus-within:border-secondary transition-colors",
      className,
    )}
  >
    <span aria-hidden className="material-symbols-outlined text-on-surface-variant text-base">
      search
    </span>
    <span className="sr-only">{label}</span>
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={label}
      className="bg-transparent outline-none text-sm font-label w-full placeholder:text-on-surface-variant/60"
    />
  </label>
);
