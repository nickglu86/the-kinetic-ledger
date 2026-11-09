import type { ReactNode } from "react";

interface StatTileProps {
  label: string;
  /** Headline number. Omit when the tile lays out its own content (e.g. the 24h range). */
  value?: string;
  /** Extra line(s) under the value: a sub-label, a bar, a percent change... */
  children?: ReactNode;
}

export const StatTile = ({ label, value, children }: StatTileProps) => (
  <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2 min-w-0">
    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
      {label}
    </p>
    {value !== undefined && (
      <p className="font-headline text-xl font-bold text-on-surface truncate">{value}</p>
    )}
    {children}
  </div>
);
