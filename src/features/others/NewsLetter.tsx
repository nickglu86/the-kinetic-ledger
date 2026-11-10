"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/server/actions/newsletter";

const initialState: NewsletterState = { status: "idle", message: "" };

export const NewsLetter = () => {
  // useActionState runs the server action on submit and gives back its result (and a pending flag)
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);
  const done = state.status === "success";

  return (
    <div className="bg-gradient-to-br from-primary-container/20 to-secondary/10 p-6 rounded-xl border border-primary/20 relative overflow-hidden group">
      <div className="relative z-10">
        <h3 className="font-headline text-lg font-bold text-on-surface mb-2">The Daily Kinetic</h3>
        <p className="text-xs text-on-surface-variant mb-4 font-body leading-relaxed">
          High-velocity data and alpha delivered to your inbox every morning. Free for pro traders.
        </p>

        {done ? (
          <p role="status" className="flex items-center gap-2 text-sm font-bold text-primary py-2">
            <span aria-hidden className="material-symbols-outlined text-lg">check_circle</span>
            {state.message}
          </p>
        ) : (
          <form action={formAction} className="flex flex-col gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              defaultValue={state.email}
              placeholder="Enter your email"
              aria-invalid={state.status === "error" || undefined}
              aria-describedby={state.status === "error" ? "newsletter-error" : undefined}
              className="bg-surface-container-lowest/80 border-outline-variant/20 rounded-lg text-sm px-4 py-2 focus:ring-secondary focus:border-secondary"
            />
            {/* Honeypot: hidden from people and screen readers, bots fill it in (see the server action) */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            <button
              type="submit"
              disabled={pending}
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-headline font-bold text-sm py-2 rounded-lg hover:shadow-[0_0_15px_rgba(177,255,206,0.4)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              {pending ? "Joining…" : "Join the Alpha"}
            </button>
            {state.status === "error" && (
              <p id="newsletter-error" role="alert" className="text-xs text-error font-label">
                {state.message}
              </p>
            )}
          </form>
        )}
      </div>
      <span
        aria-hidden
        className="material-symbols-outlined absolute -bottom-6 -right-6 text-9xl opacity-5 group-hover:opacity-10 transition-opacity rotate-12"
      >
        mail
      </span>
    </div>
  );
};
