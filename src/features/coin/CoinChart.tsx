"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {
  AreaSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  type UTCTimestamp,
} from "lightweight-charts";
import { cn } from "@/lib/utils";
import { formatMarketCap, formatPrice } from "@/lib/formats";
import { PercentChange } from "@/components/ui/PercentChange";
import { CHART_RANGES, DEFAULT_CHART_DAYS, type ChartDays } from "./chartRanges";
import type { ChartPoint, CoinChartData } from "./types";

// The chart draws on a <canvas>, so it can't use Tailwind classes. These mirror the theme in globals.css.
const COLORS = {
  up: "#00FFA3", // primary
  down: "#ff716c", // error
  text: "#a9abaf", // on-surface-variant
  grid: "#45484c33", // outline-variant, faded
  volume: "#45484c99",
};

const fetcher = async (url: string): Promise<CoinChartData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Chart request failed: ${res.status}`);
  return res.json();
};

// Enough decimals for tiny coins: 0.000004840 needs ~9, BTC needs 2.
const pricePrecision = (prices: ChartPoint[]) => {
  const min = Math.min(...prices.map((p) => p.value).filter((v) => v > 0));
  if (!Number.isFinite(min) || min >= 1) return 2;
  return Math.min(12, Math.ceil(-Math.log10(min)) + 3);
};

const formatTime = (seconds: number, days: ChartDays) =>
  new Date(seconds * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: days > 90 ? "numeric" : undefined,
    hour: days <= 30 ? "numeric" : undefined,
    minute: days <= 7 ? "2-digit" : undefined,
  });

interface CoinChartProps {
  coinId: string;
  coinName: string;
  /** Default range, fetched on the server so the chart isn't empty on first paint. */
  initialData: CoinChartData | null;
}

export const CoinChart = ({ coinId, coinName, initialData }: CoinChartProps) => {
  const [days, setDays] = useState<ChartDays>(DEFAULT_CHART_DAYS);
  // Point under the mouse. null = not hovering, show the latest price.
  const [hovered, setHovered] = useState<ChartPoint | null>(null);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/coins/${encodeURIComponent(coinId)}/chart?days=${days}`,
    fetcher,
    {
      // The server already sent the default range; don't refetch it on mount.
      fallbackData: days === DEFAULT_CHART_DAYS ? (initialData ?? undefined) : undefined,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      // Keep showing the old range while the new one loads, instead of flashing empty.
      keepPreviousData: true,
    },
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  // Create the chart once. lightweight-charts is imperative: we keep the instance in refs
  // and push new data into it, instead of re-rendering it with React.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true, // follows the container size (ResizeObserver)
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: COLORS.text,
        fontFamily: getComputedStyle(document.body).fontFamily,
        fontSize: 11,
      },
      grid: { vertLines: { color: COLORS.grid }, horzLines: { color: COLORS.grid } },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
      crosshair: { mode: CrosshairMode.Magnet },
      localization: { priceFormatter: (price: number) => `$${formatPrice(price)}` },
      handleScroll: false, // the page should scroll, not the chart
      handleScale: false,
    });

    const priceSeries = chart.addSeries(AreaSeries, { lineWidth: 2, priceLineVisible: false });

    // Volume bars on their own hidden scale, squeezed into the bottom 20%.
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: COLORS.volume,
      priceFormat: { type: "volume" },
      priceScaleId: "",
      lastValueVisible: false,
      priceLineVisible: false,
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

    const onCrosshairMove = (param: MouseEventParams) => {
      const point = param.time ? param.seriesData.get(priceSeries) : undefined;
      const value = point && "value" in point ? point.value : undefined;
      setHovered(typeof value === "number" ? { time: param.time as number, value } : null);
    };
    chart.subscribeCrosshairMove(onCrosshairMove);

    chartRef.current = chart;
    priceSeriesRef.current = priceSeries;
    volumeSeriesRef.current = volumeSeries;

    return () => {
      chart.unsubscribeCrosshairMove(onCrosshairMove);
      chart.remove();
      chartRef.current = null;
      priceSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  // Push data into the chart whenever a range finishes loading.
  useEffect(() => {
    const chart = chartRef.current;
    const priceSeries = priceSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!chart || !priceSeries || !volumeSeries || !data) return;

    const first = data.prices[0]?.value;
    const last = data.prices.at(-1)?.value;
    // Green when the period ended higher than it started, red otherwise.
    const color = first !== undefined && last !== undefined && last < first ? COLORS.down : COLORS.up;
    const precision = pricePrecision(data.prices);

    priceSeries.applyOptions({
      lineColor: color,
      topColor: `${color}4D`, // 30% opacity
      bottomColor: `${color}00`,
      priceFormat: { type: "price", precision, minMove: 10 ** -precision },
    });
    priceSeries.setData(data.prices.map((p) => ({ time: p.time as UTCTimestamp, value: p.value })));
    volumeSeries.setData(data.volumes.map((v) => ({ time: v.time as UTCTimestamp, value: v.value })));

    chart.applyOptions({ timeScale: { timeVisible: days <= 30, secondsVisible: false } });
    chart.timeScale().fitContent();
  }, [data, days]);

  // Header readout: hovered point, or the latest one.
  const firstPoint = data?.prices[0];
  const shownPoint = hovered ?? data?.prices.at(-1) ?? null;
  const periodChange =
    firstPoint && shownPoint && firstPoint.value > 0
      ? ((shownPoint.value - firstPoint.value) / firstPoint.value) * 100
      : null;
  const shownVolume = shownPoint ? data?.volumes.find((v) => v.time === shownPoint.time)?.value : undefined;
  const rangeLabel = CHART_RANGES.find((r) => r.days === days)?.label;

  return (
    <section className="bg-surface-container-low rounded-xl p-4 md:p-6 space-y-4">
      {/* No flex-wrap: a wider hover readout must never push the range buttons onto a new line.
          Mobile stacks them on purpose instead. */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* All three lines always render (empty ones keep a non-breaking space), so the
            readout has a fixed height and the chart below never shifts while hovering. */}
        <div>
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            {hovered ? formatTime(hovered.time, days) : `${coinName} price · ${rangeLabel}`}
          </p>
          <p className="font-headline text-2xl font-bold">
            {shownPoint ? (
              <>
                ${formatPrice(shownPoint.value)}{" "}
                <PercentChange value={periodChange} className="text-sm align-middle" />
              </>
            ) : (
              " "
            )}
          </p>
          <p className="text-[11px] text-on-surface-variant">
            {shownVolume !== undefined ? `Vol $${formatMarketCap(shownVolume)}` : " "}
          </p>
        </div>

        <div role="group" aria-label="Chart range" className="flex shrink-0 self-start gap-1 bg-surface-container-high rounded-lg p-1">
          {CHART_RANGES.map((range) => (
            <button
              key={range.days}
              type="button"
              aria-pressed={days === range.days}
              onClick={() => setDays(range.days)}
              className={cn(
                "px-3 py-1 rounded-md font-label text-[11px] font-bold tracking-widest transition-colors",
                days === range.days
                  ? "bg-primary text-surface"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-80 md:h-105">
        <div
          ref={containerRef}
          role="img"
          aria-label={`${coinName} price chart, ${rangeLabel}`}
          className={cn("absolute inset-0 transition-opacity", isLoading && "opacity-40")}
        />

        {/* Status overlays. The chart div stays mounted underneath so the instance survives. */}
        {isLoading && !data && (
          <div className="absolute inset-0 rounded-lg bg-surface-container animate-pulse" aria-hidden />
        )}
        {error && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-container-low/90 text-on-surface-variant">
            <span className="material-symbols-outlined">cloud_off</span>
            <p className="text-sm">Chart data temporarily unavailable</p>
            <button
              type="button"
              onClick={() => mutate()}
              className="font-label text-[10px] uppercase tracking-widest text-secondary hover:underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
