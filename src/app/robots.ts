import type { MetadataRoute } from 'next';

/* Client proposals (/p/), studies (/portal/) and the team portal (/team/) must never appear in search.
   They are kept out by noindex, sent both as an X-Robots-Tag header (next.config.ts) and as a meta tag.
   They are deliberately NOT disallowed here: a robots.txt block stops Google reading the page, so it
   never sees the noindex, and a blocked URL that someone links to can still be listed as a bare link.
   Letting the crawler fetch them is what makes the noindex stick. Each also needs its own token. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
    ],
    sitemap: 'https://loveleedaystudios.com/sitemap.xml',
  };
}
