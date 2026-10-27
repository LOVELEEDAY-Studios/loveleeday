#!/bin/bash
# shots-one.sh <stagedir> <outdir> <width> : render every public page at one width on arthur-server (never run two at once: they share port 8811)
cd "$1" || exit 1
PAGES=($(ls site/*.html site/industries/*.html site/notes/*.html))
mkdir -p "$2"
~/arthur/scripts/cloud-shot.sh "$1" "$2" "$3" "${PAGES[@]}"
echo DONE
