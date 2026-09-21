import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Archivo replaces Instrument Sans and DM Serif Display together.

   The serif display was the agency tell -- an editorial face saying "studio",
   where the brief is "company". And the sans had no variable axis loaded, so
   every headline snapped to the nearest static weight and lost the optical
   tightening a grotesque needs above about 40px.

   Archivo is variable across 100-900 and was drawn for headline performance. It
   is the one decision the whole system rests on: it has to hold at 110px in the
   hero and stay legible at 11px in a table of figures. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans-var",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
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
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full`}
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
