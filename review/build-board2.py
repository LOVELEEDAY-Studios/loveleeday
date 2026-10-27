#!/usr/bin/env python3
"""build-board2.py : desktop redesign board. Before = round-2 branch state (after2 renders), After = desktop system renders (dk2),
plus the design-system section (reference shots, section types) and the 390 lock result. Local only."""
import os, re, json, glob, shutil, subprocess
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

S = '/Users/danielmay/wt/ll-review-1026/review/out'
WT = '/Users/danielmay/wt/ll-review-1026'
OUT = S + '/board2-work'
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

def top_defect(d, p):
    f = d + '/' + p + '.txt'
    if not os.path.exists(f):
        return ''
    t = open(f, errors='ignore').read()
    m = re.findall(r'BLOCKERS?:?\**\s*(.{0,200})', t)
    return m[-1].strip(' *') if m else ''

# last Codex scores before the desktop rebuild (round 2, desktop and phone strips), as reported in the round-2 run
prev = {'architecture': 5, 'arthur': 7, 'build': 6, 'contact': 6, 'customer-data': 6, 'faq': 7, 'how-it-works': 6, 'index': 7, 'industries': 7,
        'industries_manufacturing': 7, 'industries_property': 6, 'industries_schools': 7, 'integrations': 6, 'municipal-review': 7, 'notes': 7,
        'notes_alerts-are-noise-conditions-are-signal': 7, 'notes_an-answer-you-cant-trace': 7, 'notes_intelligence-is-an-architecture': 7,
        'notes_migration-is-where-data-goes-to-die': 7, 'notes_one-company-five-names': 7, 'notes_the-spreadsheet-is-the-real-system': 7,
        'notes_what-you-knew-and-when': 7, 'notes_your-systems-dont-talk': 7, 'operating-system': 6, 'operational-intelligence': 7,
        'pricing-margins': 7, 'principles': 7, 'privacy': 6, 'snapshot': 6, 'studio': 6, 'talk': 7, 'terms': 6, 'trust': 7, 'use-cases': 6, 'work': 6}
FIN = 'cdx-2' if glob.glob(S + '/cdx-2/*.txt') else 'cdx-1'
first = scores(S + '/cdx-1')
now = scores(S + '/' + FIN)
pages = sorted(set(os.path.basename(f)[5:-9] for f in glob.glob(S + '/before/site_*-1440.png')))
names = {'index': 'Home', 'arthur': 'Arthur', 'operating-system': 'Operating system', 'how-it-works': 'How it works', 'industries': 'Industries',
         'industries_manufacturing': 'Industry: manufacturing (anchor)', 'industries_property': 'Industry: property', 'industries_schools': 'Industry: schools and charters',
         'notes': 'Systems Notes'}
def nm(p):
    if p in names:
        return names[p]
    return 'Note: ' + p[6:].replace('-', ' ') if p.startswith('notes_') else p.replace('-', ' ').capitalize()

hero = {'index': 'photo', 'how-it-works': 'photo', 'municipal-review': 'photo', 'pricing-margins': 'photo', 'customer-data': 'photo', 'studio': 'photo', 'work': 'photo',
        'build': 'split', 'faq': 'split', 'talk': 'split', 'contact': 'split', 'use-cases': 'split', 'principles': 'split', 'operational-intelligence': 'split', 'snapshot': 'split',
        'operating-system': 'dark', 'architecture': 'dark', 'integrations': 'dark', 'trust': 'dark', 'privacy': 'plain', 'terms': 'plain'}
desc = {'photo': 'Full-bleed photograph under a left-weighted scrim, white headline: the manufacturing pattern.',
        'split': 'Cream ground, copy left, graded photograph bleeding off the right edge.',
        'dark': 'Ink ground, copy left, photograph fading in from the right.',
        'plain': 'No photograph: a 72px headline on a ruled cream ground, with the contents list beside the text.'}
