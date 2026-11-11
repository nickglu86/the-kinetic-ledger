import Link from "next/link";
import { cn } from "@/lib/utils";
import { PercentChange } from "@/components/ui/PercentChange";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Unavailable } from "@/components/ui/Unavailable";
import { formatMarketCap } from "@/lib/formats";
import type { StablecoinOverview } from "./types";

// More than half a cent away from $1 counts as off-peg and is highlighted
const DEPEG_THRESHOLD = 0.005;

// "fiat-backed" -> "Fiat-backed"
const mechanismLabel = (m: string | null) => (m ? m.charAt(0).toUpperCase() + m.slice(1) : "—");

// The largest USD stablecoins: supply, how they hold their peg, current price and 7-day supply change.
export const StablecoinsTable = ({ stablecoins }: { stablecoins: StablecoinOverview | null }) => (
  <section aria-labelledby="stablecoins-heading" className="space-y-4">
    <SectionTitle id="stablecoins-heading" aside="USD-pegged · by supply">
      Stablecoins
    </SectionTitle>
    {stablecoins && stablecoins.top.length > 0 ? (
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full sm:min-w-140 text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              <th scope="col" className="pb-2 pl-4 font-normal">Stablecoin</th>
              <th scope="col" className="pb-2 font-normal hidden md:table-cell">Backing</th>
              <th scope="col" className="pb-2 font-normal text-right">Price</th>
              <th scope="col" className="pb-2 font-normal text-right">Supply</th>
              <th scope="col" className="pb-2 pr-4 font-normal text-right hidden sm:table-cell">7d supply</th>
            </tr>
          </thead>
          <tbody>
            {stablecoins.top.map((coin) => {
              const offPeg = coin.price !== null && Math.abs(coin.price - 1) > DEPEG_THRESHOLD;
              const name = (
                <>
                  <span className="font-headline font-bold text-on-surface">{coin.name}</span>
                  <span className="ml-2 font-label text-[10px] uppercase text-on-surface-variant">{coin.symbol}</span>
                </>
              );
              return (
                <tr key={coin.symbol + coin.name} className="bg-surface-container-low hover:bg-surface-container-high transition-colors">
                  <td className="py-3 pl-4 rounded-l-lg">
                    {coin.geckoId ? (
                      <Link href={`/coins/${encodeURIComponent(coin.geckoId)}`} className="hover:text-secondary">
                        {name}
                      </Link>
                    ) : (
                      name
                    )}
                  </td>
                  <td className="py-3 text-sm text-on-surface-variant hidden md:table-cell">{mechanismLabel(coin.mechanism)}</td>
                  <td className={cn("py-3 text-right font-headline text-sm", offPeg ? "text-error font-bold" : "text-on-surface")}>
                    {coin.price !== null ? `$${coin.price.toFixed(4)}` : "—"}
                    {offPeg && <span className="sr-only"> (off its $1 peg)</span>}
                  </td>
                  <td className="py-3 text-right font-headline text-on-surface-variant max-sm:rounded-r-lg max-sm:pr-4">
                    ${formatMarketCap(coin.circulating)}
                  </td>
                  <td className="py-3 pr-4 rounded-r-lg text-right text-sm hidden sm:table-cell">
                    <PercentChange value={coin.change7d} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <Unavailable label="Stablecoins" className="py-10 items-center" />
    )}
  </section>
);
