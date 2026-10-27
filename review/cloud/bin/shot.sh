#!/bin/bash
# shot.sh <width> <page>... : full-page renders of ~/llr/repo pages (served on :8850) into ~/llr/shots/<width>/<page, / as _>-<width>.png
W="$1"; shift
O=~/llr/shots/$W; mkdir -p "$O"; T=$(mktemp -d)
U=(); for p in "$@"; do U+=("http://localhost:8850/site/$p.html"); done
(cd ~/render && node ~/llr/bin/shot.cjs "$T" "$W" "${U[@]}" 2>/dev/null)
for p in "$@"; do
  P=$(echo "$p" | tr / _)
  f="$T/localhost_8850_site_$P-$W.png"
  if [ -f "$f" ]; then mv "$f" "$O/$P-$W.png"; echo "$O/$P-$W.png"; else echo "FAILED $p $W" >&2; fi
done
rm -rf "$T"
