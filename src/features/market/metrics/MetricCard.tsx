import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  icon: string;
  /** Small element on the right of the title row, e.g. a change pill. */
  aside?: ReactNode;
  children: ReactNode;
}

// Shell shared by the 4 home metric cards: title always top-left, content below,
// so all four line up no matter how tall their visual is.
export const MetricCard = ({ title, icon, aside, children }: MetricCardProps) => (
  <section className="bg-surface-container-low rounded-xl px-4 py-3.5 flex flex-col gap-3 hover:bg-surface-container transition-colors">
    <div className="flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-1.5 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
        <span aria-hidden className="material-symbols-outlined text-sm">{icon}</span>
        {title}
      </h2>
      {aside}
    </div>
    <div className="flex-1 flex items-center">{children}</div>
  </section>
);
