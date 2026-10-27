#!/bin/bash
# render-pass.sh <out dir> <1440|390|refs>... : restage the worktree as "after" and render the named sets serially (never overlaps another cloud-shot run)
S2="$1"; shift
WT=/Users/danielmay/wt/ll-review-1026
"$WT/review/stage-sync.sh" "$S2/stage-after" > /dev/null
for w in "$@"; do
  if [ "$w" = refs ]; then
    mkdir -p "$S2/refs"
    (cd "$S2" && ~/arthur/scripts/cloud-shot.sh - "$S2/refs" 1440 https://stripe.com/ https://linear.app/ https://ramp.com/ https://www.palantir.com/ https://www.databricks.com/ https://vercel.com/ https://www.snowflake.com/en/ https://www.datadoghq.com/ > "$S2/render-refs.log" 2>&1)
  else
    rm -f "$S2/after/"*-"$w".png
    "$WT/review/shots-one.sh" "$S2/stage-after" "$S2/after" "$w" > "$S2/render-after-$w.log" 2>&1
    "$WT/review/render-retry.sh" "$S2" after "$w"
  fi
  echo "pass done $w $(date +%H:%M)" >> "$S2/render-progress.log"
done
