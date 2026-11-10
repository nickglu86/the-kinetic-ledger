"use client";

import Link from "next/link";
import { useState, type FocusEvent } from "react";
import { cn } from "@/lib/utils";
import { TimeAgo } from "@/components/ui/TimeAgo";
import type { FeedArticle } from "./types";
import { externalLinkProps, sourceLogo } from "./shared";

const ALL = "All";
// The lead slot rotates through this many of the newest stories that have an image
const LEAD_COUNT = 5;
const HEADLINE_COUNT = 6;

interface NewsWireProps {
  articles: FeedArticle[];
  sources: string[];
}

// "Option B" of The Terminal: a rotating lead story next to a timeline of the latest headlines.
export const NewsWire = ({ articles, sources }: NewsWireProps) => {
  const [source, setSource] = useState(ALL);
  const [leadIndex, setLeadIndex] = useState(0);
  // Rotation stops when the visitor presses pause, or while they hover / tab inside the lead story
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);

  const filtered = source === ALL ? articles : articles.filter((a) => a.source === source);
  const leads = filtered.filter((a) => a.image).slice(0, LEAD_COUNT);
  const lead = leads[leadIndex] ?? leads[0];
  const headlines = filtered.slice(0, HEADLINE_COUNT);

  // Reset the rotation in the click handler itself, so the new source always starts at its newest story
  const selectSource = (name: string) => {
    setSource(name);
    setLeadIndex(0);
  };

  const showNext = () => setLeadIndex((i) => (i + 1) % leads.length);

  const onBlur = (e: FocusEvent<HTMLElement>) => {
    // Only "un-hold" when focus leaves the lead story, not when it moves between its buttons
    if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-outline-variant/10 pb-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h2 className="font-headline font-extrabold text-2xl md:text-3xl tracking-tighter uppercase italic whitespace-nowrap">The Terminal</h2>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-error/10 text-error font-label text-[10px] font-bold uppercase tracking-widest">
            <span aria-hidden className="relative flex size-1.5">
              <span className="absolute inset-0 rounded-full bg-error opacity-75 animate-ping motion-reduce:hidden" />
              <span className="relative size-1.5 rounded-full bg-error" />
            </span>
            Live
          </span>
          <Link
            href="/news"
            className="inline-flex items-center gap-1 whitespace-nowrap font-label text-primary text-xs font-bold tracking-widest uppercase hover:underline"
          >
            All news
            <span aria-hidden className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div role="group" aria-label="News source" className="flex gap-1 bg-surface-container-low p-1 rounded-lg overflow-x-auto no-scrollbar">
          {[ALL, ...sources].map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={source === name}
              onClick={() => selectSource(name)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md font-label text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer",
                source === name ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {name !== ALL && <img src={sourceLogo(name)} alt="" className="size-4 rounded-sm" />}
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {lead && (
          <article
            aria-roledescription="carousel"
            aria-label="Top stories"
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={onBlur}
            // Desktop: no fixed ratio, the grid row stretches the image to the headline list's height
            className="group lg:col-span-8 relative overflow-hidden rounded-xl bg-surface-container-low aspect-[4/5] sm:aspect-video lg:aspect-auto lg:min-h-[30rem]"
          >
            <img
              src={lead.image}
              alt=""
              className="absolute inset-0 size-full object-cover brightness-90 group-hover:brightness-100 transition-[filter] duration-500"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 space-y-3" aria-live={paused ? "polite" : "off"}>
              <div className="flex flex-wrap items-center gap-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-black">{lead.category}</span>
                <img src={sourceLogo(lead.source)} alt="" className="size-4 rounded-sm" />
                <span className="font-bold text-on-surface">{lead.source}</span>
                <span aria-hidden>·</span>
                <TimeAgo timestamp={lead.publishedAt} />
              </div>

              <h3 className="font-headline font-bold text-2xl md:text-4xl leading-tight tracking-tighter max-w-3xl line-clamp-3">
                {/* after:inset-0 stretches the link over the whole card; the controls below sit above it */}
                <a href={lead.link} {...externalLinkProps} className="after:absolute after:inset-0 hover:text-primary transition-colors focus-visible:outline-none">
                  {lead.title}
                </a>
              </h3>
              {lead.description && (
                <p className="hidden sm:block max-w-2xl font-body text-sm text-on-surface-variant line-clamp-2">{lead.description}</p>
              )}

              {leads.length > 1 && (
                <div className="relative z-10 flex items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-1.5">
                    {leads.map((story, i) => (
                      <button
                        key={story.link}
                        type="button"
                        onClick={() => setLeadIndex(i)}
                        aria-label={`Show story ${i + 1} of ${leads.length}`}
                        aria-current={i === leadIndex}
                        className="py-2 cursor-pointer"
                      >
                        <span className="block w-8 md:w-12 h-1 rounded-full bg-outline-variant/60 overflow-hidden">
                          {i < leadIndex && <span className="block size-full bg-primary/60" />}
                          {i === leadIndex && (
                            <span
                              // key restarts the timer for every story (and every source)
                              key={`${source}-${leadIndex}`}
                              onAnimationEnd={showNext}
                              style={{ animationPlayState: paused || held ? "paused" : "running" }}
                              className="block size-full bg-primary animate-story-progress"
                            />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    <span className="tabular-nums">
                      {leadIndex + 1} / {leads.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPaused((p) => !p)}
                      aria-label={paused ? "Resume rotation" : "Pause rotation"}
                      className="grid place-items-center size-8 rounded-full bg-surface-container-highest/80 text-on-surface hover:text-primary transition-colors cursor-pointer"
                    >
                      <span aria-hidden className="material-symbols-outlined text-lg">{paused ? "play_arrow" : "pause"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
        )}

        <aside className={cn("bg-surface-container-low rounded-xl p-5 flex flex-col", lead ? "lg:col-span-4" : "lg:col-span-12")}>
          <h3 className="mb-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Latest headlines</h3>

          {headlines.length > 0 ? (
            <ol className="flex-1">
              {headlines.map((article) => {
                const active = article.link === lead?.link;
                return (
                  <li key={article.link} className="grid grid-cols-[2.75rem_1fr] gap-3">
                    <TimeAgo
                      variant="clock"
                      timestamp={article.publishedAt}
                      className={cn(
                        "pt-px text-right font-headline text-xs tabular-nums",
                        active ? "text-primary font-bold" : "text-on-surface-variant",
                      )}
                    />
                    <div className="relative border-l border-outline-variant/30 pl-4 pb-5">
                      <span
                        aria-hidden
                        className={cn(
                          "absolute -left-[4.5px] top-1.5 size-2 rounded-full",
                          active ? "bg-primary shadow-[0_0_8px_var(--color-primary)]" : "bg-outline-variant",
                        )}
                      />
                      <a href={article.link} {...externalLinkProps} className="group block">
                        <p
                          className={cn(
                            "font-headline font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors",
                            active && "text-primary",
                          )}
                        >
                          {article.title}
                          {active && <span className="sr-only"> (shown in the lead story)</span>}
                        </p>
                      </a>
                      <p className="mt-1.5 flex items-center gap-1.5 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                        <img src={sourceLogo(article.source)} alt="" className="size-3.5 rounded-sm" />
                        {article.source}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-sm text-on-surface-variant">No stories from {source} right now.</p>
          )}

          <Link
            href="/news"
            className="mt-2 inline-flex items-center gap-1 self-start font-label text-primary text-[10px] font-bold tracking-widest uppercase hover:underline"
          >
            More headlines
            <span aria-hidden className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </aside>
      </div>
    </section>
  );
};
