# LOVELEEDAY landing page: round N, five new concepts (6 November 2026)

The owner liked The Day best of the last round: a timetable of one working day, 7:40 AM to 7:15 PM, with Arthur answering questions and managing the data through it. He has now picked the evening table photograph for the home hero. He wants five new concepts built on those two things, and he wants to be wowed. He compares this to apple.com, stripe.com and google.com. This page pitches clients and also advertises so people can join on their own.

Read in this order: `BRIEF.md`, then `BRIEF-D.md`, then this file. All of their rules bind you, including locked brand colors and type, keep and kill lists, copy rules, motion standard, nav dropdowns, the designed phone experience, the 12:40 proof moment, the join block and arrow-key pitching. Where this file differs, this file wins.

Study before you design: `d-the-day/`, `d1-straight/`, `d2-problem/`, `d3-your-day/`. Reuse their nav, dropdowns, footer, phone menu, bottom sheet, join block and hour data where they work. A new idea built on broken scenes fails, so take what is good and rebuild the page around your idea. Do not hand back d1 with a new hero.

## The photograph
`shared/evening-table.jpg` (2400 x 1600, the owner's pick). Friends at a candlelit table. It must appear in the first viewport at 1440 and at 390, as a real photograph at a size that shows it, and it must return or resolve at the end of the day. Faces stay clear: no text, card, panel or gradient block over a face. Do not recolor it. Do not generate or alter any image.

## The story every concept tells
A full working day, solved hour by hour, so people get to the table. Span schools, manufacturing, property, government, nonprofits, retail and professional services. Use no more than six hours between morning and evening. Each hour: a plain question a person would ask, an answer in Sentient, where it came from, what to do next. Label data as an example day. No invented customers, no invented results, no statistics about the market, no hours-saved claims stated as fact. A number inside a labeled example is fine.

## What failed before, do not repeat
- "Basic", "boring, no character", "AI slop", "reads like a newspaper" on phones, missing dropdowns.
- Sheets of rectangles with an eyebrow, headline and paragraph.
- Long pinned holds with nothing moving. No empty mid-scroll frames. Open pins must never show a blank field.
- A dark gradient on the left of a photo with white text, as the only composition. The first viewport of each concept must be a composition a designer would be proud of, different from the other four.

## Hard limits
Work ONLY in your folder `public/concepts/<slug>/`. Never edit `public/site/`, other concepts, or shared brief files. Static files, no build step, no CDN, local fonts only. Paths: `../../site/assets/<file>`, `../vendor/<file>`, `../shared/evening-table.jpg`.
No em dashes. No emojis. No exclamation marks. No "Arthur 4.0". Nothing may show the page was AI-made, in copy, comments or file names. No stock line icons, icon pills, or STEP labels. No public prices, "free", or trial language. Never mention Kalamazoo, Michigan, bars or restaurants as the frame. Public name is LOVELEEDAY. No vendor names. No claims of certifications. Rejected photos stay rejected. Do not upscale a photo. Support `?static=1` and `prefers-reduced-motion`. Target 12,000px or less at 1440.

## Finish
Render with `~/arthur/scripts/concept-shot.sh <slug> ~/.arthur/data/signoff/loveleeday-landing-2026-11/round-n/<slug> 1440,390 12` and read the frames with your own eyes, including mid-scroll frames and phone frames. Zero overflow is not proof: look. Fix what you see and render again, at least twice. Do not commit or push. Report under 120 words: path, the one idea, what moves, and anything unfinished or unverified.
