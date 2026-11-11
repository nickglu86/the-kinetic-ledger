// Values keyed by currency. Can be empty for coins without market data, hence optional.
type ByCurrency<T = number> = { usd?: T }

// Response of GET /coins/{id} — only the fields we use. Grows as the coin page gets more sections.
export interface CoinDetail {
    id: string
    symbol: string
    name: string
    market_cap_rank: number | null
    categories: (string | null)[]
    image: {
        thumb: string
        small: string
        large: string
    }
    // Plain text for most coins, but some descriptions contain HTML (<a> tags). Never render it as HTML.
    description: { en?: string }
    links: CoinLinks
    // Up to 100 trading pairs (tickers=true in the request). Used by "Where to trade".
    tickers?: CoinTicker[]
    market_data: {
        current_price: ByCurrency
        market_cap: ByCurrency
        total_volume: ByCurrency
        // Missing for some coins (e.g. no known total supply)
        fully_diluted_valuation: ByCurrency
        high_24h: ByCurrency
        low_24h: ByCurrency
        ath: ByCurrency
        ath_change_percentage: ByCurrency
        ath_date: ByCurrency<string> // ISO date string

        circulating_supply: number | null
        total_supply: number | null
        max_supply: number | null // null = no cap (e.g. ETH)

        // Note the different shapes: 1h is keyed by currency, the rest are plain numbers.
        price_change_percentage_1h_in_currency: ByCurrency
        price_change_percentage_24h: number | null
        price_change_percentage_7d: number | null
        price_change_percentage_14d: number | null
        price_change_percentage_30d: number | null
        price_change_percentage_1y: number | null
    }
}

// Arrays often contain empty strings, and any of these can be missing.
export interface CoinLinks {
    homepage?: string[]
    whitepaper?: string | null
    blockchain_site?: string[]
    official_forum_url?: string[]
    twitter_screen_name?: string | null
    facebook_username?: string | null
    subreddit_url?: string | null
    repos_url?: { github?: string[] }
}

// One point on the chart. `time` is in seconds (what lightweight-charts expects), not milliseconds.
export interface ChartPoint {
    time: number
    value: number
}

export interface CoinChartData {
    prices: ChartPoint[]
    volumes: ChartPoint[]
}

// One trading pair from /coins/{id}?tickers=true (only the fields we use)
export interface CoinTicker {
    base: string
    target: string
    market: { name: string; identifier: string }
    converted_last: ByCurrency
    converted_volume: ByCurrency
    bid_ask_spread_percentage: number | null
    is_anomaly: boolean
    is_stale: boolean
    trade_url: string | null
}
