"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;

// One shared clock that ticks every minute while any component is subscribed.
const subscribe = (onTick: () => void) => {
  const id = setInterval(onTick, MINUTE);
  return () => clearInterval(id);
};

// Rounded to the minute so the snapshot stays the same between ticks (React requires a stable snapshot).
const getNow = () => Math.floor(Date.now() / MINUTE) * MINUTE;

// On the server, and during hydration, there is no "now" we can agree on with the browser.
const getServerNow = () => null;

/**
 * Current time in ms, updated every minute. `null` on the server and during hydration,
 * so the first render matches the server HTML; React re-renders with the real time right after.
 */
export const useNow = () => useSyncExternalStore(subscribe, getNow, getServerNow);
