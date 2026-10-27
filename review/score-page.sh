#!/bin/bash
# score-page.sh <round> <page>... : render the named pages at 1440 (queued), strip them, and get an independent Codex score for each.
# Page names as in shot-pages.sh (index, talk, industries/schools, notes/one-company-five-names). Results: review/out/score-<round>/<page>.txt
R="$1"; shift
WT=/Users/danielmay/wt/ll-review-1026
O=$WT/review/out/score-$R; mkdir -p "$O/shots" "$O/strips"
"$WT/review/shot-pages.sh" "$O/shots" 1440 "$@" >/dev/null 2>&1
python3 "$WT/review/page-strip.py" "$O/shots" "$O/strips" --tw=1000 --per=1 >/dev/null
for p in "$@"; do
  P=$(echo "$p" | tr / _)
  IMGS=(); for f in $(ls "$O/strips/$P-1440-p"*.png 2>/dev/null | sort -V); do IMGS+=(-i "$f"); done
  PROMPT="You are an independent senior design and copy reviewer scoring the DESKTOP (1440px) version of one LOVELEEDAY public page against the marketing sites of Stripe, Linear, Ramp, Palantir and Databricks. LOVELEEDAY sells data intelligence (a system called Arthur that reads an organization's existing systems and answers plain questions with sources) to organizations of every kind: schools, cities, retailers, manufacturers, property managers, nonprofits. Attached: the page in order top to bottom, one image per tile, each tile 1500px of page height shown at 1000px wide (69 percent of real size, so 14px text appears about 10px). Source: public/site/$p.html (minified; use grep -o). FIXED BRAND, do not score down: palette white, night #0b0b10, cream #f5f1eb, mist #f5f5f7, ink #1d1d1f, action blue #0066cc; Switzer type with Sentient serif for spoken answers; the 3D particle brain; licensed stock photography. Judge: (1) excitement and brand presence (does it feel like one confident brand, not a template), (2) hero composition, (3) hierarchy and type scale (anything under 14px at desktop is a defect), (4) layout variety and rhythm, (5) proof: does the page show the real product or a concrete answer, (6) consistency with the shared system, (7) COPY: plain language a busy owner understands, specific not generic, no data jargon, no AI-made tells (two-part headlines, tracked caps eyebrows, 01/02 markers, three identical cards, filler like 'unlock' or 'seamless'). Reply ONLY with: SCORE: <integer 1-10, 10 = indistinguishable from the best of those sites>; COPY: <ok or the specific lines to rewrite, quoted, with the rewrite>; BLOCKERS: <list or none>; TOP DEFECTS: up to 5 numbered, each with where and a concrete CSS or markup fix. Terse."
  printf '%s' "$PROMPT" | codex exec --skip-git-repo-check -C "$WT" -s read-only "${IMGS[@]}" - > "$O/$P.txt" 2>&1 &
done
wait
for p in "$@"; do P=$(echo "$p" | tr / _); printf '%-40s %s\n' "$p" "$(grep -o 'SCORE: [0-9][0-9]*' "$O/$P.txt" | tail -1)"; done
