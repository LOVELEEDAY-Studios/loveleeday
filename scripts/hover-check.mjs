// Hover each film frame on a concept page and report when its preview is ready and fading in.
// node scripts/hover-check.mjs <url>
import { chromium } from "playwright";
const url = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
await p.goto(url, { waitUntil: "networkidle" });
const n = await p.locator(".hv").count();
for (let i = 0; i < Math.min(n, 6); i++) {
  const h = p.locator(".hv").nth(i);
  await h.scrollIntoViewIfNeeded();
  await p.waitForTimeout(1200);
  const pre = await h.evaluate((el) => el.querySelector("video").readyState);
  const t0 = Date.now();
  await h.hover();
  await p.waitForFunction((el) => el.classList.contains("on"), await h.elementHandle(), { timeout: 5000 }).catch(() => {});
  const on = await h.evaluate((el) => el.classList.contains("on"));
  console.log(`frame ${i}: readyState before hover ${pre}, playing+fading ${on ? `after ${Date.now() - t0}ms` : "NEVER"}`);
  await p.mouse.move(0, 0);
  await p.waitForTimeout(700);
}
console.log(`${n} frames, page errors: ${errs.length ? errs.join(" | ") : 0}`);
await b.close();
