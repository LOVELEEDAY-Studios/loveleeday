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
