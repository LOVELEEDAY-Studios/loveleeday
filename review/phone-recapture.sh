#!/bin/bash
# phone-recapture.sh : recapture every portal phone shot at a true 390 width (scrollbar hidden), one Steel session at a time.
# Full-page captures land in $OUT/<name>-390.png; crop them into public/site/assets/portal afterwards.
OUT=${1:-/tmp/phone-recapture}; mkdir -p "$OUT"
run() { perl -e 'alarm 280; exec @ARGV' node ~/arthur/scripts/ll-portal-ask.mjs "$OUT/$1" "$2" "$3" > "$OUT/$1.log" 2>&1; echo "$1 rc=$?"; }
run ask-hero "How many students are enrolled at Riverside?" /client/ask
run ask-lottery "How does the enrollment lottery work?" /client/ask
run ask-absences "What does the handbook say about unexcused absences?" /client/ask
run ask-none "What was the graduation rate last year?" /client/ask
run approvals - /client/approvals
run connections - /client/connections
run health - /client/data/health
run workstreams - /client/workstreams
