"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { VideoChannel, VideoItem } from "./types";

const ALL = "all";

const ChannelLogo = ({ src, className }: { src?: string; className?: string }) =>
  src ? (
    // no-referrer: YouTube's image server rejects requests whose Referer is another site
    <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" className={cn("rounded-full shrink-0", className)} />
  ) : null;

interface VideoLibraryProps {
  videos: VideoItem[];
  channels: VideoChannel[];
}

export const VideoLibrary = ({ videos, channels }: VideoLibraryProps) => {
  const [channel, setChannel] = useState(ALL);
  // Video in the big player (newest by default). The iframe only loads after a click,
  // so the page doesn't pull in YouTube's player (and its cookies) until someone wants to watch.
  const [activeId, setActiveId] = useState(videos[0]?.id);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<HTMLElement>(null);

  const active = videos.find((v) => v.id === activeId) ?? videos[0];
  const shown = channel === ALL ? videos : videos.filter((v) => v.channelId === channel);

  const play = (id: string) => {
    setActiveId(id);
    setPlaying(true);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!active) return null;

  return (
    <div className="space-y-10">
      {/* Player + details: same 8/4 split as the home page video and news sections */}
      <section ref={playerRef} aria-label="Now playing" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24">
        <div className="lg:col-span-8 aspect-video rounded-2xl overflow-hidden relative bg-black group">
          {playing ? (
            <iframe
              key={active.id}
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1`}
              title={active.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play ${active.title}`}
              className="w-full h-full cursor-pointer"
            >
              <img src={active.thumbnail} alt="" className="w-full h-full object-cover" />
              <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/50 group-hover:scale-110 transition-transform">
                  <span aria-hidden className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <p className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary">
            <ChannelLogo src={active.channelAvatar} className="w-6 h-6" />
            {active.channelTitle}
          </p>
          <h2 className="font-headline font-bold text-2xl leading-tight tracking-tight">{active.title}</h2>
          {active.publishedLabel && (
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              <time dateTime={active.publishedAt}>{active.publishedLabel}</time>
            </p>
          )}
          {active.description && (
            <p className="font-body text-sm text-on-surface-variant leading-relaxed line-clamp-6 whitespace-pre-line">
              {active.description}
            </p>
          )}
          <a
            href={`https://www.youtube.com/watch?v=${active.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto self-start inline-flex items-center gap-2 px-4 py-2 rounded bg-surface-container-high font-label text-xs font-bold uppercase tracking-widest hover:text-primary hover:bg-surface-container-highest transition-colors"
          >
            Watch on YouTube
            <span aria-hidden className="material-symbols-outlined text-sm">arrow_outward</span>
          </a>
        </div>
      </section>

      {/* Library */}
      <section aria-labelledby="video-library-heading" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 id="video-library-heading" className="font-headline text-lg font-bold uppercase tracking-tight flex items-center gap-2">
            <span aria-hidden className="w-1 h-6 bg-tertiary" />
            Latest Videos
          </h2>
          <div role="group" aria-label="Filter by channel" className="flex flex-wrap gap-2">
            {[{ id: ALL, title: "All", avatar: undefined }, ...channels].map((c) => {
              const selected = channel === c.id;
              const count = c.id === ALL ? videos.length : videos.filter((v) => v.channelId === c.id).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setChannel(c.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-label text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer",
                    selected
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high",
                  )}
                >
                  <ChannelLogo src={c.avatar} className="w-4 h-4" />
                  {c.title}
                  <span className={cn("text-[10px]", selected ? "opacity-70" : "opacity-50")}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shown.map((video) => {
            const isActive = video.id === active.id;
            return (
              <li key={video.id}>
                <button
                  type="button"
                  onClick={() => play(video.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group w-full h-full text-left flex flex-col bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-secondary",
                    isActive && "ring-2 ring-primary",
                  )}
                >
                  <span className="relative block aspect-video bg-black overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                    />
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span aria-hidden className="material-symbols-outlined text-primary text-5xl drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        play_circle
                      </span>
                    </span>
                    {isActive && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-on-primary font-label text-[9px] font-black uppercase tracking-widest">
                        Now playing
                      </span>
                    )}
                  </span>
                  <span className="flex-1 p-4 flex flex-col gap-3">
                    <span className="font-headline font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </span>
                    <span className="mt-auto flex items-center gap-2 text-[11px] text-on-surface-variant">
                      <ChannelLogo src={video.channelAvatar} className="w-5 h-5" />
                      <span className="truncate">{video.channelTitle}</span>
                      {video.publishedLabel && (
                        <>
                          <span aria-hidden>·</span>
                          <time dateTime={video.publishedAt} className="shrink-0">{video.publishedLabel}</time>
                        </>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};
