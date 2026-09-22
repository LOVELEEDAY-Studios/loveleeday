"""Stop the deep pages from replaying the homepage.

Measured, not eyeballed: 358 text blocks across the twelve pages, compared
exactly and by shared five-word phrases. Four of the flagged repeats are
use-cases index links pointing at their own detail pages, which is correct.
Six were real, and all six are the same failure -- the page that should go
deeper instead reprints the summary:

  index <-> operating-system   17.1% of phrases shared. The entire interactive
                               shell -- heading, subhead, sidebar, all three
                               questions and their answers -- was byte-for-byte
                               identical (2,331 chars, verified equal).
  index <-> arthur             15.8%. Both drive the same brain off the same
                               six-item array, so they cycle the same text.
  index <-> studio             "We give the day back." as a display heading in
                               two hero positions.
  operating-system <-> use-cases   the same closing call to action.

The components are right to be reused -- the shell IS the product and the
brain IS Arthur. What must differ is what they say. So the data is now
per-page, and each page owns its examples:

  index             the three core mechanics: identity, memory, verification
  arthur            the three applied questions, with its own picker
  operating-system  three examples in domains the homepage never shows,
                    chosen to exercise the trace, which is that page's argument

Nothing is lost by the split: the architecture page now carries purpose-built
figures for identity, lineage, memory, verification and awareness, so the
mechanics are covered in more depth there than a rotating caption ever did.
"""

import pathlib
import re

SITE = pathlib.Path("site")


def sub1(text, old, new, what):
    if old not in text:
        raise SystemExit(f"BUILD STOPPED: {what} not found verbatim")
    return text.replace(old, new, 1)


# ── 1. site.js: per-page demo sets ───────────────────────────────────────────
js = SITE / "assets" / "site.js"
s = js.read_text()

OS_QUESTIONS = (
    "const questionsOS=[{q:'Which ordinance actually applies today?',"
    "a:'<strong>One of three, and not the one most often cited.</strong><br>"
    "The 2019 text was superseded by a 2023 amendment. The earlier version stays "
    "in the record, marked as no longer in force.',"
    "trace:'<strong>Illustrative municipal example</strong><br>"
    "Provision · three versions · effective dates recorded<br>"
    "In force: 2023 amendment · superseded: 2019 text'},"
    "{q:'Where did this month\\u2019s margin go?',"
    "a:'<strong>Discounts, not costs.</strong><br>"
    "Unit cost held steady while realized price fell below target on nine items. "
    "The gap is in what was charged, not what was paid.',"
    "trace:'<strong>Illustrative pricing example</strong><br>"
    "Realized price vs cost vs target, per item<br>"
    "Nine items below target · cost unchanged'},"
    "{q:'Are these two customers the same person?',"
    "a:'<strong>Probably \\u2014 and it is flagged, not merged.</strong><br>"
    "Two records share an address and a card fingerprint but differ on name "
    "spelling. An uncertain match is held for review rather than decided "
    "silently.',"
    "trace:'<strong>Illustrative customer example</strong><br>"
    "Shared: billing address, card fingerprint<br>"
    "Differs: name spelling \\u00b7 status: held for review'}];\n"
)

anchor = "const qButtons=[...document.querySelectorAll('[data-q]')];"
s = sub1(s, anchor,
         OS_QUESTIONS +
         "// Each page picks its own example set: the homepage teases the core\n"
         "// mechanics, the operating system page shows the trace on other material.\n"
         "const questionSet=document.body.dataset.questionSet==='os'?questionsOS:questions;\n"
         + anchor, "question tab handler")
s = s.replace("const d=questions[Number(b.dataset.q)];",
              "const d=questionSet[Number(b.dataset.q)];", 1)

# The brain reads whichever slice of brainDemos its page declares.
s = sub1(s,
    "function updateBrain(k,t){const n=brainDemos.length,",
    "// A page may declare which demos its brain cycles, so the homepage and the\n"
    "// Arthur page do not rotate through identical text.\n"
    "const brainSet=(document.body.dataset.brainSet||'').split(',')\n"
    "  .filter(x=>x!=='').map(Number).filter(i=>brainDemos[i]);\n"
    "const activeDemos=brainSet.length?brainSet.map(i=>brainDemos[i]):brainDemos;\n"
    "function updateBrain(k,t){const n=activeDemos.length,",
    "updateBrain head")
s = s.replace("const d=brainDemos[index];", "const d=activeDemos[index];", 1)
js.write_text(s)
print("site.js: per-page question set and brain set")

# ── 2. index: brain cycles the three core mechanics ──────────────────────────
p = SITE / "index.html"; t = p.read_text()
t = sub1(t, '<body class="">', '<body class="" data-brain-set="0,1,2">', "index body")
p.write_text(t)
print("index.html: brain cycles identity, memory, verification")

