import type { NewsArticle } from "@/types/api";

/** An RSS article tagged with the feed it came from. */
export interface FeedArticle extends NewsArticle {
  source: string;
  /** Milliseconds since epoch (0 if the feed gave no valid date). Used for sorting. */
  publishedAt: number;
  /** Pre-formatted on the server, e.g. "Nov 9, 2:32 PM UTC". */
  publishedLabel: string;
}

export interface NewsFeedData {
  articles: FeedArticle[];
  /** Feeds that loaded. */
  sources: string[];
  /** Feeds that failed this time. */
  failedSources: string[];
}
