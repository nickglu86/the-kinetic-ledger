import { YouTubeVideo } from "@/types/api"
import { getVideos } from "@/server/data/videos"
import { KineticBroadcastClient } from "./KineticBroadcastClient"

const VIDEOS_PER_CHANNEL = 3

export const KineticBroadcast = async () => {
    const { videos } = await getVideos(VIDEOS_PER_CHANNEL)

    // The home client component uses the YouTubeVideo shape; convert the shared VideoItem to it.
    const items: YouTubeVideo[] = videos.map((video) => ({
        id: { videoId: video.id },
        snippet: {
            title: video.title,
            description: video.description,
            thumbnails: { high: { url: video.thumbnail } },
            channelTitle: video.channelTitle,
            channelAvatar: video.channelAvatar,
            publishedAt: video.publishedAt,
        },
    }))

    return <KineticBroadcastClient videos={items} />
}
