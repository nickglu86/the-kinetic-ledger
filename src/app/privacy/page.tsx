import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What The Kinetic Ledger stores, what it doesn't, and which third parties your browser talks to.",
};

const sections = [
  {
    title: "No accounts, no tracking",
    body: "There are no user accounts, no analytics scripts and no advertising cookies. The site doesn't know who you are.",
  },
  {
    title: "The newsletter",
    body: "If you join The Daily Kinetic, the email address you enter is sent to the site owner by email (through the Resend email service) and used only to send you the newsletter. It isn't stored in a database on this site, sold or shared. To be removed, reply to any newsletter email.",
  },
  {
    title: "Your watchlist stays in your browser",
    body: "Starred coins are saved in your browser's local storage under \"kinetic-watchlist\". They never leave your device, aren't sent to any server, and disappear if you clear your site data. They also don't sync between devices or browsers.",
  },
  {
    title: "Market data is fetched by our server",
    body: "Prices, charts, trending coins and the Fear & Greed index come from CoinGecko and Alternative.me. Our server makes those requests, so your browser doesn't contact them directly. Search works the same way: what you type is sent only to this site's own search endpoint.",
  },
  {
    title: "Images and videos come from their providers",
    body: "Coin logos and news thumbnails load from the providers' image servers (CoinGecko, CoinDesk, CoinTelegraph, Decrypt), which can see your IP address like any website. Videos play through YouTube's privacy-enhanced mode (youtube-nocookie.com), and only after you press play.",
  },
  {
    title: "Links to other sites",
    body: "News articles and NFT collections open on the publisher's or CoinGecko's own site, in a new tab. Their privacy policies apply there.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-6 space-y-10">
      <PageHeader eyebrow="Privacy" title="Privacy" description="The short version: nothing about you is stored on our side." />
      <div className="space-y-8">
        {sections.map(({ title, body }) => (
          <section key={title} className="space-y-2">
            <h2 className="font-headline text-lg font-bold text-on-surface">{title}</h2>
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
      <p className="text-xs text-on-surface-variant font-label border-t border-outline-variant/10 pt-6">
        Nothing on this site is financial advice. Prices can be delayed by a few minutes.
      </p>
    </main>
  );
}
