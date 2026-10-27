#!/usr/bin/env python3
"""build-board.py : assemble the before/after mood board (local only) from the scratch before/after shots and the Codex scores.
Re-runnable: reads whatever Codex score files exist at run time."""
import os, re, json, subprocess, shutil, glob
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

S = '/private/tmp/claude-501/-Users-danielmay/3f305371-d21a-47b6-93a7-1e8a1f9d4d45/scratchpad'
WT = '/Users/danielmay/wt/ll-review-1026'
OUT = S + '/board-work'
BOARD = '/Users/danielmay/Desktop/loveleeday-site-review-board'
os.makedirs(OUT, exist_ok=True)
os.makedirs(BOARD, exist_ok=True)

def scores(d):
    r = {}
    for f in glob.glob(d + '/*.txt'):
        t = open(f, errors='ignore').read()
        m = re.findall(r'^\**SCORE:\**[ *]*([0-9.]+)', t, re.M)
        if m:
            r[os.path.basename(f)[:-4]] = float(m[-1])
    return r

def blockers(d, p):
    f = d + '/' + p + '.txt'
    if not os.path.exists(f):
        return ''
    t = open(f, errors='ignore').read()
    m = re.findall(r'BLOCKERS?:?\**\s*(.{0,220})', t)
    return m[-1].strip(' *') if m else ''

sb = scores(S + '/codex-before')
sb.update(scores(S + '/codex-before2'))  # re-scored on the corrected render
sa = scores(S + '/codex-after')

pages = sorted(set(os.path.basename(f)[5:-9] for f in glob.glob(S + '/before/site_*-1440.png')))
names = {'index': 'Home', 'arthur': 'Arthur', 'operating-system': 'Operating system', 'how-it-works': 'How it works', 'industries': 'Industries',
         'industries_manufacturing': 'Industry: manufacturing', 'industries_property': 'Industry: property', 'industries_schools': 'Industry: schools and charters',
         'notes': 'Systems Notes'}
def nm(p):
    return names.get(p) or ('Note: ' + p[6:].replace('-', ' ')) if p.startswith('notes_') else names.get(p, p.replace('-', ' ').capitalize())

changed = {
    'index': 'Rejected hero photograph replaced with a graded stock original (two colleagues at a table); tighter headline tracking fixed so words no longer fuse.',
    'industries_manufacturing': 'Empty grey band and three blank-sided sections replaced by the sample answer card and one editorial list; button now goes to the example; unrelated EU town hall card replaced.',
    'industries_property': 'Empty band replaced by the sample answer card; Cairo-style apartment hero replaced by a unit walkthrough; step numerals removed.',
    'industries_schools': 'Empty band replaced by the sample answer card; classroom with a donor plaque replaced by a corridor photograph; step numerals removed.',
    'industries': 'Property, government and schools cards re-photographed to one warm grade and US-plausible places.',
    'municipal-review': 'Foreign, lens-distorted civic building replaced by two different counter photographs (hero and closing band no longer repeat).',
    'pricing-margins': 'Foreign market stall replaced by a US cash-and-calculator photograph in the shared grade.',
    'operating-system': 'Orange spa-like room replaced by a stockroom worker with a clipboard.',
    'studio': 'Orange cast pulled back with the shared grade; headline tracking fixed.',
    'principles': 'Cool green photograph regraded warm and muted.',
    'talk': 'Property and government cards re-photographed (no foreign buildings).',
    'arthur': 'Portrait regraded (lifted blacks, calmer contrast).',
}
for p in pages:
    if p.startswith('notes_'):
        changed.setdefault(p, 'Phone flow diagrams now fit the screen instead of hiding behind a sideways scroll; pull-quote spacing fixed.')
default = 'Headline tracking loosened with balanced wrapping, so words stop fusing on phone and desktop; share card re-cut with one-colour balanced headline.'

def lab(p):
    return nm(p)

