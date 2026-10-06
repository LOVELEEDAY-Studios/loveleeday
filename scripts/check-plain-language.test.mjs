// node --test scripts/check-plain-language.test.mjs
// Copies public/site and VOICE.md to a temp root, plants one duplicate question per source independently, and asserts
// the checker fails naming both owners. A repeat within one page must pass.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CHECK = path.join(REPO, "scripts/check-plain-language.mjs");
// A question that exists on exactly one real page (talk.html .tv3-q): every plant below duplicates it.
const TALK_Q = "If two big customers pay late, will we have enough cash at the end of next month?";

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "voice-test-"));
  fs.cpSync(path.join(REPO, "public/site"), path.join(root, "public/site"), { recursive: true });
  fs.copyFileSync(path.join(REPO, "VOICE.md"), path.join(root, "VOICE.md"));
  return root;
}
const run = (root, ...extra) => spawnSync("node", [CHECK, "--root", root, "--no-portal", ...extra], { encoding: "utf8" });
const edit = (file, fn) => fs.writeFileSync(file, fn(fs.readFileSync(file, "utf8")));
const fails = (r, ...owners) => {
  assert.equal(r.status, 1, r.stdout + r.stderr);
  for (const o of owners) assert.ok(r.stderr.includes(o), `missing owner ${o} in:\n${r.stderr}`);
  assert.ok(r.stderr.includes("talk.html") || owners.some((o) => r.stderr.includes(o)));
};

test("clean copy passes", () => {
  const r = run(fixture());
  assert.equal(r.status, 0, r.stderr);
});

test("duplicate in HTML (.eq) fails naming both pages", () => {
  const root = fixture();
  edit(path.join(root, "public/site/contact.html"), (s) => s.replace('<div class="cv3-card">', `<div class="eq"><span>${TALK_Q}</span></div><div class="cv3-card">`));
  fails(run(root), "contact.html", "talk.html");
});

test("duplicate in a data-q attribute fails", () => {
  const root = fixture();
  edit(path.join(root, "public/site/studio.html"), (s) => s.replace("<body", `<body data-q="${TALK_Q}"`));
  fails(run(root), "studio.html", "talk.html");
});

test("duplicate in site.js questions (owner index.html) fails", () => {
  const root = fixture();
  edit(path.join(root, "public/site/assets/site.js"), (s) => s.replace("const questions=[{q:'Who is HES, across our systems?'", `const questions=[{q:'${TALK_Q}'`));
  fails(run(root), "index.html", "talk.html");
});

test("duplicate in site.js questionsOS (owner operating-system.html) fails", () => {
  const root = fixture();
  edit(path.join(root, "public/site/assets/site.js"), (s) => s.replace("{q:'Which ordinance actually applies today?'", `{q:'${TALK_Q}'`));
  fails(run(root), "operating-system.html", "talk.html");
});

test("duplicate in a rotation JSON q fails", () => {
  const root = fixture();
  edit(path.join(root, "public/site/studio.html"), (s) => s.replace("</body>", `<script type="application/json">{"q": "${TALK_Q}"}</script></body>`));
  fails(run(root), "studio.html", "talk.html");
});

test("portal example missing from the registry fails; present in registry but equal to a site question fails naming both", () => {
  const root = fixture();
  const portal = path.join(root, "portal");
  fs.mkdirSync(path.join(portal, "app/client/login"), { recursive: true });
  fs.writeFileSync(path.join(portal, "app/client/login/page.tsx"), 'const LOGIN_EXAMPLE = {\n  ask: "Which vendors renew in March?",\n  answer: "x",\n};\n');
  let r = spawnSync("node", [CHECK, "--root", root, "--portal", portal], { encoding: "utf8" });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stderr, /LOGIN_EXAMPLE .*missing from the VOICE\.md/);
  edit(path.join(root, "VOICE.md"), (s) => s.replace(/^- portal sign-in: .*$/m, `- portal sign-in: ${TALK_Q}`));
  fs.writeFileSync(path.join(portal, "app/client/login/page.tsx"), `const LOGIN_EXAMPLE = {\n  ask: "${TALK_Q}",\n  answer: "x",\n};\n`);
  r = spawnSync("node", [CHECK, "--root", root, "--portal", portal], { encoding: "utf8" });
  assert.equal(r.status, 1, r.stdout);
  assert.ok(r.stderr.includes("portal sign-in (VOICE.md)") && r.stderr.includes("talk.html"), r.stderr);
});

test("multi-line carousel duplicate (nested objects, ']' inside a string) fails naming both owners", () => {
  const root = fixture();
  edit(path.join(root, "public/site/assets/site.js"), (s) => s.replace("const questionsOS=[", `const questionsOS=[\n  {\n    tags: ["a]b", {x: [1, 2]}],\n    q: '${TALK_Q}',\n  },\n`));
  fails(run(root), "operating-system.html", "talk.html");
});

test("a duplicate after a multi-line first entry of questions is still seen", () => {
  const root = fixture();
  edit(path.join(root, "public/site/assets/site.js"), (s) => s.replace("const questions=[", `const questions=[\n  {\n    note: "has ] bracket",\n    nest: [[1],[2]],\n    q: 'Placeholder first entry that is unique here?',\n  },\n  {\n    q: '${TALK_Q}'\n  },\n`));
  fails(run(root), "index.html", "talk.html");
});

test("missing portal source fails unless --no-portal is passed", () => {
  const root = fixture();
  const bad = spawnSync("node", [CHECK, "--root", root, "--portal", path.join(root, "nope")], { encoding: "utf8" });
  assert.equal(bad.status, 1, bad.stdout);
  assert.match(bad.stderr, /source not found .*--no-portal/);
  const ok = spawnSync("node", [CHECK, "--root", root, "--portal", path.join(root, "nope"), "--no-portal"], { encoding: "utf8" });
  assert.equal(ok.status, 0, ok.stderr);
});

test("a repeat within one page passes", () => {
  const root = fixture();
  edit(path.join(root, "public/site/talk.html"), (s) => s.replace("</body>", `<div class="eq"><span>${TALK_Q}</span></div></body>`));
  const r = run(root);
  assert.equal(r.status, 0, r.stderr);
});

test("portal file present but constant missing fails (not skipped)", () => {
  const root = fixture();
  const portal = path.join(root, "portal");
  fs.mkdirSync(path.join(portal, "app/client/login"), { recursive: true });
  fs.writeFileSync(path.join(portal, "app/client/login/page.tsx"), "export default function Page() { return null }\n");
  const r = spawnSync("node", [CHECK, "--root", root, "--portal", portal], { encoding: "utf8" });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stderr, /LOGIN_EXAMPLE .*not found/);
});

test("real portal main object shape is read and matches the registry", () => {
  const r = spawnSync("node", [CHECK, "--inventory"], { encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /portal sign-in \(VOICE\.md\)/);
  assert.doesNotMatch(r.stdout, /not found|missing from/);
  assert.equal(spawnSync("node", [CHECK], { encoding: "utf8" }).status, 0);
});

test("--inventory lists owners and exits 0", () => {
  const r = run(fixture(), "--inventory");
  assert.equal(r.status, 0);
  assert.match(r.stdout, /talk\.html\s+html \.tv3-q/);
  assert.match(r.stdout, /index\.html\s+assets\/site\.js questions/);
});
