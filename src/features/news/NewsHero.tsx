import { fetchRSS, safeFetchRSS } from "@/lib/rss";
import { ENDPOINTS } from "@/lib/endpoints";
import { NewsHeroClient } from "./NewsHeroClient";
import { NewsArticle } from "@/types/api";

export const NewsHero = async () => {
    // Fetch News RSS resources
    const [coindesk, cointelegraph, decrypt] = await Promise.all([
      safeFetchRSS(ENDPOINTS.rss.coindesk),
      safeFetchRSS(ENDPOINTS.rss.cointelegraph),
      safeFetchRSS(ENDPOINTS.rss.decrypt),
    ])

    // Build sources object — only include feeds that succeeded
    const sources: Record<string, NewsArticle[]> = {}
    if (coindesk) sources["CoinDesk"] = coindesk
    if (cointelegraph) sources["CoinTelegraph"] = cointelegraph
    if (decrypt) sources["Decrypt"] = decrypt

    return <NewsHeroClient sources={sources} />
}