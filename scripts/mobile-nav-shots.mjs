// Mobile header check for every study: node scripts/mobile-nav-shots.mjs <outdir> [baseUrl]
// Shoots each /portal/<dir>/index.html at 390px, then opens the menu button if one exists.
import { chromium } from "playwright";
import fs from "fs";
const out = process.argv[2];
const base = process.argv[3] ?? "http://localhost:4598";
const dirs = fs.readdirSync("public/portal").filter((d) => fs.existsSync(`public/portal/${d}/index.html`));
const b = await chromium.launch();
for (const d of dirs) {
  const p = await b.newPage({ viewport: { width: 390, height: 300 }, deviceScaleFactor: 2 });
  await p.goto(`${base}/portal/${d}/index.html`, { waitUntil: "load" });
  await p.screenshot({ path: `${out}/m-${d}.png` });
  const btn = await p.$("nav button:visible, header button:visible");
  if (btn) {
    await p.setViewportSize({ width: 390, height: 560 });
    await btn.click();
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${out}/open-${d}.png` });
  }
  await p.close();
}
await b.close();
console.log(dirs.join(" "));
