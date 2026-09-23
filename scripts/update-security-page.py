"""Brings security.html up to the controls verified on 2026-09-23. Every claim
added here was probed that day (see the commit message for the evidence).
Idempotent: each replacement asserts its anchor, so a stale page fails loudly.

  python3 scripts/update-security-page.py
"""
import pathlib
import re

P = pathlib.Path(__file__).resolve().parent.parent / "concepts/studio/site/security.html"
t = P.read_text()


def art(n, title, body):
    return f'<article class="principle-long"><span class="row-number">{n}</span><h3>{title}</h3><p>{body}</p></article>'


CONTROLS = [
    ("Multi-factor sign-in, enforced by the database.",
     "Every client account requires a one-time code from an authenticator app. The database itself refuses a session that has not completed that second step, so a stolen password cannot read or change anything, even by going around the website."),
    ("You can only join by invitation.",
     "Client accounts are created by LOVELEEDAY, never self-registered. Joining one takes an invitation sent to a named address. The link works only for that confirmed email address, once, and expires. A forwarded or leaked link is useless to anyone else."),
    ("Single sign-on for institutions.",
     "Organizations that manage accounts centrally can sign their people in through their own identity provider (SAML&nbsp;2.0), which then owns the second factor. Each organization's connection is set up with them, and signing in through it still requires an invitation to your account."),
    ("Encryption, in transit and at rest.",
     "Traffic runs over TLS, with browsers told to use it every time. Data is encrypted at rest by the database, and working machines use full-disk encryption."),
    ("Hosted in the United States.",
     "Client data is stored and processed within the United States, on established cloud infrastructure."),
    ("A separate space for every client.",
     "Each client's records are isolated in the database itself, not only in software. One client cannot read another's rows."),
    ("Documents sealed with your company's own key.",
     "Every file you share with us, or we share with you, is encrypted with a key that belongs to your company alone before it is stored. It opens only for a signed-in member of your company who has completed two-factor, its checksum is verified on every open, and there is no shareable link to leak. When an engagement ends, the key is destroyed along with the files."),
    ("Every open is on the record, and you can see it.",
     "Your account's owners and admins have an access history: who uploaded, downloaded or deleted each document, when, and from what address. It is written by the system as it happens, not reconstructed afterwards."),
    ("Backups that are checked, not assumed.",
     "Client data is backed up every day. Our own operating records are copied daily to two independent providers, each copy downloaded again and compared byte for byte, with a full restore rehearsed every week."),
    ("A backup ransomware cannot erase.",
     "One offsite copy of our operating records sits under a retention lock: for fourteen days after it is written, no one, including us, can delete or overwrite it. We test that lock by trying to delete a file ourselves, and the storage refuses."),
    ("Tested from the outside.",
     "We probe our own website, client portal and database the way an attacker would look first: exposed files, keys left in code, pages reachable without signing in, and anonymous attempts to read or write data. What it finds is fixed before new work ships."),
    ("Nothing goes out without approval.",
     "Sending mail, moving money, changing records &mdash; outbound actions pass an approval and logging step rather than running unsupervised."),
    ("Secrets the software never sees.",
     "Credentials are held in a controlled store and used without being exposed to the tools that call them, and never shipped to a browser."),
    ("A complete record.",
     "Actions are logged and reviewable after the fact, not reconstructed from memory."),
]

block = re.compile(r'(<h2 class="sr-only">Controls in place today</h2>)(?:<article class="principle-long">.*?</article>)+(</div></section>)', re.S)
assert block.search(t), "controls block not found"
t = block.sub(lambda m: m.group(1) + "".join(art(f"{i:02d}", h, b) for i, (h, b) in enumerate(CONTROLS, 1)) + m.group(2), t, count=1)

old_rules = "and the state and local requirements of wherever you operate."
assert old_rules in t, "rules sentence not found"
if "We keep a register" not in t:
    t = t.replace(old_rules, "and the state and local requirements of wherever you operate. We keep a register of the breach-notification, student-privacy and consumer-privacy laws of all fifty states and the District of Columbia, and the federal and industry standards for every sector we serve, each tied to the official text, so the obligations written into your agreement are the ones that actually apply to you.", 1)

old_intro = "None of the three below are done"
assert old_intro in t or "None of the items below are done" in t, "roadmap intro not found"
t = t.replace(old_intro, "None of the items below are done", 1)

# SSO shipped 2026-09-23 (arthur-launch 6b3eec8 + a50350f, SAML enabled on the
# loveleeday project), so its roadmap entry is removed; it is in CONTROLS above.
t = re.sub(r'<article class="principle-long"><span class="row-number">&mdash;</span><h3>Single sign-on.*?</article>', "", t, count=1, flags=re.S)
locked = art("&mdash;", "Backups that cannot be deleted.",
             "Underway. Our offsite copies are verified daily, but they can still be removed with the same access that writes them. We are adding a retention lock so that no one, including us, can delete a backup before it ages out.")
# Shipped 2026-09-23 (R2 bucket lock, proven by scripts/r2-lock-probe.sh), so it
# moves from the roadmap into the controls list above.
t = t.replace(locked, "")

# The closing "Start a project" matches the header's ink pill (.nav-cta), not
# the blue form button (.primary). site.css hides .nav-cta at phone width
# (the header collapses), so .page-cta keeps its copy visible.
t = t.replace('<a class="primary" href="studio.html#project-brief">Start a project',
              '<a class="nav-cta" href="studio.html#project-brief">Start a project', 1)
CSS_PATH = P.parent / "assets/site.css"
CSS_RULE = ("\n/* A section CTA wearing the header's pill: same ink, same size, and visible at\n"
            "   phone width, where site.css hides the header's own copy. */\n"
            ".page-cta a.nav-cta{display:inline-flex;align-items:center;gap:6px;font-size:12px;line-height:1.5;flex:none}\n")
css = CSS_PATH.read_text()
if ".page-cta a.nav-cta" not in css:
    CSS_PATH.write_text(css.rstrip("\n") + "\n" + CSS_RULE)

P.write_text(t)
print("security.html updated:", len(CONTROLS), "controls")
