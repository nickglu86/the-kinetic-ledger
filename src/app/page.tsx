import { GlobalMetrics } from "@/features/market/GlobalMetrics";
import { MarketTable } from "@/features/market/MarketTable";
import { NewsHero } from "@/features/news/NewsHero";
import { NewsLetter } from "@/features/others/NewsLetter";
import { TrendingCoins } from "@/features/trending/TrendingCoins";
import { TrendingNFTs } from "@/features/trending/TrendingNfts";
import { TrendingSectors } from "@/features/trending/TrendingSectors";
import { KineticBroadcast } from "@/features/videos/KineticBroadcast";

export default function Home() {
  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-12">
      <GlobalMetrics />
      <NewsHero />
      <TrendingSectors />
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <MarketTable />
        <div className="lg:col-span-4 space-y-6">
          <TrendingCoins />
          <NewsLetter />
        </div>
      </section>
      <TrendingNFTs />
      <KineticBroadcast />
    </main>
  );
}
