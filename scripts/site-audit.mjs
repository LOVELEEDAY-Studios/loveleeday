// Quick, measured audit of a public site for a pitch: weight, requests, load, largest assets,
// headings, meta, third-party overlays and banners, and link health on the homepage.
// node scripts/site-audit.mjs <url> [--links]
import { chromium } from "playwright";
const url = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const reqs = [];
p.on("response", async (r) => {
  const h = r.headers();
  reqs.push({ url: r.url(), status: r.status(), type: r.request().resourceType(), bytes: Number(h["content-length"] || 0) });
});
const t0 = Date.now();
await p.goto(url, { waitUntil: "load", timeout: 90000 });
const loadMs = Date.now() - t0;
await p.waitForTimeout(4000);
const nav = await p.evaluate(() => {
  const n = performance.getEntriesByType("navigation")[0];
  const lcp = performance.getEntriesByType("largest-contentful-paint").pop();
  return { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), transfer: n.transferSize };
});
const dom = await p.evaluate(() => ({
  title: document.title,
  desc: document.querySelector('meta[name=description]')?.content || null,
  h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim().slice(0, 60)),
  imgsNoAlt: [...document.images].filter((i) => !i.alt).length,
  imgs: document.images.length,
  videos: [...document.querySelectorAll("video")].map((v) => v.currentSrc || v.src).slice(0, 5),
  iframes: [...document.querySelectorAll("iframe")].map((f) => f.src.slice(0, 80)),
  scripts: [...document.scripts].map((s) => s.src).filter(Boolean).map((s) => new URL(s).host),
  links: [...document.querySelectorAll("a[href]")].map((a) => a.href).filter((h) => h.startsWith("http")),
  navVisible: [...document.querySelectorAll("header a, nav a")].filter((a) => a.offsetParent && a.textContent.trim()).map((a) => a.textContent.trim()).slice(0, 12),
}));
const totals = reqs.reduce((a, r) => ({ n: a.n + 1, bytes: a.bytes + r.bytes }), { n: 0, bytes: 0 });
const byType = {};
for (const r of reqs) byType[r.type] = (byType[r.type] || 0) + r.bytes;
const big = [...reqs].sort((a, c) => c.bytes - a.bytes).slice(0, 6).map((r) => `${(r.bytes / 1e6).toFixed(2)}MB ${r.type} ${r.url.slice(0, 90)}`);
const hosts = [...new Set(reqs.map((r) => new URL(r.url).host))];
console.log(JSON.stringify({ url, loadMs, nav, requests: totals.n, MB: +(totals.bytes / 1e6).toFixed(2), byTypeMB: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, +(v / 1e6).toFixed(2)])), big, thirdPartyHosts: hosts.filter((h) => !h.includes(new URL(url).host.replace("www.", ""))), ...dom, links: dom.links.length }, null, 1));
if (process.argv.includes("--links")) {
  const uniq = [...new Set(dom.links)].slice(0, 80);
  let bad = [];
  for (const l of uniq) {
    try { const r = await ctx.request.get(l, { timeout: 15000 }); if (r.status() >= 400) bad.push(`${r.status()} ${l}`); } catch (e) { bad.push(`ERR ${l}`); }
  }
  console.log(`links checked: ${uniq.length}, broken: ${bad.length}`); bad.forEach((x) => console.log("  " + x));
}
await b.close();
