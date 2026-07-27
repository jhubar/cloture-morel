"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import {
  COOKIE_CONSENT_EVENT,
  hasMapConsent,
  setCookieConsent,
} from "@/lib/cookie-consent";
import { site } from "@/lib/site";

export function GoogleMapEmbed() {
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setShowMap(hasMapConsent());
    const sync = () => setShowMap(hasMapConsent());
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
  }, []);

  if (!showMap) {
    return (
      <div className="overflow-hidden rounded-card border border-sand-300 bg-sand/30 shadow-card">
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center sm:min-h-64">
          <MapPin className="h-8 w-8 text-forest" aria-hidden="true" />
          <p className="text-sm text-bark-muted">
            La carte Google Maps charge des cookies tiers. Activez-la si vous l&apos;acceptez,
            ou ouvrez notre adresse directement dans Google Maps.
          </p>
          <button
            type="button"
            onClick={() => {
              setCookieConsent("accepted");
              setShowMap(true);
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-terracotta px-5 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark"
          >
            Afficher la carte
          </button>
          <a
            href={site.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-forest hover:underline"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Ouvrir dans Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-sand-300 shadow-card">
      <iframe
        src={site.mapsEmbedUrl}
        className="h-56 w-full border-0 sm:h-64"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Localisation de ${site.name} — ${site.address.street}, ${site.address.city}`}
      />
    </div>
  );
}
