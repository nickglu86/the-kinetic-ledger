import { Bone, PageHeaderSkeleton, Skeleton, TableSkeleton } from "@/components/ui/Skeleton";

// Shown while the Rankings page fetches the sector list. Mirrors the page layout.
export default function RankingsLoading() {
  return (
    <Skeleton as="main" label="Loading sector rankings" className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <PageHeaderSkeleton lines={2} />

      {/* 4 highlight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="min-h-29 bg-surface-container-low p-4 rounded-xl space-y-3">
            <Bone className="h-2.5 w-24" />
            <Bone className="h-4 w-36" />
            <Bone className="h-3.5 w-28" />
          </div>
        ))}
      </div>

      <TableSkeleton rows={10} />
    </Skeleton>
  );
}
