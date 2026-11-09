import { PercentChange } from "@/components/ui/PercentChange";
import { CoinDetail } from "./types";

export const CoinPerformance = ({ coin }: { coin: CoinDetail }) => {
  const md = coin.market_data;

  const periods = [
    { label: "1h", value: md.price_change_percentage_1h_in_currency.usd },
    { label: "24h", value: md.price_change_percentage_24h },
    { label: "7d", value: md.price_change_percentage_7d },
    { label: "30d", value: md.price_change_percentage_30d },
    { label: "1y", value: md.price_change_percentage_1y },
  ];

  return (
    <section className="space-y-4">
      <h2 className="font-headline text-lg font-bold uppercase tracking-tight">Performance</h2>
      <dl className="grid grid-cols-3 sm:grid-cols-5 gap-2 bg-surface-container-low rounded-xl p-4">
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
