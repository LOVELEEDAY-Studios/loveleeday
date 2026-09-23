// Renders official statute pages that plain fetch cannot read (JS single-page
// apps, Cloudflare-fronted sites, PDFs) and prints an excerpt around each
// citation token, so a registry item is upgraded to verified only after its
// actual text has been read.
//
//   PW_BIN=<chrome> node scripts/render-statute.mjs targets.json > excerpts.txt
//   targets.json: { "<item id>": { "urls": [...], "find": ["45.48.040", "notify"] } }
import { chromium } from "playwright";
import { execFileSync } from "child_process";
import fs from "fs";

const targets = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const browser = await chromium.launch({ executablePath: process.env.PW_BIN, args: ["--disable-blink-features=AutomationControlled"] });
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 } });

function pdfText(url) {
  try {
    const buf = execFileSync("curl", ["-sL", "--max-time", "30", "-A", UA, url], { maxBuffer: 64 << 20 });
    if (buf.subarray(0, 4).toString() !== "%PDF") return null;
    return execFileSync("pdftotext", ["-q", "-layout", "-", "-"], { input: buf, maxBuffer: 64 << 20 }).toString();
  } catch { return null; }
}

for (const [id, { urls, find }] of Object.entries(targets)) {
  let done = false;
  for (const url of urls) {
    let text = /\.pdf($|\?)/i.test(url) ? pdfText(url) : null;
    if (text === null) {
      const page = await ctx.newPage();
      try {
        const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        await page.waitForTimeout(6000);
        text = await page.evaluate(() => document.body?.innerText || "");
        if (res && res.status() >= 400) text = `[HTTP ${res.status()}] ` + text.slice(0, 200);
      } catch (e) { text = `[ERROR ${e.message.split("\n")[0]}]`; }
      await page.close();
    }
    text = (text || "").replace(/\s+/g, " ");
    const hits = find.filter((f) => text.toLowerCase().includes(f.toLowerCase()));
    console.log(`\n===== ${id}\nURL ${url}\nLEN ${text.length}  HITS ${JSON.stringify(hits)} / ${JSON.stringify(find)}`);
    if (hits.length) {
      const i = text.toLowerCase().indexOf(hits[0].toLowerCase());
      console.log("EXCERPT " + text.slice(Math.max(0, i - 100), i + 1100));
      done = true;
      break;
    } else {
      console.log("HEAD " + text.slice(0, 300));
    }
  }
  if (!done) console.log(`RESULT ${id}: NOT CONFIRMED`);
}
await browser.close();
