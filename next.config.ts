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
        source: "/:path(p|portal)/:rest*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;
