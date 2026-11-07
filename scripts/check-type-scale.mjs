#!/usr/bin/env node
// Fails the build if a kit stylesheet sets a font size outside the --t-* scale in ob.css.
// Site chrome is exempt because it is stamped from the home page; em sizes are relative to a scale step.
import { readFileSync } from "node:fs";

const DIR = "public/site/assets/ob/";
const FILES = ["ob.css", "scene.css", "widgets.css", "arthur.css"];
const CHROME = /^\s*(\.nav|\.pnl|\.mm|\.foot|\.cta-bar|\.skip|\.ll-mark|\.brand)/;
const OK = /^(var\(--t-[a-z0-9]+\)|[\d.]+em|inherit)$/;
const bad = [];
for (const f of FILES) {
  const css = readFileSync(DIR + f, "utf8");
  for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (CHROME.test(sel.split(",")[0])) continue;
    for (const [, v] of body.matchAll(/(?<![-\w])font-size:([^;}]+)/g)) {
      if (!OK.test(v.trim())) bad.push(`${f}: ${sel.trim().slice(0, 50)} -> ${v.trim()}`);
    }
  }
}
if (bad.length) {
  console.error(`type scale: ${bad.length} size(s) outside the scale\n` + bad.join("\n"));
  process.exit(1);
}
console.log(`type scale: ${FILES.length} stylesheets checked, every size is on the scale`);
