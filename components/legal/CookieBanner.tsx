"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  setCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) setVisible(true);

    const sync = () => setVisible(!localStorage.getItem(COOKIE_CONSENT_KEY));
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
  }, []);

  const choose = (value: CookieConsent) => {
    setCookieConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-sand-300 bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl text-sm text-bark-muted">
          <p id="cookie-banner-title" className="font-semibold text-forest-dark">
            Cookies et confidentialité
          </p>
          <p id="cookie-banner-desc" className="mt-1">
            Nous utilisons un stockage local pour mémoriser votre panier et, avec votre
            accord, la carte Google Maps sur la page contact. Consultez notre{" "}
            <Link href="/politique-de-confidentialite" className="text-forest hover:underline">
              politique de confidentialité
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-sand-300 px-4 text-sm font-medium text-bark transition-colors hover:bg-sand/50"
          >
            Essentiels uniquement
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-terracotta px-4 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
