import { cn } from "@/lib/utils";

// Shown instantly while page.tsx waits on CoinGecko (Next wraps the page in <Suspense> with this as the fallback).
// It mirrors the real layout (same grid, same order trick, same heights) so nothing jumps when the data arrives.

// One grey placeholder bar. Purely visual, so screen readers skip it.
const Bone = ({ className }: { className: string }) => (
  <div aria-hidden className={cn("rounded bg-surface-container-high", className)} />
);

export default function CoinLoading() {
  return (
    <main
      aria-busy="true"
      className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 animate-pulse"
    >
      <p className="sr-only" role="status">Loading coin data…</p>

      <div className="contents lg:flex lg:flex-col lg:gap-6 lg:col-span-4">
        {/* Header: back link, icon + name, price, 24h range */}
        <div className="order-1 lg:order-none space-y-5">
          <Bone className="h-3 w-20" />
          <div className="flex items-center gap-3">
            <Bone className="w-10 h-10 rounded-full" />
            <Bone className="h-8 w-40" />
            <Bone className="h-5 w-12" />
          </div>
          <Bone className="h-10 w-56" />
          <div className="space-y-2">
            <Bone className="h-1.5 w-full rounded-full" />
            <div className="flex justify-between">
              <Bone className="h-3 w-16" />
              <Bone className="h-3 w-16" />
            </div>
          </div>
        </div>

        {/* Stats: 7 label/value rows */}
        <div className="order-4 lg:order-none bg-surface-container-low rounded-xl px-4 md:px-6 py-2 divide-y divide-outline-variant/15">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="py-4 flex justify-between gap-4">
              <Bone className="h-3.5 w-28" />
              <Bone className="h-3.5 w-24" />
            </div>
          ))}
        </div>

        {/* Info links */}
        <div className="order-5 lg:order-none space-y-3">
          <Bone className="h-5 w-16" />
          <Bone className="h-40 w-full rounded-xl bg-surface-container-low" />
        </div>
      </div>

      <div className="contents lg:flex lg:flex-col lg:gap-6 lg:col-span-8">
        {/* Chart card: readout + range buttons, then the same fixed chart height as CoinChart */}
        <div className="order-2 lg:order-none bg-surface-container-low rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="space-y-2">
              <Bone className="h-3 w-32" />
              <Bone className="h-7 w-44" />
              <Bone className="h-3 w-24" />
            </div>
            <Bone className="h-8 w-64" />
          </div>
          <Bone className="h-80 md:h-105 w-full rounded-lg" />
        </div>

        {/* Performance: 6 periods */}
        <div className="order-3 lg:order-none grid grid-cols-3 sm:grid-cols-6 gap-y-4 bg-surface-container-low rounded-xl p-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Bone className="h-2.5 w-6" />
              <Bone className="h-4 w-12" />
            </div>
          ))}
        </div>

        {/* About */}
        <div className="order-6 lg:order-none bg-surface-container-low rounded-xl p-4 md:p-6 space-y-4">
          <Bone className="h-5 w-40" />
          <div className="space-y-2 max-w-prose">
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-4/5" />
          </div>
        </div>
      </div>
    </main>
  );
}
