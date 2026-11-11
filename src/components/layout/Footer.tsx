import Link from "next/link";
import { REVALIDATE } from "@/lib/cacheTimes";

const EXPLORE = [
  { label: "Markets", href: "/markets" },
  { label: "Heatmap", href: "/heatmap" },
  { label: "Exchanges", href: "/exchanges" },
  { label: "Derivatives", href: "/derivatives" },
  { label: "DeFi", href: "/defi" },
  { label: "Rankings", href: "/rankings" },
  { label: "News", href: "/news" },
  { label: "Videos", href: "/videos" },
  { label: "Watchlist", href: "/watchlist" },
] as const;

const SOURCES = [
  { label: "CoinGecko", href: "https://www.coingecko.com" },
  { label: "DefiLlama", href: "https://defillama.com" },
  { label: "Alternative.me (Fear & Greed)", href: "https://alternative.me/crypto/fear-and-greed-index/" },
  { label: "CoinDesk", href: "https://www.coindesk.com" },
  { label: "CoinTelegraph", href: "https://cointelegraph.com" },
  { label: "Decrypt", href: "https://decrypt.co" },
] as const;

// "120" → "2 min", "3600" → "1 h". Read from REVALIDATE so the footer can't drift from the real cache times.
const every = (seconds: number) =>
  seconds >= 3600 ? `${seconds / 3600} h` : `${Math.round(seconds / 60)} min`;

const FRESHNESS = [
  { label: "Prices", value: every(REVALIDATE.marketList) },
  { label: "News", value: every(300) }, // RSS feeds, see lib/rss.ts
  { label: "Trending", value: every(REVALIDATE.trending) },
  { label: "Derivatives", value: every(REVALIDATE.derivatives) },
  { label: "DeFi", value: every(REVALIDATE.defi) },
  { label: "Fear & Greed", value: every(REVALIDATE.fearAndGreed) },
];

const linkClass = "hover:text-primary transition-colors";
const headingClass = "font-headline font-bold text-on-surface mb-6 uppercase tracking-widest text-xs";

// pb-32 on phones leaves room for the fixed bottom nav (MobielNav, md:hidden)
export const Footer = () => (
  <footer className="bg-surface-container-lowest pt-16 pb-32 md:pb-16 px-4 md:px-8 mt-4 border-t border-outline-variant/10">
    <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-12">
      <div className="col-span-2 md:col-span-1 space-y-6">
        <Link href="/" className="block text-xl font-black text-primary tracking-tighter uppercase font-headline">
          The Kinetic Ledger
        </Link>
        <p className="text-on-surface-variant text-sm font-body max-w-xs">
          Live crypto prices, market data and headlines from trusted sources, all in one dashboard.
        </p>
      </div>

      <nav aria-label="Explore">
        <h5 className={headingClass}>Explore</h5>
        <ul className="space-y-4 text-sm text-on-surface-variant font-label">
          {EXPLORE.map(({ label, href }) => (
            <li key={href}>
              <Link className={linkClass} href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <h5 className={headingClass}>Data sources</h5>
        <ul className="space-y-4 text-sm text-on-surface-variant font-label">
          {SOURCES.map(({ label, href }) => (
            <li key={href}>
              <a className={linkClass} href={href} target="_blank" rel="noopener noreferrer">
                {label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Honest replacement for the old "Network Status" box: how often each kind of data refreshes */}
      <div className="col-span-2 md:col-span-1 bg-surface-container-low p-6 rounded-lg space-y-4 border border-outline-variant/10">
        <h5 className="font-headline font-bold text-on-surface uppercase tracking-widest text-xs">Data freshness</h5>
        <div className="flex items-center gap-2">
          <div aria-hidden className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-on-surface-variant font-label">Refreshed automatically</span>
        </div>
        <dl className="text-[11px] text-on-surface-variant font-label space-y-1">
          {FRESHNESS.map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <dt>{label}</dt>
              <dd className="text-primary">every {value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>

    <div className="max-w-screen-2xl mx-auto pt-10 mt-16 border-t border-outline-variant/10 flex flex-col md:flex-row gap-3 justify-between items-center text-xs text-on-surface-variant font-label text-center">
      <span>© {new Date().getFullYear()} The Kinetic Ledger. Not financial advice.</span>
      <Link className={linkClass} href="/privacy">Privacy</Link>
    </div>
  </footer>
);
