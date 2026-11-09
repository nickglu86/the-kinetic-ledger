import { PercentChange } from "@/components/ui/PercentChange";
import { CoinDetail } from "./types";

export const CoinPerformance = ({ coin }: { coin: CoinDetail }) => {
  const md = coin.market_data;

  const periods = [
    { label: "1h", value: md.price_change_percentage_1h_in_currency.usd },
    { label: "24h", value: md.price_change_percentage_24h },
    { label: "7d", value: md.price_change_percentage_7d },
    { label: "14d", value: md.price_change_percentage_14d },
    { label: "30d", value: md.price_change_percentage_30d },
    { label: "1y", value: md.price_change_percentage_1y },
  ];

  return (
    <section aria-labelledby="coin-performance-heading">
      <h2 id="coin-performance-heading" className="sr-only">Price performance</h2>
      <dl className="grid grid-cols-3 sm:grid-cols-6 gap-y-4 bg-surface-container-low rounded-xl p-4">
        {periods.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <dt className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</dt>
            <dd>
              <PercentChange value={value} className="font-headline text-sm" />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
