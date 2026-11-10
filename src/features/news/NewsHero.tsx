import { Unavailable } from "@/components/ui/Unavailable";
import { getAllNews } from "@/server/data/news";
import { NewsWire } from "./NewsWire";

// Home page "The Terminal": server fetch -> client render.
// The 3 RSS feeds are fetched and merged on the server (same cached data as /news),
// the rotating lead story and the source switcher run in the browser.
export const NewsHero = async () => {
  const { articles, sources } = await getAllNews();

  if (articles.length === 0) return <Unavailable label="News" />;

  return <NewsWire articles={articles} sources={sources} />;
};
