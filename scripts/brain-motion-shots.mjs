// Screenshot every page that draws the brain at two timestamps ~1.5s apart, log console errors,
// and report whether the canvas pixels changed. Usage: node brain-motion-shots.mjs <base> <outdir> [reduced]
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire("/Users/danielmay/Projects/arthur-launch/package.json");
const { chromium } = require("playwright");
const [base, out, mode] = [process.argv[2], process.argv[3], process.argv[4]];
fs.mkdirSync(out, { recursive: true });
const ext = base.includes("localhost") ? ".html" : "";
const pages = [["home", "/site/index"], ["arthur", "/site/arthur"], ["trust", "/site/trust"], ["talk", "/site/talk"], ["mfg", "/site/industries/manufacturing"], ["property", "/site/industries/property"]];
const live = !base.includes("localhost");
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: mode === "reduced" ? "reduce" : "no-preference" });
for (const [name, p] of pages) {
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(String(e)));
  const url = base + (live ? p.replace("/site/index", "/").replace("/site/", "/") : p + ext);
  await page.goto(url, { waitUntil: "networkidle" });
  const sel = name === "home" || name === "arthur" ? "#brain" : "canvas.brainbg";
  await page.locator(sel).scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const grab = () => page.evaluate((s) => document.querySelector(s).toDataURL().length + ":" + document.querySelector(s).toDataURL().slice(-60), sel);
  const a = await grab();
  await page.locator(sel).screenshot({ path: `${out}/${name}-1.png` });
  await page.waitForTimeout(1500);
  const c = await grab();
  await page.locator(sel).screenshot({ path: `${out}/${name}-2.png` });
  const box = await page.locator(sel).boundingBox();
  console.log(name, "changed:", a !== c, "size:", Math.round(box.width) + "x" + Math.round(box.height), "errors:", JSON.stringify(errs));
  await page.close();
}
await b.close();