mp = {}
notes = {'title': 'LOVELEEDAY public site: before and after', 'subtitle': 'Design and Codex peer review, 2026-10-26. Local board, nothing deployed. Scores are Codex 1-10 (9 = ready).',
         'summary': [], 'palette': [{'name': 'Cream', 'hex': '#f5f1eb'}, {'name': 'Ink', 'hex': '#1d1d1f'}, {'name': 'Blue (action)', 'hex': '#0066cc'}],
         'pages': {}, 'sections': [], 'afterDir': OUT + '/after', 'beforeLabel': 'Before', 'afterLabel': 'After'}
def grade(b, a):
    def L(s):
        return 'A' if s is not None and s >= 9 else 'B' if s is not None and s >= 8 else 'C' if s is not None and s >= 7 else 'D'
    if a is None:
        return f'{L(b)} {b:g} was' if b is not None else ''
    return f'{L(a)} {a:g}/10 (was {b:g})' if b is not None else f'{L(a)} {a:g}/10'
for p in pages:
    for kind, w in (('d', '1440'), ('m', '390')):
        slug = f'{p}-{kind}'
        mp[slug] = {'before': f'{S}/before/site_{p}-{w}.png', 'after': f'{S}/after/site_{p}-{w}.png', 'name': lab(p) + (' (desktop)' if kind == 'd' else ' (phone)'),
                    'url': 'https://loveleedaystudios.com/' + ('' if p == 'index' else p.replace('_', '/').replace('notes/', 'notes/')) }
        notes['pages'][slug] = {'name': mp[slug]['name'], 'url': mp[slug]['url'], 'grade': grade(sb.get(p), sa.get(p)) if kind == 'd' else '',
                                'changed': changed.get(p, default) if kind == 'd' else '',
                                'weak': ('Codex blocker: ' + blockers(S + '/codex-after', p)[:200]) if kind == 'd' and p in sa and sa[p] < 9 else ''}
json.dump(mp, open(OUT + '/map.json', 'w'))
json.dump(notes, open(OUT + '/notes.json', 'w'))
subprocess.run(['node', os.path.expanduser('~/arthur/scripts/board-inputs.mjs'), OUT + '/map.json', OUT], check=True, capture_output=True)
n2 = json.load(open(OUT + '/notes.json'))
for k, v in notes['pages'].items():
    n2['pages'][k].update(v)
n2['afterDir'] = OUT + '/after'
n2['summary'] = [
    f'Pages scored by Codex: {len(sa)} of {len(sb)}. Average before {sum(sb.values()) / max(1, len(sb)):.1f}, average after {sum(sa.values()) / max(1, len(sa)):.1f}.' if sa else 'Codex after-scores pending.',
    'Pages still under 9 are flagged with their score and remaining blocker. Cap of two Codex rounds, as instructed.',
    'Rejected hero photographs removed from the site; every new photograph is a licensed stock original at native pixels run through one grade.',
]
json.dump(n2, open(OUT + '/notes.json', 'w'))
subprocess.run(['node', os.path.expanduser('~/arthur/scripts/review-board.mjs'), OUT + '/before', OUT + '/notes.json', BOARD], check=True, capture_output=True)

# thumbnails and photography sections, injected into the generated page
share_b = S + '/share-before'
os.makedirs(share_b, exist_ok=True)
sh = BOARD + '/share'
os.makedirs(sh, exist_ok=True)
rows = []
for f in sorted(glob.glob(WT + '/public/site/assets/share/*.jpg')):
    b = os.path.basename(f)
    data = subprocess.run(['git', '-C', WT, 'show', 'origin/main:public/site/assets/share/' + b], capture_output=True).stdout
    if data:
        open(sh + '/b-' + b, 'wb').write(data)
        shutil.copy(f, sh + '/a-' + b)
        rows.append(f'<figure><figcaption>{b[:-4]}</figcaption><div class="pair"><img loading="lazy" src="share/b-{b}"><img loading="lazy" src="share/a-{b}"></div></figure>')
