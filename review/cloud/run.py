#!/usr/bin/env python3
"""run.py [phase ...] : the LOVELEEDAY site program on arthur-server, in ~/llr.
Phases (default all, in order): p1 page teams to 10 -> p2 coherence reviewer -> crawl -> p3 beta testers -> p4 fixers -> p5 final
coherence -> final scores of every page -> patch (git diff against the baseline into ~/llr/out/site.patch).
Workers are headless Claude Code sessions (sonnet for page teams, testers and fixers; opus for the coherence reviewer).
Each phase is committed in ~/llr/repo so it can be resumed: `run.py p4 p5 final patch`. Progress lines go to ~/llr/status.txt."""
import os, sys, subprocess, time, glob, concurrent.futures as cf

H = os.path.expanduser('~/llr'); R = H + '/repo'; RPT = H + '/reports'
os.makedirs(RPT, exist_ok=True); os.makedirs(H + '/out', exist_ok=True)
NOTES = sorted(os.path.relpath(f, R + '/site')[:-5] for f in glob.glob(R + '/site/notes/*.html'))
GROUPS = {
    'g1-product': ['index', 'arthur', 'operating-system', 'how-it-works'],
    'g2-platform': ['architecture', 'integrations', 'trust'],
    'g3-solutions': ['customer-data', 'operational-intelligence', 'pricing-margins', 'municipal-review'],
    'g4-industries': ['use-cases', 'snapshot', 'industries', 'industries/manufacturing', 'industries/property', 'industries/schools'],
    'g5-company': ['work', 'build', 'studio', 'principles'],
    'g6-contact': ['talk', 'contact', 'faq', 'privacy', 'terms'],
    'g7-notes': ['notes'] + NOTES,
}
ALL = [p for g in GROUPS.values() for p in g]
PERSONAS = [
    ('school', 1440, 'the business manager of a network of four charter schools. You keep enrollment, grant reporting and the board calendar in separate systems and are always late finding which reports are due. You want to know if this fits schools, whether it is safe with student data, and how to start without a big IT project.'),
    ('property', 390, 'the director of operations for a property management company with 1,200 units. You only ever look at websites on your iPhone between site visits. You want to see whether it reads your property software, what it would show you about overdue rent and repairs, and how to talk to someone.'),
    ('manufacturer', 1440, 'VP of operations at a 300-person manufacturer, skeptical of software vendors after a failed ERP project. You check security, what systems it reads, what it actually does with your data, who built it, and whether there is any proof it works. You read the trust, architecture and integrations pages closely.'),
    ('city', 720, 'a finance analyst for a mid-size city. You use the keyboard (Tab) more than the mouse and keep the browser zoomed to 200 percent (your width is 720). You care about plain language, accessibility, public-records rules and whether it can explain where a number came from. Use --tab to check focus moves sensibly.'),
    ('nonprofit', 1024, 'executive director of a nonprofit with 40 staff and no IT person, using a tablet. You are not technical, money is tight, and you want to know in plain words what this would do for you, what it costs to start, and what happens next if you fill in the form. You read a couple of the Systems Notes articles too.'),
]

def log(m):
    open(H + '/status.txt', 'a').write(time.strftime('%H:%M:%S ') + m + '\n')

def env():
    e = dict(os.environ)
    for line in open(os.path.expanduser('~/.arthur/claude.env')):
        line = line.strip()
        if line.startswith('export '): line = line[7:]
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1); e[k] = v.strip('"\'')
    for k in ('ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN'):
        e.pop(k, None)  # an API key outranks the subscription token and bills (or fails on) API credit
    return e

def claude(name, prompt, model='sonnet', hours=2):
    open(f'{H}/out/{name}.prompt.md', 'w').write(prompt)
    log(f'start {name} ({model})')
    t = time.time()
    with open(f'{H}/out/{name}.log', 'w') as lf:
        rc = subprocess.run(['timeout', str(int(hours * 3600)), 'claude', '-p', '--model', model, '--dangerously-skip-permissions', '--output-format', 'text'],
                            input=prompt, text=True, cwd=R, env=env(), stdout=lf, stderr=subprocess.STDOUT).returncode
    log(f'end {name} rc={rc} {int(time.time() - t)}s')
    return rc

def fill(tpl, **kw):
    s = open(f'{H}/{tpl}').read()
    for k, v in kw.items(): s = s.replace('{{' + k + '}}', v)
    return s

def files(pages):
    out = []
    for p in pages:
        out += [f'site/{p}.html', f'site/assets/pages/{p.replace("/", "_")}.css']
    if any(p.startswith('notes') for p in pages): out.append('site/assets/notes.css')
    return ', '.join(out)

