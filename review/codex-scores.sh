#!/bin/bash
# codex-scores.sh <dir> : page and the last SCORE: <n> Codex printed, one per line
for f in "$1"/*.txt; do
  n=$(grep -a -io '^\**SCORE:\**[ *]*[0-9.]*' "$f" | tail -1 | grep -o '[0-9.]*$')
  echo "$(basename "$f" .txt) ${n:-NA}"
done
