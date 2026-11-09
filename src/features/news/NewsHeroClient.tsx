"use client";

import Link from "next/link";
import { useState } from "react";
import { NewsArticle } from "@/types/api";
import { cn } from "@/lib/utils";

interface NewsHeroClientProps {
    sources: Record<string, NewsArticle[]>
}
export const NewsHeroClient = ({ sources }: NewsHeroClientProps) => {
    const sourcesNames = Object.keys(sources);

    const [activeSource, setActiveSource] = useState(sourcesNames[0])
    const artices = sources[activeSource] ?? [];
    const [heroArticle, setHeroArticle] = useState(artices[0])
    const sidebarArticles = artices;

    return (
        <section className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-outline-variant/10 pb-4 gap-4">
                <div className="flex items-baseline gap-4">
                    <h2 className="font-headline font-extrabold text-3xl tracking-tighter uppercase italic">The Terminal</h2>
                    <Link href="/news" className="inline-flex items-center gap-1 whitespace-nowrap font-label text-primary text-xs font-bold tracking-widest uppercase hover:underline">
                        All news
                        <span aria-hidden className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
                <div className="flex items-center gap-3  mr-3">
                    <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Source:</span>
                    <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg">
                        {sourcesNames.map(
                            (sourceName) => (
                                <button
                                    key={sourceName}
                                    onClick={() => setActiveSource(sourceName)}
                                    className={cn(
                                        "flex items-center gap-2 px-1 py-1 text-[10px] font-black uppercase transition-colors cursor-pointer min-w-[90px]",
                                        activeSource === sourceName ?
                                            "bg-primary text-on-primary rounded shadow-lg"
                                            : "text-on-surface-variant hover:text-on-surface"
                                    )}
                                >
                                    <img className="h-5 w-5" src={`/assets/news-sources/${sourceName.toLowerCase()}.png`} alt={sourceName} />
                                    <span>{sourceName}</span>
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 group relative overflow-hidden rounded-lg bg-surface-container-low">
                    <div className="aspect-[16/9] w-full relative">
                        <img alt="Hero Story"
                            className="w-full h-full object-cover transition-all duration-700 brightness-75 group-hover:brightness-100"
                            src={heroArticle.image} />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 space-y-4">
                            <span
                                className="inline-block px-3 py-1 bg-primary text-on-primary text-[10px] font-black tracking-widest uppercase rounded">Lead
                                {heroArticle.category}</span>
                            <h1
                                className="font-headline font-bold text-3xl lg:text-5xl text-on-surface max-w-3xl leading-tight tracking-tighter">
                                {heroArticle.title}
                            </h1>
                            <p className="text-on-surface-variant max-w-xl text-sm font-body line-clamp-2">{heroArticle.description}</p>
                        </div>
                        <div className="absolute bottom-0 right-0 py-8 px-4 space-y-4">
                            {/* <a className="flex align-center" href={heroArticle.link} target="_blank" >
                                <span>Read More</span>
                                <span className="material-symbols-outlined text-on-surface-variant mt-1 ml-1.5" style={{ fontSize: '16px'}}>arrow_forward</span>
                            </a> */}
                            <a className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded text-[10px] font-headline font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all group shadow-[0_0_20px_rgba(0,255,163,0.2)] hover:shadow-[0_0_30px_rgba(0,255,163,0.4)]"
                                href={heroArticle.link} target="_blank"
                            >
                                Read Full Analysis
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4 h-full max-h-[500px] overflow-y-auto no-scrollbar pr-2 space-y-2">
                    {sidebarArticles.map((article, i) => (
                        <div key={article.link} onClick={() => setHeroArticle(article)} className="bg-surface-container-high/40 p-4 rounded-lg border-l-4 border-primary group cursor-pointer hover:bg-surface-container-high transition-colors">
                            <span className="text-[9px] font-label text-primary font-bold uppercase tracking-widest">
                                {String(i + 1).padStart(2, "0")}. {article.category}
                            </span>
                            <h3 className="font-headline font-bold text-base leading-snug group-hover:text-primary transition-colors">{article.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
