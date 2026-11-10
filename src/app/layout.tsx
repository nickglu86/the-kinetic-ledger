import type { Metadata } from "next";
import { Space_Grotesk, Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobielNav";
import { LiveTicker, LiveTickerSkeleton } from "@/components/layout/LiveTicker";
import { Suspense } from "react";
import { WatchlistSync } from "@/features/watchlist/WatchlistSync";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-label",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Pages set just their own part ("Bitcoin (BTC) Price"); %s is replaced with it.
  // Pages without a title (home) get the default.
  title: {
    template: "%s | The Kinetic Ledger",
    default: "The Kinetic Ledger",
  },
  description: "High-Velocity Crypto Intelligence & Market Data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${inter.variable} dark h-full antialiased`}
    >
      <head>
        <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
        rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface font-headline selection:bg-primary selection:text-on-primary">
        {/* The ticker fetches prices; without Suspense every page would wait for it before showing anything */}
        <Suspense fallback={<LiveTickerSkeleton />}>
          <LiveTicker />
        </Suspense>
        <Header />
        {children}
        <Footer />
        <MobileNav />
        <WatchlistSync />
      </body>
    </html>
  );
}
