import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Unavailable } from "@/components/ui/Unavailable";
import { NewsFeed } from "@/features/news/NewsFeed";
import { getAllNews } from "@/server/data/news";

export const metadata: Metadata = {
  title: "Crypto News",
  description: "The latest crypto news from CoinDesk, CoinTelegraph and Decrypt in one feed.",
};

// Server fetch -> client render: the 3 RSS feeds are fetched and merged on the server
// (cached 5 min), the source filter and "load more" run in the browser.
export default async function NewsPage() {
  const { articles, sources, failedSources } = await getAllNews();

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <PageHeader
        eyebrow="The Terminal"
        title="News"
        description="Headlines from CoinDesk, CoinTelegraph and Decrypt, merged into one feed, newest first."
      >
        {failedSources.length > 0 && (
          <p className="flex items-center gap-1.5 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            <span aria-hidden className="material-symbols-outlined text-sm">cloud_off</span>
            {failedSources.join(", ")} unavailable right now
          </p>
        )}
      </PageHeader>

      {articles.length > 0 ? (
        <NewsFeed articles={articles} sources={sources} />
      ) : (
        <Unavailable label="News" className="py-10 items-center" />
      )}
    </main>
  );
}
