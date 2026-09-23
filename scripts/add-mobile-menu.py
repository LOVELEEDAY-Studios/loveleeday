"""Phone-width header: a menu button instead of four squeezed dropdown labels.

At <=700px the site previously hid "Start a project" and shrank System / Uses /
Build / Studio to 9-10px beside the logo. This adds a two-line menu button
that opens the same navigation as a full-screen sheet: the dropdowns become
large expandable rows and "Start a project" returns. Desktop is unchanged.
Idempotent: skips pages, CSS and JS already carrying it.

  python3 scripts/add-mobile-menu.py
"""
import pathlib

SITE = pathlib.Path(__file__).resolve().parent.parent / "concepts/studio/site"
TOGGLE = ('<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" '
          'aria-label="Open menu"><span></span><span></span></button>')
NAV_OLD = '<nav class="nav-links" aria-label="Main navigation">'
NAV_NEW = '<nav class="nav-links" id="site-menu" aria-label="Main navigation">'

CSS = """
/* Phone-width menu -- scripts/add-mobile-menu.py. A button opens the full
   navigation as a sheet under the header instead of squeezing four labels
   beside the logo. */
.nav-toggle{display:none}
@media(max-width:700px){
  .nav-toggle{display:flex;flex-direction:column;justify-content:center;gap:6px;width:44px;height:44px;margin-right:-10px;padding:0 10px;border:0;background:none;cursor:pointer}
  .nav-toggle span{display:block;height:1.5px;background:var(--ink);transition:transform .25s ease}
  .nav.menu-open .nav-toggle span:first-child{transform:translateY(3.75px) rotate(45deg)}
  .nav.menu-open .nav-toggle span:last-child{transform:translateY(-3.75px) rotate(-45deg)}
  .nav-links{display:none}
  /* The header's backdrop-filter makes it the containing block for fixed
     children, which clipped the sheet to the 64px bar; drop it while open. */
  .nav.menu-open{backdrop-filter:none;-webkit-backdrop-filter:none;background:#fff}
  .nav.menu-open .nav-links{display:flex;flex-direction:column;align-items:stretch;gap:0;position:fixed;top:calc(var(--header-height) + 1px);left:0;right:0;bottom:0;background:#fff;padding:8px var(--gutter) 48px;overflow-y:auto;font-size:18px;letter-spacing:-.01em;color:var(--ink);z-index:40}
  .nav.menu-open .nav-dropdown{border-bottom:1px solid var(--line)}
  .nav.menu-open .nav-dropdown summary{min-height:60px;justify-content:space-between}
  .nav.menu-open .nav-dropdown summary span{font-size:14px;color:var(--muted)}
  .nav.menu-open .usecases-nav summary span{display:inline}
  .nav.menu-open .dropdown-panel{position:static;width:auto;display:block;box-shadow:none;border:0;border-radius:0;padding:0 0 20px}
  .nav.menu-open .dropdown-panel>div+div{margin-top:16px}
  .nav.menu-open .dropdown-panel a{font-size:16px;padding:10px 0}
  .nav.menu-open .build-nav .nav-long{display:inline}
  .nav.menu-open .build-nav .nav-short{display:none}
  .nav.menu-open .nav-cta{display:inline-flex;align-self:flex-start;margin-top:28px;font-size:14px;padding:14px 22px}
  body.menu-lock{overflow:hidden}
}
@media(prefers-reduced-motion:reduce){.nav-toggle span{transition:none}}
"""

JS = """
// Phone-width menu (scripts/add-mobile-menu.py): open/close the sheet, close on
// navigation, Escape, or widening past the phone breakpoint.
(()=>{const nav=document.querySelector('.nav'),btn=document.querySelector('.nav-toggle');if(!nav||!btn)return;
const set=o=>{nav.classList.toggle('menu-open',o);btn.setAttribute('aria-expanded',String(o));btn.setAttribute('aria-label',o?'Close menu':'Open menu');document.body.classList.toggle('menu-lock',o)};
btn.addEventListener('click',()=>set(!nav.classList.contains('menu-open')));
nav.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>set(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('menu-open')){set(false);btn.focus()}});
window.matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)set(false)})})();
"""

changed = 0
for page in sorted(SITE.glob("*.html")):
    t = page.read_text()
    if "nav-toggle" in t or NAV_OLD not in t:
        continue
    page.write_text(t.replace(NAV_OLD, TOGGLE + NAV_NEW, 1))
    changed += 1

css = SITE / "assets/site.css"
if ".nav-toggle" not in css.read_text():
    css.write_text(css.read_text().rstrip("\n") + "\n" + CSS)
js = SITE / "assets/site.js"
if "nav-toggle" not in js.read_text():
    js.write_text(js.read_text().rstrip("\n") + "\n" + JS)
print(f"menu button added to {changed} pages")
