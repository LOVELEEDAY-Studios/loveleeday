import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Script from "next/script";

/* The home page is the delivered LOVELEEDAY build, rendered verbatim.

   It is injected rather than hand-ported to JSX on purpose. The delivered
   markup is 16KB across ten sections; retyping it as JSX would introduce
   differences from the thing that was designed and signed off, and every one
   of those differences would be mine rather than the designer's. Reading the
   file at build time keeps the page byte-identical to what was delivered, and
   the only edit made to it is rewriting six asset paths to /studio/.

   Its stylesheet and behaviour load as ordinary assets from /public/studio/,
   so the build stays the source of truth. If a new build arrives, replace
   src/content/home-delivered.html and the two files in public/studio/. */
export const metadata: Metadata = {
  title: "LOVELEEDAY Studios — Arthur Intelligence & Software",
  description:
    "See the question. Build the answer. Intelligence that connects what you know to what you can do next. Arthur brings persistent context, model reasoning and tool execution into a software architecture for meaningful work.",
  alternates: { canonical: "https://loveleedaystudios.com" },
  openGraph: {
    title: "LOVELEEDAY Studios — See the question. Build the answer.",
    description:
      "Intelligence that connects what you know to what you can do next.",
    url: "https://loveleedaystudios.com",
    siteName: "LOVELEEDAY Studios",
    type: "website",
  },
};

export default function Home() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/content/home-delivered.html"),
    "utf8",
  );
  return (
    <>
      {/* The delivered CSS asks for font-weight 750 and letter-spacing -0.065em
          at 98px, which is a variable grotesque's job. It shipped with
          font-family:Arial as the only stack, so every headline on the studio's
          own site was rendering in Arial at a snapped 700. Inter is the face the
          build was drawn for; loading it is the difference between the design
          and an approximation of it. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400..800&family=IBM+Plex+Mono:wght@400;500&display=swap"
      />
      <link rel="stylesheet" href="/studio/style.css" />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Script src="/studio/app.js" strategy="afterInteractive" />
    </>
  );
}
