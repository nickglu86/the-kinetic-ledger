import type { NextRequest } from "next/server";
import { getCoinChart } from "@/server/data/coin";
import { isChartDays } from "@/features/coin/chartRanges";

// GET /api/coins/bitcoin/chart?days=30
// The chart calls this when the user switches range. It goes through our server (not straight to
// CoinGecko from the browser) so the API key stays secret and responses are cached for everyone.
export async function GET(request: NextRequest, ctx: RouteContext<"/api/coins/[id]/chart">) {
  const { id } = await ctx.params;
  const days = Number(request.nextUrl.searchParams.get("days"));

  // Only allow the ranges the UI offers, so nobody can use this route to burn our quota on odd values.
  if (!isChartDays(days)) {
    return Response.json({ error: "Invalid days" }, { status: 400 });
  }

  try {
    const chart = await getCoinChart(id, days);
    if (!chart) return Response.json({ error: "Coin not found" }, { status: 404 });
    return Response.json(chart);
  } catch {
    // Rate limit or CoinGecko outage. Details are already logged by fetchData.
    return Response.json({ error: "Chart data unavailable" }, { status: 502 });
  }
}
