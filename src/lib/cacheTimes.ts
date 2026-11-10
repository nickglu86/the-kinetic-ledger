// How long (in seconds) each kind of data stays cached before the next visitor triggers a refresh.
// One place to tune the trade-off between fresh data and API usage.
//
// CoinGecko's free Demo plan allows 10,000 calls a month (failed calls count too).
// A cached request refreshes at most once per period, and only when someone visits after it expired,
// so the worst case (a visitor every few minutes, 24/7) per request is 2,592,000 s/month ÷ period:
//
//   market list   120 s  → 21,600   (one shared call: ticker, home table, metrics, Markets page)
//   global        600 s  →  4,320
//   trending     1800 s  →  1,440
//   categories   3600 s  →    720
//                          ───────
//                          ~28,000 calls/month at most, plus coin pages (each coin only when visited).
//
// Real traffic is far lower than "every few minutes, all day", but if the dashboard on
// coingecko.com/en/developers/dashboard gets close to the limit, raise marketList first.
export const REVALIDATE = {
  // CoinGecko
  marketList: 120,
  global: 600,
  trending: 1800,
  categories: 3600,
  coinDetail: 300,

  // Other sources (not CoinGecko, no shared monthly limit)
  fearAndGreed: 3600, // updated once a day
} as const;
