#!/bin/bash
# wait.sh "<regex>" [max-minutes] : poll the cloud run's status every 3 minutes until a NEW line (written after this starts)
# matches, e.g. "commit p2", then print the new lines. Old lines never match, so an earlier ALL DONE cannot end the wait.
RE="$1"; MAX=${2:-600}
G=(gcloud compute ssh arthur-server --zone=us-east1-b --tunnel-through-iap --command)
N0=$("${G[@]}" "wc -l < ~/llr/status.txt" 2>/dev/null | tr -dc 0-9)
for i in $(seq 1 $((MAX / 3))); do
  sleep 180
  S=$("${G[@]}" "tail -n +$((N0 + 1)) ~/llr/status.txt; tail -2 ~/llr/run.log | grep -E 'Traceback|Error' || true" 2>/dev/null)
  if echo "$S" | grep -qE "$RE|Traceback|Error"; then echo "$S" | tail -25; exit 0; fi
done
echo "timeout"; echo "$S" | tail -10
