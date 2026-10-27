#!/bin/bash
# board-refresh.sh <render-dir>... : copy fresh renders (<dir>/1440, <dir>/390) into review/out/final2 in the order given (later wins),
# rebuild the local review board and reload its tab in Daniel's Chrome (localhost:8834).
cd /Users/danielmay/wt/ll-review-1026 || exit 1
for d in "$@"; do
  for w in 1440 390; do [ -d "$d/$w" ] && cp "$d/$w"/*.png review/out/final2/$w/; done
done
python3 review/build-board3.py
osascript -e 'tell application "Google Chrome" to repeat with w in windows
repeat with t in tabs of w
if URL of t contains "localhost:8834" then tell t to reload
end repeat
end repeat'
