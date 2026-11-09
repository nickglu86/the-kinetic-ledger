import { CoinDetail } from "./types";

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " };

// CoinGecko descriptions are third-party text that sometimes contains HTML (mostly <a> tags).
// Rendering that with dangerouslySetInnerHTML would be an XSS hole, so instead we strip every tag,
// decode the few common entities, and let React render plain text (React escapes it for us).
const toParagraphs = (raw: string | undefined): string[] =>
  (raw ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, name: string) => ENTITIES[name])
    .split(/\r?\n\s*\r?\n/) // blank line = new paragraph
    .map((p) => p.trim())
    .filter(Boolean);

const VISIBLE_PARAGRAPHS = 2;

export const CoinAbout = ({ coin }: { coin: CoinDetail }) => {
  const paragraphs = toParagraphs(coin.description.en);
  const categories = coin.categories.filter((c): c is string => Boolean(c)).slice(0, 6);
  if (paragraphs.length === 0 && categories.length === 0) return null;

  const visible = paragraphs.slice(0, VISIBLE_PARAGRAPHS);
  const rest = paragraphs.slice(VISIBLE_PARAGRAPHS);

  return (
    <section aria-labelledby="coin-about-heading" className="bg-surface-container-low rounded-xl p-4 md:p-6 space-y-4">
      <h2 id="coin-about-heading" className="font-headline text-lg font-bold uppercase tracking-tight">
        About {coin.name}
      </h2>

      {categories.length > 0 && (
        <ul aria-label="Categories" className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <li
              key={category}
              className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant bg-surface-container-high px-2 py-1 rounded"
            >
              {category}
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-3 font-body text-sm leading-relaxed text-on-surface-variant max-w-prose">
        {visible.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {/* Native disclosure widget: keyboard and screen-reader friendly, no client JS needed */}
        {rest.length > 0 && (
          <details className="group space-y-3">
            <summary className="cursor-pointer list-none font-label text-[10px] font-bold uppercase tracking-widest text-secondary hover:underline">
              <span className="group-open:hidden">Read more</span>
              <span className="hidden group-open:inline">Show less</span>
            </summary>
            {rest.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </details>
        )}
      </div>
    </section>
  );
};
