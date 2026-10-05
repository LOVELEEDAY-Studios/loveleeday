// Screenshot the .stage section of each brain page. Usage: node stage-shots.mjs <base> <outdir> [mobile]
import { createRequire } from "node:module";
const require = createRequire("/Users/danielmay/Projects/arthur-launch/package.json");
const { chromium } = require("playwright");
const [base, out, mobile] = process.argv.slice(2);
const live = !base.includes("localhost");
const b = await chromium.launch({ channel: "chrome" });
const page = await b.newPage({ viewport: mobile ? { width: 390, height: 800 } : { width: 1280, height: 800 } });
for (const p of ["trust", "talk", "industries/manufacturing", "industries/property"]) {
  await page.goto(base + (live ? "/" + p : "/site/" + p + ".html"), { waitUntil: "networkidle" });
  const s = page.locator(".stage").last();
  await s.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await s.screenshot({ path: `${out}/stage-${p.replace("/", "-")}${mobile ? "-m" : ""}.png` });
}
await b.close();
