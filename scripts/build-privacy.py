"""A privacy page, because the form makes a promise that needs one behind it.

The brief form says "Nothing is shared with anyone else" and collects a name,
an email and a description of someone's business problem. A site that asks for
that and offers no privacy page is asking to be trusted without saying what it
does.

Every claim below was verified against the code rather than written from the
usual template, and the result is unusually short because the site genuinely
does very little: no cookies, no localStorage or sessionStorage, no analytics,
no third-party scripts and no external fonts -- grep returned nothing for all
of them -- and the contact route stores nothing, it sends two emails and keeps
no database. Saying so plainly is worth more than a page of boilerplate about
"industry-standard measures", and on a site whose argument is evidence and
lineage, a privacy page that overstates would undercut the product.
"""
import pathlib, re

SITE = pathlib.Path("public/site")
SRC = pathlib.Path("concepts/studio/site")
TEMPLATE = SITE / "principles.html"

t = TEMPLATE.read_text()
head = t[: t.find("</head>") + 7]
body = t[t.find("<body") :]
nav = body[: body.find("</header>") + 9]
footer = body[body.find("<footer") :]

# The head is rewritten for this page rather than reused verbatim.
head = re.sub(r"<title>.*?</title>", "<title>Privacy — LOVELEEDAY</title>", head, flags=re.S)
head = re.sub(r'<meta name="description" content="[^"]*"',
              '<meta name="description" content="What the site collects, who processes it, '
              'and what it does not do. No cookies, no analytics, no third-party scripts."', head)
head = re.sub(r'<link rel="canonical" href="[^"]*"',
              '<link rel="canonical" href="https://loveleedaystudios.com/privacy"', head)
head = re.sub(r'<meta property="og:url" content="[^"]*"',
              '<meta property="og:url" content="https://loveleedaystudios.com/privacy"', head)
head = re.sub(r'<meta property="og:title" content="[^"]*"',
              '<meta property="og:title" content="Privacy — LOVELEEDAY"', head)
head = re.sub(r'<meta name="twitter:title" content="[^"]*"',
              '<meta name="twitter:title" content="Privacy — LOVELEEDAY"', head)
head = re.sub(r'<script type="application/ld\+json">.*?</script>', "", head, flags=re.S)

SECTIONS = [
    ("What the form collects",
     "The project brief on the studio page asks for your name, your email, your organization, "
     "the area of work, and three descriptions: the question you need answered, the records or "
     "systems involved, and what a useful result would look like. Nothing else is captured, and "
     "nothing is required beyond your name, your email and the question.",
     ["Your brief is emailed to hello@loveleedaystudios.com and a confirmation is emailed to you.",
      "A copy of the brief also downloads to your own device, so you keep what you sent.",
      "It is not written to any database. There is no record of it beyond those two emails."]),
    ("Who else handles it",
     "Three services touch the site, and each is named rather than described as a partner.",
     ["Vercel hosts the site and keeps standard server request logs.",
      "Resend delivers the two emails.",
      "Purelymail holds the mailbox the brief arrives in."]),
    ("What the site does not do",
     "This list is short because the site is. Each of these was checked against the code, not "
     "assumed from a template.",
     ["No cookies. No localStorage, sessionStorage or IndexedDB.",
      "No analytics, no tracking pixels and no advertising tags of any kind.",
      "No third-party scripts and no externally hosted fonts — every asset is served from this domain.",
      "No profiling, no automated decisions about you, and nothing sold or shared with anyone."]),
    ("Private review links",
     "Some work is shared on an unguessable link rather than behind a login. Those pages carry "
     "instructions to search engines not to index, follow, archive or excerpt them, and an "
     "unrecognised link returns a not-found page rather than an empty one. Treat the link itself "
     "as the credential: anyone holding it can open the page.",
     []),
    ("Asking for it back",
     "Because nothing is stored in a database, deleting your information means deleting the "
     "emails. Write to hello@loveleedaystudios.com and say so, and both the brief and the "
     "confirmation will be removed from the mailbox.",
     []),
]

def section(i, title, lead, points):
    cls = "section-pad surface" if i % 2 else "section-pad"
    li = ("<div class=\"body-copy\">" + "".join(f"<p>{p}</p>" for p in points) + "</div>") if points else ""
    return (f'<section class="{cls}"><div class="wrap split">'
            f'<div><span class="eyebrow">{title}</span></div>'
            f'<div><div class="body-copy"><p>{lead}</p></div>{li}</div></div></section>')

hero = ('<section class="page-hero warm"><div class="wrap">'
        '<span class="eyebrow">Privacy</span>'
        '<h1>What we collect.<br><span>Which is very little.</span></h1>'
        '<p class="lead">Every statement on this page was checked against the code that runs the '
        'site. Where the answer is nothing, it says nothing.</p></div></section>')

updated = ('<section class="section-pad"><div class="wrap"><p class="brief-note">'
           'Last reviewed 22 September 2026 · Questions to '
           '<a href="mailto:hello@loveleedaystudios.com">hello@loveleedaystudios.com</a>'
           '</p></div></section>')

page = (head + nav + '<main id="main">' + hero
        + "".join(section(i, *s) for i, s in enumerate(SECTIONS))
        + updated + "</main>" + footer)

(SITE / "privacy.html").write_text(page)
print(f"  privacy.html written ({len(page)//1024} KB, {len(SECTIONS)} sections)")

# The concept source keeps relative asset paths; the deploy script rewrites them.
concept = page.replace('"/site/assets/', '"assets/').replace("(/site/assets/", "(assets/")
concept = concept.replace('href="/"', 'href="index.html"')
for name in ["operating-system","arthur","architecture","use-cases","industries",
             "municipal-review","customer-data","pricing-margins",
             "operational-intelligence","principles","studio"]:
    concept = concept.replace(f'href="/{name}"', f'href="{name}.html"')
(SRC / "privacy.html").write_text(concept)
print("  concept source copy written with relative paths")
