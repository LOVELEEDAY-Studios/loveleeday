#!/usr/bin/env node
// Inject the one shared header and footer (src/site-chrome/header.html, footer.html) into every static page in
// public/site, plus the chrome.css / chrome.js references. The header used to be copied by hand into each page, so
// any nav change meant editing 30+ files and pages drifted; now a page only needs <header ...></header> and
// <footer ...></footer> placeholders (or the old markup) and the build fills them. Runs before site-postprocess,
// which stamps ?v= hashes and aria-current.
// Usage: node scripts/site-chrome.mjs [--check]   (--check exits 2 and names each page that would change)
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const site = path.join(root, "public/site");
const header = fs.readFileSync(path.join(root, "src/site-chrome/header.html"), "utf8").trim();
const footer = fs.readFileSync(path.join(root, "src/site-chrome/footer.html"), "utf8").trim();
const check = process.argv.includes("--check");

const pages = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === "assets" ? [] : pages(p);
  return e.name.endsWith(".html") ? [p] : [];
});

// Asset refs are matched with or without the ?v= stamp so a re-run after postprocess is a no-op.
const CSS = '<link rel="stylesheet" href="/site/assets/chrome.css?v=0">';
const JS = '<script src="/site/assets/chrome.js?v=0" defer></script>';
// site-postprocess adds aria-current and ?v= stamps afterwards; ignore those so a re-run stays a no-op.
const norm = (h) => h.replace(/ aria-current="page"/g, "").replace(/\?v=[0-9a-f]+/g, "");
const changed = [], skipped = [];
for (const file of pages(site)) {
  const before = fs.readFileSync(file, "utf8");
  if (!/<header\b[^>]*class="nav[^"]*"[^>]*>[\s\S]*?<\/header>/.test(before)) { skipped.push(path.relative(site, file)); continue; }
  let html = before
    .replace(/<header\b[^>]*class="nav[^"]*"[^>]*>[\s\S]*?<\/header>/, header)
    .replace(/<footer\b[^>]*class="site-footer"[^>]*>[\s\S]*?<\/footer>/, footer);
  if (!/\/site\/assets\/chrome\.css/.test(html)) html = html.replace(/(<link[^>]*\/site\/assets\/site\.css[^>]*>)/, `$1${CSS}`);
  if (!/\/site\/assets\/chrome\.js/.test(html)) html = html.replace(/<\/body>/, `${JS}</body>`);
  if (norm(html) !== norm(before)) { changed.push(path.relative(site, file)); if (!check) fs.writeFileSync(file, html); }
}
if (check && changed.length) { console.error(`site-chrome: ${changed.length} page(s) out of date: ${changed.join(", ")}. Run node scripts/site-chrome.mjs`); process.exit(2); }
console.log(`site-chrome: ${check ? "checked" : "updated"} ${changed.length} page(s)${skipped.length ? `; no site header in ${skipped.join(", ")}` : ""}`);
