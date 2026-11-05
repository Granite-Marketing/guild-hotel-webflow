# Audit D done: happenings, blog, story template (390px)

Applied 2026-11-04, published to staging only. Measured with Playwright (system Chrome) at 390x844 and 1440x900 on `/happenings-stories/locals-night-at-rodeo-bar` and `/happenings-stories/best-san-diego-hotels-for-every-traveler`. At 1440 every measured element is identical before and after.

Ownership: the story template classes (`article-body_*`, `split-card-pair-captioned_*`, the Small inset and Compact split variants) are used only on the story template, so they are fixed here. Every other row touches a class also used on press, wellness, neighborhood or site wide, so it is queued in `shared-queue.md` in the integration checkout.

## Webflow changes (all `small`, no `tiny` overrides exist)

| class | change |
|---|---|
| `section_article-body` | padding-top 5rem, padding-bottom 2.5rem (title at 120 below the hero, button to image 96) |
| `article-body_eyebrow` | display none |
| `article-body_component` | row-gap 0.25rem (the h5 keeps its own 20px margin, so title to body lands at 24) |
| `article-body_rich-text` | font-size 1rem, line-height 1.25 |
| `split-card-pair-captioned_header` | padding-bottom 2rem |
| `split-card-pair-captioned_card` | aspect-ratio 390 / 435 |
| `split-card-pair-captioned_title` | left and right 1.5rem, bottom 2rem, font-size 1.25rem, line-height 1.35, letter-spacing -0.05em |
| site head `<style data-story-mobile>` | hero eyebrow hidden on the story template only; Small inset figure 244 wide at 244/200; Compact split: text above image, image 244 wide at 244/200 right aligned, gaps 96, 120 to the next heading. Source `docs/reference/site-head/story-mobile.css` (variant classes cannot be styled through the Data API) |

## Rows

### happenings-collection and blog-collection

| row | action |
|---|---|
| hero CTA "book" | skipped: Figma overlaps it with the description, an unused slot; M5 owns the hero |
| intro heading size, line-height, box | queued (`tab-pills-intro_heading` combo shared with press and wellness) |
| intro to stories gap | queued (`tab-pills-intro_stage`, press) |
| group label type | queued (`article-card-staggered`, press and neighborhood) |
| label to image gap | queued |
| card title type | queued |
| last card to next group gap | queued |
| card image, stagger x, card gap, description | ok, no change |
| offers CTA label and size | queued (global button label) |
| offers arrows, pagination row, section height | queued (`offers-slider-split`, site wide) |
| more of the guild label, section height | queued (`card-carousel-header-left`, site wide) |
| faq eyebrow, eyebrow to title gap | queued (`faq-accordion`) |
| faq title | queued (`heading-style-h2`) |
| faq chevron x | queued (`accordion_icon`) |
| blog intro heading 54.66 vs 56 | queued with the intro row (one class, 56 used) |
| blog stories group sections | ok, no change |

### happenings-indiv and blog-indiv (one template)

| row | action | after (390) |
|---|---|---|
| hero topic eyebrow | fixed (head CSS) | title stays at y644 |
| hero title, desc | ok | |
| hero CTA "book" | skipped, as above | |
| article top padding | fixed | title y920 (Figma 920) |
| date eyebrow | fixed | hidden |
| title to body gap | fixed | body y988 (Figma 988) |
| body copy type | fixed | 16 / 20 |
| article button label | queued (global button label) | |
| copy to image 1 gap | fixed | 96 |
| image 1 size | fixed | 244x200, x20 |
| image 1, text, image 2 order | fixed | image, text, image |
| image 2 size and x | fixed | 244x200, x126 |
| text and image gaps | fixed | 96 / 96 / 120 |
| image caption | skipped: no caption field in the CMS |
| more around town heading type | queued (`heading-style-h2`) | |
| heading to cards gap | fixed | 32 |
| card aspect | fixed | 390x435 |
| card title type and inset | fixed | 20 / 27, x24, bottom inset 32 |
| more of the guild, offers | queued, as above | |
| blog-indiv heading left aligned | skipped: one template serves both, and Figma happenings-indiv is centred; kept centred |
| blog-indiv 3-line hero title | skipped: CMS copy length |

## Screenshots

`img/before-<page>-<block>.jpg` and `img/after-<page>-<block>.jpg` for `happenings-indiv` and `blog-indiv`, blocks `hero`, `article`, `images`, `around-town`. The collection pages have no change from this session (all rows queued), so they have no after crops.
