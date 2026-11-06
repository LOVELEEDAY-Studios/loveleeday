ONE-BRAND KIT (public/site/assets/ob/)

Files: ob.css (chrome + tokens + components), ob.js (menus, reveal), ob-page-head.txt (the head lines every page carries).
Chrome: header, phone menu, footer and phone bar are stamped from the home page by
  node scripts/one-brand-chrome.mjs public/site/<page>.html      (run from the worktree root; --check to verify)
Never hand-edit the text between <!--ob:top--> / <!--/ob:top--> or <!--ob:bottom--> / <!--/ob:bottom-->.
Render: bash ~/arthur/scripts/ll-page-shot.sh <outdir> <page> [page ...]   (pages: arthur, notes/foo; sizes 1440x748 1440x900 1920x960 1280x640 390x844)

PAGE SKELETON
  <head> ...your title, description, canonical, share and card meta, schema, icons... then the lines in ob-page-head.txt
  <body class="ob"> <!--ob:top--><!--/ob:top-->  <main id="main"> ...sections... </main>  <!--ob:bottom--><!--/ob:bottom-->
  <script src="/site/assets/ob/ob.js?v=HASH" defer></script>
  CSS and JS links carry ?v=<first 10 hex of the file's sha1>. Page-only styles go in a scoped sheet (assets/ob/<page>.css), never in ob.css.

SHARE CARD GOTCHA: scripts/share-cards.mjs derives a page's card headline from the h1 and its card photo from the FIRST assets/*.jpg in the html, and the stamped chrome now carries nav images, so a stamped page would silently change its card. Pin both in the head, copying the values the page had before (git show origin/main:public/site/<page>.html):
  <meta name="card:headline" content="Line one. | Line two."><meta name="card:photo" content="the-old-photo.jpg">
  then `node scripts/share-cards.mjs --check` and `node scripts/check-site-consistency.mjs` must list nothing for your page. site-chrome.mjs skips pages with <!--ob:top-->; the consistency gate accepts ob.css pages.
Pages that keep scripts (arthur loads brain.js and site.js for its demo; forms load site.js) add those <script defer> tags after ob.js's siblings; ids and classes those scripts drive must stay.

TOKENS (ob.css :root): --ink --near --muted --line --blue --cream --foot, --sans Switzer, --serif Sentient, --pad (page margin), --sec (section padding), --nav.
Wrapper: <div class="ob-wrap"> ... </div>. Section: <section class="ob-sec"> (add ob-sec--white or ob-sec--dark). Type: .ob-h1 .ob-h2 .ob-h3 .ob-lede (serif) .ob-p .ob-meta.
Buttons: <p class="ob-btns"><a class="ob-btn ob-btn--blue" href="/contact">Talk to us</a><a class="ob-btn ob-btn--ink" href="/how-it-works">How it works</a></p>
  (on photos or dark: ob-btn--ghost). Links in text: class="ob-link".
Reveal: add data-ob-reveal to a block; it rises in once, and is off under prefers-reduced-motion.

1. PHOTO HERO (the page's first screen; one per photo page; h1 lives here)
  <section class="ob-hero" style="--pos:50% 40%">
    <div class="ob-hero-ph"><img src="/site/assets/X.jpg" alt="..." width="1880" height="1253" fetchpriority="high"></div>
    <div class="ob-hero-in"><h1>Headline.</h1><p class="ob-hero-lede">One plain sentence.</p>
      <p class="ob-btns"><a class="ob-btn ob-btn--blue" href="/contact">Talk to us</a><a class="ob-btn ob-btn--ghost" href="/arthur">Meet Arthur</a></p></div>
  </section>
  Text sits bottom right; add ob-hero--left to sit bottom left, ob-hero--wide for a longer headline. --pos is the object-position, set so faces stay clear of the text.
  Use only photos at least 1880px wide here. Phone shows the photo, then the text on dark.

2. LIGHT HERO (text-led pages)
  <section class="ob-lead"><div class="ob-wrap"><h1 class="ob-h1">Headline.</h1><p class="ob-lede">Lede.</p><p class="ob-meta">Last reviewed ...</p></div></section>

3. QUESTION AND SOURCED ANSWER (a different question on every page; label illustrative ones)
  <section class="ob-sec ob-top"><div class="ob-wrap ob-qa"><h2 class="ob-q">The question, asked as a person would?</h2>
    <div class="ob-a"><span class="ob-who">Arthur</span><p class="f">The answer in one sentence.</p><p class="y">What it means.</p><p class="n">What to do.</p>
    <p class="src">Source: the records.<span>Example data.</span></p></div></div></section>      (works inside ob-sec--dark too)

4. PHOTO PLUS TEXT
  <section class="ob-sec ob-scene"><div class="ob-wrap ob-scene-in"><figure class="ob-scene-ph" style="--ar:3/2;--pos:50% 40%"><img src="..." alt="..." width="1880" height="1253" loading="lazy"></figure>
    <div class="ob-scene-tx"><h2 class="ob-h2">Heading.</h2><p class="ob-lede">Lede.</p><p class="ob-p">Body.</p></div></div></section>
  ob-scene--flip puts the photo on the right. ob-scene--bleed runs the photo to the page edge (omit the ob-wrap padding: the class handles it). Keep photos at native size, never upscaled.

5. LARGE FIGURE (numbers set huge; only real or labelled-example numbers)
  <div class="ob-figs"><p class="ob-fig"><b>9</b><span>what the number counts</span></p> ... </div>

6. RULE-SEPARATED LIST
  <ul class="ob-rules"><li><b>Title</b><span>One or two plain sentences.</span></li> ... </ul>      (ob-rules--stack for one column)

7. HEADING LEFT, CONTENT RIGHT (legal and reference rows)
  <div class="ob-split"><h2>Row title</h2><div class="ob-prose"><p>...</p></div></div>

8. DARK CLOSING BAND (last thing before the footer)
  <section class="ob-close"><div class="ob-wrap"><p class="ob-close-l">A quiet serif line.<em>Second line in italic.</em></p>
    <p class="ob-btns"><a class="ob-btn ob-btn--blue" href="/contact">Talk to us</a><a class="ob-btn ob-btn--ghost" href="/how-it-works">How it works</a></p></div></section>

9. NOTE / ARTICLE BODY
  <article class="ob-sec"><div class="ob-wrap"><div class="ob-prose ob-prose--serif"><p>...</p><h2>...</h2><blockquote>...</blockquote><ul><li>...</li></ul></div></div></article>
  Plain legal text: ob-prose without --serif. Images inside .ob-prose scale down only.

RULES THE KIT ASSUMES: one h1 per page (inside the hero); no stock icons, no icon pills, no gray cards; alt text on content images; no prices; no emojis or em dashes in copy.
