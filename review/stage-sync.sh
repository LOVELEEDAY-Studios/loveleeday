#!/bin/bash
# stage-sync.sh <stagedir> : mirror the worktree's public site + the root assets it references into a stage git repo for cloud-shot
WT=/Users/danielmay/wt/ll-review-1026/public
ST="$1"
mkdir -p "$ST/portal" "$ST/integrations"
rsync -a --delete "$WT/site/" "$ST/site/"
rsync -a --delete "$WT/portal/collab/" "$ST/portal/collab/"
rsync -a --delete "$WT/integrations/" "$ST/integrations/"
cd "$ST" && { [ -d .git ] || git init -q; } && git add -A >/dev/null && git -c user.email=a@b -c user.name=x commit -qm s >/dev/null 2>&1
git ls-files | wc -l
