# In Progress feedback (Trello, Guild-Dev-QA, "In Progress" list)

Catalogued 2026-11-16 from the board export. Only cards in "In Progress"; open checklist items and the latest client note per card. Decisions are Stephen's answers, card by card.

| # | Card | Open asks | Decision |
|---|------|-----------|----------|
| 1 | [Nav-Desktop](https://trello.com/c/hL8CHoP2) | a) Open nav: background changes on hover of each page, dissolve like elsewhere. b) Book Now hover. | a) Each nav page gets its own background image, set inside the nav component (component property or slot) so the client can swap images without touching code. Hover dissolves between them. b) Done, no work. |
| 2 | [Arts/Gallery Animation](https://trello.com/c/IgLotIVs) | Omar's Loom "Fixing Desktop Glitches and CTA SVGs" (2026-11-13). | See below. |

### Card 2: Arts and Gallery (both gallery pages unless noted)

Screenshots in `docs/feedback/images/2026-11-16/card2-*.webp`.

1. Opening the gallery: the images grow slightly wider after load, a layout shift. Find the cause (likely flex sizing) and remove it.
2. Artwork modal: remove "The Guild Hotel" logo shown top right (`card2-modal-logo`).
3. Artwork modal: the Back button aligns optically with the top edge of the image (`card2-back-button`). Verify by screenshot.
4. Filter bar: the zoom control sits to the left of the filter menu, on one row, and the pair is centred (`card2-filter-zoom`).
5. Filter menu shape: corners less sharp, cut at the angle in Omar's reference (`card2-filter-shape-reference`). Omar confirmed this applies to every filter menu on the site. He is sending an SVG of the shape; the ticket stays open until it is applied from that SVG.
6. Arts page only (dark background): invert the filter colours, wine becomes the text colour and cream the background. The other gallery is on a light background and keeps its colours.
7. Modal back chain: opening a modal from a link inside another modal (artwork, then its artist), Back returns to the previous modal (the artwork), not the gallery grid (`card2-modal-back-chain`).

### Card 3: [Offers & Packages](https://trello.com/c/CNbZe6BS)

Animation approved. The Offers & Packages section is exactly 100vh on every page that uses it, the same height everywhere (History is currently taller). Copy must fit that height; nothing scrolls or grows the section.

Note to Omar (post on the card): "Fixing this section at one screen height everywhere means the copy has to be short, a line or two per offer rather than whole paragraphs, or it will crowd the image and throw off the proportions."

### Card 4: [Paragraphs-Desktop](https://trello.com/c/BL9zxd94)

Paragraphs are 18px now. Duplicate the History page as a test page with body paragraphs at 16px (on that page only, via a page-level combo or override, not the global style), kept out of search and the sitemap, and send Omar the link. The live pages stay at 18px until he decides.

### Card 5: [Press-Desktop](https://trello.com/c/E0QHDkqQ)

Each Press CMS item has an external URL field (add it if missing) and the card links to it in a new tab (`target="_blank"`, `rel="noopener"`). Until Omar supplies real article URLs, fill it with the homepage of the publication named on the item (e.g. National Geographic's homepage); where no publication is identifiable, use `https://www.google.com`. Tell Omar these are placeholders.

### Card 6: [Desktop-CTA-Buttons](https://trello.com/c/SZuQQHRK) (includes the Meetings key features CTA)

Omar's older Loom is already actioned; no SVGs are coming for buttons. Open: the outlined (hover) hexagon looks choppy, aliased or clipped on some pages, and the Meetings key features CTA outline is thicker than the rest. Fix in our own code: one outline thickness across every hexagon CTA, clean anti-aliased edges with no clipping. QA every page that has a hexagon CTA at 1440 and capture before/after.

### Card 7: [History-Desktop](https://trello.com/c/WoIQFRFW)

1. New optional attribute `data-reveal-start="<number>"` on any `[data-reveal]` element: the reveal starts when the element's top reaches that percentage of the viewport height from the top (e.g. `60` means `top 60%`). Without it, the current default start stays. Reveals still play once; no end point. Document it beside `data-reveal-delay` in the module header and `docs/reference/`.
2. Use it on History: the George Marston stamp starts earlier (as it enters view), and "Once opened, never closed" starts later (well into view). Set values in Webflow and tune by eye on staging.
3. History page images use `image-mask` instead of `image-fade`.

### Card 8: [Corporate/LegalTemplate-Desktop](https://trello.com/c/IQLsNstG)

1. Key features cards (`card8-key-features-hover`, Omar's Loom "Remove Hexagon Overlay, Use Image Contrast"): remove the hexagon panel. The image gets a dark overlay and the text sits directly on it in the brand light colour with good contrast; hover keeps this treatment.
2. "Designed for focused work" right column images (`card8-designed-for`): use `image-mask`, not the slide up. Text follows the Neighborhood equivalent section.
3. Map section (same bug on Neighborhood and Meetings, one fix for all three): the first time you scroll over the map it pauses or stutters. Stephen's guess: the embedded map catches scroll under smooth scroll. Diagnose on staging before fixing; candidate fixes are making smooth scroll ignore the map, or letting the map take pointer events only after a click. Page scroll must pass over the map without a hitch.

Card 6 addendum: the clearest example is the Meetings "Key features of our spaces" Book Your Space CTA (`card6-meetings-cta.png`, zoomed `card6-meetings-cta-zoom.png`): the diagonal edges of the outline look soft and stair-stepped, like text anti-aliasing, next to the crisp straight edges. The fix must give crisp, even diagonals at 1x and 2x (consider an SVG stroke instead of a clip-path ring if the ring cannot be made crisp).

### Card 9: [MeetingsCollection-Desktop](https://trello.com/c/zlJ4hyvS)

1. Form questions: waiting on Omar. Out of this build.
2. CTA outline: covered by card 6.
3. Map: stutter covered by card 8.3. Guild location pin: see below.
   Pin: already sorted, no work.

### Page load and scroll (site-wide, raised under card 9 "map is broken here as well")

Wider than the map: while a page loads, smooth scroll does not respond; when it starts, the page jumps back up. The hero text load animation looks poor at the same time. Likely one root cause (suspects: init waiting on every image before smooth scroll and ScrollTriggers start, scroll restoration or anchor scroll correcting position, the "scroll to the end correctly" handling). Diagnose first on staging (record a load, note when scroll becomes live and what moves the page), then fix the cause once. Done when: a page scrolls from the first user input, never jumps back, the hero text reveal plays cleanly once, and the map stutter (card 8.3) is gone on Corporate, Neighborhood and Meetings.

### Cards 10 and 11: [Neighborhood-Desktop](https://trello.com/c/soExZdmc), [HappeningsIndividual-Desktop](https://trello.com/c/5STTyFvH)

Image zooms very slightly on hover (Stephen: subtle, past zooms were too strong; around 1.03 to 1.05, eased) on the Neighborhood "Beyond Downtown" cards and the Happenings "More around town" cards. Reuse the existing image hover scale behaviour. Neighborhood map: covered by "Page load and scroll".

Card 6 scope: the soft, stepped outline edges happen on every hexagon button site-wide, so the fix is global, not per page.

### Card 12: [General Text/Image Scroll Animation](https://trello.com/c/KqYXqR5h)

Stephen is not yet happy that every block uses the right reveal. Rules:

- Large, floating image blocks use `image-mask`, not the scale-in (`image-fade`). Example: Neighborhood "Beyond Downtown" images (`card12-neighborhood-floaty-images`).
- Text over full-bleed image sections animates in. Example: home "Rooms & Suites" heading and paragraph do not animate today (`card12-home-rooms-text`).

Audit every page at 1440: list each block with its current and expected reveal in `docs/feedback/reveal-audit-2026-11-16.md`, fix what the rules settle, and flag the rest for Stephen to review page by page.
