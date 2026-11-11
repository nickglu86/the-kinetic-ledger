import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCoin, getCoinChart } from "@/server/data/coin";
import { CoinHeader } from "@/features/coin/CoinHeader";
import { CoinChart } from "@/features/coin/CoinChart";
import { CoinPerformance } from "@/features/coin/CoinPerformance";
import { CoinStats } from "@/features/coin/CoinStats";
import { CoinLinks } from "@/features/coin/CoinLinks";
import { CoinAbout } from "@/features/coin/CoinAbout";
import { CoinNews } from "@/features/coin/CoinNews";
import { CoinMarkets } from "@/features/coin/CoinMarkets";
import { getExchanges } from "@/server/data/exchanges";
import { getCoinNews } from "@/server/data/news";
import { DEFAULT_CHART_DAYS } from "@/features/coin/chartRanges";

// Dynamic route: /coins/bitcoin, /coins/ethereum, ...
// The folder name [id] becomes params.id. It's the CoinGecko coin id (e.g. "bitcoin"), not the symbol.
//
// PageProps<'/coins/[id]'> is a global helper Next.js generates during `next dev` / `next build`,
// so params is typed as Promise<{ id: string }>. In Next 15+ params is a Promise and must be awaited.

// Sets the browser tab title. The root layout's title template appends " | The Kinetic Ledger".
export async function generateMetadata({ params }: PageProps<"/coins/[id]">): Promise<Metadata> {
  const { id } = await params;
  // Don't let a failed fetch break metadata; the page itself will hit the same error and show error.tsx.
  const coin = await getCoin(id).catch(() => null);

  // Unknown coin: not-found.tsx sets its own <title>, so nothing to add here.
  if (!coin) return {};

  const symbol = coin.symbol.toUpperCase();
  return {
    title: `${coin.name} (${symbol}) Price`,
    description: `Live ${coin.name} (${symbol}) price, market cap and 24h change.`,
  };
}

export default async function CoinPage({ params }: PageProps<"/coins/[id]">) {
  const { id } = await params;

  // Fetched in parallel. getCoin is the same request as generateMetadata (deduped by cache()).
  // The chart is optional: if it fails the page still renders and the chart retries on the client.
  const [coin, chart] = await Promise.all([
    getCoin(id),
    getCoinChart(id, DEFAULT_CHART_DAYS).catch(() => null),
  ]);

  // Unknown id -> render ./not-found.tsx with a 404 status.
  // Other failures (rate limit, outage) throw inside getCoin -> app/error.tsx.
  if (!coin) notFound();

  // News needs the coin name/symbol, so it runs after getCoin. The RSS feeds are cached, so this is quick.
  // Exchanges (cached hourly, shared with the Exchanges page) supply trust scores for "Where to trade".
  const [news, exchanges] = await Promise.all([getCoinNews(coin.name, coin.symbol), getExchanges()]);

  // Desktop: two columns (sidebar | chart). Mobile: one column in reading order.
  // The columns use `contents` below lg, so their children join the outer flex column
  // and `order-*` can interleave them: header, chart, performance, stats, links, where to trade, about, news.
  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8">
      <div className="contents lg:flex lg:flex-col lg:gap-6 lg:col-span-4">
        <div className="order-1 lg:order-none">
          <CoinHeader coin={coin} />
        </div>
        <div className="order-4 lg:order-none">
          <CoinStats coin={coin} />
        </div>
        <div className="order-5 lg:order-none">
          <CoinLinks coin={coin} />
        </div>
      </div>

      <div className="contents lg:flex lg:flex-col lg:gap-6 lg:col-span-8">
        <div className="order-2 lg:order-none">
          <CoinChart coinId={coin.id} coinName={coin.name} initialData={chart} />
        </div>
        <div className="order-3 lg:order-none">
          <CoinPerformance coin={coin} />
        </div>
        <div className="order-6 lg:order-none empty:hidden">
          <CoinMarkets coin={coin} exchanges={exchanges} />
        </div>
        <div className="order-7 lg:order-none">
          <CoinAbout coin={coin} />
        </div>
        <div className="order-8 lg:order-none empty:hidden">
          <CoinNews coinName={coin.name} articles={news} />
        </div>
      </div>
    </main>
  );
}
