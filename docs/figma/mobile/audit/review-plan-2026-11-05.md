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

## Status after the run (2026-11-05)

Done and measured at 390px against the Figma; desktop guard (`layout-snapshot.mjs 1440`) clean apart from the intended Corporate RFP paragraph and a 1px dock of the venue "Reserve a table" button.

- A: framed image starts 160px under the intro on Dining, Meetings, Wellness (Home unchanged). Arts and room page bleed frame 316x213, caption gap 20px.
- B: Guidelines, Meetings, Corporate form titles centred (Contact stays left); Corporate paragraph shown (desktop Figma has it too); submit gap halved on Guidelines and Corporate; Corporate fields evenly spaced.
- C: Rooms script gap +16px; History script-to-image gap doubled.
- D/E: Key features centred; Packages heading left (head CSS); top rule on "Why teams" hidden; 120px below Key features; more space above Packages.
- F: all-rooms preview card hidden on phones; result cards 390x540; names lowercase; links underlined.
- G: room page 03 left 266x315 and 04 full width square; Little Italy closing image full width; Arts second image right 175x227 (head CSS, `docs/reference/site-head/mobile-variant-overrides.css`).
- H: Dining selector visible from the first screen (v1.1.30); Reserve a table docked from load; Zuma intro second paragraph (mobile only); other dining cards snap with no scrollbar.
- I: History caption uses a triggered line-mask reveal (v1.1.30); Discover the property top/bottom spacing increased.
- J: Home hero button "book" on mobile, "book your stay" on desktop, 140px min width.
- K: story "Learn more" floats on phones (v1.1.30); "More around town" left aligned.
- M: Midway slide wide text (260px); corporate card rule below the caption, button 24px under it.
- N: Contact checkbox centred on its two-line label.
- Room page map meets Offers with no strip (Home variant, mobile only). Guidelines image added above "Our process" (mobile only, desktop Figma has none).

## Round two (Todoist comments posted 14:55 to 15:12, v1.1.33)

- Venue masks (Dining, Wellness, Meetings, Arts, room page): the small frame is centred in its stage again, so the enlarge starts centred; the stage is pulled up by half a screen less half the frame, so the frame still sits about 160px under the intro copy. Home unchanged.
- History: the caption stays hidden until the image is full screen, then masks in line by line (played, not scrubbed). Root cause: the reveal moved the line's children, which were inline spans that ignore transforms; it now moves the split words.
- Maps: Meetings is half and half (map fills the top 656px, card below). Corporate, Legal and Neighborhood keep the card over the map with the map running on below it (Figma section height).
- Contact: 18px outlined checkbox centred on the two-line label, 12px gap.
- Zuma: "discover zuma" link under "browse the menu", shown only where the new Dinings switch "Show discover link" is on (Zuma only); target is the Zuma site, swap if the client has a specific page.
- Meetings venue modal: the top image is a slider on every width (progress line on phones, dashes on desktop). Each venue has one photo, so the other venues' photos fill the extra slides until real galleries exist (`src/utils/modalImageSlider.ts`, marked shortcut).
- Head CSS now ships as `dist/site.css` next to the bundle (one `<link>` in the head, same tag as the footer script); sources stay in `docs/reference/site-head/`. The site head was over the 10,000-character cap, and jsDelivr will not serve files under `docs/` because the repo is over its 50 MB package limit.

## Round three (comments posted 15:49 to 15:53, v1.1.35)

- Meetings venue modal: the slider had grown the desktop image to the photo's own shape (about 5:4); the slides now fill the Designer frame (2:1) absolutely.
- Neighborhood: the burgundy category pill vanished over the burgundy "corporate & services" section; it now turns cream with burgundy text while its centre is over a section of its own colour (`tabDropdown`).
- Contact: the checkbox styling applies at every width (desktop Figma is the same 18px outlined box, 12px gap); a word space before "privacy policy" restored.
- Legal and Corporate "Why teams" top rule: already absent live on phone and desktop at 393px and 1440px; no change made.
- v1.1.34 was already tagged on another branch (`claude/eloquent-bell-47541b`), so this release is v1.1.35.

## Open, needs Stephen

1. Room card icons: temporary drawn icons are live (mobile head CSS, marked TEMPORARY); swap the two data URIs when the real files arrive.
2. Zuma "Discover Zuma" link points at zumarestaurant.com; confirm the target.
3. Meetings modal slider: real gallery images per venue (placeholders in use).
5. Two unused variants created on the way ("Packages" on Image Trio Text Left, "Arts Collection" on Split image text light): OK to delete?
