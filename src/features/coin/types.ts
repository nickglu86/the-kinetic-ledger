// Values keyed by currency. Can be empty for coins without market data, hence optional.
type ByCurrency<T = number> = { usd?: T }

// Response of GET /coins/{id} — only the fields we use. Grows as the coin page gets more sections.
export interface CoinDetail {
    id: string
    symbol: string
    name: string
    market_cap_rank: number | null
    image: {
        thumb: string
        small: string
        large: string
    }
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
        price_change_percentage_30d: number | null
        price_change_percentage_1y: number | null
    }
}
