"use client"; // Error boundaries must be Client Components

import "./globals.css";

// Last-resort boundary: replaces the root layout when layout.tsx itself throws.
// It must render its own <html> and <body>, and the layout's fonts are not loaded here.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="bg-surface text-on-surface min-h-full flex flex-col items-center justify-center gap-4 text-center px-4">
        <title>Something went wrong | The Kinetic Ledger</title>
        <h1 className="text-3xl font-bold tracking-tighter uppercase">Something went wrong</h1>
        <p className="text-on-surface-variant max-w-md">
          The Kinetic Ledger failed to load. Please try again in a moment.
        </p>
        {error.digest && (
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Ref: {error.digest}</p>
        )}
        <button
          onClick={() => unstable_retry()}
          className="mt-2 px-6 py-2 rounded bg-primary text-surface text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
