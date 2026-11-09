import { safeUrl } from "@/lib/safeUrl";
import { CoinDetail } from "./types";

interface LinkItem {
  href: string;
  label: string;
}

// Links come from CoinGecko, i.e. third-party data, so every URL goes through safeUrl (http/https only).

const hostLabel = (href: string) => new URL(href).hostname.replace(/^www\./, "");

// Build link items from a list of raw URLs (which often contain empty strings).
const toItems = (urls: (string | null | undefined)[] = [], label?: string, max = 3): LinkItem[] =>
  [...new Set(urls.map(safeUrl))] // Set drops duplicate URLs
    .filter((href): href is string => href !== null)
    .slice(0, max)
    .map((href) => ({ href, label: label ?? hostLabel(href) }));

// External link in a new tab. noopener: the new tab can't reach back into our page via window.opener.
const LinkChip = ({ href, label }: LinkItem) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 max-w-full px-2.5 py-1 rounded-md bg-surface-container-high text-xs font-bold hover:text-secondary hover:bg-surface-container-highest transition-colors"
  >
    {/* Long hostnames (platform.arkhamintelligence.com) get an ellipsis instead of overflowing */}
    <span className="truncate">{label}</span>
    <span aria-hidden className="material-symbols-outlined text-[14px] text-on-surface-variant">
      arrow_outward
    </span>
  </a>
);

export const CoinLinks = ({ coin }: { coin: CoinDetail }) => {
  const { links } = coin;
  const twitter = links.twitter_screen_name ? `https://x.com/${encodeURIComponent(links.twitter_screen_name)}` : null;
  const facebook = links.facebook_username
    ? `https://www.facebook.com/${encodeURIComponent(links.facebook_username)}`
    : null;

  const rows: { label: string; items: LinkItem[] }[] = [
    { label: "Website", items: [...toItems(links.homepage, undefined, 2), ...toItems([links.whitepaper], "Whitepaper")] },
    { label: "Explorers", items: toItems(links.blockchain_site) },
    {
      label: "Community",
      items: [
        ...toItems([links.subreddit_url], "Reddit"),
        ...toItems([twitter], "X"),
        ...toItems([facebook], "Facebook"),
        ...toItems(links.official_forum_url, undefined, 1),
      ],
    },
    { label: "Source Code", items: toItems(links.repos_url?.github, "GitHub", 1) },
  ].filter((row) => row.items.length > 0);

  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="coin-links-heading" className="space-y-3">
      <h2 id="coin-links-heading" className="font-headline text-lg font-bold uppercase tracking-tight">
        Info
      </h2>
      <dl className="bg-surface-container-low rounded-xl px-4 md:px-6 py-2 divide-y divide-outline-variant/15">
        {rows.map((row) => (
          <div key={row.label} className="py-3 flex justify-between gap-4">
            <dt className="shrink-0 text-sm text-on-surface-variant pt-1">{row.label}</dt>
            <dd className="min-w-0 flex flex-wrap justify-end gap-2">
              {row.items.map((item) => (
                <LinkChip key={item.href} {...item} />
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
