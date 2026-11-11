 export const NAV_ITEMS = [
    { label: "Home", href: "/" },
    { label: "Markets", href: "/markets" },
    { label: "News", href: "/news" },
    { label: "Rankings", href: "/rankings" },
    { label: "Videos", href: "/videos" },
  ] as const;

// The pages grouped under "Markets": the header's Markets link stays highlighted on all of them,
// and MarketsNav shows them as tabs at the top of each one.
export const MARKET_PAGES = [
    { label: "Coins", href: "/markets", icon: "monitoring" },
    { label: "Heatmap", href: "/heatmap", icon: "grid_view" },
    { label: "Exchanges", href: "/exchanges", icon: "account_balance" },
    { label: "Derivatives", href: "/derivatives", icon: "candlestick_chart" },
    { label: "DeFi", href: "/defi", icon: "hub" },
] as const;

export const isMarketPage = (pathname: string) => MARKET_PAGES.some((page) => page.href === pathname);

// Is this nav link the current section? "Markets" covers every page in MARKET_PAGES.
export const isNavActive = (href: string, pathname: string) =>
    href === pathname || (href === "/markets" && isMarketPage(pathname));
