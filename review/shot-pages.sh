#!/bin/bash
# shot-pages.sh <outdir> <width> <page>... : restage the worktree and render only the named pages (e.g. index talk industries/schools) on arthur-server.
# Serialized with a mkdir lock (waits up to 15 min, then breaks a stale lock), so parallel callers queue instead of colliding on port 8811.
mkdir -p "$1"; OUT="$(cd "$1" && pwd)"; W="$2"; shift 2
L=/tmp/ll-review-shot.lock
for i in $(seq 1 300); do mkdir "$L" 2>/dev/null && break; sleep 3; done
[ -d "$L" ] || mkdir "$L"
trap 'rmdir "$L" 2>/dev/null' EXIT
ST=/Users/danielmay/wt/ll-review-1026/review/out/stage-after
/Users/danielmay/wt/ll-review-1026/review/stage-sync.sh "$ST" > /dev/null
P=(); for p in "$@"; do P+=("site/$p.html"); done
cd "$ST" && ~/arthur/scripts/cloud-shot.sh "$ST" "$OUT" "$W" "${P[@]}"
