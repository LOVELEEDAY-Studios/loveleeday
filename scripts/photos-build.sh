#!/bin/bash
# photos-build.sh : grade the chosen Pexels originals (brand/photo-candidates, licence in each credits.json) into public/site/assets.
# Originals are only scaled down; see scripts/photo-grade.py for the grade.
C=/Users/danielmay/Projects/loveleeday/brand/photo-candidates
A=/Users/danielmay/wt/ll-review-1026/public/site/assets
G="python3 -W ignore /Users/danielmay/wt/ll-review-1026/scripts/photo-grade.py"
set -e
$G $C/shot-01-home-hero/3861077-andrea-piacquadio.jpg $A/ph-home.jpg --w=2000 --warm=0.3
$G $C/shot-01-home-hero/3861077-andrea-piacquadio.jpg $A/ph-home-phone.jpg --w=1100 --crop=0.04,0,0.93,1 --warm=0.3
$G $C/shot-06-gov-counter/7821676-rdne-stock-project.jpg $A/ph-municipal.jpg --w=1400 --warm=0.1
$G $C/shot-06-gov-counter/3770194-andrea-piacquadio.jpg $A/ph-municipal-2.jpg --w=1400 --crop=0,0.05,1,0.95 --warm=0.1
$G $C/shot-09-property-unit/7937363-pavel-danilyuk.jpg $A/ph-property.jpg --w=1880 --warm=0.2
$G $C/shot-10-property-leasing/29998475-jakub-zerdzicki.jpg $A/ph-property-2.jpg --w=1880 --warm=0.2
$G $C/shot-13-ops-close-of-day/5900228-https-kaboompics-com.jpg $A/ph-pricing.jpg --w=1400 --warm=0.0
$G $C/shot-14-ops-stock-count/6169027-tima-miroshnichenko.jpg $A/ph-os.jpg --w=1400 --warm=0.3
$G $C/shot-07-gov-field/5953073-andrew-labonne.jpg $A/ph-government.jpg --w=1880 --warm=0.1
$G $C/shot-06-gov-counter/3770194-andrea-piacquadio.jpg $A/ph-government-2.jpg --w=1880 --crop=0,0.02,1,0.98 --warm=0.1
$G $C/shot-05-schools-corridor/8419223-rdne-stock-project.jpg $A/ph-schools.jpg --w=1880 --warm=0.0
$G $C/shot-09-property-unit/7937324-pavel-danilyuk.jpg $A/ph-talk-property.jpg --w=1200 --crop=0.083,0,0.917,1 --warm=0.2
$G $C/shot-07-gov-field/5953073-andrew-labonne.jpg $A/ph-talk-government.jpg --w=1500 --warm=0.1
# files we hold only at their published size are regraded from the committed original, never enlarged
T=$(mktemp -d)
regrade() { git -C /Users/danielmay/wt/ll-review-1026 show HEAD:public/site/assets/$1 > $T/src.jpg && $G $T/src.jpg $A/$1 --w=99999 "${@:2}"; }
regrade studio.jpg --warm=-0.5 --sat=0.80
regrade principles.jpg --warm=0.7 --sat=0.86
regrade arthur.jpg --warm=0.2 --sat=0.92
regrade notes/note-01.jpg --warm=0.6
regrade notes/note-06.jpg --warm=0.6
regrade notes/note-08.jpg --warm=0.7
for f in ph-property ph-property-2 ph-government ph-government-2 ph-schools; do python3 -W ignore -c "
import sys
from PIL import Image
im = Image.open('$A/$f.jpg'); im = im.resize((960, round(im.height * 960 / im.width)), Image.LANCZOS); im.save('$A/cards/$f.webp', quality=82)"; done
ls -la $A/ph-*.jpg $A/cards/ph-*.webp
