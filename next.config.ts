import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* The portfolio frames are served with a ?v=<content hash> so a regenerated
       image is a new URL and no cache can hand back a stale one. next/image
       refuses a local src carrying a query string unless the pattern is
       declared, which is a sensible default -- an undeclared query is an open
       door to optimising arbitrary paths. Declaring it keeps both properties:
       the hash still busts the cache, and the optimiser still runs. */
    localPatterns: [{ pathname: "/portal/**", search: "" }, { pathname: "/portal/**" }],
  },

  async rewrites() {
    /* The approved marketing site is static HTML under public/site, mounted at
       clean URLs. beforeFiles runs ahead of app routing, so these win over the
       old (site) routes while /work, /p, /portal and /api keep working. The
       cutover reverses by deleting this block. */
    return {
      beforeFiles: [
      { source: "/", destination: "/site/index.html" },
      { source: "/operating-system", destination: "/site/operating-system.html" },
      { source: "/arthur", destination: "/site/arthur.html" },
      { source: "/architecture", destination: "/site/architecture.html" },
      { source: "/use-cases", destination: "/site/use-cases.html" },
      { source: "/industries", destination: "/site/industries.html" },
      { source: "/municipal-review", destination: "/site/municipal-review.html" },
      { source: "/customer-data", destination: "/site/customer-data.html" },
      { source: "/pricing-margins", destination: "/site/pricing-margins.html" },
      { source: "/operational-intelligence", destination: "/site/operational-intelligence.html" },
      { source: "/principles", destination: "/site/principles.html" },
      { source: "/studio", destination: "/site/studio.html" },
      { source: "/privacy", destination: "/site/privacy.html" },
      { source: "/security", destination: "/site/security.html" },
      ],
    };
  },

  async redirects() {
    /* The old marketing routes the new site supersedes. 308 so the move is
       permanent and the link equity follows; /work stays because those are
       real portfolio pages the new site does not replace. */
    return [
      { source: "/about", destination: "/studio", permanent: true },
      { source: "/contact", destination: "/studio", permanent: true },
    ];
  },

  async headers() {
    // Client review pages and the raw deliverable HTML under /public/portal are
    // handed out one link at a time. The Next pages carry a noindex in their
    // metadata; the static files cannot, so the header covers both.
    return [
      {
        /* The site shipped with HSTS from Vercel but nothing stopping another
           origin from framing it, so a client review page could be loaded
           invisibly under a decoy and clicked through. frame-ancestors is the
           modern control; X-Frame-Options covers browsers that ignore CSP.
           Deliberately NOT a full CSP: the marketing pages under public/site
           carry inline <script> and <style>, and a script-src without a nonce
           would break them silently in production. */
        source: "/(.*)",
        headers: [
          /* 'self', not 'none'. The threat is another origin framing a client
             review page under a decoy — 'self' stops that just as completely.
             'none' also blocked the site framing its OWN deliverables, and the
             portal Viewer is an iframe of /portal/<slug>/ served from the same
             origin, so every client preview went blank. Shipped 2026-09-22 in
             b7f15d7 and caught by Daniel opening a portal, not by any check. */
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        /* Listed after the site-wide block so its stricter Referrer-Policy wins.
           Was "/:path(p|portal)/:rest*". Next 16 uses path-to-regexp v8, which
           REMOVED the :param(regex) form — that pattern is not a stricter match,
           it is an invalid one, and every /portal/<slug>/index.html returned 404
           while /site/index.html beside it returned 200. Two plain sources
           instead. See AGENTS.md: this is not the Next you know. */
        source: "/p/:rest*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/portal/:rest*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        // The internal team portal: private, never cached by a shared cache.
        source: "/team/:rest*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
