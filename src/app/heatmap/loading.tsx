import { Bone, PageHeaderSkeleton, Skeleton } from "@/components/ui/Skeleton";

// Shown while the Heatmap page loads the market list. Mirrors the page layout.
export default function HeatmapLoading() {
  return (
    <Skeleton as="main" label="Loading heatmap" className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex justify-between gap-3">
          <Bone className="h-9 w-32 rounded-lg" />
          <Bone className="hidden sm:block h-3 w-56 self-center" />
        </div>
        <Bone className="w-full aspect-[3/4] sm:aspect-video rounded-xl bg-surface-container-low" />
      </div>
    </Skeleton>
  );
}
