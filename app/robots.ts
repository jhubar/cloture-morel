import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { isProductionSite } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");

  // Hors production (staging/preview, local) : on bloque toute indexation pour
  // éviter que Google référence une version de test.
  if (!isProductionSite()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The quote request page is per-session and has no SEO value.
      disallow: ["/panier", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