# ── 3. arthur: the three applied questions, and its picker to match ──────────
p = SITE / "arthur.html"; t = p.read_text()
t = sub1(t, '<body class="arthur-page">',
         '<body class="arthur-page" data-brain-set="3,4,5">', "arthur body")
for old_i, new_i in ((3, 0), (4, 1), (5, 2)):
    t = sub1(t, f'data-brain-example="{old_i}"', f'data-brain-example="X{new_i}"',
             f"arthur picker link {old_i}")
# Drop the three pickers that pointed at the homepage's mechanics.
for i in (0, 1, 2):
    m = re.search(r'<a[^>]*data-brain-example="%d"[^>]*>.*?</a>' % i, t, re.S)
    if not m:
        raise SystemExit(f"BUILD STOPPED: arthur picker {i} not found to remove")
    t = t[:m.start()] + t[m.end():]
t = t.replace('data-brain-example="X', 'data-brain-example="')
# Its static first beat must match the new set's first item.
t = sub1(t, "Who is FES across our systems?",
         "Review every ordinance and law on the municipality’s books.",
         "arthur static brain question")
for old, new in [
    ("Which names refer to the same company?", "Which ordinances and laws are on the books?"),
    ("Which records belong to it?", "What was amended, repealed, or superseded?"),
    ("Where did each observation come from?", "Where do provisions conflict or leave gaps?"),
    ("Can we trace the answer?", "Which source and effective date support each finding?"),
    ("One company. Connected across its different names.",
     "A cited inventory of current laws, amendments, and issues to review."),
    ("Ontology example · alias matched to a canonical object",
     "Illustrative municipal review · source citations and effective dates"),
]:
    t = sub1(t, old, new, f"arthur static branch {old[:30]!r}")
p.write_text(t)
print("arthur.html: brain cycles the three applied questions, picker rebuilt")

# ── 4. operating-system: its own heading, questions and CTA ──────────────────
p = SITE / "operating-system.html"; t = p.read_text()
t = sub1(t, '<body class="">', '<body class="" data-question-set="os">', "os body")
t = sub1(t,
    '<span class="eyebrow">Intelligence, in context</span><h2>Ask simply.<br>'
    '<span>Understand completely.</span></h2></div><p>Start with a question.<br>'
    'Follow the answer back to its source.</p>',
    '<span class="eyebrow">One question, one path</span><h2>Ask once.<br>'
    '<span>Follow it all the way down.</span></h2></div><p>Every answer keeps the '
    'route back to the record it came from.</p>',
    "os section heading")
t = sub1(t,
    '<button id="q0" role="tab" aria-controls="answer-panel" aria-selected="true" '
    'data-q="0">Resolve an identity</button>',
    '<button id="q0" role="tab" aria-controls="answer-panel" aria-selected="true" '
    'data-q="0">Apply an ordinance</button>', "os tab 0")
t = sub1(t, 'data-q="1">Recall a moment</button>',
         'data-q="1">Trace a margin</button>', "os tab 1")
t = sub1(t, 'data-q="2">Verify a claim</button>',
         'data-q="2">Weigh a match</button>', "os tab 2")
t = sub1(t, '<h3 class="question-heading" id="question">Who is FES, across our systems?</h3>',
         '<h3 class="question-heading" id="question">Which ordinance actually applies '
         'today?</h3>', "os static question")
t = sub1(t,
    '<p id="answer"><strong>One company. Several names.</strong><br>FES and Fintech '
    'Equipment Services resolve to the same company, alongside its vendor ID and '
    'Stripe customer record.</p>',
    '<p id="answer"><strong>One of three, and not the one most often cited.</strong>'
    '<br>The 2019 text was superseded by a 2023 amendment. The earlier version stays '
    'in the record, marked as no longer in force.</p>', "os static answer")
# The examples are no longer drawn from the supplied source, so the disclosure
# may not keep saying they are.
t = sub1(t, 'Illustrative interaction using examples from the supplied source. '
            'No live systems connected.',
         'Illustrative interaction. No live systems connected.', "os disclosure")
t = sub1(t,
    '<h2>Start with a question.</h2><p>Bring the uncertainty. We’ll help define '
    'the work.</p>',
    '<h2>Bring your systems.</h2><p>Tell us what each of them knows, and what nobody '
    'can see across them.</p>', "os cta")
p.write_text(t)
print("operating-system.html: own heading, own three examples, own CTA")

# ── 5. studio: its own hero line ─────────────────────────────────────────────
p = SITE / "studio.html"; t = p.read_text()
t = sub1(t, '<h1>We give<br><span>the day back.</span></h1>',
         '<h1>Why we<br><span>build this.</span></h1>', "studio h1")
p.write_text(t)
print("studio.html: own hero line; the homepage keeps the closing refrain")
