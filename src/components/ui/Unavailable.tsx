import { cn } from "@/lib/utils";

interface UnavailableProps {
  label?: string;
  className?: string;
}

// Placeholder shown in place of a section/card whose data fetch failed,
// so one bad API response doesn't take down the whole page.
export const Unavailable = ({ label, className }: UnavailableProps) => (
  <div
    className={cn(
      "bg-surface-container-low rounded-xl p-4 flex flex-col justify-center gap-2",
      className,
    )}
  >
    {label && (
      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>
    )}
    <p className="flex items-center gap-1.5 font-body text-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-base">cloud_off</span>
      Data temporarily unavailable
    </p>
  </div>
);
