# Mobile fixes done: gallery, arts (390px)

Source: `f-gallery-arts.md`. All edits are `small` breakpoint (cascades to `tiny`; the old `tiny` overrides on the gallery classes were removed so `small` wins). Published to staging 2026-11-04. 1440px before/after diff: 0 changed pixels on the `/gallery` mosaic, the `/arts` mosaic and the open `#oceano` dialog.

Ownership: only `gallery-all_*` (used on /gallery and /arts only) and the Art Detail Modal (arts-only component) were edited here. Every other block on these pages uses classes shared with 5 to 15 pages, so it is queued in `shared-queue.md`.

## Screenshots (390px)

| block | before | after |
|---|---|---|
| gallery mosaic | `img/before-gallery-mosaic-390.jpg` | `img/after-gallery-mosaic-390.jpg` |
| arts mosaic | `img/before-arts-mosaic-390.jpg` | `img/after-arts-mosaic-390.jpg` |
| arts modal, artwork | `img/arts-6-live.jpg` (audit capture) | `img/after-arts-modal-oceano-390.jpg` |
| arts modal, artist | `img/arts-6-live.jpg` (audit capture) | `img/after-arts-modal-eva-struble-390.jpg` |
| 1440 unchanged | `img/before-*-1440.jpg` | `img/after-*-1440.jpg` |

## gallery

| row | action |
|---|---|
| hero overlay 0.4 -> 0.5 | queued (`hero-fullbleed-centered_overlay`, every hero page) |
| hero heading, text | none needed |
| gallery-all section height | fixed (follows the rows: 1796 -> 920 incl. the sticky pill) |
| mosaic arrangement: 2 swipe rows | fixed. New `gallery-all_scroller` wrapper (overflow-x auto below 768) around the grid; the grid is a 1775px flex-wrap track, so each row holds 5 tiles. Decision: rows are independent flex lines (Figma widths per row), not CSS grid columns, which would force shared column widths. Rows start at scroll 0; the Figma row offset (row 2 starting 116px further left) is a scroll-position snapshot and is not reproduced. |
| tile height 391.5 | fixed |
| tile widths 336.7 / 214.7 / 458.6 | fixed (`gallery-all_item`, `.is-narrow`, `.is-wide`) |
| column-gap 22.9, row-gap 20.8 | fixed |
| first tile top 20 | fixed (`section_gallery-all` padding-top 20px) |
| category pill, swipe category row | none needed |
| offers arrows, button, controls | queued (already in the queue from d-happenings-blog: `offers-slider-split_arrow`, `button.is-chamfer`) |
| offers slide min-height 804 | queued (`offers-slider-split_item`) |
| offers eyebrow, heading, figure | none needed |
| more of the guild slide padding, label ls | queued (already in the queue: `card-carousel-header-left_slider`, `_label`) |
| faq eyebrow, title, gap, chevron | queued (already in the queue: `faq-accordion_header`, `heading-style-h2`, `accordion_icon`) |

## arts

| row | action |
|---|---|
| hero overlay | queued (as gallery) |
| intro heading 35.5/42.6, paragraph y, colour | queued (`script-intro-centered_*`, 8 pages) |
| venue film shape, size, stage height, caption | queued (`venue-card-fullbleed_*`, 5 pages; stage 612 vs 100vh needs a call by the global session) |
| collection padding, order, gap, images, heading, body | queued (`split-image-text-light_*`, 5 pages) |
| artworks section height | fixed (1800 -> 714) |
| artworks mosaic: swipe rows | fixed. CMS wrapper got `gallery-all_scroller`; arts sizes live in the arts tile embed (`.section_gallery-all.is-dark` scope, max-width 767px): track 1344px, tiles 254.4 / 162.2 / 346.5 x 295.8. Decision: 2 rows of 5, not the Figma's 4 rows, because the collection holds 10 items; the track wraps every 5 tiles, so 20 items will give the 4 rows automatically. |
| tile height 295.8, widths | fixed |
| gaps 18 / 18 | fixed |
| top and bottom pad 20 | fixed (`section_gallery-all.is-dark` small 20px / 20px) |
| tile count 20 vs 10 | skipped: content; 10 CMS items is the real collection |
| category pill not in Figma | skipped by decision: it drives the Painting / Photography / Sculpture / Artists filter Stephen asked for; hiding it would remove filtering on mobile |
| more of the guild, offers, faq | queued (as gallery) |

## arts modals (Art Detail Modal, `is-art` combos, small only)

| row | action |
|---|---|
| stacking order back, heading, image, body | fixed: `_content.is-art` display contents; `_header.is-art` order 1, `_figure.is-art` order 2, `_body.is-art` order 3 |
| panel padding 24/20/24 | fixed (`_panel.is-art`) |
| back control 36 tall | fixed (`_back.is-art` min-height 36, centred) |
| back label 14/18 -0.7 | fixed (`_back-label.is-art`) |
| back icon 24x18 | fixed (`_back-icon.is-art`) |
| back to heading 56 | fixed (`_bar.is-art` static, margin-bottom 56) |
| heading y116 | fixed (measured 116) |
| by line arrow | fixed (`_eyebrow-link.is-art::after`, 12px NE arrow, 4px gap) |
| heading to by line 8 | fixed (`_header.is-art` row-gap 8; by line measured 153 vs 154) |
| caption 14/16.8 -0.4, 32 below by line | fixed (`_caption.is-art`, margin-top 24; measured y205) |
| image 350x409.1 | fixed (`_figure.is-art` aspect-ratio 350 / 409.1; measured 350x409) |
| image y 271 / 178 | fixed (measured 271 artwork, 178 artist) |
| image to body 32 | fixed (`_layout.is-art` row-gap 32) |
| body, overlay | none needed |
| panel height 896 / 763 | fixed for the artwork (896); the artist panel is 844 because the Dark variant keeps min-height 100vh, taller than the 763 Figma frame, which only adds empty space below the text |
