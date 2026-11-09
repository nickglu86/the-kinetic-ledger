import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  /** Small label above the title. */
  eyebrow?: string;
  description?: ReactNode;
  /** Optional content on the right (e.g. a timestamp or filter). */
  children?: ReactNode;
}

// Title block shared by the Markets, Rankings and News pages. Same look as the home section headings.
export const PageHeader = ({ title, eyebrow, description, children }: PageHeaderProps) => (
  <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-outline-variant/10 pb-6">
    <div className="space-y-2">
      {eyebrow && (
        <p className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
      )}
      <h1 className="font-headline font-extrabold text-4xl tracking-tighter uppercase">{title}</h1>
      {description && <div className="font-body text-sm text-on-surface-variant max-w-2xl">{description}</div>}
    </div>
    {children}
  </header>
);
