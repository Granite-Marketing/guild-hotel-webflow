# Global mobile fixes: done

Session: global (shared and cross-page classes). Every change is on the `small` breakpoint (767px and below; `tiny` where it had its own override). Desktop check: computed font, line height, spacing, padding, gap and min height of every element on 18 pages at 1440px, crawled before and after, show no value change on any class.

Before images are the audit captures already in `img/` (`home-1-live.jpg` nav, `home-13/14-live.jpg` FAQ, CTA and footer, `meetings-4-live.jpg` form, `press-*-live.jpg` cards, `happenings-collection-2-offers-cta-live.jpg` offers). After images: `img/after-global-*.jpg`.

## Type and buttons

| Row (source) | Class | Action | Change |
|---|---|---|---|
| G1 buttons (a, c, d, e, b) | `.button.is-chamfer`, `.offers-slider-split_button` | fixed | 16/16/0, 37 high, 24 side -> 14px / 18px / -0.05em, min-height 36px, side padding 25px (every combo inherits) |
| Text links (a home 3, c) | `.button.is-link.text-style-caps-caption-16` | fixed | 16/16 -> 14 / 18 / -0.05em |
| FAQ title, "other dining options", story h2 (a, b, c, d, e, f, history) | `heading-style-h2` | fixed | 30 -> 28px (lh 1, ls -0.05em already) |
| h4 headings: map card, dining, Downtown, Gaslamp, venue intro, card groups (a, d, e) | `heading-style-h4` | fixed | 20 / 24 / 0 -> 24px / 26.4px / -0.05em |
| Form group headings (c, e) | new `form-split-script-contact_fieldset-heading` on the h4 | fixed | 20px / 27px / -0.05em |
| Key features heading (e legal 03) | `.image-trio-text_heading.heading-style-h4` | fixed | 20px / 27px / -0.05em |
| Gallery heading (c, e) | `.gallery-mosaic-captioned_heading.heading-style-h4` | fixed | 28px / 28px / -0.05em |
| Venue card titles (a, b, c, e) | `heading-style-display` | fixed | 40 / 40 -> 28px / 28px / -0.05em |
| FAQ eyebrow and every plain eyebrow (a, b, c, d, e, f) | `text-style-eyebrow-caps` | fixed | 18 / 21.6 -> 12px / 18px (design system EYEBROW) |
| Footer column headings | `.footer-links_column-heading.text-style-eyebrow-caps` | fixed | kept at 18 / 21.6, ls 0 (Figma) |
| Map item names (e) | `.map-feature_text.text-style-eyebrow-caps` | fixed | kept 18 / 21.6, ls 0 |
| Wellness "discover more" link (a home) | `.image-trio-text_link.text-style-eyebrow-caps` | fixed | 14 / 18 / -0.05em |
| Article card titles (a press, d, e) | new `article-card-staggered_title` | fixed | 18 -> 14px / 16.8px / -0.03em |
| Gallery captions, back link, quiz link (c, e) | `text-style-caps-caption-16` | fixed | 16 / 19.2 -> 14px / 16.8px |
| Form detail labels (e legal 09) | `.form-split-script-contact_detail-label.text-style-caps-caption-16` | fixed | 12px / 18px |
| Copyright, credit, quiz counter, form label (a G19) | `text-style-caption` | fixed | 14 / 15 -> 12px / 18px |
| Bonvoy line (a G13) | `text-style-caption-tracked` | fixed | 14 / 14 / 0.7 -> 12px / 18px / 0.6px |
| Venue card copy, hero copy (a, b, c, e) | `text-size-large` | fixed | 18 / 28.8 -> 16px / 20px |
| Map intro and walk text (e) | `.map-feature_text.text-size-medium` | fixed | 16 / 20 -> 20px / 26px |
| Side effect | history "George Marston" split heading variant | fixed | kept 0 letter-spacing and 1.2 line height after the h4 change |

## Nav, CTA, footer, FAQ

| Row | Class | Action | Change |
|---|---|---|---|
| a G1 bar | `site-nav_bar` | fixed | 56 -> 64px high, padding 12px 20px |
| a G2 menu icon | `site-nav_toggle` | fixed | 28x12 -> 22x10 glyph in a 36x36 hit area at x20 |
| a G3 wordmark | `site-nav_logo` | fixed | 192x13 -> 186x12 |
| a G4, G5 mode icons | `site-nav_mode-icon` | fixed | 16 -> 13px (Figma 12 moon, 14 sun; one class) |
| a G6 divider 0.5px | `site-nav_modes-divider` | skipped | sub-pixel hairline, no visible gain |
| a G7, G8 lettering height | `cta-booking-newsletter_header` | fixed | min-height 70px (Figma 68 and 73) |
| a G10 email field | `cta-booking-newsletter_input`, `_label` | fixed | 37 -> 26px high |
| a G12 button label colour | `.button.is-chamfer.is-text-burgundy` | skipped | Figma mobile uses #262118, desktop uses burgundy; a mobile-only colour change was not worth the inconsistency without a design call |
| a G15 to G17 footer lists | footer CMS and static links | skipped | content, already an open client decision in the parity plan |
| a G18 link pitch | `footer-links_link` | fixed | min-height 36px |
| FAQ gap (a, b, c, d, f) | `faq-accordion_header` | fixed | row-gap 16 -> 12px |
| FAQ chevron (a, d, f) | `accordion_icon` | fixed | glyph 15x7.5 -> 10x5, centre moved 7px left |

