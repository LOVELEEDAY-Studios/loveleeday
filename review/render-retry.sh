#!/bin/bash
# render-retry.sh <scratch dir> <after|before> <width> : render one set, retrying while the output is incomplete (IAP drops now and then)
S2="$1"; WHICH="$2"; W="$3"
for try in 1 2 3 4; do
  n=$(ls "$S2/$WHICH" 2>/dev/null | grep -c -- "-$W.png")
  [ "$n" -ge 35 ] && break
  /Users/danielmay/wt/ll-review-1026/review/shots-one.sh "$S2/stage-$WHICH" "$S2/$WHICH" "$W" > "$S2/retry-$WHICH-$W-$try.log" 2>&1
done
echo "retry done $WHICH $W $(ls "$S2/$WHICH" | grep -c -- "-$W.png")" >> "$S2/render-progress.log"