ph = BOARD + '/photos'
os.makedirs(ph, exist_ok=True)
C = '/Users/danielmay/Projects/loveleeday/brand/photo-candidates/'
chosen = [
    ('ph-home.jpg', 'shot-01-home-hero/3861077-andrea-piacquadio.jpg', 'Home hero', 'Andrea Piacquadio, Pexels'),
    ('ph-municipal.jpg', 'shot-06-gov-counter/7821676-rdne-stock-project.jpg', 'Municipal review hero', 'RDNE Stock project, Pexels'),
    ('ph-municipal-2.jpg', 'shot-06-gov-counter/3770194-andrea-piacquadio.jpg', 'Municipal review band, government card', 'Andrea Piacquadio, Pexels'),
    ('ph-property.jpg', 'shot-09-property-unit/7937363-pavel-danilyuk.jpg', 'Property hero and card', 'Pavel Danilyuk, Pexels'),
    ('ph-property-2.jpg', 'shot-10-property-leasing/29998475-jakub-zerdzicki.jpg', 'Property second card', 'Jakub Zerdzicki, Pexels'),
    ('ph-pricing.jpg', 'shot-13-ops-close-of-day/5900228-https-kaboompics-com.jpg', 'Pricing and margins', 'Kaboompics, Pexels'),
    ('ph-os.jpg', 'shot-14-ops-stock-count/6169027-tima-miroshnichenko.jpg', 'Operating system', 'Tima Miroshnichenko, Pexels'),
    ('ph-government.jpg', 'shot-07-gov-field/5953073-andrew-labonne.jpg', 'Government card', 'Andrew Labonne, Pexels'),
    ('ph-schools.jpg', 'shot-05-schools-corridor/8419223-rdne-stock-project.jpg', 'Schools hero and card', 'RDNE Stock project, Pexels'),
]
prow = []
for f, src, use, cred in chosen:
    im = Image.open(C + src); im.draft('RGB', (1000, 700)); im = im.convert('RGB'); im.thumbnail((900, 600)); im.save(ph + '/o-' + f, quality=82)
    shutil.copy(WT + '/public/site/assets/' + f, ph + '/g-' + f)
    prow.append(f'<figure><figcaption>{use} &middot; {cred}</figcaption><div class="pair"><img loading="lazy" src="photos/o-{f}"><img loading="lazy" src="photos/g-{f}"></div></figure>')
css = '<style>.xs-sec{padding:28px 48px;border-bottom:1px solid #262a35}.xs-sec h2{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#9097a6;margin:0 0 6px}.xs-sec p.n{color:#9097a6;margin:0 0 16px;max-width:900px}.xs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(560px,1fr));gap:16px}.xs-grid figure{margin:0;background:#151821;border:1px solid #262a35;border-radius:12px;padding:10px}.xs-grid figcaption{font-size:12.5px;color:#c4c8d2;padding:2px 4px 8px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:6px}.pair img{width:100%;height:auto;display:block;border-radius:6px}.xs-cap{display:grid;grid-template-columns:1fr 1fr;color:#9097a6;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;padding:0 4px 4px}</style>'
cap = '<div class="xs-cap"><span>%s</span><span>After</span></div>'
sec = (css + '<section class="xs-sec"><h2>Thumbnails: share cards, before and after</h2><p class="n">One-colour balanced headline, lighter wash so the photo shows, and new photographs wherever the page photograph changed.</p><div class="xs-grid">'
       + ''.join(r.replace('<div class="pair">', cap % 'Before' + '<div class="pair">') for r in rows) + '</div></section>'
       + '<section class="xs-sec"><h2>Photography: chosen originals and the grade</h2><p class="n">Licensed Pexels originals at native pixels, scaled down only. One grade: neutral-warm white balance, lifted blacks, rolled highlights, shadows toward navy, highlights toward cream, saturation pulled back (reds and yellow-greens further), no sharpening, no grain. Left is the original, right is the graded file used on the site.</p><div class="xs-grid">'
       + ''.join(r.replace('<div class="pair">', cap % 'Original' + '<div class="pair">') for r in prow) + '</div></section>')
idx = open(BOARD + '/index.html').read()
if 'xs-sec' not in idx:
    idx = idx.replace('<section class="sec" style="border:0;padding-bottom:0">', sec + '<section class="sec" style="border:0;padding-bottom:0">', 1)
    open(BOARD + '/index.html', 'w').write(idx)
print('board', BOARD + '/index.html', len(sb), len(sa))
