import Link from "next/link";

// Shown when the coin page calls notFound(), i.e. CoinGecko has no coin with that id.
export default function CoinNotFound() {
  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-24 flex flex-col items-center text-center gap-4">
      {/* not-found.tsx can't export `metadata`; React 19 hoists this <title> into <head> instead */}
      <title>Coin not found | The Kinetic Ledger</title>
      <span className="material-symbols-outlined text-on-surface-variant text-5xl">search_off</span>
      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">404</p>
      <h1 className="font-headline text-3xl font-bold tracking-tighter uppercase">Coin not found</h1>
      <p className="font-body text-on-surface-variant max-w-md">
        We couldn&apos;t find that coin. Check the URL, or pick one from the market rankings.
      </p>
      <Link
        href="/"
        className="mt-2 px-6 py-2 rounded bg-primary text-surface font-label text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Back to markets
      </Link>
    </main>
  );
}
