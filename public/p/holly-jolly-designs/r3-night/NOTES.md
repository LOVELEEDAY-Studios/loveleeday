# r3-night: CINEMATIC NIGHT

## Concept
The last hour of Christmas Eve. One idea: before the gifts are opened there is a table; we draw the people at it and put them on paper. Every section is a beat of that night: hero (table through the window, live 11:47 PM clock), a scroll-lit statement, three chapters (I The Table, II The Lights, III The Snow) each ending in a gift-tag chip for a real paper pattern, Family Set as a product launch (huge type, hairline spec table, candle-glow hover, working bag with free-shipping bar), artists on gift-tag cards, and a Dec 7 deadline with a real countdown to end of Monday Dec 7. Pomegranate is the only bright note (one CTA per view); marigold is glow and italic accents.

## References (Dribbble, in refs/)
1. dark-luxury-website-01 (Misk fragrance): giant high-contrast serif on near-black, thin gold underline links, product glowing in dark. Took: display type scale and the single warm-metal accent.
2. cinematic-landing-page-02 (Imeji): edge-to-edge dark photo, huge stacked headline bottom-left, small body copy bottom-right, timestamp metadata top-left. Took: hero composition and the live clock.
3. dark-luxury-website-04 (fireplace): hairline-ruled grid, restraint, nothing decorative. Took: the Family Set spec table and the quiet footer.

## Imagery: honest status
All image providers were out of credit (OpenAI 429, Gemini 429, Replicate 402, HF/fal 402 after two images, Pollinations 402, Recraft `not_enough_credits` on two attempts despite being reported live). Result:
- Generated fresh for this direction (Flux via HF/fal, before it ran dry): table.jpg (hero + chapter I), snow.jpg (chapter III).
- Reused, NOT new: hands.jpg (round-1 hands-wrapping, chapter II), product.jpg (round-1 rolls and gift on red, Family Set), pattern*.jpg (round-1 patterns, chips and artist tags), macro.jpg (r3-editorial plum macro, artists and deadline).
- Not generated (jobs ready in imagery/jobs.json and imagery/jobs-recraft.json): hero gift under single lamp, string-light bokeh plate, macro ribbon, night product shot, gifts under tree. Rerun the Recraft command once credit exists; names map to the existing slots.
- Bokeh (hero) and snowfall (chapter III) are live canvas effects layered on photos, not stand-in imagery.
- Originals as PNG in imagery/src/.

## Self-scores (round 3 final)
Concept 9, Type 9, Composition 8, Detail 8, Imagery 6.

## Honest weaknesses
- Imagery is below 8: the set is not one shoot. Table and snow are 1024x768 and soft at full bleed (grain and vignette hide it, not fix it); round-1 product and hands are warmer and more illustrative than the Cinestill brief. Hero faces are blurred but a right-hand profile is still readable.
- No single hero-gift-under-lamp or glowing night product shot, so the Family Set stage is a graded red-background photo.
- Artists section uses pattern names as placeholders, no fake artist names.
- Chapter I headline sits over busy wine glasses; relies on gradient for legibility.
- Statement words light on scroll; in the static full-page screenshot they are forced lit.
