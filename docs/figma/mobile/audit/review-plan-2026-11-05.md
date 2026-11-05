# Mobile review fix plan, 2026-11-05

Source: `review-feedback-2026-11-05.md` (47 comments, 24 pages). Grouped by the shared block each comment touches, so one fix is made once and every page that uses the block is checked.

## Rules for every fix

- Mobile fixes go on the `small` and `tiny` breakpoints only. A desktop change is made only when the comment asks for it.
- Before a shared class or combo is changed, list every page that renders it (`scratchpad inventory`, live HTML). If any page must stay as it is, use a component variant (or a new one) instead of the shared class.
- After each group: publish, re-measure the pages it touches at 390px against the Figma, and run `scripts/visual/layout-snapshot.mjs 1440 … desk-base.json` to prove desktop did not move. A desktop change outside the group is a regression and is reverted before moving on.

## Groups

| # | Block | Pages | Comment(s) | Fix |
|---|---|---|---|---|
| A | Venue mask start (`venue-card-fullbleed_stage.is-media-center`, `tab-pills-intro_stage.is-media`) | Dining, Wellness, Meetings (Home uses the same stage) | ~500px gap between intro paragraph and the small framed image | Start the framed image at the top of its stage on mobile (Figma: ~120px under the paragraph). Check Home against its Figma before and after |
| A2 | Mask media, other combos | Arts intro, Corporate "secure storage", room page under "view floorplan" | Shape wrong (portrait, chamfered) and too much space | Per-variant start size from each Figma (landscape) |
| B | Form header (`form-split-script-contact`) | Guidelines, Meetings, Corporate (Contact stays left) | Script title should be centred; Corporate missing paragraph; gaps before submit and inside the field list | Centre on the base and Meetings variants only; show Corporate paragraph; halve the submit gap |
| C | Script intro heading-to-text gap | Rooms, History | More space between handwritten title and paragraph/image | Per-variant margin, from the Figma |
| D | `image-trio-text_header.is-left` | Corporate, Legal | "Key features" must be centred | Revert this morning's left-align |
| E | Corporate blocks | Corporate, Legal template | Remove top rule on "Why teams"; more space below "Quiet workspaces"; more space above "Tailored packages"; map card sizing | Combos or variants scoped to the template |
| F | Rooms | /rooms | All-rooms overlay shows a room card; links not underlined; card image ratio, icons, title case | Fix overlay, underline, ratio, lowercase; icons need assets |
| G | `split-image-text-light_media.is-secondary` | Room page, Neighborhood, Arts | Room: 03 left and bigger, 04 full width square. Neighborhood: closing image full width. Arts: second image right aligned | One variant per page, never the shared combo |
| H | Dining venues | Dining, Zuma | Sticky selector from page start; Zuma button clipped at load; missing second paragraph; other dining options scrollbar | Selector visibility, z-index, paragraph, scroll snap without a bar |
| I | History | History | Caption fades on scroll: use a triggered mask reveal; more padding around "Discover the property" | Code change in the bundle; combo padding |
| J | Home hero button | Home | Min width | Variant min-width on mobile |
| K | Article template | Happenings and Blog stories | "Learn more" sticky; "More around town" left aligned | Template only |
| L | Meetings | Meetings | Modal image is a slider on mobile and desktop; map markers over the image | Modal slider; map fit |
| M | Neighborhood | Neighborhood | Wide text variant for the Midway slide; rule below the small text and button position on the corporate card | New "wide text" variant; reorder |
| N | Contact | Contact | Checkbox not centred on its two-line label | Align |

Open questions for Stephen are listed at the end of the run, not guessed.
