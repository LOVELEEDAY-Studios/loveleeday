// Mobile header check for every study: node scripts/mobile-nav-shots.mjs <outdir> [baseUrl]
// Shoots each /portal/<dir>/index.html at 390px (and opens the menu if there is one), then fails
// on the three defects that shipped on 2026-09-23: a text "Menu" button instead of a hamburger,
// nav links spilling at phone width, and horizontal scroll. Serve public/ first:
//   python3 -m http.server 4598 -d public
import { chromium } from "playwright";
import fs from "fs";
const out = process.argv[2];
const base = process.argv[3] ?? "http://localhost:4598";
const dirs = fs.readdirSync("public/portal").filter((d) => fs.existsSync(`public/portal/${d}/index.html`));
const b = await chromium.launch();
const fails = [];
for (const d of dirs) {
  const p = await b.newPage({ viewport: { width: 390, height: 300 }, deviceScaleFactor: 2 });
  await p.goto(`${base}/portal/${d}/index.html`, { waitUntil: "load" });
  await p.screenshot({ path: `${out}/m-${d}.png` });
  const r = await p.evaluate(() => {
    const nav = document.querySelector("nav") ?? document.querySelector("header");
    const visible = (e) => { const s = getComputedStyle(e), q = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && q.width > 0 && q.height > 0; };
    const textMenu = [...(nav?.querySelectorAll("button,a") ?? [])].some((e) => visible(e) && /^\s*menu\s*$/i.test(e.textContent ?? ""));
    const links = [...(nav?.querySelectorAll("a,button") ?? [])].filter(visible).map((e) => e.getBoundingClientRect());
    const spill = links.some((q) => q.right > innerWidth + 1) || links.some((a, i) => links.some((c, j) => j > i && a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom));
    return { textMenu, spill, hscroll: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  if (r.textMenu) fails.push(`${d}: mobile nav uses the word "Menu" — use a hamburger icon`);
  if (r.spill) fails.push(`${d}: nav items overlap or run off-screen at 390px`);
  if (r.hscroll) fails.push(`${d}: horizontal scroll at 390px`);
  const btn = await p.$("nav button:visible, header button:visible");
  if (btn) {
    await p.setViewportSize({ width: 390, height: 560 });
    await btn.click();
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${out}/open-${d}.png` });
  }
  await p.close();
}
await b.close();
console.log(`${dirs.length} studies checked`);
if (fails.length) { console.log(fails.join("\n")); process.exit(1); }
