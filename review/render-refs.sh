#!/bin/bash
# render-refs.sh <out dir> : the eight reference sites at 1440, one cloud-shot call per site so one slow site cannot stall the rest
S2="$1"; mkdir -p "$S2/refs"
for u in https://stripe.com/ https://linear.app/ https://ramp.com/ https://www.palantir.com/ https://www.databricks.com/ https://vercel.com/ https://www.snowflake.com/en/ https://www.datadoghq.com/; do
  [ -n "$(ls "$S2/refs" | grep -i "$(echo "$u" | sed 's#https://##; s#www\.##; s#[./].*##')")" ] && continue
  (cd "$S2" && perl -e 'alarm 150; exec @ARGV' ~/arthur/scripts/cloud-shot.sh - "$S2/refs" 1440 "$u" >> "$S2/render-refs.log" 2>&1)
  echo "ref $u rc=$?" >> "$S2/render-progress.log"
done
echo "refs finished" >> "$S2/render-progress.log"
