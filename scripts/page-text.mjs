// Print a public page's visible text (Chromium-rendered), optionally only the lines matching a regex.
// node scripts/page-text.mjs <url> [regex] [context-lines]
import { chromium } from "playwright";
const [url, re, ctx = "1"] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const res = await p.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch((e) => ({ status: () => `ERR ${e.message}` }));
const lines = (await p.evaluate(() => document.body.innerText)).split("\n").map((l) => l.trim()).filter(Boolean);
console.log(`# ${url} → ${res.status()} · ${lines.length} lines · title: ${await p.title()}`);
if (!re) console.log(lines.join("\n"));
else {
  const rx = new RegExp(re, "i"), c = +ctx;
  lines.forEach((l, i) => { if (rx.test(l)) console.log(lines.slice(Math.max(0, i - c), i + c + 1).join(" ⏎ ")); });
}
await b.close();
