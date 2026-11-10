// Small helpers shared by the news components (NewsFeed, NewsWire, coin page news).

export const sourceLogo = (source: string) => `/assets/news-sources/${source.toLowerCase()}.png`;

// External article links: noopener so the news site can't reach back into our tab.
export const externalLinkProps = { target: "_blank", rel: "noopener noreferrer" } as const;
