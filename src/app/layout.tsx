import type { Metadata } from "next";
import { DM_Serif_Display, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display-var",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-var",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LOVELEEDAY Studios — Fixed Price. Production Code. Done in Days.",
  description:
    "Boutique development studio. Landing pages, full-stack apps, Stripe integrations, and internal tools — fixed price, shipped in days, not months.",
  alternates: {
    canonical: "https://loveleedaystudios.com",
  },
  openGraph: {
    title: "LOVELEEDAY Studios",
    description: "Boutique dev studio. Fixed price. Done in days.",
    url: "https://loveleedaystudios.com",
    siteName: "LOVELEEDAY Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOVELEEDAY Studios",
    description: "Boutique dev studio. Fixed price. Done in days.",
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
      className={`${dmSerif.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