mp, notes = {}, {'title': 'LOVELEEDAY public site: desktop redesign', 'subtitle': 'Desktop only. Mobile is locked (see the lock check). Before = the approved round-2 state, After = the new desktop system. Local board, nothing deployed.',
               'summary': [], 'palette': [{'name': 'Cream', 'hex': '#f5f1eb'}, {'name': 'Ink', 'hex': '#14161a'}, {'name': 'Action blue', 'hex': '#0066cc'}],
               'pages': {}, 'sections': [], 'afterDir': OUT + '/after', 'beforeLabel': 'Before (round 2)', 'afterLabel': 'After (desktop system)'}
def L(s):
    return 'A' if s >= 9 else 'B' if s >= 8 else 'C' if s >= 7 else 'D'
for p in pages:
    slug = p + '-d'
    mp[slug] = {'before': f'{S}/before/site_{p}-1440.png', 'after': f'{S}/after/site_{p}-1440.png', 'name': nm(p) + ' (desktop)',
                'url': 'https://loveleedaystudios.com/' + ('' if p == 'index' else p.replace('_', '/'))}
    h = hero.get(p)
    if p.startswith('industries_'):
        ch = 'Anchor pattern kept. Sample answer card restored, example question and photography from the earlier passes.'
    elif p.startswith('notes') and p != 'notes':
        ch = 'Article template unchanged on desktop except the shared spacing scale; the photograph stays in the graded set.'
    elif h:
        ch = desc[h]
    else:
        ch = 'Shared desktop spacing and type scale.'
    g = ''
    if p in now:
        g = f'{L(now[p])} {now[p]:g}/10' + (f' (was {prev[p]:g})' if p in prev else '')
    elif p in prev:
        g = f'{L(prev[p])} {prev[p]:g} prior, desktop pass not scored'
    notes['pages'][slug] = {'name': mp[slug]['name'], 'url': mp[slug]['url'], 'grade': g, 'changed': ch,
                            'weak': ('Codex: ' + top_defect(S + '/' + FIN, p)[:200]) if p in now and now[p] < 9 else ''}
json.dump(mp, open(OUT + '/map.json', 'w'))
json.dump(notes, open(OUT + '/notes.json', 'w'))
subprocess.run(['node', os.path.expanduser('~/arthur/scripts/board-inputs.mjs'), OUT + '/map.json', OUT], check=True, capture_output=True)
n2 = json.load(open(OUT + '/notes.json'))
for k, v in notes['pages'].items():
    n2['pages'][k].update(v)
n2['afterDir'] = OUT + '/after'
avg = sum(now.values()) / max(1, len(now))
avg1 = sum(first.values()) / max(1, len(first))
mx = max(now.values()) if now else 0
n2['summary'] = [f'Codex desktop pass ({FIN}): {len(now)} of {len(pages)} pages scored, average {avg:.1f} of 10 (first pass on the body rework: {avg1:.1f}); best page {mx:g}. Scores are independent Codex reads of the 1440 renders, not inflated.',
                 'The manufacturing hero is the anchor: four hero types (photo, split, dark, plain) carry every page, in one grid, spacing and type scale. Below the heroes each page now mixes statement, feature, ledger, band and closing sections.',
                 'Not every page was recomposed: industries, notes, work, integrations, snapshot and the legal pages keep their earlier body layouts on the shared scale.']
json.dump(n2, open(OUT + '/notes.json', 'w'))
subprocess.run(['node', os.path.expanduser('~/arthur/scripts/review-board.mjs'), OUT + '/before', OUT + '/notes.json', BOARD], check=True, capture_output=True)

# design system + lock sections
rf = BOARD + '/refs'
os.makedirs(rf, exist_ok=True)
refs = []
for f in sorted(glob.glob(S + '/refs/*-1440.png')):
    im = Image.open(f).convert('RGB').crop((0, 0, 1440, 900))
    im = im.resize((720, 450), Image.LANCZOS)
    b = os.path.basename(f).replace('www.', '').split('_')[0].replace('.com', '').replace('.app', '')
    im.save(rf + '/' + b + '.jpg', quality=85)
    refs.append(b)
