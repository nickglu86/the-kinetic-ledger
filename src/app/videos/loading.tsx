import { Bone, PageHeaderSkeleton, Skeleton } from "@/components/ui/Skeleton";

// Shown while the Videos page fetches the YouTube playlists. Mirrors the page layout.
export default function VideosLoading() {
  return (
    <Skeleton as="main" label="Loading videos" className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <PageHeaderSkeleton />

      <div className="space-y-10">
        {/* Player + details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Bone className="lg:col-span-8 aspect-video rounded-2xl" />
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Bone className="h-4 w-32" />
            <Bone className="h-7 w-full" />
            <Bone className="h-7 w-2/3" />
            <Bone className="h-2.5 w-24" />
            <div className="space-y-2">
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-4/5" />
            </div>
          </div>
        </div>

        {/* Library: heading + channel chips, then cards */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Bone className="h-6 w-40" />
            <Bone className="h-7 w-full max-w-lg rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="bg-surface-container-low rounded-xl overflow-hidden">
                <Bone className="aspect-video rounded-none" />
                <div className="p-4 space-y-3">
                  <Bone className="h-4 w-full" />
                  <Bone className="h-4 w-2/3" />
                  <Bone className="h-3 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Skeleton>
  );
}
