import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Building blocks for loading placeholders. A skeleton should mirror the real layout
// (same grid, same heights) so nothing jumps when the data arrives.

/** One grey placeholder bar. Purely visual, so screen readers skip it. */
export const Bone = ({ className }: { className?: string }) => (
  <div aria-hidden className={cn("rounded bg-surface-container-high", className)} />
);

interface SkeletonProps {
  /** Read out to screen readers, e.g. "Loading news". */
  label: string;
  className?: string;
  children: ReactNode;
  /** Render as <main> for whole-page skeletons (loading.tsx). */
  as?: "div" | "main";
}

/** Wrapper for a skeleton: pulses (unless the visitor prefers less motion) and announces itself once. */
export const Skeleton = ({ label, className, children, as: Tag = "div" }: SkeletonProps) => (
  <Tag aria-busy="true" className={cn("animate-pulse motion-reduce:animate-none", className)}>
    <p className="sr-only" role="status">
      {label}…
    </p>
    {children}
  </Tag>
);

/** Same shape as <PageHeader>: eyebrow, big title, description (`lines` = how many lines it wraps to). */
export const PageHeaderSkeleton = ({ lines = 1 }: { lines?: 1 | 2 }) => (
  <div className="border-b border-outline-variant/10 pb-6 space-y-2">
    <div className="h-3.5 flex items-center">
      <Bone className="h-2.5 w-24" />
    </div>
    <Bone className="h-10 w-48" />
    <div className="max-w-2xl">
      {/* Each line is as tall as a line of text-sm (20px), with a thinner bar inside */}
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="h-5 flex items-center">
          <Bone className={i === lines - 1 ? "h-3 w-2/3" : "h-3 w-full"} />
        </div>
      ))}
    </div>
  </div>
);

/** Table section like CoinsTable / SectorsTable: heading + search, then rows. */
export const TableSkeleton = ({ rows, withSearch = true }: { rows: number; withSearch?: boolean }) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <Bone className="h-6 w-40" />
      {withSearch && <Bone className="h-10 w-full sm:w-72 rounded-lg" />}
    </div>
    <div className="space-y-2">
      <Bone className="h-3 w-full bg-transparent" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-14 rounded-lg bg-surface-container-low flex items-center gap-4 px-4">
          <Bone className="h-3 w-5" />
          <Bone className="size-7 rounded-full" />
          <Bone className="h-3.5 w-28" />
          <Bone className="ml-auto h-3.5 w-16" />
          <Bone className="hidden sm:block h-3.5 w-12" />
          <Bone className="hidden md:block h-3.5 w-20" />
        </div>
      ))}
    </div>
  </div>
);
