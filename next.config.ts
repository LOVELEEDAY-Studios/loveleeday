import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
