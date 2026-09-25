// Click through an interactive page's tabs headless and screenshot each state (local Chromium, never
// a person's browser). node scripts/tab-shots.mjs <url> <outDir> "Tab A,Tab B,..." [clickSelectorAfterEachTab]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [url, out, tabs, extra] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url, { waitUntil: "networkidle" });
for (const [i, t] of tabs.split(",").entries()) {
  await page.getByRole("button", { name: t, exact: true }).first().click();
  await page.waitForTimeout(Number(process.env.WAIT || 500));
  if (extra) {
    const [label, sel] = extra.split("=>");
    if (label === t) { await page.locator(sel).first().click(); await page.waitForTimeout(400); }
  }
  const f = path.join(out, `tab-${i}-${t.replace(/\W+/g, "-").toLowerCase()}.png`);
  await page.screenshot({ path: f, fullPage: false });
  console.log(t, "->", f);
}
console.log("page errors:", errors.length ? errors : "none");
await browser.close();
