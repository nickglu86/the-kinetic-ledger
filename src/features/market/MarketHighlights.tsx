import Link from "next/link";
import { getTrending } from "@/server/data/trending";
import { formatMarketCap, formatPrice } from "@/lib/formats";
import { PercentChange } from "@/components/ui/PercentChange";
import { Unavailable } from "@/components/ui/Unavailable";
import type { GlobalData } from "@/types/api";
import type { ChartPoint } from "@/features/coin/types";
import { MarketCapChart } from "./MarketCapChart";
import type { MarketCoin } from "./types";

const LIST_SIZE = 5;
// Ignore coins with almost no trading: a thin market can "gain" 100% on one trade.
const MIN_GAINER_VOLUME = 1_000_000;

interface ListCoin {
  id: string;
  name: string;
  image: string;
  price: number;
  change: number | null | undefined;
}

const cardClass = "bg-surface-container-low rounded-xl p-4 md:p-5 flex flex-col gap-4";

// "Trending" / "Top Gainers" card: 5 coins, each row opens the coin page.
const CoinListCard = ({ title, icon, iconClass, coins }: { title: string; icon: string; iconClass: string; coins: ListCoin[] }) => (
  <section aria-label={title} className={cardClass}>
    <h2 className="font-headline font-bold text-base flex items-center gap-2">
      <span aria-hidden className={`material-symbols-outlined text-xl ${iconClass}`}>{icon}</span>
      {title}
    </h2>
    {coins.length === 0 ? (
      <p className="text-sm text-on-surface-variant">No data right now.</p>
    ) : (
      <ul className="flex flex-col">
        {coins.map((coin) => (
          <li key={coin.id}>
            <Link
              href={`/coins/${coin.id}`}
              className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-surface-container-high transition-colors group focus-visible:outline-2 focus-visible:outline-secondary"
            >
              <img src={coin.image} alt="" loading="lazy" className="w-6 h-6 rounded-full shrink-0" />
              <span className="flex-1 min-w-0 truncate font-bold text-sm group-hover:text-secondary transition-colors">
                {coin.name}
              </span>
              <span className="font-headline text-sm text-on-surface">${formatPrice(coin.price)}</span>
              <PercentChange value={coin.change} className="text-xs w-16 text-right" />
            </Link>
          </li>
        ))}
      </ul>
    )}
  </section>
);

interface MarketHighlightsProps {
  coins: MarketCoin[];
  marketCapTrend: ChartPoint[] | null;
  global: GlobalData | null;
}

export const MarketHighlights = async ({ coins, marketCapTrend, global }: MarketHighlightsProps) => {
  const trending = await getTrending();

  const trendingCoins: ListCoin[] = (trending?.coins ?? []).slice(0, LIST_SIZE).map(({ item }) => ({
    id: item.id,
    name: item.name,
    image: item.thumb,
    price: item.data.price,
    change: item.data.price_change_percentage_24h?.usd,
  }));

  const topGainers: ListCoin[] = coins
    .filter((c) => typeof c.price_change_percentage_24h === "number" && c.total_volume >= MIN_GAINER_VOLUME)
    .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
    .slice(0, LIST_SIZE)
    .map((c) => ({ id: c.id, name: c.name, image: c.image, price: c.current_price, change: c.price_change_percentage_24h }));

  // Our trend line is the top 250 coins. Scale it so its last point equals CoinGecko's real
  // global total: the line keeps its shape and the numbers on the axis match the headline.
  const lastTrendValue = marketCapTrend?.at(-1)?.value;
  const chartPoints =
    marketCapTrend && global && lastTrendValue
      ? marketCapTrend.map((p) => ({ ...p, value: (p.value / lastTrendValue) * global.total_market_cap.usd }))
      : marketCapTrend;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {global ? (
        <section aria-label="Market cap and volume" className={`${cardClass} md:col-span-2 lg:col-span-1`}>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="font-headline font-bold text-lg flex items-baseline gap-2">
                ${formatMarketCap(global.total_market_cap.usd)}
                <PercentChange value={global.market_cap_change_percentage_24h_usd} className="text-xs" />
              </p>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Market Cap</p>
            </div>
            <div>
              <p className="font-headline font-bold text-lg flex items-baseline gap-2">
                ${formatMarketCap(global.total_volume.usd)}
                <PercentChange value={global.volume_change_percentage_24h_usd} className="text-xs" />
              </p>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">24h Trading Volume</p>
            </div>
          </div>
          {chartPoints && chartPoints.length > 1 && (
            <div className="mt-auto space-y-1">
              <MarketCapChart points={chartPoints} />
              <p className="text-[10px] text-on-surface-variant/70">24h trend based on the top 250 coins</p>
            </div>
          )}
        </section>
      ) : (
        <Unavailable label="Market cap" className="md:col-span-2 lg:col-span-1" />
      )}

      <CoinListCard title="Trending" icon="local_fire_department" iconClass="text-[#f97316]" coins={trendingCoins} />
      <CoinListCard title="Top Gainers" icon="rocket_launch" iconClass="text-primary" coins={topGainers} />
    </div>
  );
};
