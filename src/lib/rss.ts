import { NewsArticle } from "@/types/api";
import { XMLParser } from "fast-xml-parser";

export const fetchRSS = async (url: string): Promise<NewsArticle[]> => {
    const response = await fetch(url, { next: { revalidate: 300 } });
    const xml = await response.text();

    const parser = new XMLParser({ ignoreAttributes: false });
    const result = parser.parse(xml);
    const items = result.rss.channel.item ?? [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((item: any) => {
        const rawCat = item.category;
        let category = "General";
        if (typeof rawCat === "string") {
            category = rawCat;
        } else if (Array.isArray(rawCat)) {
            const first = rawCat[0];
            category = typeof first === "string" ? first : first?.["#text"] ?? "General";
        } else if (rawCat?.["#text"]) {
            category = rawCat["#text"];
        }
        return {
            title: String(item.title ?? "").trim(),
            link: String(item.link ?? "").trim(),
            pubDate: item.pubDate as string,
            description: String(item.description ?? "").replace(/<[^>]*>/g, "").trim().slice(0, 200),
            image:
                item["media:content"]?.["@_url"] ??
                item["enclosure"]?.["@_url"] ??
                item["media:thumbnail"]?.["@_url"] ??
                undefined,
            category
        };
    });
}

export const safeFetchRSS = async (url: string): Promise<NewsArticle[] | null> => {
    try {
        return await fetchRSS(url)
    } catch {
        return null  // failed feed returns null
    }
}