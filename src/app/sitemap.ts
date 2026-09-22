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

  /* The marketing pages are the static site mounted from public/site by the
     rewrites in next.config.ts. They are listed here rather than in a
     public/sitemap.xml because this route handler wins over a public file, so
     a static one would be shadowed and would silently go stale. /about and
     /contact are gone -- they 308 to /studio -- and a redirect does not belong
     in a sitemap. /work and its project pages remain: the new site does not
     replace them. */
  const fixed: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/operating-system`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/arthur`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/studio`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/architecture`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/use-cases`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/municipal-review`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/customer-data`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing-margins`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/operational-intelligence`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/principles`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
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
