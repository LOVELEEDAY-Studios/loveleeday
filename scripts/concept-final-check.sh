#!/bin/bash
# Regenerate the Elemental concepts, render every concept plus a full-page desktop/phone pass of
# one concept, run the mobile-nav check, and write contact sheets to <outdir>.
# bash scripts/concept-final-check.sh <outdir> [concept-file-stem]
OUT=$1; C=${2:-c1-periodic}; cd ~/Projects/loveleeday || exit 1
mkdir -p "$OUT/review"
node scripts/elemental-concepts.mjs >/dev/null
python3 -m http.server 4598 -d public >/dev/null 2>&1 & SRV=$!; sleep 1
node scripts/concept-shots.mjs http://localhost:4598/portal/elemental/concepts public/portal/elemental/concepts "$OUT" >/dev/null
for w in 1440 390; do node scripts/section-shots.mjs "http://localhost:4598/portal/elemental/concepts/$C.html" "$OUT/review" $w | tail -1; done
node scripts/mobile-nav-shots.mjs "$OUT/shots" | tail -1
kill $SRV
python3 - "$OUT/review" <<'PY'
import sys
from PIL import Image
d=sys.argv[1]
for f,n in [('full-1440.png',3),('full-390.png',5)]:
  im=Image.open(f'{d}/{f}').convert('RGB'); w,h=im.size; seg=(h+n-1)//n
  g=Image.new('RGB',(w*n,seg),'white')
  for i in range(n): g.paste(im.crop((0,i*seg,w,min(h,(i+1)*seg))),(i*w,0))
  g.thumbnail((2400,2400)); g.save(f"{d}/final-{f.replace('full-','').replace('.png','.jpg')}",quality=85)
print('sheets written')
PY
