# Wiring plan for ai-tell-check.mjs

Status: NOT wired anywhere. Nothing below has been applied to the live repo, the deploy skill, any git hook or any guard. This is the exact list of hook points to apply once Daniel approves. Verified facts are marked; the rest are proposals.

## What the checker is (verified by running it on 2026-10-11)

File: `concepts/ai-tells-2026-10-11/ai-tell-check.mjs` (a copy also sits at `~/arthur/scripts/ai-tell-check.mjs`). Measures 18 tells, prints each as ok or FAIL against a threshold, and exits 2 if any is over. Two modes, and they do not measure the same things:

- Static: `node ai-tell-check.mjs --dir public/site`. Reads the HTML and CSS files, needs no browser, runs in about a second. It cannot see computed styles, so it under-reports type-scale, weight, font-stack and card-uniformity tells.
- Computed: `node ai-tell-check.mjs --urls-file urls.txt`. Loads each URL in the headless cloud browser and reads computed styles. This is the accurate mode. It depends on `~/arthur/lib/arthur-browser/client.js`, so it only runs on this Mac, not in Vercel or CI.

Baselines on 2026-10-11:

- Computed, 35 live pages (crawl/baseline.txt): exit 2, 9 tells over.
- Static, `public/site` in this checkout (34 pages): exit 2, 4 tells over (the former defaultHexHits finding is withdrawn): twoPartHeadlineShare 0.28 (0.15), allCapsLabelsPerPage 40 (4), gradientsPerPage 38 (1), singleWeightShare 1.00 (0.90).

Because both modes fail today, a blocking gate would stop every deploy. Roll it out in two steps: warn first, block once the live site is under threshold.

## Hook points

### 1. `npm run check:site` (this repo, package.json line 16)

Today: `node scripts/check-plain-language.mjs && node scripts/check-site-consistency.mjs && node scripts/build-integrations-page.mjs --check`.

Proposed:

1. Copy the checker to `scripts/ai-tell-check.mjs` (it has no repo dependencies in static mode).
2. Add `"check:tells": "node scripts/ai-tell-check.mjs --dir public/site"`.
3. Phase 1 (warn): append `; node scripts/ai-tell-check.mjs --dir public/site || true` to `check:site` so the list prints on every run and nothing blocks.
4. Phase 2 (block): change to `&& node scripts/ai-tell-check.mjs --dir public/site` once the redesign lands and static mode exits 0.
5. Add `"check:tells:live": "node scripts/ai-tell-check.mjs --urls-file scripts/ai-tell-urls.txt"` beside `check:site:live` for the accurate computed run. Local only.

### 2. The deploy skill (`~/.claude/skills/loveleeday-render-check-deploy/SKILL.md`, "Site" section)

- Step 2 (gates): add `node scripts/ai-tell-check.mjs --dir public/site` after `npm run -s check:site` (becomes redundant once hook 1 phase 2 is on; keep it until then).
- Step 5 (post-push probe): after the unique-string probe, run the computed mode against the changed pages: `node scripts/ai-tell-check.mjs https://loveleedaystudios.com/<page>`. Exit 2 means the page shipped with a tell. Report it; do not roll back for a tell alone.
- Add one line to the per-screen rubric: "No tell over threshold in the changed page (ai-tell-check)."

### 3. Pre-deploy gate (`scripts/git-hooks/pre-push`)

A push to main deploys on Vercel, and this hook already blocks bad share cards. After the share-cards block add:

```
if [ "$AI_TELLS_SKIP" != "1" ] && [ -f "$ROOT/scripts/ai-tell-check.mjs" ]; then
  node "$ROOT/scripts/ai-tell-check.mjs" --dir "$ROOT/public/site" --quiet || { echo "pre-push: blocked by ai-tell-check. Bypass: AI_TELLS_SKIP=1 git push" >&2; exit 1; }
fi
```

Enable only in phase 2. Phase 1 uses `|| true` and prints the list. Run `npm run hooks:install` once per clone for the hook to take effect (existing note in the hook file).

### 4. Design gate (`~/.claude/skills/design-gate/SKILL.md`, section 1, deterministic)

Add `node scripts/ai-tell-check.mjs --dir <folder>` next to `brand-gate.mjs` so any mockup folder is checked before Daniel sees it. This is where the "after" mockups in this folder would be run first (static mode; see the note below).

### 5. Optional: a guard rule

An action-guard rule that blocks `git push origin HEAD:main` in this repo while `check:tells` exits 2. Not recommended in phase 1: the pre-push hook already does this at the right moment and the guard would duplicate it. Location of the guard registry was not checked.

## Known gaps to close before phase 2

- The thresholds are judgment calls grounded in the sources in EXPERTISE.md, not measurements from a study. Daniel should review `DEFAULTS` in the checker.
- Static mode cannot read computed styles and does not run the card-uniformity or icon metrics. The portal (authenticated) was not crawled; it is covered by screenshots only.
- The checker no longer has a color check (defaultHexHits and the Apple-palette counts were deleted 2026-10-11). The LOVELEEDAY palette (#1d1d1f ink, #f5f5f7 surface, #f5f1eb cream, #0066cc blue, the dark sections) is the owner's brand, set by Daniel, and is out of scope for this review. See concepts/BRAND-COLORS.md. Color is never counted as a tell.
- Gradients: static mode counts 38 per page on the current CSS (the decorative brain and hero glows). The threshold of 1 may be too strict for a brand that uses a gradient on purpose; decide when the design lands.
- No ratchet: a failing site can only be gated all-or-nothing. A baseline file with per-tell ceilings that may only go down would let the gate go live before the redesign finishes. Small addition to the checker, not built.
