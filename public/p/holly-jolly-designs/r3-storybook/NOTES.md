# r3-storybook: "Illustrated World"

## Concept
The whole site is one snowy holiday street at dusk. The hero is the start of the street; vertical scroll pins the stage and walks you horizontally past six houses, each with a lit arched window showing a different family's celebration (tamalada, Doorstep Diwali, Eight Nights, two dads and a star, grandma's table, the sled hill with a wheelchair parked at the summit). The window nearest centre (or hovered, focused, tapped) lights up and unrolls its matching wrapping-paper sheet with a gift tag and "Add roll". After the street: the rolls (patterns built from the same scene motifs), a six-arch print library, the offer as a big gift tag plus a ledger, a named-artists section and footer. Fraunces (SOFT 100, WONK 1, opsz 144, tracking -0.04em), Instrument Sans body, Shantell Sans accent. Parallax layers: sky 0.1x, far skyline 0.3x and 0.5x, street 1x, foreground snow 1.3x, canvas snow.

## References (Dribbble, ./refs)
1. illustrated-website-06 (Candid Leap): textured flat illustration with a grain, calm two-tone palette; taken for the grain and flat-shape-plus-highlight treatment of the scenes.
2. illustrated-website-05 (SUSO rink pop-up): arched photo frames, sticker accents and offset hard shadow on buttons; taken for the arch window motif, sticker/tag chips and the pressed button.
3. storytelling-scroll-website-il-01 (noomo XR): illustrated world told through scroll, with a progress indicator; taken for the scroll-driven narrative and the HUD progress readout.
(The third query's sheet failed in the ref tool, so I read queries 1 and 2 only. I viewed 7 refs at full size.)

## IMAGERY: honest status
OpenAI, Gemini, HuggingFace/fal, Replicate and finally Recraft all returned no-credit errors (Recraft: `not_enough_credits`, two attempts). No raster art was generated. `imagery/jobs.json` (OpenAI/Gemini shape) and `imagery/jobs-recraft.json` (9 jobs) are ready; run the Recraft command once credit exists. All art in index.html is hand-built inline SVG (6 scene illustrations, 6 houses, 6 seamless patterns, the roll product shot) with a displacement "wobble" filter plus a fixed grain overlay. It is a stand-in for the generated set, not a replacement; the product shot is a vector illustration, not a photograph.

## FINAL UPDATE (after Daniel's "finish")
Swapped in the shared gpt-image set via ../../imagery/: pattern-long-table / pattern-light-up / pattern-snow-day (quadrant-cropped via background-size 200%) are now the paper that unrolls from each window and the six-arch print library; hero-rolls-gift.png is the product shot (roll-cutout/gift-cutout are not actually transparent, they carry halo backgrounds, so I did not use them). The SVG street, houses and window scenes stay; they sit acceptably next to the screen-print patterns (flat shapes, warm palette) but are simpler and cleaner than the textured raster. Scores now: concept 9, imagery 7, type 8, composition 8, detail 8. Extra weakness: only 3 source patterns, so prints 4-6 are different crops of the same three; swatch crops sometimes cut figures.

## Self-scores (before the swap, after 3 critique rounds)
- Concept 9: one idea carried from hero to footer; hover/scroll reveals the product.
- Imagery 6: consistent and charming as a set, but flat vector with simple figures (no hands, no real gouache texture); not the pro art asked for.
- Type 8: Fraunces display with tight tracking, hand script accent used sparingly; some headlines wrap to three lines.
- Composition 8: varied rhythm (pinned horizontal walk, arch-topped rolls panel, staggered arch library, tilted tag offer); artists section is the plainest.
- Detail 8: lights wire twinkle, window bulbs, sheet unroll, lit-window glow, cart drawer with free-shipping meter, header tone switch.

## Weaknesses
- Imagery is the main gap (see above). Faces are dots; skin ramp is used but figures are small inside the windows (windows are ~60% of house width).
- Horizontal walk depends on JS and a tall scroll runway (600vh); reduced-motion users get no smoothing but still the same pin-scroll.
- Mobile hero shows only a peek of house 1 and shortened copy; the lit-window sheet is hidden on house 1 on mobile.
- Hover reveal is mirrored by auto-light at screen centre for touch; keyboard focus works, but the sheet's "Add roll" button is only reachable once a panel is lit.
- Last print swatch in the library scrolls off-screen on desktop at 1440.
- Cart is a front-end demo only.

Files: index.html, hero.png, desktop.png (street collapsed to hero, full page), mobile.png, plus s2/s3/s6 (street at 30%/62%/97% scroll), m1/m2 (mobile).
