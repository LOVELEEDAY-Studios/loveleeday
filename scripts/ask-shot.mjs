// Type a question into a page's ask box headless, submit, wait for the answer, screenshot the result.
// node scripts/ask-shot.mjs <url> <inputSelector> "<question>" <out.png> [scrollSelector]
import { chromium } from "playwright";

const [url, input, question, out, scrollTo] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
let status = null;
p.on("response", async (r) => { if (r.url().includes("/ask")) status = `${r.status()} ${(await r.text().catch(() => "")).slice(0, 300)}`; });
await p.goto(url, { waitUntil: "load" });
await p.locator(input).first().scrollIntoViewIfNeeded();
await p.locator(input).first().fill(question);
await p.locator(input).first().press("Enter");
const t0 = Date.now();
while (!status && Date.now() - t0 < 60000) await p.waitForTimeout(500);
await p.waitForTimeout(800);
if (scrollTo) await p.locator(scrollTo).first().scrollIntoViewIfNeeded();
await p.screenshot({ path: out });
console.log("ask response:", status ?? "none in 60s", `(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
console.log("page errors:", errors.length ? errors : "none");
await b.close();
