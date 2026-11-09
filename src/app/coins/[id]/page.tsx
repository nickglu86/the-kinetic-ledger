import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCoin } from "@/server/data/coin";
import { CoinHeader } from "@/features/coin/CoinHeader";

// Dynamic route: /coins/bitcoin, /coins/ethereum, ...
// The folder name [id] becomes params.id. It's the CoinGecko coin id (e.g. "bitcoin"), not the symbol.
//
// PageProps<'/coins/[id]'> is a global helper Next.js generates during `next dev` / `next build`,
// so params is typed as Promise<{ id: string }>. In Next 15+ params is a Promise and must be awaited.

// Sets the browser tab title. The root layout's title template appends " | The Kinetic Ledger".
export async function generateMetadata({ params }: PageProps<"/coins/[id]">): Promise<Metadata> {
  const { id } = await params;
  // Don't let a failed fetch break metadata; the page itself will hit the same error and show error.tsx.
  const coin = await getCoin(id).catch(() => null);

  // Unknown coin: not-found.tsx sets its own <title>, so nothing to add here.
  if (!coin) return {};

  const symbol = coin.symbol.toUpperCase();
  return {
    title: `${coin.name} (${symbol}) Price`,
    description: `Live ${coin.name} (${symbol}) price, market cap and 24h change.`,
  };
}

export default async function CoinPage({ params }: PageProps<"/coins/[id]">) {
  const { id } = await params;
  const coin = await getCoin(id); // same request as generateMetadata, deduped by cache()

  // Unknown id -> render ./not-found.tsx with a 404 status.
  // Other failures (rate limit, outage) throw inside getCoin -> app/error.tsx.
  if (!coin) notFound();

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-6 space-y-12">
      <CoinHeader coin={coin} />
    </main>
  );
}
