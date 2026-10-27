#!/bin/bash
# launch.sh [phase ...] : ship the review kit (review/cloud + the two standards) to arthur-server, build ~/llr/repo from the
# server's current stage copy (~/sites/stage-after, kept fresh by shot-pages.sh) on a first launch, start the clean-URL server
# on :8850, and start run.py DETACHED (nohup setsid) so the IAP tunnel can drop. Watch with: review/cloud/status.sh
set -e
WT=/Users/danielmay/wt/ll-review-1026
"$WT/review/stage-sync.sh" "$WT/review/out/stage-after" >/dev/null
"$WT/review/shot-pages.sh" "$WT/review/out/measure/sync" 390 terms >/dev/null 2>&1 || true   # pushes the latest stage delta
T=$(mktemp -d); mkdir -p "$T/k"
cp -R "$WT/review/cloud/." "$T/k/"; cp "$WT/review/cloud/STANDARD.md" "$WT/review/HERO-STANDARD.md" "$T/k/"
tar czf "$T/k.tgz" -C "$T/k" .
printf -v PH '%q ' "$@"
REMOTE='set -e; mkdir -p ~/llr/bin; cd ~/llr; tar xzf - -C ~/llr; mv -f ~/llr/bin/*.cjs ~/llr/bin/*.sh ~/llr/bin/*.py ~/llr/bin/ 2>/dev/null || true; chmod +x ~/llr/bin/*.sh ~/llr/run.py
if [ ! -d ~/llr/repo/.git ]; then
  mkdir -p ~/llr/repo; rsync -a --delete --exclude _hero.html --exclude _measure.html ~/sites/stage-after/ ~/llr/repo/
  cd ~/llr/repo; git init -q; git add -A; git -c user.name=review -c user.email=review@localhost commit -q -m baseline; git rev-parse HEAD > ~/llr/baseline; cd ~/llr
fi
cp ~/llr/STANDARD.md ~/llr/HERO-STANDARD.md ~/llr/repo/
python3 -c "import PIL" 2>/dev/null || pip3 install --user -q pillow || sudo apt-get install -y -q python3-pil >/dev/null
test -s ~/.arthur/claude.env || { echo "NO CLAUDE TOKEN"; exit 4; }
pgrep -f "^node .*serve.cjs" >/dev/null || (setsid nohup node ~/llr/bin/serve.cjs ~/llr/repo 8850 > ~/llr/serve.log 2>&1 &)
sleep 2; curl -s -o /dev/null -w "serve %{http_code}\n" http://localhost:8850/how-it-works || true
pgrep -f "^python3 .*llr/run.py" >/dev/null && { echo "run.py already running"; exit 0; }
setsid nohup python3 ~/llr/run.py '"$PH"' > ~/llr/run.log 2>&1 < /dev/null &
sleep 2; echo launched; tail -3 ~/llr/status.txt 2>/dev/null || true'
gcloud compute ssh arthur-server --zone=us-east1-b --tunnel-through-iap --command "$REMOTE" < "$T/k.tgz" 2>&1 | grep -viE 'numpy|tunnel_performance|tcp_upload|increasing|^warning'
rm -rf "$T"
