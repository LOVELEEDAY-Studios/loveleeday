import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — LOVELEEDAY Studios",
  description: "Tell us what you need. Fixed quote within 24 hours. No commitment, no cost.",
  alternates: {
    canonical: "https://loveleedaystudios.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
