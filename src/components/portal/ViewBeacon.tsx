"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const send = (body: string) => {
  if (!navigator.sendBeacon?.("/api/t/pv", new Blob([body], { type: "application/json" }))) {
    fetch("/api/t/pv", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
  }
};

/* One beacon per private page view, then the visible time on page each time the tab is hidden or closed
   (the report keeps the largest). Only visible time counts, so a tab left open in the background does not
   read as an hour of reading. See src/lib/visits.ts. */
export function ViewBeacon() {
  const path = usePathname();
  useEffect(() => {
    let visit = "";
    let visibleMs = 0;
    let since = document.visibilityState === "visible" ? performance.now() : 0;
    try {
      visit = crypto.randomUUID();
      send(JSON.stringify({ path, visit }));
    } catch {}
    const flush = () => {
      if (since) visibleMs += performance.now() - since;
      since = 0;
      if (visit && visibleMs >= 1000) {
        try { send(JSON.stringify({ path, visit, dwell_ms: Math.round(visibleMs) })); } catch {}
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else since = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      flush();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, [path]);
  return null;
}
