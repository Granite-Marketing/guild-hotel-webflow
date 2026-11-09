# Animations feedback (Trello, Guild-Dev-QA, "Animations" list)

Catalogued 2026-11-09 from `https://trello.com/1/boards/Jvfr4sv3?cards=open&checklists=all`. Board order.

| # | Card | Ask (client words, trimmed) | Status |
|---|------|-----------------------------|--------|
| 1 | [General Text/Image Scroll Animation](https://trello.com/c/KqYXqR5h) | No description; Stephen to explain. | Done v1.1.58 (2026-11-09) |
| 2 | [Desktop-CTA-Buttons](https://trello.com/c/SZuQQHRK) | Hexagon CTA buttons animate as now, but hover turns them outlined: light background with dark text becomes light outline with light text. The inverse of the homepage Rooms section animation. | Done v1.1.58 (2026-11-09) |
| 3 | [Desktop-CTA-UnderlineText](https://trello.com/c/gZijWKzF) | Underline disappears, then mask reveals left to right on hover, with easing. | Done v1.1.58 (2026-11-09) |
| 4 | [Script Reveal](https://trello.com/c/EYNUTb3D) | No description; Stephen to explain. | Done v1.1.58 (2026-11-09) |
| 5 | [Offers & Packages](https://trello.com/c/CNbZe6BS) | Currently a dissolve; make it a text mask reveal like the large hexagon sections. | Done v1.1.58 (2026-11-09) |
| 6 | [Homepage-Desktop](https://trello.com/c/jpoQvaQd) | a) Wellness section image animation slower, too sensitive. b) Meetings section: hover only swaps the image; clicking a space or the CTA goes to the Meetings & Events page. | Done v1.1.58 (2026-11-09) |
| 7 | [RoomsIndividual-Desktop](https://trello.com/c/TUnd0W4L) | Offset image/text section soft dissolves in on scroll with easing. | Done v1.1.58 (2026-11-09) |
| 8 | [History-Desktop](https://trello.com/c/WoIQFRFW) | a) George Marston stamp dissolves in on scroll. b) Timeline sticky middle number appears in the middle of the first large picture. c) "Once opened never closed": unify padding so text is centred between the two sections. d) Timeline number transitions (text and box) smoother. | Done v1.1.58 (2026-11-09) |
| 9 | [Subnav](https://trello.com/c/FjjStvdO) | Subnav anchor scroll slower and eased. | Done (`ANCHOR_SCROLL` in `src/utils/lenisGsap.ts`) |
| 10 | [Arts/Gallery Animation](https://trello.com/c/IgLotIVs) | Missing "canvas" style animations on both pages. | Parked |

## Stephen's notes (2026-11-09)

1. Use the `data-reveal` modes; only tagging elements is left. Covers 7 and 8a too.
2. Hexagon CTA hover goes from filled to outlined. Options: (A) existing inset-fill trick from `meetings-button.css` (works only on flat section colours); (B) ring-shaped `clip-path` polygon on a pseudo-element, a true transparent outline on any background, no SVG. Recommended: B.
3. Every underlined link: underline masks out, then back in left to right, eased. Pseudo-element or div.
4. "Script" means the handwritten script type: add a reveal animation.
5. Nav menu panels (the card title says Offers & Packages, the screenshot shows the menu): panels slide or text-mask in and out; align the back arrow, title and close X.
6. a) Wellness images smoother (scrub, delay). b) Meetings spaces link to the real URLs.
7. Offset image/text on room pages: image mask plus text mask.
8. a) Try the reveals. b) Sticky timeline year starts in the middle of the first large image. c) "Once opened, never closed" vertically centred between the sections. d) Smoother year transitions.
9. Make the eased anchor scroll global.
10. Parked.

## Item 1 plan: scroll reveal targets (survey 2026-11-09, 1440 wide)

Most candidate blocks live inside shared Webflow components, so tagging by attribute means editing each component definition. Proposal: `scrollReveal` also applies a selector map in code (same modes), so every page using a component gets it at once; `data-reveal` on an element still works and overrides.

| Mode | Targets |
|------|---------|
| image-mask | `.split-image-text-light_media`, `.map-feature_figure`, `.gallery-mosaic-captioned_figure` (staggered), `.home-art-stories_figure`, `.history-oasis_figure`, meetings feature card figures |
| text-mask | `.split-image-text-light_content`, `.script-intro-centered_heading` + `_paragraph`, `.map-feature_text`, `.gallery-mosaic-captioned_heading`, FAQ heading, `.card-carousel-header-left_heading` + `_text`, `.home-art-stories_heading` + `_text`, `.history-oasis_heading` + `_text`, `.rooms-individual-description_*`, `.rooms-individual-amenities_*` heading and text, `.meetings-collection-features_heading` + `_text` |
| fade | `.split-image-text-light_stamp` (George Marston stamp), `.script-intro-centered_figure`, CTA booking/newsletter text group |

Left alone: heroes (above the fold), enlarge-snap venue cards and wellness tab intro, image-trio collapse list, history timeline and landmark, sliders, rooms quiz.


## Shipped (v1.1.58, v1.1.59)

Items 1 to 9 are live on staging and were checked at 1440, 991, 800, 650 and 390. Item 10 is parked. Known gap: in the Reserve a table menu the lowest Reserve buttons settle about 4s after opening (below the fold).

## Round 2 (2026-11-09, v1.1.60)

1. Split image text (1924 intro): underlined button links only redraw the line; the label roll is off for them, site-wide.
2. Home venue stack (wellness): step 150 to 200, scrub 1.6, snap settles over 0.8 to 1.6s.
3. History intro: 1924 and 2026 centred on the title and subtitle group (`align-items:center`).
4. Year badges: digits lifted 0.065em to the optical centre (measured Sackers Gothic ink box).
5. Offers sliders: copy masks in line by line on every slide change, on every Offers Slider Split; `data-slide-mask="off"` on the root opts one out. No other slider shows one text slide at a time.
6. Underline on padded links (rooms quiz results, Safari): the line uses the content box, so it no longer runs into side padding.
7. New `data-reveal="image-fade"`: fade in while the image settles from a slight zoom. Now on Gallery Mosaic figures, Map Feature figure and Meetings feature cards; large split images keep the bottom-up mask.
8. Underline distance (mobile): the line now sits on an inline span round the link text, about 0.18em under the baseline on every link, instead of under the link box. v1.1.61.
