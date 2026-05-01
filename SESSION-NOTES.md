# Session Notes — The Kinetic Ledger

## What was accomplished this session

### Infrastructure & Utilities Created

1. **`src/lib/fetcher.ts`** — Generic data fetcher with Next.js revalidation
   - `fetchData<T>(url, revalidate?)` — typed JSON fetch with cache, defaults to 60s
   - `safeFetch<T>(url, revalidate?)` — same but returns `null` on failure instead of throwing

2. **`src/lib/endpoints.ts`** — All API URLs centralized
   - `ENDPOINTS.coinsMarket(perPage)` — function, defaults to 23, pass 100 for full market page
   - `ENDPOINTS.global` — CoinGecko global data
   - `ENDPOINTS.trending` — CoinGecko trending (coins, categories, NFTs)
   - `ENDPOINTS.fearAndGreed` — Alternative.me Fear & Greed Index
   - `ENDPOINTS.rss.coindesk/cointelegraph/decrypt` — RSS feed URLs
   - `ENDPOINTS.youtube(channelId, maxResults)` — YouTube Data API search
   - `YOUTUBE_CHANNELS` — map of channel names to IDs (add more here, code auto-adapts)

3. **`src/lib/rss.ts`** — RSS feed parser using fast-xml-parser
   - `fetchRSS(url)` — fetches XML, parses to `NewsArticle[]`
   - `safeFetchRSS(url)` — same but returns `null` on failure
   - Handles different RSS formats (CoinDesk, CoinTelegraph, Decrypt)
   - Extracts: title, link, pubDate, description (HTML stripped), image (tries media:content → enclosure → media:thumbnail), category

4. **`src/types/api.ts`** — All TypeScript interfaces
   - `CoinMarket` — coin data from /coins/markets
   - `GlobalResponse` / `GlobalData` — global market data
   - `FearAndGreedResponse` / `FearAndGreedEntry` — sentiment data
   - `TrendingResponse` / `TrendingCoinWrapper` / `TrendingCoin` / `TrendingCategory` / `TrendingNFTs` — trending data
   - `NewsArticle` — parsed RSS article (with category field)
   - `YouTubeVideo` / `YouTubeResponse` — YouTube API response

### Components with Real Data

1. **`src/components/layout/LiveTicker.tsx`** — Server Component
   - Fetches top coins from CoinGecko
   - Filters out stablecoins (USDT, USDC)
   - Marquee animation (duplicated list for infinite scroll)
   - Green/red color based on price change
   - Coin images from API

2. **`src/features/news/NewsHero.tsx`** — Server Component (fetcher)
   - Fetches all 3 RSS feeds in parallel with `Promise.all`
   - Uses `safeFetchRSS` — only includes sources that succeeded
   - Passes `sources: Record<string, NewsArticle[]>` to client component

3. **`src/features/news/NewsHeroClient.tsx`** — Client Component (interactive)
   - `"use client"` with `useState` for active source
   - Source switcher buttons — dynamically rendered from available sources
   - Hero (left): first article with image, title, description, category
   - Sidebar (right): articles.slice(1,7) with numbered list and categories
   - Only shows sources that loaded successfully

4. **`src/features/videos/KineticBroadcast.tsx`** — Server Component (fetcher)
   - Fetches all YouTube channels in parallel (generic — reads from YOUTUBE_CHANNELS)
   - Uses `Object.values(YOUTUBE_CHANNELS).map()` — auto-adapts when you add channels
   - Flattens all videos with `.flatMap()`
   - Passes videos array to client component

5. **`src/features/videos/KineticBroadcastClient.tsx`** — Client Component (interactive)
   - `"use client"` with `useState` for active video ID
   - Featured video: thumbnail + play button, click → swaps to YouTube embed iframe with autoplay
   - "Up Next" sidebar: sorted by publishedAt, clicking swaps the featured video
   - Sidebar height matches featured video, scrollable with no-scrollbar

### CSS Added to globals.css

- `@keyframes marquee` + `.animate-marquee` — for LiveTicker scrolling
- `.no-scrollbar` — hides scrollbar (used in NewsHero sidebar, videos sidebar)

