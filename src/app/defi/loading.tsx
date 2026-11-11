import {
  Bone,
  MarketsNavSkeleton,
  PageHeaderSkeleton,
  Skeleton,
  StatCardsSkeleton,
  TableSkeleton,
} from "@/components/ui/Skeleton";

// Shown while the DeFi page loads its DefiLlama data. Mirrors the page layout.
export default function DefiLoading() {
  return (
    <Skeleton as="main" label="Loading DeFi data" className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <MarketsNavSkeleton />
      <PageHeaderSkeleton lines={2} />
      <StatCardsSkeleton />
      <div className="space-y-4">
        <Bone className="h-6 w-48" />
        <Bone className="h-72 md:h-88 w-full rounded-xl bg-surface-container-low" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="space-y-4">
            <Bone className="h-6 w-36" />
            <Bone className="h-[34rem] w-full rounded-xl bg-surface-container-low" />
          </div>
        ))}
      </div>
      <TableSkeleton rows={8} />
    </Skeleton>
  );
}
