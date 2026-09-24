// Render a sign-off board and report tiles, broken images and the save connection.
// node scripts/board-check.mjs <url> <out.png>
import { chromium } from "playwright";
const [url, out] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.screenshot({ path: out, fullPage: true });
console.log(await p.evaluate(() => ({
  title: document.title,
  tiles: document.querySelectorAll(".tile").length,
  brokenImages: [...document.images].filter((i) => i.complete && !i.naturalWidth).length,
  sync: document.getElementById("sync")?.textContent ?? "n/a",
})));
await b.close();