def commit(msg):
    subprocess.run(['git', 'add', '-A', 'site', 'portal', 'integrations'], cwd=R)
    subprocess.run(['git', '-c', 'user.name=review', '-c', 'user.email=review@localhost', 'commit', '-q', '-m', msg], cwd=R)
    log('commit ' + msg)

def pool(jobs, n):
    with cf.ThreadPoolExecutor(n) as ex: list(ex.map(lambda j: j(), jobs))

def p1():
    jobs = []
    for g, pages in GROUPS.items():
        pr = fill('brief-page.md', PAGES=', '.join(pages), PAGES_SPACE=' '.join(pages), FILES=files(pages), REPORT=f'{RPT}/p1-{g}.md',
                  EXTRA='Notes articles share one template (site/assets/notes.css): fix the template once so every article benefits.' if g == 'g7-notes' else '')
        jobs.append(lambda g=g, pr=pr: claude('p1-' + g, pr))
    pool(jobs, 3); commit('p1 page teams')

def p2(tag='p2', extra=''):
    claude(tag + '-coherence', fill('brief-coherence.md', ALLPAGES=' '.join(ALL), REPORT=f'{RPT}/{tag}-coherence.md', EXTRA=extra), model='opus', hours=3)
    commit(tag + ' coherence')

def crawl():
    lines = []
    for w in (1440, 390):
        for p in ALL:
            o = subprocess.run(['node', f'{H}/bin/browse.cjs', str(w), f'site/{p}.html', f'--out={H}/beta/crawl'], capture_output=True, text=True, timeout=180).stdout
            bad = [l for l in o.splitlines() if l.startswith('BROKEN')]
            ov = next((l for l in o.splitlines() if l.startswith('OVERFLOW_X')), '')
            sec = o.split('--- BROKEN IMAGES ---')[-1].split('--- SMALL')[0].strip() if '--- BROKEN IMAGES ---' in o else ''
            err = o.split('--- CONSOLE ERRORS ---')[-1].strip() if '--- CONSOLE ERRORS ---' in o else ''
            if bad or (ov and ov != 'OVERFLOW_X 0px' and not ov.startswith('OVERFLOW_X -')) or (sec and sec != 'none') or (err and err != 'none'):
                lines.append(f'== {p} @{w} {ov}\n' + '\n'.join(bad) + (f'\nbroken images: {sec}' if sec and sec != 'none' else '') + (f'\nconsole: {err}' if err and err != 'none' else ''))
    open(f'{RPT}/crawl.txt', 'w').write('\n\n'.join(lines) or 'no broken links, overflow, broken images or console errors\n')
    log(f'crawl {len(lines)} page-widths with problems')

def p3():
    jobs = []
    for name, w, who in PERSONAS:
        pr = fill('brief-beta.md', PERSONA=who, WIDTH=str(w), OUTDIR=f'{H}/beta/{name}', REPORT=f'{RPT}/beta-{name}.md')
        jobs.append(lambda name=name, pr=pr: claude('p3-beta-' + name, pr, hours=1.5))
    pool(jobs, 5)
    subprocess.run(['git', 'checkout', '--', 'site', 'portal', 'integrations'], cwd=R)  # testers only report
    log('beta done')

def p4():
    jobs = []
    for g, pages in GROUPS.items():
        pr = fill('brief-fix.md', PAGES=', '.join(pages), PAGES_SPACE=' '.join(pages), FILES=files(pages), REPORT=f'{RPT}/p4-{g}.md')
        jobs.append(lambda g=g, pr=pr: claude('p4-' + g, pr))
    pool(jobs, 3); commit('p4 beta fixes')

def final():
    o = subprocess.run([f'{H}/bin/score.sh'] + ALL, capture_output=True, text=True).stdout
    open(f'{RPT}/FINAL-scores.txt', 'w').write(o); log('final scores written')

def patch():
    base = open(f'{H}/baseline').read().strip()
    d = subprocess.run(['git', 'diff', '--binary', base, 'HEAD', '--', 'site', 'portal', 'integrations'], cwd=R, capture_output=True).stdout
    open(f'{H}/out/site.patch', 'wb').write(d); log(f'patch {len(d)} bytes')

STEPS = {'p1': p1, 'p2': p2, 'crawl': crawl, 'p3': p3, 'p4': p4,
         'p5': lambda: p2('p5', 'This is the FINAL pass after the beta fixes: re-check every page against the others, then score every page with score.sh.'),
         'final': final, 'patch': patch}
for s in ([a for a in sys.argv[1:] if a] or list(STEPS)):
    log('phase ' + s); STEPS[s]()
log('ALL DONE')
