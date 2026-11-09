import { ENDPOINTS } from "@/lib/endpoints";
import { safeFetchRSS } from "@/lib/rss";
import { safeUrl } from "@/lib/safeUrl";
import type { FeedArticle, NewsFeedData } from "@/features/news/types";

export const NEWS_SOURCES = [
  { name: "CoinDesk", url: ENDPOINTS.rss.coindesk },
  { name: "CoinTelegraph", url: ENDPOINTS.rss.cointelegraph },
  { name: "Decrypt", url: ENDPOINTS.rss.decrypt },
] as const;

// Formatted here on the server, not in the client component: a date formatted in the browser can
// differ from the server-rendered HTML (time zone), which causes a hydration mismatch.
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

// All three feeds in parallel, merged into one list, newest first.
// A feed that fails is skipped (and reported), the others still show.
export const getAllNews = async (): Promise<NewsFeedData> => {
  const results = await Promise.all(
    NEWS_SOURCES.map(async (source) => ({ source: source.name, articles: await safeFetchRSS(source.url) })),
  );

  const seen = new Set<string>();
  const articles: FeedArticle[] = [];

  for (const { source, articles: items } of results) {
    for (const item of items ?? []) {
      // RSS is third-party data: only keep real http(s) links, and drop duplicates.
      const link = safeUrl(item.link);
      if (!link || seen.has(link) || !item.title) continue;
      seen.add(link);

      const publishedAt = Date.parse(item.pubDate) || 0;
      articles.push({
        ...item,
        link,
        image: safeUrl(item.image) ?? undefined,
        source,
        publishedAt,
        publishedLabel: publishedAt ? dateFormat.format(publishedAt) : "",
      });
    }
  }

  articles.sort((a, b) => b.publishedAt - a.publishedAt);

  return {
    articles,
    sources: results.filter((r) => r.articles).map((r) => r.source),
    failedSources: results.filter((r) => !r.articles).map((r) => r.source),
  };
};
