import { Bone, MarketsNavSkeleton, PageHeaderSkeleton, Skeleton, TableSkeleton } from "@/components/ui/Skeleton";

// Shown while the Markets page fetches 250 coins + global data. Mirrors the page layout.
export default function MarketsLoading() {
  return (
    <Skeleton as="main" label="Loading markets" className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <MarketsNavSkeleton />
      <PageHeaderSkeleton />

      {/* Highlights: market cap card, Trending, Top Gainers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-surface-container-low rounded-xl p-5 space-y-4 h-70">
            <Bone className="h-4 w-32" />
            {Array.from({ length: 5 }, (_, j) => (
              <div key={j} className="flex items-center gap-3">
                <Bone className="size-6 rounded-full" />
                <Bone className="h-3.5 flex-1" />
                <Bone className="h-3.5 w-16" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <TableSkeleton rows={10} />
    </Skeleton>
  );
}
