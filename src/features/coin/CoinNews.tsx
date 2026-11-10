import Link from "next/link";
import { TimeAgo } from "@/components/ui/TimeAgo";
import type { FeedArticle } from "@/features/news/types";
import { externalLinkProps, sourceLogo } from "@/features/news/shared";

interface CoinNewsProps {
  coinName: string;
  articles: FeedArticle[];
}

// "Bitcoin Latest News": headlines that mention the coin. Hidden when there are none.
export const CoinNews = ({ coinName, articles }: CoinNewsProps) => {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="coin-news-title" className="space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="coin-news-title" className="font-headline font-bold text-xl tracking-tight">
          {coinName} Latest News
        </h2>
        <Link
          href="/news"
          className="inline-flex items-center gap-1 whitespace-nowrap font-label text-primary text-[10px] font-bold tracking-widest uppercase hover:underline"
        >
          All news
          <span aria-hidden className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {articles.map((article) => (
          <li key={article.link}>
            <a
              href={article.link}
              {...externalLinkProps}
              className="group h-full flex flex-col gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-container-high">
                {article.image ? (
                  <img
                    src={article.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-[1.03] transition-all duration-500"
                  />
                ) : (
                  <img src={sourceLogo(article.source)} alt="" className="absolute inset-0 m-auto size-12 opacity-40" />
                )}
              </div>
              <h3 className="font-headline font-bold text-base leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <div className="mt-auto pb-3 border-b border-outline-variant/15 font-label text-[11px] text-on-surface-variant">
                <p className="flex items-center gap-1.5 font-bold text-on-surface">
                  <img src={sourceLogo(article.source)} alt="" className="size-4 rounded-sm" />
                  {article.source}
                </p>
                <TimeAgo timestamp={article.publishedAt} className="mt-1 block" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
