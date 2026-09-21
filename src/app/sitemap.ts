import type { MetadataRoute } from "next";
import { operated } from "@/content/work";

/* Generated from the same content module the pages render, so a new project can
   never be live and missing from the sitemap. The hand-written list this
   replaces had drifted: it listed /work/dabney and /work/olldae but not
   /work/kronos or /work/duezy, and it had no entry for the product page at all
   because the product page did not exist yet. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://loveleedaystudios.com";
  const now = new Date();

  const fixed: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/arthur`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  return [
    ...fixed,
    ...operated.map((p) => ({
      url: `${base}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
