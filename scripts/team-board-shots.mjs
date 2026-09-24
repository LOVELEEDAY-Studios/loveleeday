// Screenshots of every team-portal screen for the sign-off board, desktop (1440×900) and phone (390×900).
// node scripts/team-board-shots.mjs <base-url> <shots-dir>
// Signs a session with TEAM_SESSION_SECRET from .env.local, the same way /api/team/verify does.
import fs from "fs";
import crypto from "crypto";
import { chromium } from "playwright";

const [base, out] = process.argv.slice(2);
const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]));
const email = env.TEAM_EMAILS.split(",")[0].trim();
const body = `${Buffer.from(email).toString("base64url")}.${Date.now() + 3600_000}`;
const session = `${body}.${crypto.createHmac("sha256", env.TEAM_SESSION_SECRET).update(`session:${body}`).digest("base64url")}`;
fs.mkdirSync(out, { recursive: true });

// id, path, signed in?, optional action before the shot
const SCREENS = [
  ["01-sign-in", "/team/login", false],
  ["02-sign-in-code", "/team/login", false, async (p) => {
    await p.fill("#team-email", "team@loveleedaystudios.com"); // not on the team list, so no email is sent
    await p.click("form button");
    await p.waitForSelector("#team-code");
  }],
  ["03-overview", "/team", true],
  ["04-bids", "/team/bids", true],
  ["05-bid-sent", "/team/bids/kalamazoo-county", true],
  ["06-bid-built", "/team/bids/startup-zoo", true],
  ["07-portals", "/team/portals", true],
  ["08-menu", "/team", true, async (p, w) => { if (w < 761) await p.click("button[aria-controls=team-menu]"); }],
];

const b = await chromium.launch();
for (const [suffix, w] of [["d", 1440], ["m", 390]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
  for (const [id, path, auth, act] of SCREENS) {
    if (id === "08-menu" && suffix === "d") continue;
    await ctx.clearCookies();
    if (auth) await ctx.addCookies([{ name: "ll_team_session", value: session, domain: new URL(base).hostname, path: "/", httpOnly: true, secure: true, sameSite: "Lax" }]);
    const p = await ctx.newPage();
    await p.goto(base + path, { waitUntil: "networkidle" });
    if (act) await act(p, w);
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${out}/${id}-${suffix}.png` });
    console.log(`${id}-${suffix} ← ${p.url().replace(base, "")}`);
    await p.close();
  }
  await ctx.close();
}
await b.close();
