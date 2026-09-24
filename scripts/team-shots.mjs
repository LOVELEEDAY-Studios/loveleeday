// Render the team portal signed in, at 1440, 1366×768 and 390, full page, and report layout faults.
// node scripts/team-shots.mjs <base-url> <outdir> [paths comma-separated]
// Signs a session with TEAM_SESSION_SECRET from .env.local, the same way /api/team/verify does.
import fs from "fs";
import crypto from "crypto";
import { chromium } from "playwright";

const [base, out, list] = process.argv.slice(2);
const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]));
const email = env.TEAM_EMAILS.split(",")[0].trim();
const body = `${Buffer.from(email).toString("base64url")}.${Date.now() + 3600_000}`;
const sig = crypto.createHmac("sha256", env.TEAM_SESSION_SECRET).update(`session:${body}`).digest("base64url");
const paths = (list ?? "/team,/team/bids,/team/bids/kalamazoo-county,/team/portals,/team/board,/team/login").split(",");
fs.mkdirSync(out, { recursive: true });

const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [1366, 768], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const host = new URL(base).hostname;
  if (!/login/.test(paths.join())) {}
  await ctx.addCookies([{ name: "ll_team_session", value: `${body}.${sig}`, domain: host, path: "/", httpOnly: true, secure: base.startsWith("https"), sameSite: "Lax" }]);
  for (const p of paths) {
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(e.message));
    if (p === "/team/login") await ctx.clearCookies();
    const r = await page.goto(base + p, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(p.includes("board") ? 4000 : 300);
    const m = await page.evaluate(() => ({
      hscroll: document.documentElement.scrollWidth > innerWidth + 1,
      menuWord: [...document.querySelectorAll("button,a")].some((el) => el.offsetParent && el.textContent.trim() === "Menu"),
      h1: document.querySelector("h1")?.textContent.slice(0, 60),
    }));
    const f = `${out}/${p.replace(/\//g, "_") || "root"}-${w}.png`;
    await page.screenshot({ path: f, fullPage: true });
    console.log(`${w} ${p} → ${r.status()} ${page.url().replace(base, "")} · hscroll ${m.hscroll} · menuWord ${m.menuWord} · errors ${errs.length} · "${m.h1}"`);
    await page.close();
    if (p === "/team/login") await ctx.addCookies([{ name: "ll_team_session", value: `${body}.${sig}`, domain: host, path: "/", httpOnly: true, secure: base.startsWith("https"), sameSite: "Lax" }]);
  }
  await ctx.close();
}
await b.close();
