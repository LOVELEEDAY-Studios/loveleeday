#!/bin/bash
# pull.sh : bring the cloud run's results to the Mac: ~/llr/out/site.patch, every report, and the scores, into review/out/cloud/.
# The patch paths are site/, portal/, integrations/ (relative to the worktree's public/), so apply with: git apply --directory=public
set -e
O=/Users/danielmay/wt/ll-review-1026/review/out/cloud; rm -rf "$O"; mkdir -p "$O"
gcloud compute ssh arthur-server --zone=us-east1-b --tunnel-through-iap --command 'cd ~/llr && tar czf - out/site.patch reports scores status.txt' 2>/dev/null | tar xzf - -C "$O"
ls -la "$O/out/site.patch" | awk '{print "patch", $5, "bytes"}'; ls "$O/reports" | tr '\n' ' '; echo
