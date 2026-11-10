"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatMarketCap, formatPrice } from "@/lib/formats";
import type { MarketCoin } from "@/features/market/types";
import { squarify, type TreemapTile } from "./treemap";

const PERIODS = [
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
] as const;
type Period = (typeof PERIODS)[number]["key"];

// Colour scale: ±MAX_CHANGE % or more gets the strongest colour
const MAX_CHANGE = 10;
const UP = "#00c27c"; // a deeper take on primary, so white text stays readable
const DOWN = "#e5484d";
const FLAT = "#22262b"; // surface-container-highest

const changeOf = (coin: MarketCoin, period: Period) =>
  period === "24h" ? coin.price_change_percentage_24h : coin.price_change_percentage_7d_in_currency;

// Mix toward green/red by the size of the move: tiny moves stay near-neutral, big ones are vivid.
const tileColor = (change: number | null | undefined) => {
  if (change == null || !Number.isFinite(change)) return FLAT;
  const strength = Math.min(Math.abs(change) / MAX_CHANGE, 1);
  const pct = Math.round(15 + strength * 80);
  return `color-mix(in oklab, ${change >= 0 ? UP : DOWN} ${pct}%, ${FLAT})`;
};

const formatChange = (change: number | null | undefined) =>
  change == null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

// Two layouts: a tall one for phones and a wide one for larger screens. Only one is shown (CSS),
// so each keeps its tiles square at its own shape.
const LAYOUTS = [
  { aspect: 0.75, className: "aspect-[3/4] sm:hidden" },
  { aspect: 16 / 9, className: "hidden sm:block aspect-video" },
] as const;

const Tile = ({ tile, period }: { tile: TreemapTile<MarketCoin>; period: Period }) => {
  const coin = tile.item;
  const change = changeOf(coin, period);

  // Text sizes come from the tile's real pixel size, not from the code here:
  // .heat-tile is a CSS size container (globals.css), so labels scale with the tile
  // and hide themselves when the tile is too small or too thin to fit them.
  return (
    <Link
      href={`/coins/${coin.id}`}
      aria-label={`${coin.name}: ${formatChange(change)} (${period})`}
      title={`${coin.name} · $${formatPrice(coin.current_price)} · ${formatChange(change)} (${period}) · $${formatMarketCap(coin.market_cap)} market cap`}
      className="absolute p-px group focus-visible:z-10 focus-visible:outline-none"
      style={{ left: `${tile.x}%`, top: `${tile.y}%`, width: `${tile.w}%`, height: `${tile.h}%` }}
    >
      <span
        className="heat-tile block size-full rounded-sm overflow-hidden text-white transition-[filter] group-hover:brightness-125 group-focus-visible:ring-2 group-focus-visible:ring-secondary"
        style={{ backgroundColor: tileColor(change) }}
      >
        {/* Inner wrapper: a size container can't style itself, only its children */}
        <span className="size-full flex flex-col items-center justify-center text-center px-0.5">
          <span className="heat-sym max-w-full truncate font-headline font-bold uppercase leading-none drop-shadow">
            {coin.symbol}
          </span>
          <span className="heat-pct font-label font-bold leading-tight drop-shadow">{formatChange(change)}</span>
          <span className="heat-price font-label leading-tight text-white/80">${formatPrice(coin.current_price)}</span>
        </span>
      </span>
    </Link>
  );
};

export const HeatmapView = ({ coins }: { coins: MarketCoin[] }) => {
  const [period, setPeriod] = useState<Period>("24h");
  const items = coins.map((coin) => ({ value: coin.market_cap, item: coin }));

  return (
    <section aria-label="Market heatmap" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div role="group" aria-label="Price change period" className="flex gap-1 bg-surface-container-low p-1 rounded-lg self-start">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-pressed={period === p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                "px-4 py-1.5 rounded-md font-label text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer",
                period === p.key ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div aria-hidden className="flex items-center gap-2 font-label text-[10px] text-on-surface-variant">
          <span>−{MAX_CHANGE}%</span>
          <span
            className="h-2 w-40 rounded-full"
            style={{ background: `linear-gradient(to right, ${DOWN}, ${FLAT}, ${UP})` }}
          />
          <span>+{MAX_CHANGE}%</span>
        </div>
      </div>

      {LAYOUTS.map((layout) => (
        <div key={layout.aspect} className={cn("relative w-full rounded-xl overflow-hidden bg-surface-container-lowest", layout.className)}>
          {squarify(items, layout.aspect).map((tile) => (
            <Tile key={tile.item.id} tile={tile} period={period} />
          ))}
        </div>
      ))}

      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
        Tile size = market cap · colour = price change · hover or focus a tile for details
      </p>
    </section>
  );
};
