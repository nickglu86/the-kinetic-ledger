"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-[#0b0e11] sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        <div className="text-2xl font-black text-[#00FFA3] tracking-tighter uppercase font-headline">
          The Kinetic Ledger
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-headline tracking-tight text-sm transition-colors",
                pathname === item.href
                  ? "text-primary border-b-2 border-primary pb-1 font-bold"
                  : "text-on-surface/70 font-medium hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48 font-label"
              placeholder="Search assets..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-[#00FFA3] cursor-pointer active:scale-95 transition-transform"
              data-icon="notifications"
            >
              notifications
            </span>
            <span
              className="material-symbols-outlined text-[#00FFA3] cursor-pointer active:scale-95 transition-transform"
              data-icon="account_circle"
            >
              account_circle
            </span>
          </div>
        </div>
      </div>
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
