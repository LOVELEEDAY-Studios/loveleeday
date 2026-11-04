# LOVELEEDAY landing page: three variations of The Day (November 2026)

The owner picked concept D, The Day, as the best explanation of the problem we solve. This page is what we pitch clients with AND what we advertise so people can join on their own. Read `BRIEF.md` first: its locked brand, keep and kill lists, copy rules, motion standard and self-check all still bind you. This file adds to it. Original to compare against: `public/concepts/d-the-day/`. Your folder starts as a copy of it. Work ONLY in your own folder.

The owner's corrections, all mandatory on every variation:

## 1. Real navigation with dropdowns (he called out that they are missing)
Desktop: hover and click dropdown menus on Product, Solutions, Services, Company, with keyboard support, Escape to close, and `aria-expanded`. Use the real groups from the footer in `d-the-day/index.html`. Add Industries inside Solutions. It must look premium, like stripe.com or apple.com's menus: a real panel with grouped links, a short description per link, one featured item. The nav is fixed to the viewport, stays readable over every scene (use its own bar background; contrast over photos was weak), and shows Sign in, a quiet "Talk to us", and a solid blue "Get started".

## 2. The phone version must read like a real product site, not a newspaper
He said the current mobile "reads like a newspaper". Stacked columns of serif text are the failure. Build a designed phone experience, not a reflow:
- Each hour is one screen: a full-bleed photo with the clock over it, then the exchange as a phone conversation. The question is a sent bubble (blue, right), the answer a received bubble (white, left) in Sentient, kept to one or two sentences.
- Tap the answer's source chip to raise a bottom sheet with the record line. A real sheet: drag handle, backdrop, close.
- Hamburger opens a full-screen menu with accordion groups matching the desktop dropdowns.
- A sticky bottom bar with "Get started" and "Talk to us", respecting the safe area, hidden while the sheet or menu is open.
- A thin day progress indicator showing where you are from 7:40 AM to 7:15 PM, tappable to jump.
- Horizontal swipe or scroll-snap is welcome where it helps. Tap targets 44px. No horizontal page overflow. Nothing pinned that fights thumb scrolling; prefer CSS scroll-snap on phones.

## 3. Product proof: the 12:40 screen is the proof moment
Bring E's click-any-number into D. Read `public/concepts/e-show-your-work/e.js`, `e.css` and `e2.css`. At 12:40 the page stops, a real answer sits large, and the visitor clicks a figure to open its record list, then a line. It should work without clicking too: it demonstrates itself once if nobody interacts. Build it as real HTML, not a screenshot, large enough to read at 1440. Keep example data generic and labeled.

## 4. Shorter
The original is 18,500px at 1440. Target 12,000px or less at 1440. Cut the weakest hours; keep hours that show different kinds of work, and no more than six hours between the opening and dinner. No scene may have an empty hold. Every mid-scroll frame has something worth seeing.

## 5. Every hour visibly solves something
Answers are the focal point, not the photos: main answer at least 28px at 1440, source line at least 15px and clearly connected to it. Keep found, why it matters, next step. Span schools, manufacturing, property, government, nonprofits, retail, professional services. Do not frame the company around bars or restaurants; if the kitchen scene stays, it is one hour of many.

## 6. Motion quality
The wipes must feel deliberate and expensive: one consistent transition grammar, no half-empty frames, no text fading in on a blank field. Motion must hold up beside apple.com. Animate transform, opacity and clip-path only.

## 7. It must convert, two ways
- Self-serve: a "Get started" path. Near the end, a real-feeling join block: work email, organization, and "What is the first question you would ask?", leading to a confirmation screen. It is a front-end mock: never submit anywhere, keep it on the page. Say what happens next in plain words: bring one question, connect one system read-only, see your first answer. No prices, no "free", no trial length, no customer counts, and no promise of instant access, since none of that is confirmed.
- Pitching: left and right arrow keys jump hour to hour so someone can present this page live on a screen. Show the keys nowhere; it just works.
Keep the ending: "We give the day back." / "So you can be here." Real footer.

## Standing rules that apply here
Never mention Kalamazoo, Michigan, bars or restaurants as the frame. No public prices. No em dashes. No emojis. Nothing may show the page was AI-made, including comments and file names. Stock line icons, icon pills and "STEP 1" labels read as AI generated: use none. Never use hero-decision.jpg, hero-team-desktop.jpg, hero-team-phone.jpg, hero-home.jpg or ph-home.jpg. Never upscale a photo: hero-size use only for files 1800px or wider, and outdoors.jpg and dinner.jpg are 940px wide, so keep them small enough to stay sharp. No answer card over a face. Vary the example question across scenes. Example data labeled. Colors and fonts are locked.

## Self-check
`~/arthur/scripts/concept-shot.sh <your-slug> <outdir> 1440,390 12`. Look at the frames with Read, including the phone frames. Errors and overflow must be empty, but zero overflow is not proof: the body hides overflow, so look. Open dropdowns and the sheet for the render by supporting `?open=nav` and `?open=sheet` in your page, and check those states too with a slug path that the tool accepts, or by a temporary copy that opens them on load, removed afterward. Never run local Chromium. Report what you saw, under 120 words: path, height at 1440, what changed, what is unfinished.
