import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brief Received — LOVELEEDAY Studios",
  description: "Your project brief has been received. We'll respond within 24 hours.",
  alternates: {
    canonical: "https://loveleedaystudios.com/contact/success",
  },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
