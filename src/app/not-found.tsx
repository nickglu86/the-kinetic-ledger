import Link from "next/link";

// Root 404: any URL that matches no route (e.g. /markets, /news before those pages exist).
// The coin route has its own not-found.tsx with a coin-specific message; this is the fallback for everything else.
// The tab title comes from app/[...slug]/page.tsx (see the comment there for why).
export default function NotFound() {
  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-24 flex flex-col items-center text-center gap-4">
      <span className="material-symbols-outlined text-on-surface-variant text-5xl">explore_off</span>
      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">404</p>
      <h1 className="font-headline text-3xl font-bold tracking-tighter uppercase">Page not found</h1>
      <p className="font-body text-on-surface-variant max-w-md">
        This page doesn&apos;t exist, or it hasn&apos;t been built yet. Head back to the dashboard for live market data.
      </p>
      <Link
        href="/"
        className="mt-2 px-6 py-2 rounded bg-primary text-surface font-label text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Back to home
      </Link>
    </main>
  );
}
