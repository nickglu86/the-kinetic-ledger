"use client";

import { useNow } from "@/hooks/useNow";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
// Fallbacks used before hydration: pinned to UTC so server and browser print the same text.
const utcDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const utcClock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
const fullUtc = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });
// After hydration: the visitor's own time zone.
const localDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const localClock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

const formatRelative = (timestamp: number, now: number) => {
  const diff = timestamp - now; // negative = in the past
  const abs = Math.abs(diff);
  if (abs < MINUTE) return "just now";
  if (abs < HOUR) return relative.format(Math.round(diff / MINUTE), "minute");
  if (abs < DAY) return relative.format(Math.round(diff / HOUR), "hour");
  if (abs < 7 * DAY) return relative.format(Math.round(diff / DAY), "day");
  return localDate.format(timestamp);
};

// "14:32" for today, "Nov 9" for older items.
const formatClock = (timestamp: number, now: number) =>
  new Date(timestamp).toDateString() === new Date(now).toDateString()
    ? localClock.format(timestamp)
    : localDate.format(timestamp);

interface TimeAgoProps {
  /** Milliseconds since epoch. */
  timestamp: number;
  /** relative: "5 minutes ago" · clock: "14:32" (today) or "Nov 9". */
  variant?: "relative" | "clock";
  className?: string;
}

// Server HTML shows a UTC date/time; the browser then switches to relative / local time
// and keeps it fresh every minute. The exact UTC time is in the tooltip.
export const TimeAgo = ({ timestamp, variant = "relative", className }: TimeAgoProps) => {
  const now = useNow();
  if (!timestamp) return null;

  let text: string;
  if (now === null) {
    text = variant === "clock" ? utcClock.format(timestamp) : `${utcDate.format(timestamp)}, ${utcClock.format(timestamp)} UTC`;
  } else {
    text = variant === "clock" ? formatClock(timestamp, now) : formatRelative(timestamp, now);
  }

  return (
    <time dateTime={new Date(timestamp).toISOString()} title={`${fullUtc.format(timestamp)} UTC`} className={className}>
      {text}
    </time>
  );
};
