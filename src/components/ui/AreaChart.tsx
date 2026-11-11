"use client";

import { useEffect, useRef } from "react";
import { AreaSeries, ColorType, CrosshairMode, createChart, type UTCTimestamp } from "lightweight-charts";
import { formatMarketCap } from "@/lib/formats";
import { CHART_COLORS } from "@/lib/chartTheme";
import { cn } from "@/lib/utils";

export interface AreaPoint {
  time: number; // unix seconds, strictly increasing
  value: number;
}

interface AreaChartProps {
  points: AreaPoint[];
  /** Describes the chart for screen readers (the canvas itself is invisible to them). */
  label: string;
  /** Show hours on the time axis (intraday data) or just dates. */
  intraday?: boolean;
  className?: string;
}

// Small read-only area chart in USD (e.g. "$2.45T"). Green when the last value is above the first, red otherwise.
// Used for the Markets page's 24h market cap and the DeFi page's TVL history.
// The data never changes after render (it comes from the server), so the chart is built once.
export const AreaChart = ({ points, label, intraday = false, className }: AreaChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || points.length < 2) return;

    const color = points.at(-1)!.value < points[0].value ? CHART_COLORS.down : CHART_COLORS.up;

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: CHART_COLORS.text,
        fontFamily: getComputedStyle(document.body).fontFamily,
        fontSize: 10,
      },
      grid: { vertLines: { visible: false }, horzLines: { color: CHART_COLORS.grid } },
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.05 } },
      timeScale: { borderVisible: false, timeVisible: intraday, secondsVisible: false, fixLeftEdge: true, fixRightEdge: true },
      crosshair: { mode: CrosshairMode.Magnet },
      localization: { priceFormatter: (value: number) => `$${formatMarketCap(value)}` },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: color,
      lineWidth: 2,
      topColor: `${color}40`,
      bottomColor: `${color}00`,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    series.setData(points.map((p) => ({ time: p.time as UTCTimestamp, value: p.value })));
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [points, intraday]);

  return <div ref={containerRef} role="img" aria-label={label} className={cn("w-full", className)} />;
};
