import { ENDPOINTS, YOUTUBE_CHANNELS } from "@/lib/endpoints";
import { safeFetch } from "@/lib/fetcher";
import { safeUrl } from "@/lib/safeUrl";
import type { YouTubeChannelsResponse, YouTubePlaylistItem, YouTubePlaylistResponse } from "@/types/api";
import type { VideoChannel, VideoItem, VideosData } from "@/features/videos/types";

// New uploads come a few times a day, so refresh hourly. (The old 60s burned through the YouTube quota.)
const VIDEOS_REVALIDATE_SECONDS = 3600;
// Channel logos almost never change.
const CHANNELS_REVALIDATE_SECONDS = 86400;

// YouTube video ids are always 11 characters of [A-Za-z0-9_-]. Checked because the id
// ends up in an <iframe src>, and it comes from a third-party API.
const VIDEO_ID = /^[\w-]{11}$/;

// Formatted on the server: formatting in the browser could differ (time zone) and break hydration.
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

const toVideoItem = ({ snippet }: YouTubePlaylistItem, avatars: Map<string, string>): VideoItem | null => {
  const id = snippet.resourceId.videoId;
  const thumbnail = safeUrl(snippet.thumbnails.high?.url);
  // No thumbnail = private or deleted video that is still listed in the playlist
  if (!VIDEO_ID.test(id) || !thumbnail) return null;

  const published = Date.parse(snippet.publishedAt);
  return {
    id,
    title: snippet.title,
    description: snippet.description.slice(0, 300),
    thumbnail,
    channelId: snippet.channelId,
    channelTitle: snippet.channelTitle,
    channelAvatar: avatars.get(snippet.channelId),
    publishedAt: snippet.publishedAt,
    publishedLabel: Number.isNaN(published) ? "" : dateFormat.format(published),
  };
};

/**
 * Latest long-form videos (no Shorts, see ENDPOINTS.youtube) from every channel in YOUTUBE_CHANNELS,
 * plus each channel's name and logo. A channel that fails is skipped; the others still show.
 */
export const getVideos = async (perChannel: number): Promise<VideosData> => {
  const channelIds = Object.values(YOUTUBE_CHANNELS);

  const [channelsRes, ...playlists] = await Promise.all([
    safeFetch<YouTubeChannelsResponse>(ENDPOINTS.youtubeChannels(channelIds), CHANNELS_REVALIDATE_SECONDS),
    ...channelIds.map((id) =>
      safeFetch<YouTubePlaylistResponse>(ENDPOINTS.youtube(id, perChannel), VIDEOS_REVALIDATE_SECONDS),
    ),
  ]);

  // channelId -> logo URL (third-party URL, so only http/https)
  const avatars = new Map<string, string>();
  for (const channel of channelsRes?.items ?? []) {
    const url = safeUrl(channel.snippet.thumbnails.default?.url);
    if (url) avatars.set(channel.id, url);
  }

  const videos = playlists
    .flatMap((res) => res?.items ?? [])
    .map((item) => toVideoItem(item, avatars))
    .filter((video): video is VideoItem => video !== null)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  // Channels that actually returned videos, in YOUTUBE_CHANNELS order
  const channels: VideoChannel[] = [];
  for (const id of channelIds) {
    const first = videos.find((v) => v.channelId === id);
    if (first) channels.push({ id, title: first.channelTitle, avatar: avatars.get(id) });
  }

  return { videos, channels };
};
