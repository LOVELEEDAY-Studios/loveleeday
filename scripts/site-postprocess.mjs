#!/usr/bin/env node
// Final pass over every static page in public/site, run before each build so no page generator can undo it.
// Idempotent. Four jobs:
//   1. Wrap every mailto link in <!--email_off--> so Cloudflare Email Obfuscation leaves it as a real mailto
//      (otherwise it becomes /cdn-cgi/l/email-protection#..., a 404 for crawlers and anyone without JavaScript).
//   2. Mark the link to the current page with aria-current="page" in the header nav and footer.
//   3. Lazy-load integration logos (src under /logos/).
//   4. Stamp ?v=<content hash> on every shared asset reference, so a CSS/JS change always busts caches.
// Usage: node scripts/site-postprocess.mjs [--check]   (--check exits 2 if any page would change)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve(import.meta.dirname, "..", "public", "site");
const check = process.argv.includes("--check");

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".html") ? [path.join(d, e.name)] : []);

const hashes = new Map();
const assetHash = (rel) => {
  if (!hashes.has(rel)) {
    const f = path.join(root, "assets", rel);
    hashes.set(rel, fs.existsSync(f) ? crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex").slice(0, 10) : null);
  }
  return hashes.get(rel);
};

let changed = 0;
for (const file of walk(root)) {
  const before = fs.readFileSync(file, "utf8");
  let html = before;

  html = html.replace(/(<!--email_off-->)?(<a\b[^>]*href="mailto:[^"]*"[^>]*>[\s\S]*?<\/a>)(<!--\/email_off-->)?/g,
    (_m, _o, a) => `<!--email_off-->${a}<!--/email_off-->`);

  const canon = (html.match(/<link rel="canonical" href="https:\/\/loveleedaystudios\.com([^"]*)"/) || [])[1];
  if (canon !== undefined) {
    const here = canon === "" ? "/" : canon;
    const section = here.match(/^\/(notes|work|industries)\//)?.[1];
    html = html.replace(/<(header|nav|footer)\b[\s\S]*?<\/\1>/g, (block) =>
      block.replace(/<a\b([^>]*?)href="([^"#?]+)"([^>]*)>/g, (tag, pre, href, post) => {
        if (/aria-current=/.test(tag)) tag = tag.replace(/\s*aria-current="page"/, "");
        const target = href.replace(/\/$/, "") || "/";
        const isHere = target === here || (section && target === `/${section}`);
        return isHere ? tag.replace(/>$/, ' aria-current="page">') : tag;
      }));
  }

  html = html.replace(/<img\b(?![^>]*\bloading=)([^>]*\bsrc="[^"]*\/logos\/[^"]*"[^>]*)>/g, '<img loading="lazy" decoding="async"$1>');

  // The stamp is optional in the match: an unstamped reference gets one too. next.config.ts caches these files for a
  // year as immutable, so an unstamped CSS/JS link would otherwise serve a stale file forever after it changes.
  html = html.replace(/(\/site\/assets\/|assets\/)([\w./-]+\.(?:css|js))(?:\?v=[A-Za-z0-9_-]+)?(?=["'])/g, (m, pre, rel) => {
    const h = assetHash(rel);
    return h ? `${pre}${rel}?v=${h}` : m;
  });

  if (html !== before) {
    changed++;
    if (check) console.log("would change", path.relative(root, file));
    else fs.writeFileSync(file, html);
  }
}
console.log(`${check ? "check" : "postprocess"}: ${changed} page(s) ${check ? "out of date" : "updated"}`);
if (check && changed) process.exit(2);
