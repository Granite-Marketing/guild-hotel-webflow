# M7 build plan: feature, form and image sections on mobile

Workstream M7 of `docs/plans/2026-11-03-001-feat-mobile-figma-parity-plan.md`. Status: approved by Stephen and built on 2026-11-03; see Result for deviations.

Every change below is a style write at the Webflow **small** breakpoint (767px and below), unless marked **tiny** (479px and below). Nothing is written at main, large or medium, so desktop at 1440 cannot change. No script changes: `map.ts` only needs `[data-map]` to keep a non-zero, `position: relative; overflow: hidden` box, and `modals.ts` needs nothing new.

Evidence: Figma values from `figma/mobile/nodes.json.gz` and the renders; live values from a 390px audit of staging (both in the shared notes folder for this session group, `m7-figma-values.md` and `m7-live-styles.md`).

## 1. Map feature (`section_map-feature`, `map-feature_*`)

### 1a. Overlay card (`is-image-bg`: neighborhood, legal, corporate)

Figma: the map fills the whole section, the brown card floats on it inset 18px from each side, 40px from the top.

| Class | small |
|---|---|
| `.section_map-feature.is-image-bg` | padding-bottom 2.5rem (map shows under the card) |
| `.map-feature_figure.is-image-bg` | position absolute; inset 0; margin 0; aspect-ratio auto; order 0 |
| `.map-feature_content.is-image-bg` | padding 2rem; text-align left; align-items stretch |

The intermediate wrappers (`padding-global`, `article`, `container-large`) are not positioned, so the figure fills the section. The card already has `position: relative; z-index: 1`.

### 1b. Stacked (meetings only)

Figma: full-bleed map 390 x 650, card full-bleed below it, no overlap.

- **One element change on the meetings page:** add combo class `is-stacked` to the meetings `map-feature_figure` and `map-feature_content` (classes become `... is-image-bg is-stacked`).
- `.map-feature_figure.is-image-bg.is-stacked` (small): position relative; inset auto; order -1; aspect-ratio 390 / 650; width auto; margin 0 -1.25rem.
- `.map-feature_content.is-image-bg.is-stacked` (small): margin 0 -1.25rem (card full-bleed, 390 wide, below the map).

### 1c. Card type (all four)

| Class | small |
|---|---|
| `.map-feature_item` | padding-top 1.5rem; padding-bottom 1.5rem (row pitch about 97px, Figma 97) |

Heading stays `heading-style-h4` (owned by M1).

### 1d. Plain map (home, rooms, rooms detail, dining)

Figma: script heading, copy and outline button centred; vector map 552 x 559 overflowing 81px each side; no card.

