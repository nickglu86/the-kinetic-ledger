import { Suspense } from "react";
import { GlobalMetrics } from "@/features/market/GlobalMetrics";
import { MarketTable } from "@/features/market/MarketTable";
import { NewsHero } from "@/features/news/NewsHero";
import { NewsLetter } from "@/features/others/NewsLetter";
import { TrendingCoins } from "@/features/trending/TrendingCoins";
import { TrendingNFTs } from "@/features/trending/TrendingNfts";
import { TrendingSectors } from "@/features/trending/TrendingSectors";
import { KineticBroadcast } from "@/features/videos/KineticBroadcast";
import {
  BroadcastSkeleton,
  MarketTableSkeleton,
  MetricsSkeleton,
  NFTsSkeleton,
  SectorsSkeleton,
  TerminalSkeleton,
  TrendingCoinsSkeleton,
} from "@/features/home/HomeSkeletons";

// Every section fetches its own data. Each one sits in its own <Suspense>, so Next streams
// them in as they finish and a slow API (e.g. YouTube) only delays its own section.
export default function Home() {
  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-12">
      <Suspense fallback={<MetricsSkeleton />}>
        <GlobalMetrics />
      </Suspense>
      <Suspense fallback={<TerminalSkeleton />}>
        <NewsHero />
      </Suspense>
      <Suspense fallback={<SectorsSkeleton />}>
        <TrendingSectors />
      </Suspense>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Suspense fallback={<MarketTableSkeleton />}>
          <MarketTable />
        </Suspense>
        <div className="lg:col-span-4 space-y-6">
          <Suspense fallback={<TrendingCoinsSkeleton />}>
            <TrendingCoins />
          </Suspense>
          <NewsLetter />
        </div>
      </section>
      <Suspense fallback={<NFTsSkeleton />}>
        <TrendingNFTs />
      </Suspense>
      <Suspense fallback={<BroadcastSkeleton />}>
        <KineticBroadcast />
      </Suspense>
    </main>
  );
}
