import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Unavailable } from "@/components/ui/Unavailable";
import { VideoLibrary } from "@/features/videos/VideoLibrary";
import { getVideos } from "@/server/data/videos";

// 12 per channel = up to 48 videos. Costs 1 YouTube quota unit per channel per hourly refresh.
const VIDEOS_PER_CHANNEL = 12;

export const metadata: Metadata = {
  title: "Videos",
  description: "The latest crypto videos from Coin Bureau, DataDash, Bankless and more, in one place.",
};

export default async function VideosPage() {
  const { videos, channels } = await getVideos(VIDEOS_PER_CHANNEL);

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-8">
      <PageHeader
        eyebrow="Kinetic Broadcast"
        title="Videos"
        description={`The latest long-form videos from ${channels.length > 0 ? channels.map((c) => c.title).join(", ") : "our favourite crypto channels"}. Shorts are left out.`}
      />
      {videos.length > 0 ? (
        <VideoLibrary videos={videos} channels={channels} />
      ) : (
        <Unavailable label="Videos" className="py-10 items-center" />
      )}
    </main>
  );
}
