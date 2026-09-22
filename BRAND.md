# LOVELEEDAY Studios — Brand Direction

> ## STALE. THE PALETTE BELOW IS NOT THE BRAND.
>
> **The live brand lives in `src/app/globals.css`. Read that, not this.**
>
> This file was last edited 2026-05-01. `globals.css` was edited 2026-09-21. On
> 2026-09-22 three portal studies were built from the palette below and every one
> of them was wrong — Daniel: *"what you gave vermillion is wrong and old outdated
> against our live site."*
>
> | this file says | the site actually uses |
> |---|---|
> | Ink `#111111` near-black | `--ink: #16243A` deep navy |
> | Paper `#F3F2EE` | `--ground: #FBF8F2` warm off-white |
> | Accent **Vermilion `#C84B31`** | `--teal: #0E7877`, with `--copper: #9B5C3E` secondary |
>
> `C84B31` appears **zero** times in `src/`. It was abandoned and this file was
> never updated. A stale brand file is more dangerous than a missing one, because
> it answers confidently.
>
> Everything below is kept for the written POV only — the voice and the reasoning
> are still useful. Take no colour, no hex and no type token from it.

## Visual POV

**Refined editorial meets high-craft engineering.** Think a well-made Swiss design annual from 1972 that somehow also ships code. Strong typographic authority, breathing room, disciplined restraint — the visual language of a studio that has done this before and doesn't need to shout. Not "creative agency portfolio." Not "SaaS startup." A practice that charges for precision.

The existing cream + black direction is correct. The upgrade: stronger vertical rhythm, genuine section differentiation through tone-on-tone backgrounds, a single bold accent used sparingly and with conviction, and a hero treatment that earns attention through scale and confidence, not decoration.

---

## Color Palette

| Role | Name | Hex | Use |
|---|---|---|---|
| Primary | Ink | `#111111` | Headlines, buttons, borders, nav |
| Background | Paper | `#F3F2EE` | Page base — warm white, not cold |
| Accent | Vermilion | `#C84B31` | Single CTA, active state, index numbers |
| Surface | Parchment | `#EAE9E3` | Section alternates, code blocks, cards |
| Muted Text | Pewter | `#5A5A55` | Body copy, labels, captions |
| Faint | Bone | `#D4D2C9` | Dividers, borders, placeholders |
| Success | Moss | `#2D6A4F` | Form success states |
| Error | Ember | `#C0392B` | Form errors, alerts |

**Rules:**
- Vermilion appears on exactly one element per viewport at any time — the primary CTA. Nowhere else.
- No gradients. No overlays. No translucency except deliberate glassmorphism-as-detail.
- Dark sections (footer, standout CTA block) use `#111111` background with `#F3F2EE` text — not gray-700.

---

## Typography

### Display — DM Serif Display
- Source: Google Fonts
- Weights: 400, 400 italic
- Rationale: High authority without the London newspaper feel of Playfair. Slightly wider set, friendlier at small sizes, excellent italics for pull-quotes. Used for all H1–H2 and the hero.
- Variable: `--font-display`

### Body & UI — Instrument Sans
- Source: Google Fonts
- Weights: 400, 500, 600
- Rationale: Google Fonts, humanist sans, looks finished at 14px. Not Inter. Has character at the label sizes we need. Works with the serif without fighting it.
- Variable: `--font-sans`

### Mono Detail — JetBrains Mono
- Source: Google Fonts (already wired)
- Weights: 400
- Rationale: Keep. It earns its place on index numbers, stack tags, "shipped in N days" labels, and any content that lives in `code` territory.
- Variable: `--font-mono`

### Scale
```
Hero:     clamp(3.5rem, 6vw, 7rem)    / DM Serif / weight 400 / leading 0.95 / tracking -0.04em
H2:       clamp(1.8rem, 2.8vw, 3rem)  / DM Serif / weight 400 / leading 1.05 / tracking -0.03em
H3:       1.25rem                     / Instrument Sans / weight 600 / leading 1.2
Label:    0.7rem                      / JetBrains Mono / uppercase / tracking 0.08em
Body:     1rem / 1.1rem lead          / Instrument Sans / weight 400 / leading 1.6
Small:    0.875rem                    / Instrument Sans / weight 400 / leading 1.5
```

---

## Spacing Scale (4px base)

```
xs:   4px   (0.25rem)
sm:   8px   (0.5rem)
md:   16px  (1rem)
lg:   24px  (1.5rem)
xl:   40px  (2.5rem)
2xl:  64px  (4rem)
3xl:  96px  (6rem)
4xl:  128px (8rem)
```

Page padding: `clamp(1.5rem, 5vw, 6rem)` horizontal on all sections.
Max content width: `1280px` centered.

---

## Radius Scale

Zero-radius as default. Sharp corners are the brand.
- `0px` — default for all cards, buttons, inputs
- `2px` — tech stack tags only (very slight softness)
- `4px` — focus rings, form inputs (invisible but accessible)

---

## Shadow Scale

No drop shadows on cards or buttons.
- `0 1px 0 rgba(0,0,0,0.06)` — subtle bottom rule for navigation
- `inset 0 0 0 1px var(--bone)` — card border alternative to shadow

---

## Hero Treatment Direction

**Oversized display type, full-bleed.** No photography. No video. No geometric decorations.

The hero is typographically composed: the studio name is not in the hero — it's in the navigation. The hero is one statement at maximum scale the viewport allows, set in DM Serif Display. Below that, a single-line sub-statement in Instrument Sans at 1.1rem with generous top margin. Then immediately: a proof strip in JetBrains Mono.

No hero CTA button in the hero block itself. The CTA lives in its own section further down. The hero does not sell — it establishes authority.

**Vertical rhythm:** hero text flows into an `overflow: hidden` strip with the proof items (11-day MVP, etc.) scrolling or displayed inline. Then a ruled divider.

---

## Photo / Imagery Direction

**No photography.** Zero stock imagery. Zero client logos (we don't have permission and they feel like proof-by-association filler).

Instead: code blocks styled as documentation excerpts, architecture diagrams in SVG, and the geometric logo mark at maximum scale. Each case study section uses a colored index number (Vermilion) and a thin ruling grid to create visual interest without imagery.

---

## Reference Sites

1. **Linear.app** — typographic authority, razor-sharp layout, zero decoration
2. **Vercel.com/new** — headline scale confidence, minimal chrome
3. **Railway.app** — dark/light duality, no-bullshit copy, technical credibility
4. **Resend.com** — warm-minimalist, clean docs energy on marketing pages
5. **Cron.com** (acquired by Vercel) — editorial grid, strong label/headline contrast

---

## Anti-Patterns

We are NOT:
- Using AI gradient orbs or mesh backgrounds
- Using floating 3D illustrations of any kind
- Using rotating testimonial carousels
- Using client logo bars ("trusted by 500+ companies")
- Using orange accents (already the SaaS default — Vermilion is different)
- Using purple or purple-blue gradients
- Using shadows to create card depth
- Using border-radius > 2px on anything structural
- Using "✨" or "🚀" in any copy, headings, or CTAs
- Using stock photography
- Using Inter or Roboto as a typeface
- Using center-aligned body copy
- Using animated background particles or parallax effects
