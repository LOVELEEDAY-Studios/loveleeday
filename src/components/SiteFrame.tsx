"use client";

import { usePathname } from "next/navigation";

/* The header is fixed so the homepage hero can run to the top of the viewport
   and the bar can sit transparently on it. Every other page therefore needs the
   bar's height back as padding, or its first heading hides underneath.

   Reading the route here rather than in the layout keeps the layout a server
   component: children are passed through untouched and never re-render on the
   client. */
export function SiteFrame({ children }: { children: React.ReactNode }) {
  const home = usePathname() === "/";
  return <div className={`flex-1 ${home ? "" : "pt-[62px]"}`}>{children}</div>;
}
