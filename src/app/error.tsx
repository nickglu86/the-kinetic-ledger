"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

// Catches errors thrown while rendering page.tsx (and anything nested under it).
// The root layout (Header, LiveTicker, Footer) stays on screen.
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-screen-2xl mx-auto px-2 md:px-8 py-24 flex flex-col items-center text-center gap-4">
      <span className="material-symbols-outlined text-error text-5xl">error</span>
      <h1 className="font-headline text-3xl font-bold tracking-tighter uppercase">
        Market data unavailable
      </h1>
      <p className="font-body text-on-surface-variant max-w-md">
        We couldn&apos;t load the latest data. This is usually a temporary rate limit from one of our data providers.
      </p>
      {error.digest && (
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          Ref: {error.digest}
        </p>
      )}
      <button
        onClick={() => unstable_retry()}
        className="mt-2 px-6 py-2 rounded bg-primary text-surface font-label text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </main>
  );
}
