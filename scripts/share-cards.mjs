#!/usr/bin/env node
// Share cards: render, record and wire one 1200x630 card per public page, with complete og/twitter/canonical meta.
// Runs in `npm run build` (prebuild) so every Vercel deploy regenerates what changed and fails on what cannot be fixed.
// Docs: docs/SHARE-CARDS.md
//
//   node scripts/share-cards.mjs             render stale/missing cards, rewrite page meta, prune orphans, then verify
//   node scripts/share-cards.mjs --check     change nothing; exit 2 listing every problem (pre-push / CI)
//   node scripts/share-cards.mjs --force     re-render every card regardless of hash
//   node scripts/share-cards.mjs --cards-only  render cards but leave page HTML alone
//   node scripts/share-cards.mjs --root <dir>  operate on another checkout/copy (tests)
import fs from "node:fs";
import path from "node:path";
import { plan, paths, imageUrl, applyMeta, checkCards, manifestPath, fileHash } from "./lib/share-cards.mjs";

const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const ri = argv.indexOf("--root");
const root = path.resolve(ri > -1 ? argv[ri + 1] : path.join(import.meta.dirname, ".."));

async function main() {
  if (flag("--check")) return report(checkCards(root), "check");

  const p = paths(root);
  fs.mkdirSync(p.share, { recursive: true });
  const { manifest, pages } = plan(root);
  const next = {};
  const todo = pages.filter((s) => !s.external && s.photoFile && fs.existsSync(s.photoFile) && s.l1);
  let rendered = 0, skipped = 0;
  let render;
  for (const s of todo) {
    const file = path.join(p.site, s.cardRel);
    // Fresh = same inputs hash AND the file on disk is still exactly what we wrote (a hand-edited or swapped card re-renders).
    const fresh = !flag("--force") && manifest[s.slug]?.hash === s.hash && fs.existsSync(file) && manifest[s.slug]?.file === fileHash(fs.readFileSync(file));
    if (!fresh) {
      render ||= (await import("./lib/share-card-render.mjs")).renderCard;
      fs.writeFileSync(file, await render({ l1: s.l1, l2: s.l2, caption: s.caption, photoFile: s.photoFile, markFile: s.markFile }));
      rendered++;
      console.log(`  rendered ${s.slug}.jpg  ${s.l1}${s.l2 ? " / " + s.l2 : ""}`);
    } else skipped++;
    next[s.slug] = { page: s.rel, hash: s.hash, file: fileHash(fs.readFileSync(file)), headline: [s.l1, s.l2].filter(Boolean).join(" | "), caption: s.caption, photo: s.photo };
  }
  // A page we could not render (no photo, no headline) keeps whatever record it had, so check reports it instead of hiding it.
  const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)));
  const manifestText = JSON.stringify(sorted, null, 2) + "\n";
  if (!fs.existsSync(manifestPath(root)) || fs.readFileSync(manifestPath(root), "utf8") !== manifestText) fs.writeFileSync(manifestPath(root), manifestText);

  const keep = new Set(Object.keys(sorted).map((k) => `${k}.jpg`));
  let pruned = 0;
  for (const f of fs.readdirSync(p.share)) if (f.endsWith(".jpg") && !keep.has(f)) { fs.unlinkSync(path.join(p.share, f)); pruned++; console.log(`  pruned orphan ${f}`); }

  let wired = 0;
  if (!flag("--cards-only")) {
    for (const s of plan(root).pages) {
      const { html, changes } = applyMeta(s.html, s, imageUrl(s, root));
      if (changes.length) { fs.writeFileSync(s.file, html); wired++; console.log(`  meta ${s.rel}: ${changes.join("; ")}`); }
    }
  }
  console.log(`share cards: ${rendered} rendered, ${skipped} unchanged, ${pruned} pruned, ${wired} page head(s) updated`);
  return report(checkCards(root), "verify");
}

function report(problems, what) {
  if (problems.length) {
    console.error(`share cards ${what}: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
    return 2;
  }
  console.log(`share cards ${what}: ${plan(root).pages.length} public page(s) OK (${plan(root).hidden.length} hidden skipped)`);
  return 0;
}

process.exit(await main());
