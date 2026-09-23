import type { Metadata } from "next";
import { Manrope, Mulish, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* System A's type, from typography-mastery.md §"50+ Proven Font Pairings",
   category "SaaS & Modern Tech": a geometric heading over a humanist body.

   Manrope carries display and UI. Mulish carries running text -- a humanist
   face has open apertures and a taller x-height, which is what keeps a 15px
   paragraph readable where a geometric one goes tight and even. IBM Plex Mono
   carries eyebrows, identifiers and every figure.

   Archivo, which the previous direction used for everything, is gone: a single
   neo-grotesque was the right answer for the Swiss system and the wrong one
   here, where the whole point is that heading and body are different voices. */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans-var",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-text-var",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LOVELEEDAY Studios — Intelligence architecture and the software it runs",
    template: "%s — LOVELEEDAY Studios",
  },
  description:
    "LOVELEEDAY Studios builds Arthur, an intelligence system that holds context, resolves entities across sources and carries lineage on every figure — and the production software that runs on top of it.",
  alternates: {
    canonical: "https://loveleedaystudios.com",
  },
  openGraph: {
    title: "LOVELEEDAY Studios",
    description:
      "Intelligence architecture and the software it runs. Every figure carries its source.",
    url: "https://loveleedaystudios.com",
    siteName: "LOVELEEDAY Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOVELEEDAY Studios",
    description:
      "Intelligence architecture and the software it runs. Every figure carries its source.",
  },
  metadataBase: new URL("https://loveleedaystudios.com"),
  /* The same icon set, in the same order, as the static homepage (public/site/*.html),
     so a client page and the landing page show one tab icon. */
  icons: {
    icon: [
      { url: "/site/assets/icon.svg?v=3", type: "image/svg+xml" },
      { url: "/site/assets/favicon-32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/site/assets/favicon-16.png?v=3", sizes: "16x16", type: "image/png" },
    ],
    apple: "/site/assets/apple-icon.png?v=3",
    shortcut: "/favicon.ico?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LOVELEEDAY Studios",
    url: "https://loveleedaystudios.com",
    logo: "https://loveleedaystudios.com/icon.svg",
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@loveleedaystudios.com",
      contactType: "Customer Service",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kalamazoo",
      addressRegion: "MI",
      addressCountry: "US",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LOVELEEDAY Studios",
    url: "https://loveleedaystudios.com",
  };

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${mulish.variable} ${plexMono.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
