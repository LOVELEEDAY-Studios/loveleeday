#!/bin/bash
# score-ref.sh <round> <full-page-1440.png>... : calibrate the Codex judge by scoring reference sites (stripe, linear...) with the same prompt and tiling as score-page.sh
R="$1"; shift
WT=/Users/danielmay/wt/ll-review-1026
O=$WT/review/out/score-$R; mkdir -p "$O/shots" "$O/strips"
for f in "$@"; do cp "$f" "$O/shots/"; done
python3 "$WT/review/page-strip.py" "$O/shots" "$O/strips" --tw=1000 --per=1 >/dev/null
for f in "$@"; do
  P=$(basename "$f" .png)
  IMGS=(); for s in $(ls "$O/strips/$P-p"*.png 2>/dev/null | sort -V | head -8); do IMGS+=(-i "$s"); done
  PROMPT="You are an independent senior design and copy reviewer scoring the DESKTOP (1440px) version of one B2B company's public home page against the marketing sites of Stripe, Linear, Ramp, Palantir and Databricks. Attached: the page in order top to bottom, one image per tile, each tile 1500px of page height shown at 1000px wide (69 percent of real size, so 14px text appears about 10px). Judge: (1) excitement and brand presence, (2) hero composition, (3) hierarchy and type scale (anything under 14px at desktop is a defect), (4) layout variety and rhythm, (5) proof: does the page show the real product or a concrete answer, (6) consistency, (7) COPY: plain language, specific not generic, no AI-made tells. Reply ONLY with: SCORE: <integer 1-10, 10 = indistinguishable from the best of those sites>; BLOCKERS: <list or none>; TOP DEFECTS: up to 5. Terse."
  printf '%s' "$PROMPT" | codex exec --skip-git-repo-check -C "$WT" -s read-only "${IMGS[@]}" - > "$O/$P.txt" 2>&1 &
done
wait
for f in "$@"; do P=$(basename "$f" .png); printf '%-40s %s\n' "$P" "$(grep -o 'SCORE: [0-9][0-9]*' "$O/$P.txt" | tail -1)"; done
