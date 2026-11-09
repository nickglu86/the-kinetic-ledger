// Shared by the server (page + API route) and the client chart, so no "use client" / server-only code here.

export const CHART_RANGES = [
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 }, // Demo API limit: nothing older than 365 days
] as const;

export type ChartDays = (typeof CHART_RANGES)[number]["days"];

// Rendered on the server so the chart has data on first paint; other ranges load on click.
export const DEFAULT_CHART_DAYS: ChartDays = 7;

export const isChartDays = (value: number): value is ChartDays =>
  CHART_RANGES.some((range) => range.days === value);
