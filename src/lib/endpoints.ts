export const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export const ENDPOINTS = {
    // sparkline=true adds 7 days of hourly prices per coin (~4x bigger response). Only the Markets page needs it.
    coinsMarket: (perPage = 23, sparkline = false) =>
        `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=${sparkline}&price_change_percentage=1h%2C7d%2C30d&locale=en`,
    global: `${COINGECKO_BASE_URL}/global`,
    trending: `${COINGECKO_BASE_URL}/search/trending`,
    fearAndGreed: "https://api.alternative.me/fng/?limit=14",
    categories: `${COINGECKO_BASE_URL}/coins/categories`,
    // Every coin's id, symbol and name (~22,800 coins, ~1.5 MB). Used to reject unknown coin URLs.
    coinsList: `${COINGECKO_BASE_URL}/coins/list`,
    // id comes from the page URL, so encode it. The =false flags drop large unused parts of the response.
    // tickers=true adds up to 100 trading pairs (~60 KB) for the "Where to trade" list, in the same call.
    coinDetail: (id: string) =>
        `${COINGECKO_BASE_URL}/coins/${encodeURIComponent(id)}?localization=false&tickers=true&community_data=false&developer_data=false&sparkline=false`,
    // Spot exchanges ranked by CoinGecko trust score (1-10), with 24h volume in BTC
    exchanges: `${COINGECKO_BASE_URL}/exchanges?per_page=100&page=1`,
    // Every derivatives contract on every exchange (~28,000 rows, ~11 MB). Summarised before caching.
    derivatives: `${COINGECKO_BASE_URL}/derivatives`,
    derivativesExchanges: `${COINGECKO_BASE_URL}/derivatives/exchanges?order=open_interest_btc_desc&per_page=30`,
    // DefiLlama: free, no key
    defi: {
        chains: "https://api.llama.fi/v2/chains", // TVL per chain (~60 KB)
        tvlHistory: "https://api.llama.fi/v2/historicalChainTvl", // total DeFi TVL per day (~120 KB)
        protocols: "https://api.llama.fi/protocols", // every protocol (~9 MB), summarised before caching
        dexs: "https://api.llama.fi/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true", // ~2.4 MB
        stablecoins: "https://stablecoins.llama.fi/stablecoins?includePrices=true", // ~550 KB
    },
    // Price + volume history. Granularity is automatic: 5-min for 1 day, hourly up to 90 days, daily beyond.
    // The free Demo key only allows days <= 365.
    coinMarketChart: (id: string, days: number) =>
        `${COINGECKO_BASE_URL}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days}`,
    rss: {
        coindesk: "https://www.coindesk.com/arc/outboundfeeds/rss/",
        cointelegraph: "https://cointelegraph.com/rss",
        decrypt: "https://decrypt.co/feed",
    },
    // A channel's long-form uploads, newest first: no Shorts and no live streams.
    // "UULF" + the channel id without its "UC" prefix is YouTube's videos-only uploads playlist
    // (Shorts live in "UUSH..."). Costs 1 quota unit per call, vs 100 for the search endpoint.
    youtube: (channelId: string, maxResults = 3) =>
        `https://www.googleapis.com/youtube/v3/playlistItems?key=${process.env.YOUTUBE_API_KEY}&playlistId=UULF${channelId.slice(2)}&part=snippet&maxResults=${maxResults}`,
    // Name + logo of several channels in one call (1 quota unit).
    youtubeChannels: (channelIds: string[]) =>
        `https://www.googleapis.com/youtube/v3/channels?key=${process.env.YOUTUBE_API_KEY}&id=${channelIds.join(",")}&part=snippet`,

}

export const YOUTUBE_CHANNELS = {
    coinBureau: "UCqK_GSMbpiV8spgD3ZGloSw",
    dataDash: "UCCatR7nWbYrkVXdxXb4cGXw",
    cameronFous: "UCwGflGmzevf4fcm-z8E-twA",
    bankless: "UCAl9Ld79qaZxp9JzEOwd3aA"
}