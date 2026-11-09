import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Catch-all for any URL no other route matches (/markets, /news, ...). It only exists so unknown
// URLs get a proper <title>: app/not-found.tsx can't export metadata, and without a matched route
// the root layout's default title overrides the one in not-found.tsx. Real routes always win over this.
export const metadata: Metadata = { title: "Page not found" };

export default function CatchAll() {
  notFound(); // renders app/not-found.tsx with a 404 status
}
