import type { MetadataRoute } from "next";
import { operated } from "@/content/work";
import notes from "@/content/notes.json";

/* Generated from the same content module the pages render, so a new project can
   never be live and missing from the sitemap. The hand-written list this
   replaces had drifted: it listed /work/dabney and /work/olldae but not
   /work/kronos or /work/duezy, and it had no entry for the product page at all
   because the product page did not exist yet. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://loveleedaystudios.com";

  /* The marketing pages are the static site mounted from public/site by the
     rewrites in next.config.ts. They are listed here rather than in a
     public/sitemap.xml because this route handler wins over a public file, so
     a static one would be shadowed and would silently go stale. /about and
     /contact are gone -- they 308 to /studio -- and a redirect does not belong
     in a sitemap. /work and its project pages are static too (scripts/build-work-pages.mjs); they are
     listed here from the same content module. */
  const fixed: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/operating-system`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/arthur`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/studio`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/architecture`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/use-cases`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/industries`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/municipal-review`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/customer-data`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing-margins`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/how-it-works`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/build`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/operational-intelligence`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/principles`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/integrations`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/industries/manufacturing`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/industries/property`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/trust`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/talk`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/snapshot`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/notes`, changeFrequency: "weekly", priority: 0.8 },
    /* Written by scripts/build-notes.py from the same source the pages are built from. */
    ...notes.map((n) => ({ url: `${base}/notes/${n.slug}`, lastModified: new Date(n.date), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];

  return [
    ...fixed,
    ...operated.map((p) => ({
      url: `${base}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
