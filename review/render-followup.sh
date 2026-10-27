#!/bin/bash
# render-followup.sh <scratch dir> : wait for render-all.sh to exit, then fill in whatever sets are still incomplete
S2="$1"
R=/Users/danielmay/wt/ll-review-1026/review
while pgrep -f render-all.sh > /dev/null; do read -t 5 <> <(:); done
$R/render-retry.sh "$S2" after 1440
$R/render-retry.sh "$S2" after 390
$R/render-retry.sh "$S2" before 1440
$R/render-retry.sh "$S2" before 390
echo "followup finished" >> "$S2/render-progress.log"
