#!/bin/bash
# Re-run Search Console's domain verification for loveleedaystudios.com in Daniel's Chrome.
# Brings the Search Console tab to the front, opens Add a website, enters the domain, then presses VERIFY.
# bash scripts/gsc-verify.sh
D=loveleedaystudios.com
osascript <<OSA
tell application "Google Chrome"
  repeat with w in windows
    set i to 0
    repeat with t in tabs of w
      set i to i + 1
      if URL of t contains "search.google.com" then
        set URL of t to "https://search.google.com/search-console/welcome"
        set active tab index of w to i
        set index of w to 1
        activate
        exit repeat
      end if
    end repeat
  end repeat
end tell
delay 6
tell application "Google Chrome" to execute active tab of front window javascript "[...document.querySelectorAll('button')].find(b=>/Add a website/.test(b.innerText)).click()"
delay 3
tell application "Google Chrome" to execute active tab of front window javascript "[...document.querySelectorAll('input')].find(e=>e.placeholder==='example.com'&&e.getClientRects().length).focus()"
tell application "System Events"
  keystroke "$D"
  delay 0.8
  key code 36
end tell
delay 8
tell application "Google Chrome" to execute active tab of front window javascript "(()=>{const o=[...document.querySelectorAll('[role=option]')].find(o=>/Any DNS provider/.test(o.innerText));if(o)['pointerdown','mousedown','pointerup','mouseup','click'].forEach(t=>o.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:window})));return 'ok'})()"
delay 3
tell application "Google Chrome" to execute active tab of front window javascript "(()=>{const b=[...document.querySelectorAll('[role=button],button')].find(e=>e.getClientRects().length&&(e.innerText||'').trim()==='VERIFY');if(!b)return 'none';['pointerdown','mousedown','pointerup','mouseup','click'].forEach(t=>b.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:window})));return 'clicked'})()"
delay 15
tell application "Google Chrome" to return (URL of active tab of front window) & " :: " & (execute active tab of front window javascript "document.body.innerText.slice(0,700)")
OSA
