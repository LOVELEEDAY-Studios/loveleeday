#!/bin/bash
# codex-desktop.sh <stripdir> <outdir> <page> : independent Codex score of ONE page's 1440 render (run through xargs -P6)
STRIPS="$1"; OUT="$2"; P="$3"
mkdir -p "$OUT"
REPO=/Users/danielmay/wt/ll-review-1026
IMGS=()
for f in "$STRIPS/$P-1440-p1.png" "$STRIPS/$P-1440-p2.png"; do [ -f "$f" ] && IMGS+=(-i "$f"); done
SRC="public/site/$(echo "$P" | sed 's#_#/#').html"
[ -f "$REPO/$SRC" ] || SRC="public/site/$P.html"
PROMPT="You are an independent senior design reviewer scoring the DESKTOP (1440px) layout of one LOVELEEDAY public page against the bar of Stripe, Linear, Ramp, Palantir and Databricks marketing sites (billion-dollar B2B data company). Attached: strips of the page, 3 tiles left to right = top to bottom, each tile 1500px of page height at 640px wide. Source: $SRC (minified; grep -o). The brand palette (ink, cream, action blue) and the Switzer/Sentient type are fixed, so do not score them down for existing. Judge: hero composition, grid and alignment, whitespace rhythm, type hierarchy, photography crop and grade, proof visuals, variety of section layouts, AI-made tells (icon pills, STEP eyebrows, three identical cards, gradients). Reply ONLY with: SCORE: <integer 1-10, 9 = ready for a billion-dollar company>; BLOCKERS: <list or none>; TOP DEFECTS: up to 5 numbered, each with where and a concrete CSS or markup fix. Terse."
printf '%s' "$PROMPT" | codex exec --skip-git-repo-check -C "$REPO" -s read-only "${IMGS[@]}" - > "$OUT/$P.txt" 2>&1
echo "done $P" >> "$OUT/_progress.log"
