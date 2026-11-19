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

## Room template (e.g. /rooms/guild-loft-suite)

### R2. "Back to rooms" link fades in

- **Where:** room template, the "Back to rooms" link under the hero.
- **Stephen:** add the fade, including the arrow icon.
- **Screenshot:** `r2-room-back-link.webp`.
- **Status:** open.

### R3. Room description: floorplan link and feature list fade

- **Where:** room template, "Room description" block.
- **Stephen:** "View floorplan" fades in. The feature list on the right (1 Queen Bed, 2 Guests, ...) fades in one row at a time, not text masked, so the left and right sides are not both masking at once.
- **Screenshot:** `r3-room-description.webp`.
- **Status:** open.

## History

### H1. Caption over the landmark photo needs a bottom gradient

- **Where:** History page, the full-screen landmark photo after the mask reveal, with the small caps caption bottom left ("Etiam imperdiet sodales...").
- **Stephen:** the caption is hard to read; add a gradient overlay at the bottom only, about the bottom 20 to 25% of the screen, not the whole image. The other images may already have an overlay; check why this one has none (it comes from the masked section).
- **Screenshot:** `h1-history-caption-overlay.webp`.
- **Status:** open. Build in the Designer (class or embed), not in code.

## Dining

### D1. Nav flashes when a full-screen mask section opens

- **Where:** Dining venue section (and other full-screen mask sections, including the room template).
- **Stephen:** when the section reaches full screen, the top menu flashes briefly. Possibly the light/dark nav check (`navTheme`) flipping while the frame opens.
- **Screenshot:** `d1-dining-nav-flash.webp`.
- **Status:** open. Sitewide fix in `navTheme`, likely new since today's venue changes; check v1.3.0 vs v1.3.6.
