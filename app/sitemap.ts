import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getFamilies } from "@/lib/families";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const routes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/vente", priority: 0.9, changeFrequency: "monthly" },
    { path: "/catalogue", priority: 0.9, changeFrequency: "weekly" },
    { path: "/pose", priority: 0.9, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
    ...getFamilies().map((family) => ({
      path: `/catalogue?famille=${family.id}`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
