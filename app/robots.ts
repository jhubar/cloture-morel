import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");
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
