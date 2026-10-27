#!/bin/bash
# status.sh [n] : last n lines of the cloud review run's status, live workers, and the latest scores (read-only).
N=${1:-25}
gcloud compute ssh arthur-server --zone=us-east1-b --tunnel-through-iap --command "tail -$N ~/llr/status.txt; echo; echo workers: \$(pgrep -fc 'claude -p'); echo codex: \$(pgrep -fc 'codex exec'); echo; cd ~/llr/scores 2>/dev/null && grep -o 'SCORE: [0-9]*' *.txt | sed 's/.txt:/  /' | tail -40; tail -3 ~/llr/run.log" 2>&1 | grep -viE 'numpy|tunnel_performance|tcp_upload|increasing|^warning'
