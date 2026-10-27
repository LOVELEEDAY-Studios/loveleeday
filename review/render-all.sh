#!/bin/bash
# render-all.sh <scratch dir> : stage the current branch (after) and the round-2 commit (before), then render serially on arthur-server
# (never two cloud-shot runs at once: they share port 8811 on the server), then the reference sites.
S2="$1"
WT=/Users/danielmay/wt/ll-review-1026
mkdir -p "$S2"/{after,before,refs}
# after = current worktree
"$WT/review/stage-sync.sh" "$S2/stage-after" > /dev/null
# before = round-2 baseline commit, exported into its own git repo so cloud-shot can ship it
if [ ! -d "$S2/stage-before/site" ]; then
  mkdir -p "$S2/stage-before"
  git -C "$WT" archive 718cb70 public/site public/portal/collab public/integrations | tar -x -C "$S2/stage-before"
  mv "$S2/stage-before/public/site" "$S2/stage-before/site"; mv "$S2/stage-before/public/portal" "$S2/stage-before/portal"; mv "$S2/stage-before/public/integrations" "$S2/stage-before/integrations"
  rmdir "$S2/stage-before/public" 2>/dev/null
  (cd "$S2/stage-before" && git init -q && git add -A >/dev/null && git -c user.email=a@b -c user.name=x commit -qm s >/dev/null 2>&1)
fi
for pass in "after 1440" "after 390" "before 1440" "before 390"; do
  set -- $pass
  "$WT/review/shots-one.sh" "$S2/stage-$1" "$S2/$1" "$2" > "$S2/render-$1-$2.log" 2>&1
  echo "done $1 $2" >> "$S2/render-progress.log"
done
cd "$S2" && ~/arthur/scripts/cloud-shot.sh - "$S2/refs" 1440 https://stripe.com/ https://linear.app/ https://ramp.com/ https://www.palantir.com/ https://www.databricks.com/ https://vercel.com/ https://www.snowflake.com/en/ https://www.datadoghq.com/ > "$S2/render-refs.log" 2>&1
echo "done refs" >> "$S2/render-progress.log"
