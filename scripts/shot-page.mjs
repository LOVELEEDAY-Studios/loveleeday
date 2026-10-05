// Usage: node scripts/shot-page.mjs <url> <outPrefix>   -> <outPrefix>-1440.png and <outPrefix>-390.png (full page)
import { chromium } from "playwright";

const [url, prefix] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const w of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.querySelectorAll("[data-rise]").forEach((e) => e.classList.add("is-in")));
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(w, "horizontal overflow px:", over);
  await page.screenshot({ path: `${prefix}-${w}.png`, fullPage: true });
}
await browser.close();
