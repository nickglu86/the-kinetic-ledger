"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MARKET_PAGES } from "@/lib/constants";

// Tabs across the top of every market page (Coins, Heatmap, Exchanges, Derivatives, DeFi).
// The header has room for one "Markets" link only, so this is how visitors move between them,
// on phones too. Scrolls sideways if it doesn't fit.
export const MarketsNav = () => {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // On a narrow screen the later tabs start off-screen. Scroll the strip (not the page)
  // so the current tab is visible.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active) return;
    const overflowRight = active.offsetLeft + active.offsetWidth - (nav.scrollLeft + nav.clientWidth);
    if (overflowRight > 0) nav.scrollLeft += overflowRight + 16;
  }, [pathname]);

  return (
    <nav ref={navRef} aria-label="Market pages" className="relative -mx-2 md:mx-0 overflow-x-auto no-scrollbar">
      <ul className="flex gap-1 px-2 md:px-0 w-max">
        {MARKET_PAGES.map((page) => {
          const active = pathname === page.href;
          return (
            <li key={page.href}>
              <Link
                href={page.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label text-[11px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low",
                )}
              >
                <span aria-hidden className="material-symbols-outlined text-base">{page.icon}</span>
                {page.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
