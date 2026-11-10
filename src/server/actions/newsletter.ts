"use server";

import { headers } from "next/headers";

// Newsletter sign-up: there's no database, so each new address is simply emailed to the site
// owner through Resend (resend.com). Needs two server-only env variables:
//   RESEND_API_KEY           API key from the Resend dashboard
//   NEWSLETTER_NOTIFY_EMAIL  where sign-ups are sent. With Resend's test sender
//                            (onboarding@resend.dev) this must be the address your Resend
//                            account is registered with, until you verify your own domain.
//
// A server action is a public POST endpoint, so everything from the form is treated as untrusted:
// the email is validated, bots are filtered with a hidden field, and each IP is rate-limited.

export interface NewsletterState {
  status: "idle" | "success" | "error";
  message: string;
  /** Echoed back on errors: React resets the form after submit, this refills the field. */
  email?: string;
}

const RESEND_URL = "https://api.resend.com/emails";
const FROM = "The Kinetic Ledger <onboarding@resend.dev>";

// Simple shape check: something@domain.tld, no spaces or characters that could break an email header
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const MAX_EMAIL_LENGTH = 254;

// Rate limit: a few attempts per IP per window. Kept in memory, so it resets on restart and each
// server instance has its own count. Good enough to stop someone flooding your inbox from one machine.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const attempts = new Map<string, number[]>();

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  // Drop old entries now and then so the map can't grow forever
  if (attempts.size > 1000) {
    for (const [key, times] of attempts) if (times.every((t) => now - t >= WINDOW_MS)) attempts.delete(key);
  }
  return recent.length > MAX_PER_WINDOW;
};

const fail = (message: string, email?: string): NewsletterState => ({ status: "error", message, email });

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Hidden "company" field: people never see it, bots fill in every field.
  // Pretend it worked so the bot has nothing to learn from.
  if (formData.get("company")) {
    return { status: "success", message: "Thanks! You're on the list." };
  }

  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return fail("Please enter a valid email address.", email.slice(0, MAX_EMAIL_LENGTH));
  }

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return fail("Too many attempts. Please try again in a few minutes.", email);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NEWSLETTER_NOTIFY_EMAIL;
  if (!apiKey || !notifyEmail) {
    console.error("[newsletter] RESEND_API_KEY or NEWSLETTER_NOTIFY_EMAIL is not set");
    return fail("Sign-ups are unavailable right now. Please try again later.", email);
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [notifyEmail],
        reply_to: email, // hit Reply in your inbox to write straight back to the subscriber
        subject: `New newsletter sign-up: ${email}`,
        text: `${email} joined The Daily Kinetic on ${new Date().toUTCString()}.`,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      // Resend's error body says what went wrong (bad key, unverified recipient…). No secrets in it.
      console.error(`[newsletter] Resend responded ${res.status}: ${await res.text()}`);
      return fail("Something went wrong. Please try again later.", email);
    }
  } catch (error) {
    console.error("[newsletter] Could not reach Resend:", error);
    return fail("Something went wrong. Please try again later.", email);
  }

  return { status: "success", message: "Thanks! You're on the list." };
}
