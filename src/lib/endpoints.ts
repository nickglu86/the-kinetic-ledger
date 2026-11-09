export const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export const ENDPOINTS = {
    coinsMarket: (perPage = 23) =>
        `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=1h%2C7d%2C30d&locale=en`,
    global: `${COINGECKO_BASE_URL}/global`,
    trending: `${COINGECKO_BASE_URL}/search/trending`,
    fearAndGreed: "https://api.alternative.me/fng/?limit=14",
    categories: `${COINGECKO_BASE_URL}/coins/categories`,
    // id comes from the page URL, so encode it. The =false flags drop large unused parts of the response.
    coinDetail: (id: string) =>
        `${COINGECKO_BASE_URL}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`,
    rss: {
        coindesk: "https://www.coindesk.com/arc/outboundfeeds/rss/",
        cointelegraph: "https://cointelegraph.com/rss",
        decrypt: "https://decrypt.co/feed",
    },
    youtube: (channelId: string, maxResults = 3) =>
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&maxResults=${maxResults}&order=date&type=video`,

}

export const YOUTUBE_CHANNELS = {
    coinBureau: "UCqK_GSMbpiV8spgD3ZGloSw",
    dataDash: "UCCatR7nWbYrkVXdxXb4cGXw",
    cameronFous: "UCwGflGmzevf4fcm-z8E-twA",
    bankless: "UCAl9Ld79qaZxp9JzEOwd3aA"
}