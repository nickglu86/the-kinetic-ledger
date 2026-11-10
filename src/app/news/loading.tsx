import { Bone, PageHeaderSkeleton, Skeleton } from "@/components/ui/Skeleton";

// Shown while the News page fetches the 3 RSS feeds. Mirrors the page layout.
export default function NewsLoading() {
  return (
    <Skeleton as="main" label="Loading news" className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <PageHeaderSkeleton />

      <div className="space-y-6">
        {/* Source filter chips */}
        <div className="flex flex-wrap gap-2">
          {["w-16", "w-28", "w-32", "w-24"].map((width) => (
            <Bone key={width} className={`h-7 rounded-md ${width}`} />
          ))}
        </div>

        {/* Lead article: image left, text right on desktop */}
        <div className="grid lg:grid-cols-12 bg-surface-container-low rounded-xl overflow-hidden">
          <Bone className="aspect-video lg:aspect-auto lg:min-h-80 lg:col-span-7 rounded-none" />
          <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-center gap-4">
            <Bone className="h-5 w-32" />
            <Bone className="h-7 w-full" />
            <Bone className="h-7 w-3/4" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-40" />
          </div>
        </div>

        {/* Article cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-surface-container-low rounded-xl overflow-hidden">
              <Bone className="aspect-video rounded-none" />
              <div className="p-5 space-y-3">
                <Bone className="h-2.5 w-16" />
                <Bone className="h-4 w-full" />
                <Bone className="h-4 w-2/3" />
                <Bone className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Skeleton>
  );
}
