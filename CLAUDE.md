# The Kinetic Ledger

Crypto dashboard website — real-time market data, news, and portfolio tracking.

## Role of Claude

The user is coding this project themselves for practice. Claude should **only plan, guide, review, and answer questions** — not write implementation code unless explicitly asked for help with a specific piece.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 (custom dark theme via `@theme inline` in globals.css)
- **Fonts:** Space Grotesk (headlines), Manrope (body), Inter (labels) — loaded via `next/font/google`
- **Icons:** Material Symbols (Google)
- **Data fetching:** Server Components for pre-rendered data, SWR for client-side interactive data
- **RSS parsing:** fast-xml-parser
- **Auth (Phase 8):** NextAuth.js / Auth.js v5
- **Client state (Phase 9+):** Zustand + persist middleware
- **Utility:** `cn()` helper via tailwind-merge + clsx (`src/lib/utils.ts`)

## Color Palette

All custom colors are defined in `src/app/globals.css` under `@theme inline`:
- primary: `#00FFA3`, secondary: `#00e3fd`, tertiary: `#ac89ff`, error: `#ff716c`
- surface: `#0b0e11`, on-surface: `#f8f9fe`
- surface-container-low/med/high/highest: `#101417` / `#161a1e` / `#1c2024` / `#22262b`
- outline-variant: `#45484c`, on-surface-variant: `#a9abaf`

Use Tailwind classes like `bg-surface-container`, `text-on-surface-variant`, `text-primary`, etc.

## Project Structure

```
src/
├── app/              # Pages and API routes
│   ├── layout.tsx    # Root layout (fonts, Header)
│   ├── page.tsx      # Home page
│   └── api/          # API routes (news, prices, etc.)
├── features/         # Feature-based modules (each has components/, hooks/, types.ts)
│   ├── market/       # MarketTable, GlobalMetrics, CoinRow
│   ├── news/         # NewsFeed, NewsHero, SourceSwitcher
│   ├── trending/     # TrendingCoins, TrendingSectors
│   ├── nfts/         # TopNFTs
│   ├── videos/       # VideoGrid, VideoCard
│   ├── auth/         # Phase 8
│   ├── watchlist/    # Phase 9+
│   └── portfolio/    # Phase 9+
├── components/       # Shared/layout components only
│   ├── layout/       # Header, Footer, MobileNav, LiveTicker
│   └── ui/           # Badge, Card, Loader (reusable primitives)
├── lib/              # Utilities, constants, fetcher, db client
│   ├── fetcher.ts    # Generic fetchData<T>() with revalidation
│   ├── rss.ts        # RSS feed parser (fast-xml-parser)
│   ├── endpoints.ts  # All API URLs (CoinGecko, Alternative.me, RSS feeds)
│   ├── constants.ts  # NAV_ITEMS, etc.
│   └── utils.ts      # cn() helper
└── types/
    └── api.ts        # CoinMarket, GlobalData, NewsArticle, FearAndGreed, Trending types
```

## Data Sources (all free, no keys unless noted)

| Data | Source | Endpoint |
|------|--------|----------|
| Coins, trending, global, categories, NFTs | CoinGecko | `api.coingecko.com/api/v3/...` |
| Fear & Greed Index | Alternative.me | `/fng/?limit=14` |
| News | RSS — CoinDesk, CoinTelegraph, Decrypt | Parsed server-side via fast-xml-parser |
| BTC Halving | Client-side calculation | From block height |
| YouTube videos | YouTube Data API | Needs API key (free quota) |

## Data Fetching Strategy

- **Server Components** (pre-rendered): LiveTicker, Global Metrics, Market Table Top 10, Fear & Greed, Trending Sectors
- **Server fetch → Client render** (server fetches, client handles interactivity): NewsHero (3 RSS feeds fetched in parallel, source switcher via useState)
- **API Routes + SWR** (client-side): Trending Coins, Top NFTs, YouTube Videos

## Build Phases

| Phase | What | Status |
|-------|------|--------|
| 1 | Scaffold — Next.js, Tailwind config, fonts, cn() helper | Done |
| 2 | Layout shell — Header, Footer, MobileNav, LiveTicker | Done |
| 3 | Global Metrics — 4 cards, CoinGecko + Alternative.me | Static UI done, wiring up next |
| 4 | News — RSS parsing, source switcher, hero layout | In progress — RSS parser done, NewsHero server/client split next |
| 5 | Market Table — Top 10, then full 100 | Static UI done |
| 6 | Sidebars — Trending Sectors, Trending Coins, Top NFTs | Static UI done |
| 7 | Videos — YouTube API | Static UI done |
| 8 | Auth — NextAuth, login/register, protected routes | Not started |
| 9 | Watchlist + Portfolio — Zustand stores + persist | Not started |
| 10 | User sync — save/load user data from DB | Not started |
| 11 | Polish — animations, skeletons, mobile responsive | Not started |

## Design References

- Google Stitch design: https://stitch.withgoogle.com/projects/2602449381917841271
- Desktop mockup: `../TheKinteticLedget.html`
- Mobile mockup: `../TheKineticLedgerMobile.html`
- Full planning doc: `../TheKineticLedger-Planning.md`
- Previous project for reference: `../CoinIndex/`

## Tailwind Class Strategy

| Situation | Approach |
|-----------|----------|
| Repeated UI pattern (coin card, news item) | Extract to React component |
| Conditional styles (green/red, active/inactive) | `cn()` helper |
| Global design tokens (glass-card, label-micro) | `@apply` in globals.css |
| One-off styling | Leave inline |

## Commands

```bash
npm run dev     # Start dev server (http://localhost:3000)
npm run build   # Production build
npm run lint    # ESLint
```
