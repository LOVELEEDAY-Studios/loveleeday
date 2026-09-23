#!/usr/bin/env node
// unicode-lint — fail a build that contains invisible or look-alike typography
// characters that render as errors: narrow no-break space (U+202F), figure/thin
// spaces, non-breaking hyphen (U+2011), zero-width characters, and a mid-file BOM.
//
// WHY (2026-09-23): an LLM answer on a client proposal wrote the date with narrow
// no-break spaces (U+202F); it rendered as "December312026". lib/text/clean-model-text.js now cleans model
// output at the source; this is the second wall, run before every deploy, so a
// character that slips into content, generated pages or copy never ships.
//
//   node unicode-lint.mjs <path> [path ...]      exit 1 on any finding
// Scans text files (html, css, js, mjs, cjs, ts, tsx, jsx, json, md, mdx, txt, svg,
// py, yml, yaml). Skips node_modules, .next, .git, dist, build and minified bundles
// over 2 MB. A literal U+00A0 is reported as a warning, not an error, since an
// intentional no-break space in copy is legitimate (prefer the &nbsp; entity).
import fs from "node:fs";
import path from "node:path";

// Built from code points: this file must never contain the characters it hunts.
const ch = (c) => String.fromCharCode(c);
const ERRORS = {
  [ch(0x202f)]: "narrow no-break space U+202F",
  [ch(0x2007)]: "figure space U+2007",
  [ch(0x2009)]: "thin space U+2009",
  [ch(0x200a)]: "hair space U+200A",
  [ch(0x2011)]: "non-breaking hyphen U+2011",
  [ch(0x2010)]: "hyphen U+2010",
  [ch(0x200b)]: "zero-width space U+200B",
  [ch(0x200c)]: "zero-width non-joiner U+200C",
  [ch(0x200d)]: "zero-width joiner U+200D",
  [ch(0x2060)]: "word joiner U+2060",
};
const WARN = { [ch(0x00a0)]: "no-break space U+00A0" };
const BOM = ch(0xfeff);
const EXT = new Set([".html", ".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json", ".md", ".mdx", ".txt", ".svg", ".py", ".yml", ".yaml"]);
const SKIP = new Set(["node_modules", ".next", ".git", "dist", "build", ".vercel", "coverage", "venv", ".venv", "site-packages", "__pycache__"]);
const BAD = new RegExp("[" + Object.keys(ERRORS).join("") + Object.keys(WARN).join("") + BOM + "]", "g");

let errors = 0, warnings = 0, files = 0;
function scanFile(file) {
  const st = fs.statSync(file);
  if (st.size > 2 * 1024 * 1024) return;
  const text = fs.readFileSync(file, "utf8");
  files++;
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(BAD)) {
      const c = m[0];
      if (c === BOM && i === 0 && m.index === 0) continue; // a leading BOM is harmless
      const what = ERRORS[c] || WARN[c] || "byte-order mark U+FEFF mid-file";
      const isWarn = c in WARN;
      isWarn ? warnings++ : errors++;
      const ctx = line.slice(Math.max(0, m.index - 30), m.index + 30).replace(BAD, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
      console.log(`${isWarn ? "warn " : "ERROR"} ${file}:${i + 1}:${m.index + 1}  ${what}  …${ctx}…`);
    }
  });
}
function walk(p) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const e of fs.readdirSync(p)) if (!SKIP.has(e)) walk(path.join(p, e));
  } else if (EXT.has(path.extname(p).toLowerCase())) {
    scanFile(p);
  }
}

const targets = process.argv.slice(2);
if (!targets.length) { console.error("usage: unicode-lint.mjs <path> [path ...]"); process.exit(2); }
for (const t of targets) if (fs.existsSync(t)) walk(t);
console.log(`unicode-lint: ${files} files, ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
