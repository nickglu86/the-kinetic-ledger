import type { ReactNode } from "react";

interface SectionTitleProps {
  id?: string;
  children: ReactNode;
  /** Optional content on the right, e.g. a "View all" link or a note */
  aside?: ReactNode;
}

// Section heading with the coloured bar, same look as the Rankings and Markets tables.
export const SectionTitle = ({ id, children, aside }: SectionTitleProps) => (
  <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
    <h2 id={id} className="font-headline text-lg font-bold uppercase tracking-tight flex items-center gap-2">
      <span aria-hidden className="w-1 h-6 bg-secondary" />
      {children}
    </h2>
    {aside && <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{aside}</div>}
  </div>
);
