import { COINGECKO_BASE_URL } from "./endpoints";

// Adds the CoinGecko Demo key as a header (keeps it out of the URL and logs).
// Only for CoinGecko URLs, and only when the key is set, so builds without it fall back to keyless.
const getHeaders = (url: string): HeadersInit | undefined => {
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey && url.startsWith(COINGECKO_BASE_URL)) {
    return { "x-cg-demo-api-key": apiKey };
  }
  return undefined;
};

// Masks secrets passed as query params (e.g. YouTube's ?key=) so URLs are safe to log.
const SECRET_PARAMS = ["key", "x_cg_demo_api_key"];

const redactUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    for (const param of SECRET_PARAMS) {
      if (parsed.searchParams.has(param)) parsed.searchParams.set(param, "***");
    }
    return parsed.toString();
  } catch {
    return "<invalid url>";
  }
};

// Error that remembers the HTTP status, so callers can tell "doesn't exist" (404)
// apart from real failures like rate limits (429) or outages (5xx).
export class FetchError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "FetchError";
    this.status = status;
  }
}

export const fetchData = async <T>(
  url: string,
  revalidate?: number,
): Promise<T> => {
  const start = Date.now();
  const response = await fetch(url, {
    headers: getHeaders(url),
    next: { revalidate: revalidate ?? 60 },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "<no body>");
    const retryAfter = response.headers.get("retry-after");
    const safeUrl = redactUrl(url);
    console.error("[fetchData] FAIL", {
      url: safeUrl,
      status: response.status,
      statusText: response.statusText,
      retryAfter,
      body: body.slice(0, 500),
      elapsedMs: Date.now() - start,
    });
    throw new FetchError(`Fetch failed ${response.status}: ${safeUrl}`, response.status);
  }

  return response.json();
};

export const safeFetch = async <T>(
  url: string,
  revalidate?: number,
): Promise<T | null> => {
  try {
    return await fetchData(url, revalidate);
  } catch {
    return null;
  }
};
//   1. Call fetch(url, { next: { revalidate: revalidate ?? 60 } })
//   2. Check res.ok — if not, throw an error (include the URL and status in the message)
//   3. Return res.json() cast as T
