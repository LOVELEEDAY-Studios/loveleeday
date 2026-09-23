"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* One beacon per private page view; see src/lib/visits.ts. */
export function ViewBeacon() {
  const path = usePathname();
  useEffect(() => {
    try {
      const body = JSON.stringify({ path });
      if (!navigator.sendBeacon?.("/api/t/pv", new Blob([body], { type: "application/json" }))) {
        fetch("/api/t/pv", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
      }
    } catch {}
  }, [path]);
  return null;
}
