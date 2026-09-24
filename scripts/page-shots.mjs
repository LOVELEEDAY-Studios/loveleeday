// Screenshot one local HTML page at desktop and phone, with reveals fired and lazy images loaded,
// and report any sideways overflow.
// node scripts/page-shots.mjs <file.html> <outDir> [prefix]
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
const [file, out, prefix = "page"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, "1440"], [390, 844, "390"]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto("file://" + path.resolve(file), { waitUntil: "load" });
  await p.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/${prefix}-${tag}-top.png` });
  await p.screenshot({ path: `${out}/${prefix}-${tag}-full.png`, fullPage: true });
  const ov = await p.evaluate(() => [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).map((e) => e.tagName + "." + e.className).slice(0, 8));
  console.log(tag, "overflow:", ov.length ? ov.join(" | ") : "none", "height:", await p.evaluate(() => document.body.scrollHeight));
  await p.close();
}
await b.close();
