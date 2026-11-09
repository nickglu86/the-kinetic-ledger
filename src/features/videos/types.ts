/** One YouTube video, flattened from the playlistItems response. */
export interface VideoItem {
  id: string;
  title: string;
  /** First ~300 characters of the YouTube description. */
  description: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  channelAvatar?: string;
  publishedAt: string;
  /** Pre-formatted on the server, e.g. "Nov 9, 2026". */
  publishedLabel: string;
}

export interface VideoChannel {
  id: string;
  title: string;
  avatar?: string;
}

export interface VideosData {
  /** Newest first. */
  videos: VideoItem[];
  channels: VideoChannel[];
}
