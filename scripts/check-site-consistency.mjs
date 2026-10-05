#!/usr/bin/env node
// Every public page must wear the live site's design system: the same header, the same footer, the same site.css.
// Built after /integrations shipped as a React route on the superseded (site) layout ("Arthur 4.0" strip, second nav row,
// cream ground) while every real page is static HTML under public/site sharing one header and footer. Nothing failed:
// the build passed and the page screenshotted fine in isolation. This makes "does it match the site" a check that can fail.
//
//   node scripts/check-site-consistency.mjs              static: public/site/**/*.html + React routes vs rewrites (prebuild)
//   node scripts/check-site-consistency.mjs --live [url] live: every <loc> in sitemap.xml vs the live homepage
// Exit 2 on any mismatch. Known exceptions live in scripts/site-consistency-allow.json, each with a reason.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const allow = JSON.parse(fs.readFileSync(path.join(root, "scripts/site-consistency-allow.json"), "utf8"));
const allowed = (route) => allow.routes.some((a) => a.reason && (a.route === route || (a.route.endsWith("/*") && route.startsWith(a.route.slice(0, -1)))));
const colors = JSON.parse(fs.readFileSync(path.join(root, "src/content/logo-colors.json"), "utf8"));
const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gis)].map((m) => [m[1].toLowerCase(), m[3]]));
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#[0-9]+|amp|lt|gt|quot|apos|nbsp);/gi, (_, v) => v[0] === "#" ? String.fromCodePoint(parseInt(v.slice(v[1] === "x" ? 2 : 1), v[1] === "x" ? 16 : 10)) : ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[v.toLowerCase()]);

// Old-layout fingerprints: if any of these reach a public page, it is on the superseded design.
const FORBIDDEN = [/Arthur 4\.0/, /About the Ontology/];

