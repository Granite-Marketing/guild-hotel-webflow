# Animations feedback (Trello, Guild-Dev-QA, "Animations" list)

Catalogued 2026-11-09 from `https://trello.com/1/boards/Jvfr4sv3?cards=open&checklists=all`. Board order.

| # | Card | Ask (client words, trimmed) | Status |
|---|------|-----------------------------|--------|
| 1 | [General Text/Image Scroll Animation](https://trello.com/c/KqYXqR5h) | No description; Stephen to explain. | Open |
| 2 | [Desktop-CTA-Buttons](https://trello.com/c/SZuQQHRK) | Hexagon CTA buttons animate as now, but hover turns them outlined: light background with dark text becomes light outline with light text. The inverse of the homepage Rooms section animation. | Open |
| 3 | [Desktop-CTA-UnderlineText](https://trello.com/c/gZijWKzF) | Underline disappears, then mask reveals left to right on hover, with easing. | Open |
| 4 | [Script Reveal](https://trello.com/c/EYNUTb3D) | No description; Stephen to explain. | Open |
| 5 | [Offers & Packages](https://trello.com/c/CNbZe6BS) | Currently a dissolve; make it a text mask reveal like the large hexagon sections. | Open |
| 6 | [Homepage-Desktop](https://trello.com/c/jpoQvaQd) | a) Wellness section image animation slower, too sensitive. b) Meetings section: hover only swaps the image; clicking a space or the CTA goes to the Meetings & Events page. | Open |
| 7 | [RoomsIndividual-Desktop](https://trello.com/c/TUnd0W4L) | Offset image/text section soft dissolves in on scroll with easing. | Open (scrollReveal module ready, untagged) |
| 8 | [History-Desktop](https://trello.com/c/WoIQFRFW) | a) George Marston stamp dissolves in on scroll. b) Timeline sticky middle number appears in the middle of the first large picture. c) "Once opened never closed": unify padding so text is centred between the two sections. d) Timeline number transitions (text and box) smoother. | Open |
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
