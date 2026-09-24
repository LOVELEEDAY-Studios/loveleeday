"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/team", label: "Overview" },
  { href: "/team/bids", label: "Bids" },
  { href: "/team/portals", label: "Client portals" },
  { href: "/team/board", label: "Board" },
];

/* Top bar for the team portal. Below 760px the links fold into a hamburger, never the word "Menu". */
export function TeamNav({ email }: { email: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (h: string) => (h === "/team" ? path === "/team" : path.startsWith(h));

  async function signOut() {
    await fetch("/api/team/verify", { method: "DELETE" });
    location.href = "/team/login";
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#e4e5e9] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6 max-[640px]:px-4">
        <a href="/team" className="flex items-center gap-2 text-[13px] font-[650] tracking-[0.12em]" aria-label="LOVELEEDAY team, overview">
          <span
            aria-hidden="true"
            className="inline-block h-5 w-5 bg-current"
            style={{ WebkitMask: "url(/site/assets/mark-mask.png) center/contain no-repeat", mask: "url(/site/assets/mark-mask.png) center/contain no-repeat" }}
          />
          LOVELEEDAY
          <span className="ml-1 rounded-full bg-[#1d1d1f] px-2 py-0.5 text-[10px] font-semibold tracking-[0.1em] text-white">TEAM</span>
        </a>
        <nav aria-label="Team" className="max-[760px]:hidden">
          <ul className="flex items-center gap-1 text-[14px]">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active(l.href) ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 ${active(l.href) ? "bg-[#f0f1f4] font-medium text-[#1d1d1f]" : "text-[#5b606a] hover:text-[#1d1d1f]"}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3 max-[760px]:hidden">
          <span className="text-[12px] text-[#8c8e95]">{email}</span>
          <button onClick={signOut} className="rounded-full border border-[#dcdfe6] px-3 py-1.5 text-[12px] hover:border-[#1d1d1f]">
            Sign out
          </button>
        </div>
        <button
          className="relative hidden h-11 w-11 min-[761px]:hidden max-[760px]:block"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="team-menu"
          onClick={() => setOpen(!open)}
        >
          <span className={`absolute left-[11px] top-[15px] h-[2px] w-[22px] bg-[#1d1d1f] transition ${open ? "top-[21px] rotate-45" : ""}`} />
          <span className={`absolute left-[11px] top-[21px] h-[2px] w-[22px] bg-[#1d1d1f] transition ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-[11px] top-[27px] h-[2px] w-[22px] bg-[#1d1d1f] transition ${open ? "top-[21px] -rotate-45" : ""}`} />
        </button>
      </div>
      {open && (
        <div id="team-menu" className="border-t border-[#e4e5e9] bg-white px-4 pb-5 min-[761px]:hidden">
          <ul className="grid">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} aria-current={active(l.href) ? "page" : undefined} className="block border-b border-[#eef0f3] py-3.5 text-[16px]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between text-[13px] text-[#8c8e95]">
            <span>{email}</span>
            <button onClick={signOut} className="rounded-full border border-[#dcdfe6] px-3 py-1.5 text-[#1d1d1f]">
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
