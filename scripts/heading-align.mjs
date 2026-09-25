// Left edge of every section eyebrow on a page, at the three standing widths, so a heading that
// drifts off the page column shows up as a number instead of by eye.
//   node scripts/heading-align.mjs <url> [--shot=out-prefix]
import { chromium } from "playwright";

const [url] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const shot = (process.argv.find((a) => a.startsWith("--shot=")) || "").split("=")[1];
const browser = await chromium.launch();
let bad = 0;
for (const [w, h] of [[1440, 900], [1366, 768], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url, { waitUntil: "networkidle" });
  const rows = await page.$$eval("section", (secs) => secs.map((s) => {
    // A section eyebrow is an uppercase label whose own block also holds the section title (h2). Image
    // captions ("Today" on a before/after) and form labels ("Your name") are uppercase too, but carry no title.
    const el = [...s.querySelectorAll("p, span, div")].find((e) => e.children.length === 0 && /^[A-Z][a-z ]+$/.test(e.textContent.trim())
      && getComputedStyle(e).textTransform === "uppercase" && e.parentElement?.querySelector("h2"));
    return el ? { text: el.textContent.trim(), left: Math.round(el.getBoundingClientRect().left) } : null;
  }).filter(Boolean));
  const lefts = new Set(rows.map((r) => r.left));
  if (lefts.size > 1) bad++;
  console.log(`${w}px: ${rows.map((r) => `${r.text}@${r.left}`).join(" · ")}  ${lefts.size > 1 ? "MISALIGNED" : "aligned"}`);
  if (shot) {
    // Viewport shot straddling the section above and the dashboard header: the two left edges side by side.
    await page.$eval("#dashboard", (e, half) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - half), h / 2);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${shot}-${w}.png` });
  }
  await page.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
