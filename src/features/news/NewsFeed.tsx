"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FeedArticle } from "./types";

const ALL = "All";
// 1 lead story + 4 rows of 3 cards
const INITIAL_COUNT = 13;
const LOAD_MORE_COUNT = 12;

const sourceLogo = (source: string) => `/assets/news-sources/${source.toLowerCase()}.png`;

// Image, or a source-logo placeholder when the feed item has none.
// eager: the lead image is above the fold, so lazy-loading it would only delay it.
const ArticleImage = ({ article, className, eager }: { article: FeedArticle; className?: string; eager?: boolean }) => (
  <div className={cn("relative overflow-hidden bg-surface-container-high", className)}>
    {article.image ? (
      <img
        src={article.image}
        alt=""
        loading={eager ? "eager" : "lazy"}
        className="absolute inset-0 w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-[1.03] transition-all duration-500"
      />
    ) : (
      <img src={sourceLogo(article.source)} alt="" className="absolute inset-0 m-auto w-12 h-12 opacity-40" />
    )}
  </div>
);

const ArticleMeta = ({ article }: { article: FeedArticle }) => (
  <div className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
    <img src={sourceLogo(article.source)} alt="" className="w-4 h-4 rounded-sm" />
    <span className="font-bold text-on-surface">{article.source}</span>
    {article.publishedLabel && (
      <>
        <span aria-hidden>·</span>
        <time dateTime={new Date(article.publishedAt).toISOString()}>{article.publishedLabel}</time>
      </>
    )}
  </div>
);

// External article: the whole card is the link. noopener so the news site can't reach back into our tab.
const externalLinkProps = { target: "_blank", rel: "noopener noreferrer" } as const;

const LeadArticle = ({ article }: { article: FeedArticle }) => (
  <a
    href={article.link}
    {...externalLinkProps}
    className="group grid lg:grid-cols-12 bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-secondary"
  >
    <ArticleImage article={article} eager className="aspect-video lg:aspect-auto lg:min-h-80 lg:col-span-7" />
    <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-center gap-4">
      <span className="self-start px-3 py-1 bg-primary text-on-primary text-[10px] font-black tracking-widest uppercase rounded">
        Latest · {article.category}
      </span>
      <h2 className="font-headline font-bold text-2xl md:text-3xl leading-tight tracking-tighter group-hover:text-primary transition-colors">
        {article.title}
      </h2>
      {article.description && (
        <p className="font-body text-sm text-on-surface-variant line-clamp-3">{article.description}</p>
      )}
      <ArticleMeta article={article} />
    </div>
  </a>
);

const ArticleCard = ({ article }: { article: FeedArticle }) => (
  <li>
    <a
      href={article.link}
      {...externalLinkProps}
      className="group h-full flex flex-col bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-secondary"
    >
      <ArticleImage article={article} className="aspect-video" />
      <div className="flex-1 p-5 flex flex-col gap-3">
        <span className="font-label text-[9px] font-bold uppercase tracking-widest text-primary">{article.category}</span>
        <h3 className="font-headline font-bold text-base leading-snug line-clamp-3 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {article.description && (
          <p className="font-body text-xs text-on-surface-variant line-clamp-2">{article.description}</p>
        )}
        <div className="mt-auto pt-2">
          <ArticleMeta article={article} />
        </div>
      </div>
    </a>
  </li>
);

interface NewsFeedProps {
  articles: FeedArticle[];
  sources: string[];
}

export const NewsFeed = ({ articles, sources }: NewsFeedProps) => {
  const [activeSource, setActiveSource] = useState(ALL);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filtered = activeSource === ALL ? articles : articles.filter((a) => a.source === activeSource);
  const [lead, ...rest] = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const chooseSource = (source: string) => {
    setActiveSource(source);
    setVisibleCount(INITIAL_COUNT); // start each source from the top
  };

  const filters = [ALL, ...sources];

  return (
    <section aria-label="News articles" className="space-y-6">
      <div role="group" aria-label="Filter by source" className="flex flex-wrap gap-2">
        {filters.map((source) => {
          const count = source === ALL ? articles.length : articles.filter((a) => a.source === source).length;
          const active = activeSource === source;
          return (
            <button
              key={source}
              type="button"
              aria-pressed={active}
              onClick={() => chooseSource(source)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-label text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer",
                active
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high",
              )}
            >
              {source !== ALL && <img src={sourceLogo(source)} alt="" className="w-4 h-4 rounded-sm" />}
              {source}
              <span className={cn("text-[10px]", active ? "opacity-70" : "opacity-50")}>{count}</span>
            </button>
          );
        })}
      </div>

      {!lead ? (
        <p className="py-12 text-center text-sm text-on-surface-variant">No articles from this source right now.</p>
      ) : (
        <>
          <LeadArticle article={lead} />
          {rest.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article) => (
                <ArticleCard key={article.link} article={article} />
              ))}
            </ul>
          )}
        </>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + LOAD_MORE_COUNT)}
            className="px-6 py-2 rounded bg-surface-container-high font-label text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container-highest hover:text-primary transition-colors cursor-pointer"
          >
            Load more
            <span className="ml-2 text-on-surface-variant">{filtered.length - visibleCount} left</span>
          </button>
        </div>
      )}
    </section>
  );
};