### Key Architecture Decisions

1. **Server fetch → Client render pattern**: Used for NewsHero and KineticBroadcast. Server component fetches data (no loading states), client component handles interactivity (useState, onClick). Data is pre-rendered, switching is instant.

2. **Next.js fetch deduplication**: If multiple server components fetch the same URL in the same render, Next.js makes only 1 network request. So TrendingCoins, TrendingSectors, and TrendingNFTs can each independently call `fetchData(ENDPOINTS.trending)` — still 1 request.

3. **Revalidation caching**: `fetchData` defaults to 60s revalidate. RSS uses 300s. Same URL across different pages hits the same cache.

4. **Self-contained components**: Each component fetches its own data. No global data store. Components are reusable across pages.

5. **Error resilience**: `safeFetch` / `safeFetchRSS` return null on failure. Components only render data that loaded successfully.

### Environment Variables

- `YOUTUBE_API_KEY` — in `.env.local` (gitignored). Server-side only, no `NEXT_PUBLIC_` prefix.
- Get/manage at: https://console.cloud.google.com/apis/credentials

### Remaining Homepage Tasks

1. ~~Kinetic Broadcast — YouTube videos fetch~~ **DONE**
2. Global Metrics — improve Fear & Greed graph (wire up real data)
3. The Terminal — add news source icons and "read more" links (open in new tab)
4. Trending Sectors — add category icons
5. Market Rankings — organize table / fix small issues (wire up real data)
6. Trending 15 — organize list / fix small issues (wire up real data)

### AWS Deployment — Learning Path

Three deployment options were discussed, from simple to production-like:

**Option 1: AWS Amplify (Easiest)**
- Connects to GitHub, auto-builds on push
- Handles SSR, server components, everything
- Free tier available, then $20+/month
- Closest to Vercel experience on AWS

**Option 2: EC2 + PM2 (Most infrastructure learning)**
- EC2 = virtual Linux server rented from AWS (t2.micro = free 12 months)
- PM2 = Node.js process manager that keeps your app alive, auto-restarts on crash
- Nginx = reverse proxy (receives traffic on port 80/443, forwards to port 3000, handles SSL)
- Full stack: User → Domain → Nginx (port 80/443) → PM2 → Next.js (port 3000)
- You manage everything: OS updates, security, restarts, SSL
- ~$8-9/month after free tier

**Option 3: Docker + ECS/Fargate (Production-like)**
- Docker = packages app + Node.js + dependencies into a container image
- ECR = AWS container registry (like GitHub but for Docker images)
- ECS = AWS service that runs containers
- Fargate = serverless mode of ECS (no server management, AWS handles the infra)
- Flow: Code → Dockerfile → Docker Image → Push to ECR → ECS Fargate runs it
- ~$15-20/month, standard at mid-to-large companies

**Chosen learning path (staged approach):**
1. **Stage 1: Docker locally** ← CURRENT (guide in DOCKER-GUIDE.md)
   - Install Docker Desktop, write Dockerfile, build & run locally
   - No AWS cost, fast feedback, essential skill
2. **Stage 2: EC2** — spin up t2.micro, SSH in, install Docker, run container, set up Nginx + SSL
   - Learn Linux, SSH, networking, DNS
3. **Stage 3: ECR + ECS Fargate** — push image to ECR, create ECS cluster, load balancer + HTTPS
   - Understand what Fargate abstracts away (because you did it manually in Stage 2)
4. **Stage 4: CI/CD** — GitHub Actions: on push → build image → push to ECR → deploy to ECS
   - Automate what you already understand manually

### Docker Setup (Stage 1)

Guide created in `DOCKER-GUIDE.md`. Key points:
- Multi-stage Dockerfile (deps → build → production) for small image size (~150MB)
- Requires `output: "standalone"` in next.config.ts
- `.dockerignore` to exclude node_modules, .next, .git, etc.
- Build: `docker build --build-arg YOUTUBE_API_KEY=key -t kinetic-ledger .`
- Run: `docker run -p 3000:3000 --env-file .env.local kinetic-ledger`
- Guides for Stages 2-4 will be created later.
