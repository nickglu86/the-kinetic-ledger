import type { NextRequest } from "next/server";
import { searchCoins } from "@/server/data/coinList";

const MAX_QUERY_LENGTH = 50;

// GET /api/search?q=eth
// Backs the header search. Answers from the cached coin list and market list,
// so a search never makes a CoinGecko call, however fast someone types.
export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (!query || query.length > MAX_QUERY_LENGTH) return Response.json({ results: [] });

  const results = await searchCoins(query);
  return Response.json(
    { results },
    // Same query within 5 min (e.g. two visitors typing "btc"): served from the CDN.
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
