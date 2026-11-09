import { formatMarketCap, formatPrice } from "@/lib/formats";

// Coin page formatters. CoinGecko leaves many fields empty for small coins,
// so every formatter accepts null/undefined and falls back to a dash.
export const DASH = "—";

export const isNum = (value: number | null | undefined): value is number => typeof value === "number";

/** Big dollar amounts: $1.51T, $32.5B */
export const usd = (value: number | null | undefined) => (isNum(value) ? `$${formatMarketCap(value)}` : DASH);

/** Prices: $75,119.00, $0.000004840 */
export const usdPrice = (value: number | null | undefined) =>
  isNum(value) && value > 0 ? `$${formatPrice(value)}` : DASH;

/** Coin amounts, no dollar sign: 19.8M BTC */
export const supply = (value: number | null | undefined, symbol: string) =>
  isNum(value) ? `${formatMarketCap(value)} ${symbol}` : DASH;

export const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

/** Fixed locale and time zone so the server renders the same date wherever it runs. */
export const formatDate = (iso: string | undefined | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" });
};
