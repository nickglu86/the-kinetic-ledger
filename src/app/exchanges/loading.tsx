import { MarketsNavSkeleton, PageHeaderSkeleton, Skeleton, StatCardsSkeleton, TableSkeleton } from "@/components/ui/Skeleton";

// Shown while the Exchanges page loads. Mirrors the page layout.
export default function ExchangesLoading() {
  return (
    <Skeleton as="main" label="Loading exchanges" className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <MarketsNavSkeleton />
      <PageHeaderSkeleton lines={2} />
      <StatCardsSkeleton />
      <TableSkeleton rows={10} />
    </Skeleton>
  );
}
