#!/bin/bash
# commit-pages.sh "<commit msg>" <page>... : for each page (path without .html, e.g. industries/schools), check it links brand.css and
# assets/pages/<page with / -> _>.css, grep for banned public terms (Kalamazoo, Michigan, "LOVELEEDAY Studios" outside the LLC legal line,
# public $ prices), then stage the page + its css by name and commit. Exit 2 = a check failed, nothing committed.
M="$1"; shift
cd /Users/danielmay/wt/ll-review-1026/public/site || exit 1
FILES=(); BAD=0
for p in "$@"; do
  css="assets/pages/${p//\//_}.css"
  b=$(grep -c 'brand.css' "$p.html"); o=$(grep -c "pages/${p//\//_}.css" "$p.html")
  hits=$(grep -oi 'kalamazoo\|michigan\|LOVELEEDAY Studios[^ L<]\|\$[0-9][0-9,.]*\s*/\s*mo' "$p.html" | sort -u | tr '\n' ';')
  printf '%-32s brand:%s own:%s %s\n' "$p" "$b" "$o" "${hits:+BANNED:$hits}"
  [ "$b" -ge 1 ] && [ "$o" -ge 1 ] && [ -z "$hits" ] || BAD=1
  FILES+=("$p.html"); [ -f "$css" ] && FILES+=("$css")
done
[ "$BAD" = 1 ] && { echo "check failed, nothing committed"; exit 2; }
git add -- "${FILES[@]}" && git commit -q -m "$M" -- "${FILES[@]}" && git log --oneline -1
