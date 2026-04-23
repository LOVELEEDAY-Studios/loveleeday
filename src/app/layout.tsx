import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "LOVELEEDAY Studios — Fixed Price. Production Code. Done in Days.",
  description:
    "Boutique development studio specializing in landing pages, dashboards, Stripe integrations, SEO audits, and full-stack web applications. Fixed-price, fast delivery.",
  alternates: {
    canonical: "https://loveleedaystudios.com",
  },
  openGraph: {
    title: "LOVELEEDAY Studios",
    description: "Boutique dev studio. Fixed-price. Fast delivery.",
    url: "https://loveleedaystudios.com",
    siteName: "LOVELEEDAY Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOVELEEDAY Studios",
    description: "Boutique dev studio. Fixed-price. Fast delivery.",
  },
  metadataBase: new URL("https://loveleedaystudios.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#F3F2EE" }}>
        {children}
      </body>
    </html>
  );
}
