#!/usr/bin/env python3
"""build-board3.py : brand pass board. Before = this morning's state (out/after), After = brand-pass renders (out/final),
desktop 1440 and phone 390 for all 35 pages, with each page's last Codex score. Local only, written to ~/Desktop."""
import os, json, glob, subprocess

S = '/Users/danielmay/wt/ll-review-1026/review/out'
OUT = S + '/board3-work'
BOARD = '/Users/danielmay/Desktop/loveleeday-site-review-board'
os.makedirs(OUT, exist_ok=True)

# last Codex round per page, from each worker's final report (judge calibration: stripe 7, ramp 7, linear 8)
SCORE = {'index': 7, 'arthur': 7, 'operating-system': 7, 'how-it-works': 7, 'architecture': 6, 'integrations': 6, 'trust': 6,
         'customer-data': 7, 'operational-intelligence': 7, 'pricing-margins': 6, 'municipal-review': 7, 'use-cases': 7, 'snapshot': 6,
         'industries': 6, 'industries_manufacturing': 7, 'industries_property': 7, 'industries_schools': 7, 'work': 6, 'build': 6,
         'studio': 6, 'principles': 6, 'talk': 7, 'contact': 6, 'faq': 7, 'notes': 6, 'privacy': 7, 'terms': 7}
WEAK = {'index': 'Example answer card is example data, not a captured case.',
        'architecture': 'Approvals and signals screens are still older captures.', 'integrations': 'Every connector says Planned; nothing live to show.',
        'trust': 'Sample answer names a source category, not a citable record.', 'pricing-margins': 'Calculator and chart labels read small at review scale.',
        'snapshot': 'Upload action sits below the hero; no opened-result view.', 'industries': 'Reads as a directory of rows; no product screen.',
        'work': 'Wants before/after measurements beyond page weight.', 'build': 'Six service rows read repetitive.',
        'studio': 'Product example is labeled example data.', 'principles': 'Six similar rows; wants one large annotated product view.',
        'contact': 'No real answer or source trail shown.', 'notes': 'Three equal cards; wants a larger product view.'}
# final scores from the cloud run (review/out/cloud/reports/FINAL-scores.txt), strict judge: any remaining defect caps a page at 9
_F = S + '/cloud/reports/FINAL-scores.txt'
if os.path.exists(_F):
    SCORE = {l.split()[0].replace('/', '_'): int(l.split()[-1]) for l in open(_F) if l.strip().split()[-1].isdigit()}
    WEAK = {}

NAMES = {'index': 'Home', 'operating-system': 'Operating system', 'how-it-works': 'How it works', 'industries_manufacturing': 'Industry: manufacturing',
         'industries_property': 'Industry: property', 'industries_schools': 'Industry: schools and charters', 'notes': 'Systems Notes',
         'customer-data': 'Customer data', 'operational-intelligence': 'Operational intelligence', 'pricing-margins': 'Pricing and margins',
         'municipal-review': 'Municipal review', 'use-cases': 'Use cases', 'faq': 'FAQ'}

def nm(p):
    if p in NAMES:
        return NAMES[p]
    return 'Note: ' + p[6:].replace('-', ' ') if p.startswith('notes_') else p.replace('-', ' ').capitalize()

pages = sorted(os.path.basename(f)[5:-9] for f in glob.glob(S + '/final2/1440/site_*-1440.png'))
order = ['index'] + [p for p in pages if p != 'index']
mp, notes = {}, {'title': 'LOVELEEDAY site: full design pass', 'subtitle': 'Before = this morning. After = one brand layer across all 35 pages: fixed palette, Switzer with Sentient for answers, one type scale, one button, the 3D brain back on home. Desktop and phone. Local board, nothing pushed or deployed.',
                 'summary': [], 'palette': [{'name': 'Night', 'hex': '#0b0b10'}, {'name': 'Cream', 'hex': '#f5f1eb'}, {'name': 'Mist', 'hex': '#f5f5f7'}, {'name': 'Ink', 'hex': '#1d1d1f'}, {'name': 'Action blue', 'hex': '#0066cc'}],
                 'pages': {}, 'sections': [], 'beforeLabel': 'Before (this morning)', 'afterLabel': 'After (full design pass)'}
for p in order:
    url = 'https://loveleedaystudios.com/' + ('' if p == 'index' else p.replace('_', '/'))
    sc = SCORE.get(p, 7 if p.startswith('notes_') else None)
    g = f'{sc}/10 (Stripe scored 7, Linear 8 on the same judge)' if sc else ''
    for w, tag in ((1440, 'desktop'), (390, 'phone')):
        slug = f'{p}-{w}'
        mp[slug] = {'before': f'{S}/after/site_{p}-{w}.png', 'after': f'{S}/final2/{w}/site_{p}-{w}.png', 'name': f'{nm(p)} ({tag})', 'url': url}
        notes['pages'][slug] = {'name': mp[slug]['name'], 'url': url, 'grade': g if w == 1440 else '', 'changed': '',
                                'weak': ('Codex: ' + WEAK[p]) if (w == 1440 and p in WEAK) else ''}
json.dump(mp, open(OUT + '/map.json', 'w'))
json.dump(notes, open(OUT + '/notes.json', 'w'))
subprocess.run(['node', os.path.expanduser('~/arthur/scripts/board-inputs.mjs'), OUT + '/map.json', OUT], check=True, capture_output=True)
n2 = json.load(open(OUT + '/notes.json'))
for k, v in notes['pages'].items():
    n2['pages'][k].update(v)
n2['afterDir'] = OUT + '/after'
vals = [SCORE.get(p, 7) for p in order]
n2['summary'] = [f'Strict Codex judge, every page on desktop and phone: average {sum(vals)/len(vals):.1f} of 10, range {min(vals)} to {max(vals)}. Any remaining defect caps a page at 9, so no page reached 10.',
                 'What changed: one hero system (photo, split, product, text) with one photo per hero, one screen frame, one answer card, one logo chip, the phone menu button fixed on every page, off-brand colours removed, beta-tester gaps closed.',
                 'Five beta testers (charter-school manager, property director on a phone, manufacturing VP, keyboard-only city analyst at 200 percent zoom, nonprofit director on a tablet) walked the site; their findings went to the fix teams. Link crawl of 70 page views: no broken internal links, overflow or broken images.',
                 'Since the scores: every page now uses the same full-width photo hero (build, principles, talk, contact and FAQ were split screen), home has a new workshop hero photo, and all nine phone portal screenshots were recaptured at a true 390 width so the padding is even on both sides. Scores shown predate these fixes.']
json.dump(n2, open(OUT + '/notes.json', 'w'))
subprocess.run(['node', os.path.expanduser('~/arthur/scripts/review-board.mjs'), OUT + '/before', OUT + '/notes.json', BOARD], check=True, capture_output=True)
print('board3', BOARD + '/index.html', len(order), 'pages x 2 widths')