| Class | small |
|---|---|
| `.map-feature_content` | align-items center; text-align center |
| `.map-feature_header` | padding-left 0 |
| `.map-feature_aside` | align-items center |
| `.map-feature_figure` | width 34.5rem; max-width none; align-self center; aspect-ratio 552 / 559; margin-top 2rem |
| `.map-feature_figure` (tiny) | aspect-ratio 552 / 559 (replaces today's 4 / 5) |

The `is-image-bg` and `is-centered` combos override these where they differ (1a sets left text; history is already centred). "No extra building photo" turned out not to be part of this section: the rooms map section has no photo on staging, so nothing to remove.

## 2. Detail panel (`overlay-detail-panel-modal`, Base variant)

Live already hides the close X and the "back" label on mobile. What differs from Figma (`renders/meetings-collection/...776-11888`):

| Element | Change (small) | Figma |
|---|---|---|
| `_figure` | order -1; aspect-ratio 350 / 440 | image first, 350 x 440 |
| `_header`, `_heading` | align-items flex-start; text-align left; heading 1.75rem / 1.875rem, letter-spacing -0.05em | title left, 28 / 30 |
| `_column` | display contents | lets the list sit between the details text and layout options |
| `_list` | order 1 | numbered list after DETAILS text |
| `_extras` | order 2; margin-top 0 | LAYOUT OPTIONS after the list |
| `_options` | column-count 2; column-gap 1.5rem; line-height 1.75rem; font-size 1rem | 2 columns, 28 pitch, 16px |
| `_item` | padding 0.75rem 0; border-bottom 1px rgba ink 20% | hairline rows, 49 pitch |
| `_item-heading` numeral | inline, same size (vertical-align baseline) | "1 510 SQ FT", not superscript |
| `_footer` | position absolute; top 1.5rem; right 1.25rem | dark chamfer CTA top right |
| `_button` | dark chamfer style (ink fill, cream label), min-height 2.25rem | "SUBMIT YOUR REQUEST" |

- **CTA label:** the button text is already a prop on each instance; set to "SUBMIT YOUR REQUEST" on meetings, legal, corporate instances where it differs (copy only, listed back to you before writing).
- **Centered variant (neighborhood, Coronado Beach):** keeps the footer in flow and centred, image after the text. Variant styles on Centered: `_figure` order 1; `_footer` position static; `_header` centred. Figma shows a close X on this one; variant style `_close` display flex.
- **Booking menu dialogs (`#book`, `#book-table`, M2's Burgundy and Image Bg):** they inherit Base. Their variant rules already hide the figure and set layout to block, so the order changes do nothing there. I will screenshot both before and after at 390 and, if anything moves, stop and tell you rather than edit M2's variants.

## 3. Form (`form-split-script-contact_*`)

Labels are screen-reader only; the visible label is the placeholder (`formPlaceholders.ts`).

| Class | small | Figma |
|---|---|---|
| `_fields` | row-gap 1.5rem | 50 pitch |
| `_input` | height 1.625rem; padding-bottom 0.25rem; font-size 0.875rem; text-transform uppercase (placeholder pseudo too) | 26 high, 14px caps |
| `_input.is-textarea` (tiny) | height 1.625rem; min-height 1.625rem; resize vertical | single row |
| `_fieldsets` | row-gap 4rem | 64 between fieldsets |
| `_footer` | justify-content flex-start; margin-top 3.5rem | submit left (legal, corporate, guidelines) |
| `_footer` Tall variant (meetings) | justify-content center | submit centred |

Contact keeps its form hidden on mobile as today.

## 4. Staggered image sections

| Section | Change (small) | Figma |
|---|---|---|
| `timeline-scatter-images_item.is-inset` / `.is-end` (neighborhood) | width 87%; `is-end` align-self flex-end | 305 wide, alternating left and right |
| `timeline-scatter-images_caption.is-tall` | text-align left; font-size 0.875rem | captions left, 14px |
| `image-trio-text_figure.is-left` (legal, corporate) | aspect-ratio 1 / 1 | square 350 |
| `image-pair-text_figure.is-portrait` (zuma) | width 70%; aspect-ratio 244 / 334; second figure width 50%, align-self flex-end, aspect 175 / 226 | staggered portrait pair |
| `neighborhood-corporate_heading` | text-align left | left, 2 lines |
| `neighborhood-corporate_figure` | aspect-ratio 1 / 1 | square |
| `split-image-text-light_media` Stagger Mid variant (Gaslamp) | width 70%; align-self flex-end; aspect 244 / 200; content margin-left 30% | image right, copy indented under it |
| `split-image-text-light_media` Wide variant (Little Italy) | first media width 70%, aspect 244 / 200 | image left 244 |
| `split-image-text-light` Base (Downtown) | content order -1; media width 76%, aspect 266 / 315 | copy first, image left 266 |
| `image-trio-text` non `is-left` (dining "Group dining", home wellness) | header text-align left | Figma is a 3-slide swipe slider; the swipe stays (script owned), only the text alignment changes |

Exact class names of the split-image and image-pair children are confirmed from the style list before writing; anything that turns out to be shared with another workstream's family is skipped and reported.

## Not built

- Dining trio as a Figma-style one-image-at-a-time slider with progress line: that is slider behaviour, closer to M4.
- Form script title sizes and tilt: M1 owns `text-style-script`.

## Verification

Publish to staging, then Playwright with system Chrome at 390 on meetings, neighborhood, legal and rooms (plus corporate, zuma and the two booking dialogs), and a 1440 check on the same pages to confirm desktop is unchanged. Screenshots go in `staging/` here.

## Result

Built on 2026-11-03 at the small breakpoint (767px and below), plus tiny where noted. Ids are in `docs/reference/webflow-ids.md` (M7 section). Staging screenshots are in `staging/`.

Deviations from the plan above:

- **Meetings map:** this is a component (Map Feature Image Bg), so a combo class on one instance was not possible. A new **Stacked** variant now holds the change, and the meetings instance uses it. The variant gives `map-feature_component` `position: relative`, negative side and top margins (full-bleed) and `padding-top: 166.667vw` (650px at 390), so the absolute map fills that space and the card sits below it at 390 wide.
- **Overlay map:** the absolute `is-image-bg` figure needs `align-self: stretch`. Without it, Chrome applies the base `align-self: center` to the absolutely positioned box and it collapses to 0px high in the middle of the section.
- **Neighborhood timeline:** the per-item widths are combo classes, so a new **Stagger** variant on timeline-scatter-images Tall caps `timeline-scatter-images_item` at `max-width: 87%`. `is-end` already has `margin-left: auto`, so items alternate. Guidelines and arts keep their own layout.
- **Downtown split (base variant):** not changed. The base variant is shared by every page that uses split-image-text-light, so reordering it would change other pages.
- **Booking menu (M2 variants):** the shared `_item-title` mobile size reached the Image Bg venue cards. One Image Bg variant style restores 1.5rem / 1.1 at small. Nothing else moved.
- **Horizontal scroll at 390 (existing before M7):** the secondary split image had `margin-right: -2rem`. `.split-image-text-light_media.is-secondary` is now `margin-right: 0` at small, which fixes neighborhood and the room pages.
- **CTA copy:** not changed. The button label is per instance and was left as authored.

Not built:

- The legal and corporate second trio heading is centred, while Figma has it left. Both trios share the `is-left` header, and the Key Features label is centred in Figma.
- The Little Italy second image is still 75% wide; Figma has it full width.
- The detail panel CTA is 252 wide, while Figma is 217 (button padding is shared with desktop).
