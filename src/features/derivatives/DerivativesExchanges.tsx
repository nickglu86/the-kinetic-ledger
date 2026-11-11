import { externalLinkProps } from "@/features/news/shared";
import { Logo } from "@/components/ui/Logo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Unavailable } from "@/components/ui/Unavailable";
import { formatMarketCap } from "@/lib/formats";
import type { DerivativesExchange } from "./types";

const SHOWN = 10;

const usd = (usdValue: number | null, btcValue: number) =>
  usdValue !== null ? `$${formatMarketCap(usdValue)}` : `₿${formatMarketCap(btcValue)}`;

// The derivatives exchanges with the most open interest. Each row opens the exchange on CoinGecko.
export const DerivativesExchanges = ({ exchanges }: { exchanges: DerivativesExchange[] | null }) => (
  <section aria-labelledby="deriv-exchanges-heading" className="space-y-4">
    <SectionTitle id="deriv-exchanges-heading" aside="By open interest">
      Top derivatives exchanges
    </SectionTitle>
    {exchanges && exchanges.length > 0 ? (
      <div className="bg-surface-container-low rounded-xl p-2 overflow-x-auto no-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              <th scope="col" className="px-2 py-2 font-normal">Exchange</th>
              <th scope="col" className="px-2 py-2 font-normal text-right">Open Int.</th>
              <th scope="col" className="px-2 py-2 font-normal text-right hidden sm:table-cell">24h Volume</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.slice(0, SHOWN).map((e) => (
              <tr key={e.id} className="border-t border-outline-variant/10">
                <td className="px-2 py-2.5">
                  <a
                    href={`https://www.coingecko.com/en/exchanges/${encodeURIComponent(e.id)}`}
                    {...externalLinkProps}
                    className="flex items-center gap-3 w-fit group focus-visible:outline-2 focus-visible:outline-secondary rounded"
                  >
                    <Logo src={e.image} name={e.name} className="rounded-md" />
                    <span>
                      <span className="block font-headline font-bold text-sm text-on-surface group-hover:text-secondary transition-colors">
                        {e.name}
                      </span>
                      <span className="block font-label text-[10px] text-on-surface-variant">
                        {e.perpetuals} perpetuals · {e.futures} futures
                      </span>
                    </span>
                  </a>
                </td>
                <td className="px-2 py-2.5 text-right font-headline text-sm text-on-surface">
                  {usd(e.openInterestUsd, e.openInterestBtc)}
                </td>
                <td className="px-2 py-2.5 text-right font-headline text-sm text-on-surface-variant hidden sm:table-cell">
                  {usd(e.volume24hUsd, e.volume24hBtc)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <Unavailable label="Derivatives exchanges" className="py-10 items-center" />
    )}
  </section>
);
