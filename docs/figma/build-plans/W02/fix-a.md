# fix-a notes (W02 style fixes)

Session ses_3KyWC0TkMJleRE6XKlXT16Ar8g3, agent opus-5.5|claude-code|fxa7q. Style edits only, no element or page structure changes, no publish.

## 1. gallery-mosaic-captioned captions
Done. Component 560e1b31-d612-0921-8773-8f9de2e2b06f. Figma history/07 actually overlays the caption at the bottom left inside each tile (on a grey placeholder), not below it, so the placement was kept and only the colour changed.
- Style `gallery-mosaic-captioned_caption` (48e422ce-a9c7-4c69-54a4-962ce0e16f5a), base: color dark green variable -> `relume-variable--neutral-shade-1` (cream); added `text-shadow: 0px 1px 8px rgba(0, 0, 0, 0.55)`.
- Applies to every instance (History 07, Rooms Detail 09, Meetings 09, Neighborhood 11, Legal 13, Corporate 13, dining items).
- Not touched: the top `gallery-mosaic-captioned_heading` (still dark shade-7 over the photo); out of scope, check after publish.

## 2. history-timeline year pill
Done. Page 6ad66fd276d24ed37ac4c52f, one sticky label (element adab6545-7ce2-dd52-c11c-6380642b0e5f; A04 swaps the text, sets no heights or classes).
- Root cause: `history-timeline_label-wrap` is a flex row with `height: 0px` and default `align-items: stretch`, so the pill was stretched to 0 height and only its padding showed as a sliver.
- `history-timeline_label-wrap` (d6d8a0e0-81ee-c7f7-5e58-b44e23f59bb3): added `align-items: flex-start` (the existing `translateY(-50%)` on the label centres it on the 50vh line).
- `history-timeline_label` (87c3f212-f16b-f06d-13ac-4e64a2547fd1): added `flex: 0 0 auto`. Text colour was already cream on dark green.

## 3. timeline-scatter-images @USERNAME captions
Done. Component 144b7315-3604-2419-b046-c09d180f1163. Same overlay placement as Figma guidelines/04.
- `timeline-scatter-images_caption` (8e07e5f2-f9ab-4856-49a1-2f8ed4a2b79d), base: color -> `relume-variable--neutral-shade-1`; added the same text-shadow.

## 4. Tab pill rows at 390
Done, wrapping chosen (all options stay visible, no JS, pill shape kept by the chamfer clip-path).
- `tab-pills-intro_tabs` (bba7b479-c595-d4f4-9895-256ede9aeaaa), small: height auto, padding 0.875rem / 1.75rem, flex-wrap wrap, justify-content center, column-gap 1.5rem, row-gap 0.625rem, overflow-x visible. Tiny: justify-content flex-start -> center, column-gap 1.25rem, padding 1.5rem left/right. Covers Wellness, Gallery and gallery-all tags (reuses the class).
- `venue-card-fullbleed_tabs` (2bdfd4ef-9b8d-1489-27e0-262ba21b4d0a), small: flex-wrap wrap, justify-content center, row-gap 0.625rem, column-gap 1.25rem, padding top/bottom 0.875rem, overflow-x auto -> visible. Component bbccdbb5-db17-02a1-a0cc-43ce0f5da371.
- `tab-pills-intro_tab` already has flex-shrink 0, so each label stays on one line.

## Check after publish
- /history 05 pill readable at 1440 and 390; captions readable on light photos; tab rows at 390 wrap to two lines on Wellness, Gallery, Dining 03.
