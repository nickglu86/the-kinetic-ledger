"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ITEMS = [
    { label: "Pulse", href: "/", icon: "show_chart" },
    { label: "Markets", href: "/markets", icon: "monitoring" },
    { label: "Rank", href: "/rankings", icon: "trending_up" },
    { label: "News", href: "/news", icon: "newspaper" },
    { label: "Videos", href: "/videos", icon: "smart_display" },
] as const;

export const MobileNav = () => {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Main"
            className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-[#0b0e11]/80 backdrop-blur-xl border-t border-[#1c2024] z-50 rounded-t-lg">
            {MOBILE_NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn("flex flex-col items-center", active ? "text-primary" : "text-on-surface/50")}
                    >
                        <span aria-hidden className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-[10px] uppercase font-label">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};
