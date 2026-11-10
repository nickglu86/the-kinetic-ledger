// Squarified treemap (Bruls, Huizing & van Wijk, 2000).
// Splits a rectangle into tiles whose areas match the values, keeping tiles as close to square as possible
// (long thin slivers are hard to read and to click). Pure function: no React, no DOM.

export interface TreemapTile<T> {
  item: T;
  /** Position and size in percent of the container, ready for CSS left/top/width/height. */
  x: number;
  y: number;
  w: number;
  h: number;
}

// How far from square the worst tile in a row would be (1 = perfect square). Lower is better.
const worstRatio = (row: number[], side: number) => {
  const sum = row.reduce((a, b) => a + b, 0);
  const max = Math.max(...row);
  const min = Math.min(...row);
  return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
};

/**
 * @param items  anything with a positive value (e.g. coins by market cap)
 * @param aspect container width ÷ height, so the tiles come out square on screen
 */
export const squarify = <T>(items: { value: number; item: T }[], aspect: number): TreemapTile<T>[] => {
  const sorted = items.filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const total = sorted.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return [];

  // Work in a width × height box (height 1), with values scaled to areas that fill it exactly
  const W = aspect;
  const H = 1;
  const areas = sorted.map((d) => (d.value / total) * W * H);

  const tiles: TreemapTile<T>[] = [];
  let x = 0;
  let y = 0;
  let w = W;
  let h = H;
  let i = 0;

  while (i < areas.length) {
    // Lay tiles in a strip along the shorter side; keep adding while that makes the strip more square
    const side = Math.min(w, h);
    const row = [areas[i]];
    let next = i + 1;
    while (next < areas.length && worstRatio([...row, areas[next]], side) <= worstRatio(row, side)) {
      row.push(areas[next]);
      next++;
    }

    const rowArea = row.reduce((a, b) => a + b, 0);
    if (w >= h) {
      // Vertical strip on the left
      const stripW = rowArea / h;
      let cy = y;
      row.forEach((area, k) => {
        const tileH = area / stripW;
        tiles.push({ item: sorted[i + k].item, x, y: cy, w: stripW, h: tileH });
        cy += tileH;
      });
      x += stripW;
      w -= stripW;
    } else {
      // Horizontal strip on top
      const stripH = rowArea / w;
      let cx = x;
      row.forEach((area, k) => {
        const tileW = area / stripH;
        tiles.push({ item: sorted[i + k].item, x: cx, y, w: tileW, h: stripH });
        cx += tileW;
      });
      y += stripH;
      h -= stripH;
    }
    i = next;
  }

  // Box units -> percent of the container
  return tiles.map((t) => ({ ...t, x: (t.x / W) * 100, y: (t.y / H) * 100, w: (t.w / W) * 100, h: (t.h / H) * 100 }));
};
