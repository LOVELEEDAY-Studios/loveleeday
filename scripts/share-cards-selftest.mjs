#!/usr/bin/env node
// Proves the share-card system can FAIL, in a throwaway copy of public/site (never touches the real tree):
//   1. a clean build is stable (second run renders nothing and rewrites nothing)
//   2. a brand-new page with only <title>, a description and an h1 gets a card and complete meta, and passes
//   3. each way a page can be wrong is caught: deleted card, reused card, wrong size, over-long title/description,
//      stale card (headline changed), missing og tags, canonical mismatch, orphan card, hidden page skipped
// Usage: node scripts/share-cards-selftest.mjs        exit 2 on the first claim that does not hold
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const REPO = path.resolve(import.meta.dirname, "..");
const T = fs.mkdtempSync(path.join(os.tmpdir(), "share-cards-"));
fs.mkdirSync(path.join(T, "public"), { recursive: true });
fs.cpSync(path.join(REPO, "public/site"), path.join(T, "public/site"), { recursive: true, filter: (s) => !s.includes("/assets/concepts") });
fs.copyFileSync(path.join(REPO, "next.config.ts"), path.join(T, "next.config.ts"));
const site = (...p) => path.join(T, "public/site", ...p);

const run = (...args) => {
  try { return { code: 0, out: execFileSync("node", [path.join(REPO, "scripts/share-cards.mjs"), "--root", T, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) }; }
  catch (e) { return { code: e.status, out: String(e.stdout) + String(e.stderr) }; }
};
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : "  " + detail}`); if (!cond) failed++; };
const page = (title, desc, h1) => `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${desc}"><title>${title}</title></head><body><main><h1>${h1}</h1></main></body></html>`;
const DESC = "A plain description that is long enough to be a real one and short enough for any platform.";

let r = run();
ok("1a. full build on the real pages passes", r.code === 0, r.out.slice(-600));
r = run();
ok("1b. second build is a no-op (0 rendered, 0 head updates)", r.code === 0 && /0 rendered/.test(r.out) && /0 page head/.test(r.out), r.out);
ok("1c. --check passes after build", run("--check").code === 0);

// 2. a new page, with nothing but title, description and h1; and the rewrite that serves it is a /work/:slug style catch-all
fs.mkdirSync(site("work"), { recursive: true });
fs.writeFileSync(site("work/newcase.html"), page("New case — LOVELEEDAY", DESC, "A new case.<br><span>Done right.</span>"));
ok("2a. --check FAILS for a new page with no card yet", run("--check").code === 2);
r = run();
ok("2b. build gives the new page a card", r.code === 0 && fs.existsSync(site("assets/share/work-newcase.jpg")), r.out.slice(-500));
const head = fs.readFileSync(site("work/newcase.html"), "utf8");
for (const need of ['rel="canonical" href="https://loveleedaystudios.com/work/newcase"', 'og:url" content="https://loveleedaystudios.com/work/newcase"', 'og:image" content="https://loveleedaystudios.com/site/assets/share/work-newcase.jpg?v=', 'og:image:width" content="1200"', 'og:image:height" content="630"', 'og:image:alt" content="LOVELEEDAY', 'twitter:card" content="summary_large_image"', 'og:title" content="New case — LOVELEEDAY"', 'twitter:image" content="https://'])
  ok(`2c. new page head has ${need.slice(0, 40)}`, head.includes(need));
ok("2d. new page passes --check", run("--check").code === 0);
const dim = fs.readFileSync(site("assets/share/work-newcase.jpg"));
ok("2e. card is a 1200x630 JPEG", dim[0] === 0xff && dim.includes(Buffer.from([0x04, 0xb0])) && dim.length > 20000);

// 3. every failure mode
const card = site("assets/share/trust.jpg");
const keep = fs.readFileSync(card);
fs.unlinkSync(card);
r = run("--check");
ok("3a. deleting trust.jpg fails the check, naming the file", r.code === 2 && /trust\.html: og:image file does not exist/.test(r.out), r.out);
fs.writeFileSync(card, keep);
ok("3a'. restored, passes again", run("--check").code === 0);

