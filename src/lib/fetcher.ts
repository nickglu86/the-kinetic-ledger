export const fetchData = async <T>(
  url: string,
  revalidate?: number,
): Promise<T> => {
  const start = Date.now();
  const response = await fetch(url, { next: { revalidate: revalidate ?? 60 } });

  if (!response.ok) {
    const body = await response.text().catch(() => "<no body>");
    const retryAfter = response.headers.get("retry-after");
    console.error("[fetchData] FAIL", {
      url,
      status: response.status,
      statusText: response.statusText,
      retryAfter,
      body: body.slice(0, 500),
      elapsedMs: Date.now() - start,
    });
    throw new Error(`Fetch failed ${response.status}: ${url}`);
  }

  console.log("[fetchData] OK", { url, ms: Date.now() - start });
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
