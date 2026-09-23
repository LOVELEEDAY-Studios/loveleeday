// Screenshot named sections of a page with every lazy image forced to load and reveals shown,
// and report broken images. node scripts/section-shots.mjs <url> <outdir> <width> <selector...>
import { chromium } from "playwright";
const [url, out, width, ...sels] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(width), height: 900 } });
await p.goto(url, { waitUntil: "load" });
await p.evaluate(() => {
  document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
  document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
});
await p.waitForTimeout(2500);
const bad = await p.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
console.log(`broken images: ${bad.length}`, bad.slice(0, 5).join(" "));
for (const s of sels) {
  const el = await p.$(s);
  if (el) await el.screenshot({ path: `${out}/sec-${width}-${s.replace(/[^a-z0-9]/gi, "")}.png` });
}
await p.screenshot({ path: `${out}/full-${width}.png`, fullPage: true });
await b.close();
