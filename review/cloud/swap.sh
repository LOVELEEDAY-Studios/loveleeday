#!/bin/bash
# swap.sh <phase>... : replace the running cloud orchestrator without killing its workers. Adds the old orchestrator's live
# children to ~/llr/orphans (the "join" step waits on them), stops only the old python, then relaunches with the given phases.
set -e
gcloud compute ssh arthur-server --zone=us-east1-b --tunnel-through-iap --command 'P=$(pgrep -f "^python3 .*llr/run.py" || true); [ -n "$P" ] || { echo "no orchestrator running"; exit 0; }; K=$(pgrep -P $P | tr "\n" " "); echo "$(cat ~/llr/orphans 2>/dev/null) $K" > ~/llr/orphans; echo "stopped $P, waiting on: $(cat ~/llr/orphans)"; kill $P' 2>&1 | grep -viE 'numpy|tunnel_performance|tcp_upload|increasing|^warning'
exec bash /Users/danielmay/wt/ll-review-1026/review/cloud/launch.sh "$@"