const block = (html, tag) => (html.match(new RegExp(`<${tag}[\\s>][\\s\\S]*?</${tag}>`, "i")) || [""])[0];
// Only per-page or per-request noise is normalized away: which nav item is current, cache-busting query strings, and
// Cloudflare's email obfuscation (it re-encodes every address with a fresh key on each response).
const norm = (s) => s
  .replace(/\s+aria-current="[^"]*"/g, "")
  .replace(/\?v=[A-Za-z0-9_-]+/g, "")
  .replace(/\/cdn-cgi\/l\/email-protection#[0-9a-f]+/g, "/cdn-cgi/l/email-protection")
  .replace(/data-cfemail="[0-9a-f]+"/g, 'data-cfemail=""')
  .replace(/<span class="__cf_email__"[^>]*>\[email&#160;protected\]<\/span>/g, "EMAIL")
  .replace(/<a [^>]*href="mailto:[^"]*"[^>]*>[^<]*<\/a>/g, (m) => m.replace(/>[^<]*</, ">EMAIL<"))
  .replace(/\s+/g, " ").trim();
const usesSiteCss = (html) => /<link[^>]+rel="?stylesheet"?[^>]+href="?\/site\/assets\/site\.css/i.test(html);

// Our internal state is not the customer's business. Each of these reached a public page or the client-facing design on
// 2026-10-05 and Daniel had to catch it: vendor-access stages, our own (Dabney) accounts dressed up as client connections,
// and working-notes vocabulary. A public page says what a customer can do today, and nothing about where we are stuck.
// "Coming soon" is allowed: Daniel wants unfinished connectors labelled that way (2026-10-05); the reason why stays private.
const INTERNAL_STATE = [
  /vendor approval/i, /live (at|with) (a )?(customer|client)/i, /approved connectors?/i,
  /not switched on/i, /\bsandbox\b/i, /partner program/i, /\bUNVERIFIED\b/, /developer (app|account)s?\b/i,
  /awaiting (vendor|approval)/i, /pending (vendor )?approval/i,
  /pending (vendor )?review/i, /\bin review\b/i, /\bwaitlist\b/i, /\bbeta access\b/i,
];

// A logo tile is a span whose class list holds ic-logo, or sq together with logo. Every one must carry a real image (no
// initials fallback) and the brand-colour tint, so a connector can never ship as a blank or grey square again.
const logoTiles = (html) => [...html.matchAll(/<span\b([^>]*\bclass="([^"]*)"[^>]*)>([\s\S]*?)<\/span>/g)]
  .filter((m) => /(^|\s)ic-logo(\s|$)/.test(m[2]) || (/(^|\s)sq(\s|$)/.test(m[2]) && /(^|\s)logo(\s|$)/.test(m[2])))
  .map((m) => ({ attrs: m[1], inner: m[3], src: (m[3].match(/<img\b[^>]*\bsrc="([^"]+)"/) || [])[1] || null }));

function checkContent(label, html, problems, srcExists) {
  const content = decode(html.replace(/<style[\s\S]*?<\/style>/gi, " "));
  const text = content.replace(/<[^>]+>/g, " ");
  const joined = content.replace(/<[^>]+>/g, "");
  const attributeText = [...content.matchAll(/\b(?:alt|title|aria-label|data-status)\s*=\s*(["'])(.*?)\1/gi)].map((m) => m[2]).join(" ");
  for (const re of INTERNAL_STATE) if ([text, joined, attributeText, content.match(/<script[^>]*type=["']application\/json["'][^>]*>[\s\S]*?<\/script>/gi)?.join(" ") || ""].some((s) => re.test(s))) problems.push(`${label}: shows internal status wording ${re} to the public`);
  if (/<style\b[^>]*>[\s\S]*?(?:header|footer)\b[^{}]*\{[^}]*?(?:display\s*:\s*none|visibility\s*:\s*hidden|all\s*:\s*unset)[^}]*}/i.test(html)) problems.push(`${label}: inline CSS hides or resets the shared header/footer`);
  for (const t of logoTiles(html)) {
    if (!t.src) { problems.push(`${label}: a logo tile has no image (initials fallback): ${t.inner.replace(/<[^>]+>/g, "").trim().slice(0, 20) || "(empty)"}`); continue; }
    if (srcExists && !srcExists(t.src)) problems.push(`${label}: logo ${t.src} does not exist`);
    if (srcExists && srcExists(t.src) && t.src.toLowerCase().endsWith(".png")) {
      const png = fs.readFileSync(path.join(root, "public", t.src.split(/[?#]/)[0]));
      if (png.length >= 24 && png.toString("ascii", 1, 4) === "PNG" && png.readUInt32BE(16) <= 1 && png.readUInt32BE(20) <= 1) problems.push(`${label}: logo ${t.src} is a 1x1 placeholder`);
    }
    const style = attrs(t.attrs).style || "";
    const expected = colors[t.src.split(/[?#]/)[0].split("/").pop()];
    const declarations = Object.fromEntries(style.split(";").map((part) => part.split(":").map((s) => s.trim().toLowerCase())).filter((pair) => pair.length === 2));
    // The brand colour may sit on the tile itself (tinted square) or fill the whole card that holds it (directory cards).
    const at = html.indexOf(`src="${t.src}"`);
    const cardOpen = at > -1 ? html.slice(html.lastIndexOf("<article", at), at) : "";
    const cardStyle = (cardOpen.match(/^<article\b[^>]*\bstyle="([^"]*)"/) || [])[1] || "";
    const cardFilled = !!expected && new RegExp(`(^|;)\\s*background\\s*:\\s*${expected}\\s*(;|$)`, "i").test(cardStyle);
    if (!cardFilled && (!expected || declarations.background !== `${expected.toLowerCase()}2e` || declarations["border-color"] !== `${expected.toLowerCase()}73`)) problems.push(`${label}: logo tile ${t.src} has no matching brand-colour tint`);
  }
}

function compare(label, html, ref, problems) {
  const h = norm(block(html, "header")), f = norm(block(html, "footer"));
  if (!h) problems.push(`${label}: no <header>`); else if (h !== ref.header) problems.push(`${label}: header differs from the homepage`);
  if (!f) problems.push(`${label}: no <footer>`); else if (f !== ref.footer) problems.push(`${label}: footer differs from the homepage`);
  if (!usesSiteCss(html)) problems.push(`${label}: does not load /site/assets/site.css`);
  for (const re of FORBIDDEN) if (re.test(html)) problems.push(`${label}: carries old-layout marker ${re}`);
}

function staticMode() {
  const problems = [];
  const siteDir = path.join(root, "public/site");
  const index = fs.readFileSync(path.join(siteDir, "index.html"), "utf8");
  const ref = { header: norm(block(index, "header")), footer: norm(block(index, "footer")) };
  if (!ref.header || !ref.footer) { console.error("public/site/index.html has no header/footer to compare against"); process.exit(2); }
  const pages = [];
  (function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) { if (f !== "assets") walk(p); } else if (f.endsWith(".html")) pages.push(p);
    }
  })(siteDir);
  const srcExists = (src) => /^\/[\w./-]+(?:[?#].*)?$/.test(src) && !src.includes("..") && fs.existsSync(path.join(root, "public", decodeURI(src.split(/[?#]/)[0])));
  for (const p of pages) {
    const html = fs.readFileSync(p, "utf8"), label = path.relative(root, p);
    compare(label, html, ref, problems);
    checkContent(label, html, problems, srcExists);
  }

  // One source of truth: every system a public page names as connectable must be Available in the integrations data,
  // so a hand-typed list can never contradict the directory again.
  const dataFile = path.join(root, "src/content/integrations.json");
  if (fs.existsSync(dataFile)) {
    const available = new Set(JSON.parse(fs.readFileSync(dataFile, "utf8")).items.filter((i) => i.status === "Available").map((i) => i.name.toLocaleLowerCase()));
    for (const p of pages) {
      const html = fs.readFileSync(p, "utf8");
      for (const section of html.matchAll(/<div\b[^>]*class="[^"]*\bsys\b[^"]*"[^>]*>([\s\S]*?)(?=<p\b|<\/section|$)/g)) {
        for (const m of section[1].matchAll(/<div\b[^>]*class="[^"]*\bc\b[^"]*"[^>]*>[\s\S]*?<b>([\s\S]*?)<\/b>/g)) {
          const name = decode(m[1].replace(/<[^>]+>/g, "")).trim();
          if (!available.has(name.toLocaleLowerCase())) problems.push(`${path.relative(root, p)}: lists "${name}", which is not Available in src/content/integrations.json`);
        }
      }
    }
  }

  // A React page under src/app/(site) renders the superseded layout unless a rewrite or redirect shadows its route.
  const config = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
  const rewrites = [...config.matchAll(/\{\s*source:\s*["']([^"']+)["']\s*,\s*destination:\s*["']([^"']+)["']/g)].map((m) => ({ source: m[1], destination: m[2] }));
  const sources = new Set(rewrites.filter((r) => r.destination.startsWith("/site/")).map((r) => r.source));
  const mapped = new Set(rewrites.filter((r) => r.destination.startsWith("/site/")).map((r) => r.destination));
  for (const p of pages) {
    const dest = "/" + path.relative(path.join(root, "public"), p).replaceAll(path.sep, "/");
    if (!mapped.has(dest) && !rewrites.some((r) => r.destination.includes(":slug") && dest.startsWith(r.destination.split(":slug")[0]))) problems.push(`${path.relative(root, p)}: static page has no public rewrite`);
  }
  for (const r of rewrites.filter((x) => x.destination.startsWith("/site/") && !x.destination.includes(":"))) if (!fs.existsSync(path.join(root, "public", r.destination))) problems.push(`rewrite ${r.source}: missing ${r.destination}`);
  const appDir = path.join(root, "src/app");
  const routes = [];
  (function walk(d, r) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p, /^\(.+\)$/.test(f) ? r : `${r}/${f.replace(/^\[(.+)\]$/, ":$1")}`);
      else if (/^page\.(tsx|jsx|ts|js)$/.test(f)) routes.push(r || "/");
    }
  })(appDir, "");
  for (const r of routes) {
    if (/^\/(p|portal|team)(\/|$)/.test(r)) continue;
    if (sources.has(r) || allowed(r)) continue;
    if (["/about", "/contact"].includes(r)) continue; // permanent redirects in next.config.ts
    problems.push(`route ${r}: served by a React page without a shared static-site rewrite`);
  }
  return { problems, checked: pages.length + routes.length };
}

async function liveMode(base) {
  const problems = [];
  const get = async (u) => { try { const r = await fetch(u, { redirect: "follow", signal: AbortSignal.timeout(15000) }); return { status: r.status, url: r.url, html: await r.text() }; } catch (e) { return { status: 0, url: u, html: "", error: e.message }; } };
  const home = await get(base + "/");
  if (home.status !== 200) return { problems: [`homepage: ${home.error || `HTTP ${home.status}`}`], checked: 0 };
  const ref = { header: norm(block(home.html, "header")), footer: norm(block(home.html, "footer")) };
  if (!ref.header || !ref.footer) { console.error(`${base}/ has no header/footer to compare against`); process.exit(2); }
  const sitemap = await get(base + "/sitemap.xml");
  if (sitemap.status !== 200) return { problems: [`sitemap.xml: ${sitemap.error || `HTTP ${sitemap.status}`}`], checked: 0 };
  const xml = sitemap.html;
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (!locs.length) { console.error("sitemap.xml listed no URLs: nothing was checked"); process.exit(2); }
  const logoSeen = new Set();
  for (const loc of locs) {
    let u;
    try { u = new URL(loc); } catch { problems.push(`sitemap.xml: invalid URL ${loc}`); continue; }
    if (u.origin !== new URL(base).origin) { problems.push(`sitemap.xml: foreign URL ${loc}`); continue; }
    const route = u.pathname.replace(/\/$/, "") || "/";
    if (allowed(route)) continue;
    const page = await get(base + u.pathname);
    if (page.status !== 200) { problems.push(`${route}: ${page.error || `HTTP ${page.status}`}`); continue; }
    compare(route, page.html, ref, problems);
    checkContent(route, page.html, problems, null);
    for (const t of logoTiles(page.html)) {
      if (!t.src || logoSeen.has(t.src)) continue;
      logoSeen.add(t.src);
      if (!/^\/[\w./-]+(?:[?#].*)?$/.test(t.src) || t.src.includes("..")) { problems.push(`${route}: logo ${t.src} is not a local asset`); continue; }
      const r = await fetch(new URL(t.src, base + "/"), { method: "HEAD", signal: AbortSignal.timeout(15000) }).catch(() => null);
      if (!r || r.status !== 200) problems.push(`${route}: logo ${t.src} returns ${r ? r.status : "no response"}`);
    }
  }
  return { problems, checked: locs.length };
}

const live = process.argv.indexOf("--live");
const { problems, checked } = live > -1 ? await liveMode((process.argv[live + 1] || "https://loveleedaystudios.com").replace(/\/$/, "")) : staticMode();
if (problems.length) {
  console.error(`site consistency: ${problems.length} problem(s) across ${checked} checked\n  ${problems.join("\n  ")}`);
  process.exit(2);
}
console.log(`site consistency: ${checked} checked, all match the homepage header, footer and site.css`);