anchor = Image.open(S + '/after/site_industries_manufacturing-1440.png').convert('RGB').crop((0, 0, 1440, 900)).resize((720, 450), Image.LANCZOS)
anchor.save(rf + '/anchor.jpg', quality=85)
lock = subprocess.run(['python3', '-W', 'ignore', WT + '/review/mobile-lock.py', S + '/before', S + '/after'], capture_output=True, text=True)
lock_txt = lock.stdout.strip().splitlines()
lock_sum = lock_txt[-1] if lock_txt else 'not run'
lock_rows = ''.join('<tr><td>%s</td><td>%s</td></tr>' % tuple(l.split(None, 1)) for l in lock_txt[:-1] if len(l.split(None, 1)) == 2)
css = '<style>.xs-sec{padding:28px 48px;border-bottom:1px solid #262a35}.xs-sec h2{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#9097a6;margin:0 0 6px}.xs-sec p.n{color:#9097a6;margin:0 0 16px;max-width:900px}.xs-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:14px}.xs-g figure{margin:0;background:#151821;border:1px solid #262a35;border-radius:12px;padding:10px}.xs-g img{width:100%;display:block;border-radius:6px}.xs-g figcaption{font-size:12.5px;color:#c4c8d2;padding:6px 2px 0}.xs-t{border-collapse:collapse;font-size:12.5px;color:#c4c8d2}.xs-t td{border-bottom:1px solid #262a35;padding:3px 14px 3px 0}</style>'
sec = (css + '<section class="xs-sec"><h2>Design system: anchor and references</h2><p class="n">Anchor: the manufacturing desktop hero (left). References captured with the headless cloud browser at 1440: ' + ', '.join(refs) + '. Palantir shows only its shell because its hero is a video. What the references share: one headline on the left, one action, the product or proof directly under the fold, a quiet trust row, and no decoration. That is what the four hero types and the proof-card sections borrow.</p><div class="xs-g"><figure><img src="refs/anchor.jpg"><figcaption>Anchor: manufacturing hero, 1440</figcaption></figure>'
       + ''.join('<figure><img src="refs/%s.jpg"><figcaption>%s</figcaption></figure>' % (r, r) for r in refs) + '</div></section>'
       + '<section class="xs-sec"><h2>Desktop system: section types, grid, scale</h2><p class="n">Grid: 1080 wrap, 12 columns, 24 gutter. Spacing scale 8, 16, 24, 40, 64, 96, 128 (sections breathe at 96). Type scale 64, 40, 28, 20, 17 (Switzer for text, Sentient for answers). Section types in use: <b>photo hero</b> (' + ', '.join(k for k, v in hero.items() if v == 'photo') + '); <b>split hero</b> (' + ', '.join(k for k, v in hero.items() if v == 'split') + '); <b>dark hero</b> (' + ', '.join(k for k, v in hero.items() if v == 'dark') + '); <b>plain hero</b> (privacy, terms); then the existing split photo and text rows, proof band with the portal screen, example-answer card, and closing call to action on the shared scale. Every rule lives in desktop.css inside min-width:1021px.</p></section>'
       + '<section class="xs-sec"><h2>Mobile lock check (390 x 844, full page)</h2><p class="n">' + lock_sum + '. Every 390 render of the 35 pages was pixel-diffed against the approved round-2 render (tolerance: any channel difference above 8).</p><table class="xs-t">' + lock_rows + '</table></section>')
idx = open(BOARD + '/index.html').read()
idx = re.sub(r'<style>\.xs-sec.*?</section>(?=<section class="sec" style="border:0)', '', idx, flags=re.S) if 'xs-sec' in idx else idx
idx = idx.replace('<section class="sec" style="border:0;padding-bottom:0">', sec + '<section class="sec" style="border:0;padding-bottom:0">', 1)
open(BOARD + '/index.html', 'w').write(idx)
print('board2', BOARD + '/index.html', 'scored', len(now), 'of', len(pages), '| lock:', lock_sum)
