# Animation walk with Stephen, 19 November 2026

Stephen walks the staging site page by page and says what to animate. Mostly text masks and fades. This file is the running list: every item, its screenshot, and its status. Check work against Stephen's words here before calling an item done.

Screenshots: `docs/feedback/images/2026-11-19/`.

**Rules from Stephen (apply sitewide):**

- **Fade means fade:** opacity only. No slide, no rise, no scale. In code that is `data-reveal="fade-only"`.
- **Text links get a fade:** any text link under a text line animation ("Uncover our history", "Discover more", and the like) fades in.
- **Attribute on the element itself** in the Designer, never on a wrapper and never applied by class in code (issue #293).
- **Show before release:** preview changes locally and let Stephen see them before they go to staging.

Status: `open`, `in progress`, `preview` (ready to look at locally), `live` (on staging), `held`.

## Scroll and venue sections (earlier today)

| # | Item | Status |
|---|---|---|
| S1 | Venue scroll sections got stuck on a trackpad until a click (`s1-corporate-venues-stuck.webp`) | live, v1.3.1 |
| S2 | Old venue text has no outro and hides when the next image is in; new text starts at 60% of the wipe; no text flash during the wipe | live, v1.3.6 |
| S3 | Scrolling up out of a venue section (first venue, e.g. Home "Zuma") masks the text out instead of vanishing (`s5-home-zuma-outro.webp`) | live, v1.3.6 |
| S4 | Phone tab selector glides to its new width, no label fade, menu icon does not shrink, sitewide (`s4-tab-selector.png`) | live, v1.3.6 |
| S5 | Map section freezes briefly on the first scroll over the map | in progress, separate session (map-scroll-freeze) |

## Home

### A1. Hero image zoom is sometimes jittery

- **Where:** Home hero (and every page hero with the load zoom, M23).
- **Stephen:** the scale is sometimes jittery or sticky, maybe because it runs while the page is still loading.
- **Screenshot:** `a1-home-hero.webp`.
- **Status:** open.

### A2. Fade on text links

- **Where:** Home "West Coast Hospitality since 1924" ("Uncover our history"), Home "Wellness" ("Discover more"), and every text link like them.
- **Stephen:** add a simple fade to these links.
- **Screenshots:** `a2-home-history-link.webp`, `a2-home-wellness-link.webp`.
- **Status:** open.

### A3. Rooms & Suites block has no animation

- **Where:** Home "Rooms & Suites" full-bleed block.
- **Stephen:** text mask on the title and the subtitle; fade (opacity only) on "Explore more".
- **Screenshot:** `a3-home-rooms.webp`.
- **Status:** open.

### A4. Art & Stories large image: fade and scale, not a mask

- **Where:** Home "Art & Stories", the large framed image.
- **Stephen:** not a mask reveal; it should fade and scale in (the `image-fade` style).
- **Screenshot:** `a4-home-art-image.webp`.
- **Status:** open.

### A5. FAQ answer text does not animate

- **Where:** Home FAQs, the open answer text under the first question.
- **Stephen:** it shows before everything else comes in; it needs an animation.
- **Decision (Stephen):** text mask, the same as the questions.
- **Screenshot:** `a5-home-faq-answer.webp`.
- **Status:** open.

## Rooms

### R1. Quiz steps replay a broken-looking mask on phones

- **Where:** Rooms page quiz ("Who's checking in?"), phones.
- **Stephen:** tapping an answer shows the mask intro animation again and it looks broken. Stop it there, probably on phones only; perhaps a `no-animate` style attribute.
- **Screenshot:** `r1-rooms-quiz.webp`.
- **Status:** open. To check: which mask replays (step copy, buttons or the photo) before choosing the fix.
