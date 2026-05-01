"use client"

import { useState } from "react"
import { YouTubeVideo } from "@/types/api"
import { cn } from "@/lib/utils"

interface KineticBroadcastClientProps {
    videos: YouTubeVideo[]
}

export const KineticBroadcastClient = ({ videos }: KineticBroadcastClientProps) => {
    const hero = videos[0]
    const upNext = videos.slice(1,-1).sort((a,b) => new Date(b.snippet.publishedAt).getTime()  - new Date(a.snippet.publishedAt).getTime() );
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

    if (!hero) return null

    return (
        <section className="mb-4">
            <h2 className="font-headline text-3xl font-bold mb-8">Kinetic Broadcast</h2>
            <div className="grid grid-cols-12 gap-8">
                {/* Featured Video */}
                <div className="col-span-12 lg:col-span-9 lg:row-span-1 aspect-video rounded-2xl overflow-hidden relative group">
                    {activeVideoId ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div
                            className="w-full h-full cursor-pointer"
                            onClick={() => setActiveVideoId(hero.id.videoId)}
                        >
                            <img
                                className="w-full h-full object-cover"
                                alt={hero.snippet.title}
                                src={hero.snippet.thumbnails.high.url}
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <button className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/50 group-hover:scale-110 transition-transform">
                                    <span
                                        className="material-symbols-outlined text-primary text-5xl"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        play_arrow
                                    </span>
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                                    {hero.snippet.channelTitle}
                                </p>
                                <h3 className="text-3xl font-bold text-on-surface line-clamp-2">
                                    {hero.snippet.title}
                                </h3>
                            </div>
                        </div>
                    )}
                </div>

                {/* Up Next Sidebar */}
                <div className="col-span-12 lg:col-span-3 lg:row-span-1 flex flex-col gap-4 lg:h-0 lg:min-h-full overflow-y-auto no-scrollbar">
                    <h4 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest px-2">
                        Up Next
                    </h4>
                    <div className="flex flex-col gap-4">
                        {upNext.map((video) => (
                            <div
                                key={video.id.videoId}
                                onClick={() => setActiveVideoId(video.id.videoId)}
                                className={cn(
                                    "bg-surface-container rounded-lg p-3 flex gap-3 cursor-pointer hover:bg-surface-bright transition-all",
                                    activeVideoId === video.id.videoId && "ring-1 ring-primary bg-surface-container-high"
                                )}
                            >
                                <div className="w-20 h-14 bg-black rounded-sm flex-shrink-0 overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover opacity-60"
                                        alt={video.snippet.title}
                                        src={video.snippet.thumbnails.high.url}
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h5 className="text-xs font-bold line-clamp-2">
                                        {video.snippet.title}
                                    </h5>
                                    <span className="text-[10px] text-on-surface-variant">
                                        {video.snippet.channelTitle}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
