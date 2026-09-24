import type { Metadata } from "next";

/* The LOVELEEDAY team portal. Private: never indexed, never linked from the public site. */
export const metadata: Metadata = {
  title: { default: "Team", template: "%s · Team" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export default function TeamLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="ll-os min-h-full bg-[#f5f5f7] text-[#1d1d1f]">{children}</div>;
}
