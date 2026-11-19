# Animation walk with Stephen, 19 November 2026

Stephen walks the staging site page by page and says what to animate. Mostly text masks and fades. This file is the running list: every item, its screenshot, and its status. Check work against Stephen's words here before calling an item done.

Screenshots: `docs/feedback/images/2026-11-19/`.

**Rules from Stephen (apply sitewide):**

- **Fade means fade:** opacity only. No slide, no rise, no scale. In code that is `data-reveal="fade-only"`.
- **Text links get a fade, everywhere:** every static text link ("Uncover our history", "Discover more", "Browse the menu", "Enquire", and the like) fades in. Stephen will not call these out page by page any more; apply it sitewide.
- **Form submit buttons fade in, everywhere** (G3).
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
| S5 | Map section freezes briefly when the map appears (cause: Google's font load makes every animated text block re-measure) | live, v1.3.7 (PR #303); not yet checked on a real trackpad |

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

### D2. "Browse the menu" fades in

- **Where:** dining template (e.g. /dining/dining-gardenterrace), Dress code and Hours block.
- **Stephen:** simple fade.
- **Screenshot:** `d2-dining-browse-menu.webp`.
- **Status:** open (covered by the sitewide text link rule).

### D3. Right-hand image slides in; should mask in

- **Where:** dining template, the two-image row (bartender left, cocktail right). The right image slides in.
- **Stephen:** it should mask in, not slide.
- **Screenshot:** `d3-dining-right-image.webp`.
- **Status:** open.

### D4. "Enquire" fades in

- **Where:** dining template, Group dining & events block.
- **Stephen:** the same text link fade as elsewhere.
- **Screenshot:** `d4-dining-enquire.webp`.
- **Status:** open (covered by the sitewide text link rule).

## Guidelines (/guidelines)

### G1. Process list numbers do not animate

- **Where:** "Our process" list, the small numbers above each step (1 to 6). The step text already animates.
- **Stephen:** the numbers are missing an animation.
- **Decision (Stephen):** fade, timed with each step's text.
- **Screenshot:** `g1-guidelines-numbers.webp`.
- **Status:** open.

### G2. "Work from our collaborators" images mask in

- **Where:** the collaborator photos (with @username captions) and the large photo after them.
- **Stephen:** these should mask in, not fade and scale.
- **Screenshots:** `g2-guidelines-collaborators-1.webp`, `-2`, `-3`.
- **Status:** open.

### G3. Form submit buttons fade in (sitewide)

- **Where:** every form's submit button.
- **Stephen:** add a fade.
- **Status:** open.

## Blog listing (/blog)

### B1. Offers slider needs an intro animation

- **Where:** the "Offers & packages" split slider at the top of /blog (and the same slider wherever it appears).
- **Stephen:** asked for a recommendation; his idea is to mask the first image in from right to left, as the slides travel left to right.
- **Decision (Stephen, 19 Nov), played once when the slider scrolls into view:**
  1. The image masks in from its right edge towards the left.
  2. At 60% of that mask (the same handoff as the venue sections), "Offers & packages", the title and the line text-mask in, one after another.
  3. "Discover more" and the arrows with the 01 / 05 counter fade in last (fade only).
- **Screenshot:** `b1-blog-offers-slider.webp`.
- **Status:** open.

## Story template (offers & packages, happenings, blog posts)

### P1. Image pair: both images mask in

- **Where:** the story template's staggered two-image block (e.g. /happenings-stories/autumn-at-spa-adolphus). Same template for packages, happenings and blog posts.
- **Stephen:** one image masks in and the other fades in; both should mask in.
- **Screenshot:** `p1-story-image-pair.webp`.
- **Status:** open.

## Neighborhood (/neighborhood)

### N1. Right-hand list images mask in

- **Where:** "Dining around the Guild" (and the other tabbed lists: Arts, Beyond downtown, Services), the photos in the right-hand column.
- **Stephen:** make these images mask in.
- **Screenshot:** `n1-neighborhood-dining-images.webp`.
- **Status:** open.

### N2. Map panel "Directions" links do not animate

- **Where:** map section, "Steps from key legal addresses" panel, the "Directions" link on each row. Everything else there animates.
- **Stephen:** fix these (text link fade, per the sitewide rule).
- **Screenshot:** `n2-neighborhood-map-directions.webp`.
- **Status:** open. Same map panel on /meetings and /legal-corporate/corporate; fix all three.

## Meetings (/meetings)

### M1. Key features: images mask in, service list fades in

- **Where:** "Key features of our spaces" section, the right-hand column.
- **Stephen:** the right-hand images mask in. The "Event services" title already animates; the list items under it fade in too (one row at a time, like R3).
- **Screenshot:** `m1-meetings-features.webp`.
- **Status:** open.
