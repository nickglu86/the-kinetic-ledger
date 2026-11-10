import { Bone, Skeleton } from "@/components/ui/Skeleton";

// Placeholders for the home page sections. The page wraps each async section in <Suspense>
// with one of these as the fallback, so the sections appear one by one as their data arrives
// instead of the whole page waiting for the slowest API. Each mirrors its section's layout.

const SectionTitle = ({ className = "h-7 w-56" }: { className?: string }) => <Bone className={className} />;

/** GlobalMetrics: 4 metric cards */
export const MetricsSkeleton = () => (
  <Skeleton label="Loading market overview" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="min-h-33 bg-surface-container-low rounded-xl px-4 py-3.5 flex flex-col gap-3">
        <div className="flex justify-between">
          <Bone className="h-3 w-28" />
          <Bone className="h-4 w-12 rounded-md" />
        </div>
        <div className="flex items-center gap-4">
          <Bone className="size-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Bone className="h-5 w-24" />
            <Bone className="h-3 w-32" />
          </div>
        </div>
      </div>
    ))}
  </Skeleton>
);

/** NewsWire: header + source chips, lead story, 6-headline timeline */
export const TerminalSkeleton = () => (
  <Skeleton label="Loading news" className="space-y-6">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-outline-variant/10 pb-4">
      <SectionTitle className="h-8 w-60" />
      <Bone className="h-9 w-full max-w-md rounded-lg bg-surface-container-low" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 relative rounded-xl bg-surface-container-low aspect-[4/5] sm:aspect-video lg:aspect-auto lg:h-145">
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 space-y-3">
          <Bone className="h-4 w-48" />
          <Bone className="h-8 w-full max-w-2xl" />
          <Bone className="h-8 w-2/3 max-w-xl" />
          <Bone className="h-3 w-full max-w-xl" />
        </div>
      </div>
      <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-5 space-y-5">
        <Bone className="h-2.5 w-28" />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="grid grid-cols-[2.75rem_1fr] gap-3">
            <Bone className="h-3 w-9 justify-self-end" />
            <div className="space-y-2">
              <Bone className="h-3.5 w-full" />
              <Bone className="h-3.5 w-3/4" />
              <Bone className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </Skeleton>
);

/** TrendingSectors: a row of sector cards */
export const SectorsSkeleton = () => (
  <Skeleton label="Loading trending sectors" className="space-y-4">
    <SectionTitle className="h-7 w-48" />
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-25 bg-surface-container p-4 rounded-lg flex flex-col justify-between">
          <Bone className="h-3.5 w-3/4" />
          <div className="flex items-center gap-2">
            <Bone className="size-7 rounded-full" />
            <Bone className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  </Skeleton>
);

/** MarketTable: top 10 rows. Takes the same 8 of 12 columns as the real table. */
export const MarketTableSkeleton = () => (
  <Skeleton label="Loading market rankings" className="lg:col-span-8 space-y-8">
    <div className="border-b border-outline-variant/10 pb-4">
      <SectionTitle className="h-8 w-64" />
    </div>
    <div className="space-y-2">
      <Bone className="h-4 w-full bg-transparent" />
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="h-18 rounded-lg bg-surface-container-low flex items-center gap-4 px-4">
          <Bone className="h-3.5 w-5" />
          <Bone className="size-8 rounded-full" />
          <div className="space-y-1.5">
            <Bone className="h-3.5 w-24" />
            <Bone className="h-2.5 w-10" />
          </div>
          <Bone className="ml-auto h-3.5 w-20" />
          <Bone className="hidden sm:block h-3.5 w-14" />
          <Bone className="hidden md:block h-3.5 w-14" />
          <Bone className="hidden md:block h-3.5 w-20" />
        </div>
      ))}
    </div>
  </Skeleton>
);

/** TrendingCoins: card with 10 coins */
export const TrendingCoinsSkeleton = () => (
  <Skeleton label="Loading trending coins" className="bg-surface-container-high rounded-xl p-6 space-y-4">
    <Bone className="h-7 w-36 bg-surface-container-highest" />
    {Array.from({ length: 10 }, (_, i) => (
      <div key={i} className="h-8.5 flex items-center gap-3">
        <Bone className="h-3 w-5 bg-surface-container-highest" />
        <Bone className="size-5 rounded-full bg-surface-container-highest" />
        <Bone className="h-4 w-28 bg-surface-container-highest" />
        <div className="ml-auto space-y-1.5">
          <Bone className="h-3 w-16 bg-surface-container-highest" />
          <Bone className="ml-auto h-3 w-10 bg-surface-container-highest" />
        </div>
      </div>
    ))}
    {/* "View all trending" button */}
    <Bone className="h-8 w-full bg-surface-container-highest" />
  </Skeleton>
);

/** TrendingNFTs: horizontal row of cards */
export const NFTsSkeleton = () => (
  <Skeleton label="Loading trending NFTs" className="mb-14 space-y-8">
    <SectionTitle className="h-9 w-52" />
    <div className="flex gap-6 overflow-hidden pb-2">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="w-65 h-31 shrink-0 bg-surface-container rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-4">
            <Bone className="size-12 rounded-lg" />
            <div className="space-y-2">
              <Bone className="h-3.5 w-32" />
              <Bone className="h-2.5 w-20" />
            </div>
          </div>
          <div className="flex justify-between">
            <Bone className="h-3 w-14" />
            <Bone className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  </Skeleton>
);

/** KineticBroadcast: player + "Up Next" list */
export const BroadcastSkeleton = () => (
  <Skeleton label="Loading videos" className="mb-4 space-y-8">
    <SectionTitle className="h-9 w-64" />
    <div className="grid grid-cols-12 gap-8">
      <Bone className="col-span-12 lg:col-span-8 aspect-video rounded-2xl bg-surface-container-low" />
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
        <Bone className="h-2.5 w-16 mx-2" />
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-surface-container rounded-lg p-3 flex gap-4">
            <Bone className="w-36 aspect-video rounded-md shrink-0" />
            <div className="flex-1 flex flex-col justify-center gap-2">
              <Bone className="h-3.5 w-full" />
              <Bone className="h-3.5 w-2/3" />
              <Bone className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </Skeleton>
);
