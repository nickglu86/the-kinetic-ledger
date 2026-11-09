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
        // Keyed by currency; can be empty for coins without market data, hence optional.
        current_price: { usd?: number }
        price_change_percentage_24h: number | null
    }
}
