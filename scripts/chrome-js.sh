#!/bin/bash
# Run JavaScript in a Chrome tab and print the result.
# bash scripts/chrome-js.sh <url-substring|ACTIVE> '<javascript expression>'
# Prefers the ACTIVE tab of the front window when it matches, so it acts on the tab on screen,
# not an older tab with a similar URL (2026-09-24: it read a stale Search Console tab).
osascript - "$1" "$2" <<'OSA'
on run argv
  set needle to item 1 of argv
  set js to item 2 of argv
  tell application "Google Chrome"
    set t to active tab of front window
    if needle is "ACTIVE" or (URL of t contains needle) then return (execute t javascript js)
    repeat with w in windows
      repeat with t in tabs of w
        if URL of t contains needle then return (execute t javascript js)
      end repeat
    end repeat
  end tell
  return "NO TAB matching " & needle
end run
OSA
