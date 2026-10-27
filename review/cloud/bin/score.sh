#!/bin/bash
# score.sh <page>... : render each page at 1440 and 390, cut the renders into tiles, and get an independent Codex score for
# design and components against ~/llr/repo/STANDARD.md. Result per page: ~/llr/scores/<page, / as _>.txt. Prints "page SCORE: n".
cd ~/llr || exit 1
mkdir -p scores strips
bin/shot.sh 1440 "$@" >/dev/null
bin/shot.sh 390 "$@" >/dev/null
for p in "$@"; do
  P=$(echo "$p" | tr / _)
  S=strips/$P; rm -rf "$S"; mkdir -p "$S/d" "$S/m" "$S/o"
  cp "shots/1440/$P-1440.png" "$S/d/" 2>/dev/null; cp "shots/390/$P-390.png" "$S/m/" 2>/dev/null
  python3 bin/strip.py "$S/d" "$S/o" --tw=1000 --per=1 >/dev/null
  python3 bin/strip.py "$S/m" "$S/o" --per=4 >/dev/null
  IMGS=(); for f in $(ls "$S/o/"*-1440-p*.png "$S/o/"*-390-p*.png 2>/dev/null | sort -V); do IMGS+=(-i "$f"); done
  PROMPT="You are the strictest senior product designer reviewing one page of the LOVELEEDAY marketing site before launch. Read ~/llr/repo/STANDARD.md and ~/llr/repo/HERO-STANDARD.md first: they are the bar. Source: site/$p.html with site/assets/brand.css and site/assets/pages/$P.css (minified; use grep -o). Attached in order: the DESKTOP page (1440px wide, each tile 1500px of page height shown at 1000px) and then the PHONE page (390px, tiles of 1700px laid side by side). Score DESIGN AND COMPONENTS together: composition, alignment to the wrap, spacing rhythm, type scale, component consistency with the standard (hero type, screen frame, answer card, logo chips, buttons, row lists), image quality and cropping, phone layout, and copy that reads as written by a careful person (any AI-sounding phrase is a defect). 10 means a Stripe or Linear design lead would ship this page unchanged on both desktop and phone with zero defects; any remaining defect caps the score at 9; a broken layout, unreadable text or a second photo layer in a hero caps it at 6. Reply ONLY with: SCORE: <integer 1-10>; BLOCKERS: <list or none>; DEFECTS: numbered, every one you can see, each with desktop or phone, where on the page, and the concrete CSS or markup fix; COPY: <ok or each line to rewrite, quoted, with the rewrite>. Terse."
  printf '%s' "$PROMPT" | timeout 900 codex exec --skip-git-repo-check -C ~/llr/repo -s read-only "${IMGS[@]}" - > "scores/$P.txt" 2>&1 &
  while [ "$(jobs -r | wc -l)" -ge 4 ]; do sleep 2; done
done
wait
for p in "$@"; do P=$(echo "$p" | tr / _); printf '%-46s %s\n' "$p" "$(grep -o 'SCORE: [0-9][0-9]*' "scores/$P.txt" | tail -1)"; done