const arch = fs.readFileSync(site("architecture.html"), "utf8");
fs.writeFileSync(site("architecture.html"), arch.replace(/share\/architecture\.jpg\?v=\w+/g, "share/trust.jpg"));
r = run("--check");
ok("3b. a page pointing at another page's card fails (the work/trust bug)", r.code === 2 && /architecture\.html: og:image is the card of trust\.html/.test(r.out), r.out);
fs.writeFileSync(site("architecture.html"), arch);

fs.writeFileSync(site("assets/share/arthur.jpg"), fs.readFileSync(site("assets/hero.jpg")));
r = run("--check");
ok("3c. wrong-size image fails", r.code === 2 && /arthur\.jpg is \d+x\d+, must be 1200x630/.test(r.out), r.out);
run();

const t = fs.readFileSync(site("privacy.html"), "utf8");
fs.writeFileSync(site("privacy.html"), t.replace(/<title>[^<]*/, "<title>" + "Long ".repeat(20)));
r = run("--check");
ok("3d. over-long title fails", r.code === 2 && /privacy\.html: title is \d+ chars, over the 70/.test(r.out), r.out);
fs.writeFileSync(site("privacy.html"), t.replace(/(<meta name="description" content=")[^"]*/, "$1" + "word ".repeat(60)));
r = run("--check");
ok("3e. over-long description fails", r.code === 2 && /privacy\.html: description is \d+ chars, over the 200/.test(r.out), r.out);
fs.writeFileSync(site("privacy.html"), t);

fs.writeFileSync(site("terms.html"), fs.readFileSync(site("terms.html"), "utf8").replace(/<h1([^>]*)>[\s\S]*?<\/h1>/, "<h1$1>A different headline.<br><span>Entirely.</span></h1>"));
r = run("--check");
ok("3f. changing a page's headline makes its card stale", r.code === 2 && /terms\.html: card is out of date/.test(r.out), r.out);
run();
ok("3f'. build refreshes it", run("--check").code === 0);

fs.writeFileSync(site("studio.html"), fs.readFileSync(site("studio.html"), "utf8").replace(/<meta property="og:[a-z:]+"[^>]*>/g, "").replace(/<meta name="twitter:[a-z:]+"[^>]*>/g, ""));
r = run("--check");
ok("3g. a page stripped of its og/twitter tags fails", r.code === 2 && /studio\.html: share meta out of date: .*og:title missing/.test(r.out), r.out);
r = run();
ok("3g'. build restores them", r.code === 0 && run("--check").code === 0);

fs.writeFileSync(site("assets/share/ghost.jpg"), keep);
r = run("--check");
ok("3h. an orphan card fails", r.code === 2 && /ghost\.jpg: orphan/.test(r.out), r.out);
r = run();
ok("3h'. build prunes it", r.code === 0 && !fs.existsSync(site("assets/share/ghost.jpg")));

fs.writeFileSync(site("work/olldae.html"), page("Olldae — LOVELEEDAY", DESC, "Hidden."));
r = run();
ok("3i. a page whose route is redirected (hidden) is skipped, no card made", r.code === 0 && !fs.existsSync(site("assets/share/work-olldae.jpg")) && !/work-olldae/.test(r.out), r.out);

fs.writeFileSync(site("work/nophoto.html"), page("No photo — LOVELEEDAY", DESC, "No photo.<br>Anywhere.").replace("</head>", '<meta name="card:photo" content="does-not-exist.jpg"></head>'));
r = run("--check");
ok("3j. a card:photo that does not exist fails", r.code === 2 && /card photo not found: does-not-exist\.jpg/.test(r.out), r.out);
fs.unlinkSync(site("work/nophoto.html"));

fs.writeFileSync(site("work/override.html"), page("Override — LOVELEEDAY", DESC, "Ignored h1").replace("</head>", '<meta name="card:headline" content="Custom top|Custom tan"><meta name="card:photo" content="industry-retail.jpg"></head>'));
r = run();
const man = JSON.parse(fs.readFileSync(site("assets/share/manifest.json"), "utf8"))["work-override"];
ok("3k. card:headline / card:photo overrides are honoured", r.code === 0 && man && man.headline === "Custom top | Custom tan" && man.photo === "industry-retail.jpg", JSON.stringify(man));

fs.rmSync(T, { recursive: true, force: true });
console.log(failed ? `\nshare-cards selftest: ${failed} FAILED` : "\nshare-cards selftest: all claims hold");
process.exit(failed ? 2 : 0);
