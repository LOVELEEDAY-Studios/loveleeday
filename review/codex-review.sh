#!/bin/bash
# codex-review.sh <stripdir> <outdir> <page> ...   independent Codex score per page (images + source), runs on the ChatGPT subscription
STRIPS="$1"; OUT="$2"; shift 2
mkdir -p "$OUT"
REPO=/Users/danielmay/wt/ll-review-1026
for P in "$@"; do
  IMGS=()
  for f in "$STRIPS/$P-1440-p1.png" "$STRIPS/$P-390-p1.png"; do [ -f "$f" ] && IMGS+=(-i "$f"); done
  SRC="public/site/$(echo "$P" | sed 's#_#/#').html"
  [ -f "$REPO/$SRC" ] || SRC="public/site/$P.html"
  PROMPT="You are an independent senior design reviewer for the LOVELEEDAY public website (navy/teal/cream palette, Manrope, real photography; palette is fixed). Bar: Stripe/Linear/Ramp-grade, billion-dollar company. The attached images are strips of ONE page: *-1440-pN are desktop (3 tiles left to right = top to bottom, 640px wide each), *-390-pN are phone (4 tiles left to right). Source file: $SRC (minified, use grep -o). Review layout/grid, spacing rhythm, type hierarchy and widows, clipped text, phone stacking, photo quality and relevance and consistent warm grade, share card, AI-made tells (stock line icons, icon pills, STEP 1 eyebrows, three-icon-card rows, emojis). Reply ONLY with: SCORE: <1-10 integer, 9 = ready for a billion-dollar company>; BLOCKERS: <list or none>; DEFECTS: numbered, each with where, what, concrete fix. Terse."
  printf '%s' "$PROMPT" | codex exec --skip-git-repo-check -C "$REPO" -s read-only "${IMGS[@]}" - > "$OUT/$P.txt" 2>&1
  echo "done $P" >> "$OUT/_progress.log"
done
