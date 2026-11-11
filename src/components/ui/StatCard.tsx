import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Small line under the value, e.g. a % change or a note */
  detail?: ReactNode;
  /** Top border colour */
  accent: string;
}

// Headline number card used at the top of the DeFi, Exchanges and Derivatives pages.
export const StatCard = ({ label, value, detail, accent }: StatCardProps) => (
  <div className="bg-surface-container-low p-4 rounded-xl border-t-2 flex flex-col gap-2 min-w-0" style={{ borderTopColor: accent }}>
    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</p>
    {/* Wraps instead of truncating: two cards side by side on a phone are only ~160px wide */}
    <p className="font-headline text-xl md:text-2xl leading-tight font-bold text-on-surface break-words">{value}</p>
    {detail && <div className="font-label text-xs text-on-surface-variant">{detail}</div>}
  </div>
);

export const ACCENTS = {
  primary: "#00FFA3",
  secondary: "#00e3fd",
  tertiary: "#ac89ff",
  error: "#ff716c",
} as const;
