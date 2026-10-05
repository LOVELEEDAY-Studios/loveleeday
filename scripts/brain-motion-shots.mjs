// Screenshot every page that draws the brain at two timestamps ~1.5s apart, log console errors,
// compare canvas pixel stats and computed styles against the landing hero brain.
// Usage: node brain-motion-shots.mjs <base> <outdir> [reduced]
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire("/Users/danielmay/Projects/arthur-launch/package.json");
const { chromium } = require("playwright");
const [base, out, mode] = [process.argv[2], process.argv[3], process.argv[4]];
fs.mkdirSync(out, { recursive: true });
const live = !base.includes("localhost");
const pages = [["home", "/site/index"], ["arthur", "/site/arthur"], ["trust", "/site/trust"], ["talk", "/site/talk"], ["mfg", "/site/industries/manufacturing"], ["property", "/site/industries/property"]];
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: mode === "reduced" ? "reduce" : "no-preference" });
const stats = (sel) => {
  const c = document.querySelector(sel), x = c.getContext("2d"), d = x.getImageData(0, 0, c.width, c.height).data;
  let n = 0, a = 0, r = 0, g = 0, bl = 0;
  for (let i = 0; i < d.length; i += 4) { a += d[i + 3]; if (d[i + 3] > 20) { n++; r += d[i]; g += d[i + 1]; bl += d[i + 2]; } }
  const cs = getComputedStyle(c);
  return { meanAlpha: +(a / (d.length / 4)).toFixed(2), lit: n, r: Math.round(r / n), g: Math.round(g / n), b: Math.round(bl / n),
    opacity: cs.opacity, mask: cs.maskImage, filter: cs.filter, blend: cs.mixBlendMode, css: Math.round(c.getBoundingClientRect().width) + "x" + Math.round(c.getBoundingClientRect().height) };
};
for (const [name, p] of pages) {
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto(base + (live ? p.replace("/site/index", "/").replace("/site/", "/") : p + ".html"), { waitUntil: "networkidle" });
  const sel = name === "home" || name === "arthur" ? "#brain" : "canvas.stage-brain";
  await page.locator(sel).scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const s1 = await page.evaluate(stats, sel);
  await page.locator(sel).screenshot({ path: `${out}/${name}-1.png` });
  await page.waitForTimeout(1500);
  const s2 = await page.evaluate(stats, sel);
  await page.locator(sel).screenshot({ path: `${out}/${name}-2.png` });
  console.log(name, "changed:", JSON.stringify(s1.lit !== s2.lit || s1.r !== s2.r), JSON.stringify(s2), "errors:", JSON.stringify(errs));
  await page.close();
}
await b.close();
