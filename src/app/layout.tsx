import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LOVELEEDAY Studios — We Build What You Need, Fast",
  description:
    "Boutique development studio specializing in landing pages, dashboards, Stripe integrations, SEO audits, and full-stack web applications. Fixed-price, fast delivery.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#F3F2EE" }}>
        {children}
      </body>
    </html>
  );
}