## Shared components

| Row | Class | Action | Change |
|---|---|---|---|
| Offers pager (a, b, c, d, e G2, f) | `offers-slider-split_arrow`, `_controls`, `_counter` | fixed | arrows 30x14 -> 36x36 hit area (icon 24x18), gap 16px, row 36px, counter 12 / 14 |
| Offers min-height 804 (f, b) | `offers-slider-split_item` | skipped | the pager fix adds the missing height on most pages; a fixed min-height would clip slides with long copy |
| Carousel label (a, c, d, f) | `card-carousel-header-left_label` | fixed | ls -0.6 -> -0.05em |
| Carousel bottom (d, f) | `card-carousel-header-left_slider` | fixed | padding-bottom 24px |
| Section padding G3 (e) | `padding-section-large` | skipped | a global 40 -> 120 would move every section on every page; page sessions already set paddings on their own section families |
| Hero overlay 0.4 -> 0.5 (f) | `hero-fullbleed-centered_overlay` | skipped | only the gallery and arts audit reports it; other hero frames were not confirmed |
| Venue card header eyebrow 14px (c, f) | plain `text-style-eyebrow-caps` in `venue-card-fullbleed_header` | partly | now 12px from the eyebrow fix (Figma 14); needs an element class, left with the venue card work already in progress in page sessions |
| Script intro, tab-pills intro, map script, form script sizes and rotations | `text-style-script` combos | queued back | per-page values (27 to 56px); page combos belong to page sessions |
| Venue card start clip, pinned stage height, split-image order and sizes, gallery figure aspects, overlay panel | component layout | queued back | layout work inside component families already being changed by page sessions this run; not touched here to avoid two writers |

## Final shared-queue pass (after page sessions)

Inputs: `shared-queue.md` in the integration checkout and the queued rows in `a`, `b`, `c`, `d`, `e`, `f` done files. Desktop check repeated on 18 pages at 1440px: no computed value change against the original baseline.

How per-page script sizes work now: `.script-intro-centered_heading.text-style-script.is-large` and `.tab-pills-intro_heading.text-style-script.is-large` use `font-size: 1em` below 768px, and the parent header sets the size. Variant styles on the header can then win (a variant compiles to `:where()` and could never beat the three-class combo on the heading itself).

| Queue row | Action | Change (below 768px) |
|---|---|---|
| Script intro sizes: home, dining, rooms, room template, guidelines, arts, neighborhood, legal, corporate, history (a, b C6, c, e, f) | fixed | `script-intro-centered_header` sizes: Base 35px (arts 35.5, neighborhood 33.6, legal 37.2, corporate 38.5); Tall 31.3px (home); Wide 30px (dining); Bottom 56px (rooms); new variant Large Heading 56px (room template); new variant Small Heading 26.9px (guidelines). The new variants are copies of Base, so desktop is unchanged |
| Tab pills intro heading (d, c wellness, a press) | fixed | header 56px (happenings, blog), Press variant 53px, `is-media` and Media variant 36.8px (wellness) |
| `tab-pills-intro_stage` bottom (d) | fixed | 40 -> 2px (small and tiny) |
| Map script titles (c rooms, b C20 dining) | fixed | `.text-style-script.is-large` 32 -> 44.4px, line height 1; dining map variant 2rem -> 2.775rem |
| Article card group label to image, group gap (d) | fixed | `.article-card-staggered_header.is-group` margin-bottom -8px; `section_article-card-staggered` padding-bottom 32px (last card to next label 48 more) |
| Home art stories button filled dark (a home 10) | fixed | new combo `.button.is-chamfer.is-outline.is-dark-mobile`, fill #262118, label #f4efdf, chamfer clip; desktop stays outline |
| Rooms quiz title 28/28 (c) | fixed | new `rooms-collection-quiz_heading` on the three quiz h2s, 28px / 28px / -0.05em |
| Hero 660 on guidelines and legal and corporate (c, e) | fixed | new hero variant Short Mobile (copy of Base) with min-height 660px; guidelines and the Legal Corporates template hero switched to it |
| Press email label 14px vs contact 12px (a press 3) | skipped | one combo serves both forms and the two Figma frames disagree by 2px; contact keeps the design-system 12px |
| `stickyTabs.ts` pin from first paint (a press 1) | skipped | a JS behaviour change on three pages with scroll pinning; not safe to ship unattended. Left for a reviewed change |
| Hero overlay 0.4 -> 0.5 (f) | skipped | not confirmed on other hero frames |
| Venue card start clip, logos 280, text width 310, stage 612 (b C10 to C17, c, e, f) | skipped | GSAP start values and layout shared by 7 pages; type rows (title 28, copy 16/20) are already fixed |
| Split image text light order, image sizes and gaps (e neighborhood, f arts) | skipped | needs page-only element combos in a component used on 5 pages; page sessions left it for a reviewed layout pass |
| Overlay detail panel rows (e) | skipped | modal layout, shared by four page groups; no type rows left |
| Card carousel variant padding-top 96 (c room template) | skipped | padding lives on the shared padding utility, not the variant |
| Section padding G3, offers min-height, newsletter label colour, footer lists | skipped | see the first pass above |
