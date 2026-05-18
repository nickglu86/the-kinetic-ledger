export interface ICoin {
    id: string
    symbol: string
    name: string
    image: string
    current_price: number
    market_cap: number
    market_cap_rank: number
    price_change_percentage_1h_in_currency: number
    price_change_percentage_24h: number
    price_change_percentage_7d_in_currency: number
    total_volume: number
}

export interface GlobalResponse {
    data: GlobalData
}

export interface GlobalData {
    total_market_cap: { usd: number }
    market_cap_percentage: { btc: number, eth: number }
    market_cap_change_percentage_24h_usd: number
}

export interface FearAndGreedResponse {
    data: FearAndGreedEntry[]
}

export interface FearAndGreedEntry {
    value: string
    value_classification: string
    timestamp: string
}

export interface TrendingResponse {
    coins: TrendingCoinWrapper[]
    categories: TrendingCategory[]
    nfts: TrendingNFTs[]

}

export interface TrendingNFTs {
    id: string
    name: string
    symbol: string
    thumb: string
    native_currency_symbol: string
    floor_price_in_native_currency: string
    data: {
        floor_price: string
        h24_volume: string
    }
}

export interface TrendingCoinWrapper {
    item: TrendingCoin
}

export interface TrendingCoin {
    id: string
    name: string
    symbol: string
    thumb: string
    market_cap_rank: number
    data: {
        price: number
        price_change_percentage_24h: {
            usd: number
        }
    }
}

export interface TrendingCategory {
    id: number
    name: string
    market_cap_1h_change: number
    slug: string
    data: {
        market_cap_change_percentage_24h: {
            usd: number
        }
    }
}

// export interface CategoriesResponse {
//     data: Category[]
// }

export interface Category {
    id: number
    name: string
    market_cap: number
    market_cap_1h_change: number
    top_3_coins_id: string[]
    top_3_coins: string[]
}

export interface NewsArticle {
    title: string
    link: string
    pubDate: string
    description: string
    image?: string
    category: string
}

export interface YouTubeVideo {
    id: { videoId: string }
    snippet: {
        title: string
        description: string
        thumbnails: { high: { url: string } }
        channelTitle: string
        publishedAt: string
    }
}

export interface YouTubeResponse {
    items: YouTubeVideo[]
}