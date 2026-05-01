import { ENDPOINTS, YOUTUBE_CHANNELS } from "@/lib/endpoints"
import { safeFetch } from "@/lib/fetcher"
import { YouTubeResponse, YouTubeVideo } from "@/types/api"
import { KineticBroadcastClient } from "./KineticBroadcastClient"

export const KineticBroadcast = async () => {
    const channelIds = Object.values(YOUTUBE_CHANNELS)

    const responses = await Promise.all(
        channelIds.map((id) => safeFetch<YouTubeResponse>(ENDPOINTS.youtube(id)))
    )

    const videos: YouTubeVideo[] = responses.flatMap((res) => res?.items ?? [])

    return <KineticBroadcastClient videos={videos} />
}
