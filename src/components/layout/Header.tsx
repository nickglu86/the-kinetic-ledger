"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { isNavActive, NAV_ITEMS } from "@/lib/constants";
import { CoinSearch } from "@/features/search/CoinSearch";
import { WatchlistLink } from "@/features/watchlist/WatchlistLink";

export const Header = () => {
  const pathname = usePathname();
  // Below lg the search box doesn't fit in the bar; a button opens it in a panel under the header
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-[#0b0e11] sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-screen-2xl mx-auto gap-4">
        <Link href="/" className="text-xl sm:text-2xl font-black text-[#00FFA3] tracking-tighter uppercase font-headline whitespace-nowrap">
          The Kinetic Ledger
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isNavActive(item.href, pathname) ? "page" : undefined}
              className={cn(
                "font-headline tracking-tight text-sm transition-colors",
                isNavActive(item.href, pathname)
                  ? "text-primary border-b-2 border-primary pb-1 font-bold"
                  : "text-on-surface/70 font-medium hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 lg:gap-4">
          <CoinSearch shortcut className="hidden lg:block w-56 xl:w-64" />
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-expanded={searchOpen}
            aria-controls="mobile-search"
            aria-label={searchOpen ? "Close search" : "Search coins"}
            className="lg:hidden grid place-items-center size-9 rounded-full text-on-surface/80 hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span aria-hidden className="material-symbols-outlined">{searchOpen ? "close" : "search"}</span>
          </button>
          <WatchlistLink />
        </div>
      </div>
      {searchOpen && (
        <div id="mobile-search" className="lg:hidden px-4 md:px-8 pb-4">
          <CoinSearch autoFocus onNavigate={() => setSearchOpen(false)} />
        </div>
      )}
      <div className="bg-[#101417] h-[2px] w-full"></div>
    </header>
  );
};

// <header className="bg-[#0b0e11] sticky top-0 z-50">
//   <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
//     <div className="text-2xl font-black text-[#00FFA3] tracking-tighter uppercase font-headline">
//       The Kinetic Ledger
//     </div>
//     <nav className="hidden md:flex items-center gap-6">
//       <a
//         className="text-[#f8f9fe]/70 font-medium hover:text-[#00FFA3] font-headline tracking-tight transition-colors text-sm"
//         href="#"
//       >
//         Home
//       </a>
//       <a
//         className="text-[#00FFA3] border-b-2 border-[#00FFA3] pb-1 font-headline font-bold tracking-tight text-sm"
//         href="#"
//       >
//         Markets
//       </a>
//       <a
//         className="text-[#f8f9fe]/70 font-medium hover:text-[#00FFA3] font-headline tracking-tight transition-colors text-sm"
//         href="#"
//       >
//         News
//       </a>
//       <a
//         className="text-[#f8f9fe]/70 font-medium hover:text-[#00FFA3] font-headline tracking-tight transition-colors text-sm"
//         href="#"
//       >
//         Rankings
//       </a>
//       <a
//         className="text-[#f8f9fe]/70 font-medium hover:text-[#00FFA3] font-headline tracking-tight transition-colors text-sm"
//         href="#"
//       >
//         Videos
//       </a>
//     </nav>
//     <div className="flex items-center gap-6">
//       <div className="hidden lg:flex items-center bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/20">
//         <span className="material-symbols-outlined text-on-surface-variant text-sm">
//           search
//         </span>
//         <input
//           className="bg-transparent border-none focus:ring-0 text-sm w-48 font-label"
//           placeholder="Search assets..."
//           type="text"
//         />
//       </div>
//       <div className="flex items-center gap-4">
//         <span
//           className="material-symbols-outlined text-[#00FFA3] cursor-pointer active:scale-95 transition-transform"
//           data-icon="notifications"
//         >
//           notifications
//         </span>
//         <span
//           className="material-symbols-outlined text-[#00FFA3] cursor-pointer active:scale-95 transition-transform"
//           data-icon="account_circle"
//         >
//           account_circle
//         </span>
//       </div>
//     </div>
//   </div>
//   <div className="bg-[#101417] h-[2px] w-full"></div>
// </header>;
