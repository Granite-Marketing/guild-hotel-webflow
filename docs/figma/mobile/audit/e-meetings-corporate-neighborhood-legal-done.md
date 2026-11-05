# Audit E done: meetings, corporate, neighborhood, legal (390px)

All changes are Webflow style edits at the `small` breakpoint (cascades to `tiny`; two `tiny` overrides removed so `small` applies). No `main` or `medium` value changed; 1440px computed values were re-measured and are unchanged. No `src/` change. Published to webflow.io staging only.

Ownership was decided from the live HTML of every page: a class or combo is "owned" only when it appears on these four pages and nowhere else. Everything else went to `shared-queue.md` in the integration checkout (14 rows, tagged "e").

Before shots are the audit crops (`img/<page>-N-live.jpg`); after shots are `img/<page>-N-after.jpg` (390x844, after a slow scroll).

## Fixed

| audit rows | class family | change (small) | after shot |
|---|---|---|---|
| legal/corporate 04 why teams: padding, heading lh/ls, heading gap, eyebrow, text, item pitch, reading order, logo, logo gap, caption | `feature-grid-dark-eyebrow_*` | component padding-block 5rem (40 + 80 = 120), row-gap 6rem; heading lh 1.1, ls -0.05em; eyebrow 12/18; text 16/20; item row-gap 0.75rem (pitch 135 vs 114, see note); columns `display: contents`, list flex column, `:last-child` order 1 so items read location, setting, connectivity, privacy, outdoors, dining, group stays, rewards (verified by y position); logo 167px; footer gap 1.5rem; caption 12/18/-0.03em | legal-3, corporate-2 |
| legal/corporate 05 focused work: padding, heading, gaps, p, image, title, item text, item gap | `split-sticky-text-stacked-images_*` | component padding-block 5rem; heading lh 1.1 ls -0.05em; header gap 1.25rem; text 16/20; figure 1/1 full width, margin 0; item padding-inline 0 (was 8px inset, image now x20 w350), row-gap 1.25rem; title 18px ls 0; item text 16/20; list gap 4rem | legal-4 |
| legal/corporate 03 key features: title ls, title to p, item gap; 08 packages: title to list, item gap, list line-height | `image-trio-text_item-heading`, `_item-content` (+ `.is-list`), `_item-text`, `_list.is-left` | title ls 0; content gap 0.75rem (key features 12), `.is-list` 1.25rem (packages 20); item text lh 1.25; list gap 4rem | legal-2, legal-5 |
| meetings 02 intro: heading size, rotation, width, p lh, section padding | `meetings-collection-venues_*`, `venue-card-fullbleed_intro` | heading 30.67px, rotate -7.4deg; p lh 1.25; intro padding 160 / 20 (tiny 3.5rem override removed) | meetings-1 |
| meetings 09 features: padding, heading, gaps, p, figure, card heading, list | `meetings-collection-features_*` | section padding-block 7.5rem; heading lh 1.1 ls -0.05em; header gap 1.25rem; text lh 1.25; component gap 4rem; figure 350/360; card heading 20/27/-0.05em; card header gap 1rem; items lh 1.25, padding 4px / 8px | meetings-3 |
| neighborhood 09 corporate and services: padding, heading (2 lines), gaps, title ls, p, caption | `neighborhood-corporate_*` | component padding-block 5rem, gap 4rem; heading 24/26.4, max-width 10rem; list gap 4rem; title ls 0; content gap 1.25rem; text 16/20; caption 12/18 | neighborhood-3 |
| neighborhood 08 beyond downtown: padding, heading lh, heading gap, image ratio, item gap | `timeline-scatter-images_*.is-tall`, `_image-wrap.is-xlarge` | section padding-block 5rem; heading lh 1.1; header margin 1.5rem; image 305/200 (now 304.5x199.7); list gap 6rem | neighborhood-2 |
| neighborhood 10 dining: padding, p to first item, card gap | `article-card-staggered_*.is-tall` | component padding-block 6.5rem, gap 4rem; list gap 4rem (tiny overrides removed) | neighborhood-5-dining |
| map 07/11: item name ls, p to first item, pin size | `map-feature_text.text-style-eyebrow-caps`, `map-feature_content.is-image-bg`, `map-feature_pin` | ls 0; content gap 35px; pins 48px | meetings-2, neighborhood-4 |
| panel: subheadings, footnote, extras gap, submit/learn more button (G1 for the panel button) | `overlay-detail-panel-modal_subheading`, `_link`, `_note`, `_extras`, `_button` | 20/27/-0.05em; 12/18; margin 2.25rem; button 14px, 36px tall, padding 4px 25px | (modal, measured: 14px / 36px) |

## Queued as shared (see `shared-queue.md`, rows tagged "e")

G1 chamfer buttons, G2 offer arrows, G3 section padding where the padding lives only on `padding-section-large` (meetings form, key features 0/96, packages), every `heading-style-h4` / `-h2` / `text-style-*` size row, map intro and walk text (`map-feature_text.text-size-medium`, shared with other maps), gallery mosaic, FAQ, venue card title/p/pill/start clip, the whole form block (shared with contact, guidelines, press), script intro sizes, legal/corporate hero height, neighborhood split-image-text-light reorder and sizes, panel back/close/padding/list gap/progress, dining card title and gap.

## Skipped

| row | why |
|---|---|
| neighborhood 03 selector pill position | moving the section in the DOM also moves it on desktop, which must not change |
| legal/corporate 11 offers block present | structural and on desktop too; the audit says it needs a yes before removal |
| legal/corporate 08 packages CMS order | content order in the CMS, flagged only |
| legal/corporate 08 packages image 350/360 | 2.9% off and shares the figure combo with key features, which already match at 1/1 |
| legal/corporate 08 list indent (x40) | the indent is on the rich text `ul`; MCP cannot style rich text children |
| neighborhood 09 divider before button, button width | the footer already has the 1px border; the stretch comes from the shared button |
| map pin count and places | driven by map data and JS centring, not styles; neighborhood/legal 68px pins need a variant split |
| map card x18 w354 | 2px, within tolerance |
| why teams item pitch 135 vs 114 | item keeps its 2rem padding from the tablet border rule; Figma gap is smaller but the divider spacing reads correctly; left as is |

## Desktop check

At 1440px the measured values match the pre-change desktop values (for example feature grid heading 32px / 38.4px, meetings figure 484x605, panel button 16px / 37px, timeline image 672.9x473.9).
