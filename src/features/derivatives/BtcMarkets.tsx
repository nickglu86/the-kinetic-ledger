import { SectionTitle } from "@/components/ui/SectionTitle";
import { Unavailable } from "@/components/ui/Unavailable";
import { formatMarketCap, formatPrice } from "@/lib/formats";
import { FundingRate } from "./FundingRate";
import type { PerpMarket } from "./types";

// "Binance (Futures)" -> "Binance"
const exchangeName = (market: string) => market.replace(/\s*\((Futures|Derivatives)\)\s*$/i, "");

// Bitcoin's largest perpetual markets, exchange by exchange: how funding and price differ between them.
export const BtcMarkets = ({ markets }: { markets: PerpMarket[] | null }) => (
  <section aria-labelledby="btc-markets-heading" className="space-y-4">
    <SectionTitle id="btc-markets-heading" aside="By open interest">
      Bitcoin perpetuals
    </SectionTitle>
    {markets && markets.length > 0 ? (
      <div className="bg-surface-container-low rounded-xl p-2 overflow-x-auto no-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              <th scope="col" className="px-2 py-2 font-normal">Exchange</th>
              <th scope="col" className="px-2 py-2 font-normal text-right hidden sm:table-cell">Price</th>
              <th scope="col" className="px-2 py-2 font-normal text-right">Funding</th>
              <th scope="col" className="px-2 py-2 font-normal text-right">Open Int.</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m) => (
              <tr key={m.market + m.symbol} className="border-t border-outline-variant/10">
                <td className="px-2 py-2.5">
                  <span className="block font-headline font-bold text-sm text-on-surface">{exchangeName(m.market)}</span>
                  <span className="block font-label text-[10px] text-on-surface-variant">{m.symbol}</span>
                </td>
                <td className="px-2 py-2.5 text-right font-headline text-sm text-on-surface hidden sm:table-cell">
                  {m.price !== null ? `$${formatPrice(m.price)}` : "—"}
                </td>
                <td className="px-2 py-2.5 text-right text-sm">
                  <FundingRate value={m.fundingRate} />
                </td>
                <td className="px-2 py-2.5 text-right font-headline text-sm text-on-surface-variant">
                  ${formatMarketCap(m.openInterest)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <Unavailable label="Bitcoin perpetuals" className="py-10 items-center" />
    )}
  </section>
);
