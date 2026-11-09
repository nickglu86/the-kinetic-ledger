// URLs from third-party data (CoinGecko links, RSS feeds) go into href/src attributes.
// Only allow real http(s) URLs, so a "javascript:..." value can never end up in an href.
export const safeUrl = (value: string | null | undefined): string | null => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
};
