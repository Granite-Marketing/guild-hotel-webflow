# Mobile fixes A: home, contact, static (privacy, accessibility), press

Source rows: `a-home-contact-static-press.md`. Global rows (G1 to G21: nav, CTA newsletter, footer) and every `button*` row belong to the global session and are not repeated here. Measured on staging at 390x844 after publish. Before shots are the audit's `img/<page>-<n>-live.jpg`; after shots are `img/after-<page>-<n>.jpg`.

## How the fixes are scoped

All values are set at `small` and repeated at `tiny`, because 390px sits in Webflow's `tiny` breakpoint and several base classes carry `tiny` values that override `small`. Desktop and tablet values are untouched.

- Shared components get page-only variants, so other pages keep their current look: Image Trio Text "Home", Map Feature "Home", Split image text light "Olive Home" (Olive was shared with the Lobby Bar page), Offers Slider Split "Home Press", Card Carousel Header Left "Contact" and "Press", tab-pills-intro "Press", Article Card Staggered "Press Left" (with the existing press-only "Right"), form-split-script-contact "Press" (with the existing contact-only "Contact"). The existing home-only Tall variant of script-intro-centered and the Venue Card Fullbleed Tall and Left components (one instance each, home) are edited directly.
- Page-level elements on home, contact and privacy/accessibility get new family classes or combos where a global type class had no family class: `venue-card-fullbleed_heading`, `venue-card-fullbleed_list-label`, `venue-card-fullbleed_intro-heading`, `home-art-stories_heading`, `home-art-stories_text`, `form-contact-fields_label`, `static-template-privacy-policy_heading`, `static-template-privacy-policy_block-heading`, and combos `is-media-center` (header, content, text), `is-strip` (dining thumbnail), `is-tall` (rooms content).
- Variant styles compile to `:where(.w-variant-…)`, so they add no specificity. Where a three-class combo sets the value (`.script-intro-centered_heading.text-style-script.is-large`), a variant cannot win and the row is queued.

## Home

| Row | Action | Result at 390 (Figma) |
|---|---|---|
| 1 hero CTA label "book" | skipped | copy choice; "book your stay" kept as live content. Button type is a global row |
| 2 script-intro padding 160/160, image 280 | fixed (Tall variant) | image top +160 (160), figure 280 wide |
| 2 script heading 31.3/37.6 | queued | 3-class combo outranks variant styles; row in `shared-queue.md` |
| 3 west-coast padding, gap 64, title 24/26.4/-1.2 | fixed (Olive Home variant) | media +64 (64), title +578 (578), body +670 (670), link +782 (782) |
| 3 link 14/18 | global | button row |
| 4 dining intro heading 24/26.4/-1.2, pad 120/20 | fixed | heading +120, 24/26.4/-1.2, x20 w350 |
| 4 thumbnail 265x193 landscape, 48 under heading, chamfer 12 | fixed (`is-strip`, intro margin) | start mask 265x193 at x62.5, chamfer 12, 47px under heading. The scroll-enlarge module reads the start rect from these Designer values, no JS change |
| 4 space below thumb | fixed by the above | thumb now pins centred with the heading directly above it |
| 5 card order (Pool before Garden) | skipped | CMS sort is content; left for Stephen |
| 5 description 16/20, max 310 | fixed (`is-media-center` text combo) | 16/20, max-width 310 |
| 5 header gap 32, text to button 24 | fixed | header row-gap 32, content row-gap 24 |
| 5 Lobby and Pool logos 280 wide | skipped | one CMS template logo wrapper for all venues; needs a per-venue width field |
| 5 Garden Terrace and Solana titles 28/28/-1.4 | fixed | 28/28/-1.4, one line |
| 6 wellness padding, left align, title 28/28, link 14/18 36 high, gaps 24/36 | fixed (Image Trio Text Home variant) | title +96 (96), text +148 (148), link +252 (252) 36 high, slider +324 (324), section 930 (928) |
| 6 progress fill | none | as audit |
| 7 rooms bottom-anchored copy, height 736, title 28/28, gaps 24 | fixed (Tall component, `is-tall` content combo) | section 736, title +536 (536), text +588 (588), button +652 (652) |
| 8 neighborhood padding, heading 44.4, gaps 24, bottom 11 | fixed (Map Feature Home variant) | heading 44.4/44.4, text 16/20 two lines, map ends 11 above section end |
| 9 and 12 offers controls | skipped | `offersSliderSplit.ts` hides the pager when a slider has one slide; both home offers instances show one slide (Show slide 2 to 5 off). Turning slides on is a content choice |
| 9 and 12 offers description two lines, section height | skipped | follows slide content |
| 10 art padding 96/96, title 28/28, subtitle 14/16.8, gaps 24/40 | fixed | section 1230 (1230), title +96, subtitle +148, button +206, media +282 (all match) |
| 10 button filled dark | queued | mobile-only button fill needs a button combo (global) |
| 10 tiles 4 vs 7 | kept 7 | the 7-tile collage matches Figma state frame "2", which Stephen approved in PR #139 |
| 11 meetings height 800, title 28/28, list bottom-anchored, rows 56 full-bleed dividers, labels 20/27/-1 | fixed (Left component) | section 800, title +80 (80), text +132 (132), list +529 (529) 390 wide, rows 57 pitch (56 + 1px divider), labels 20/27/-1, button +724 (724) |
| 13 FAQ | global | `faq-accordion*` is global |

## Contact

| Row | Action | Result at 390 (Figma) |
|---|---|---|
| 1 title y184, 28/30/-1.4, no rotation, lowercase, #29310c | fixed (Contact variant) | title y184, one line, rotation none, colour #29310c |
| 1 labels 12/18 #2b2927, value #29310c | already fixed globally | |
| 1 gaps 64 / 12 / 32 / 64, social links stacked 14/20 | fixed | detail pitch 82/102/82 (82/102/82), links stacked, 14/20 |
| 1 media 1:1, pad-bottom 120 | fixed | 350x350, 120 below |
| 2 form heading 24/26.4 | already fixed globally | |
| 2 checkbox 18px at x20, text x50 w320 one paragraph 14/20 | fixed | link moved inside the checkbox label so the sentence wraps as one paragraph; box 18x18 at x20, text at x50 |
| 2 consent to button 56, section bottom 120 | fixed | 56, 120 |
| 2 submit size | global | button row |
| 3 carousel padding 56/56, card pad 24, label ls -1 | fixed (Carousel Contact variant) | title +56 (56), section 788 (788) |
| 4 FAQ | global | |
| 5 support CTA heading 45.4/54.5, text left, gaps 32, pad-top 80 | fixed | heading 45.4/54.5, text left, paragraph to button 32 |
| 5 button | global | |

## Static template (privacy policy and accessibility)

| Row | Action | Result at 390 (Figma) |
|---|---|---|
| 1 title y184, 28/30/-1.4, #29310c | fixed | y184, 28/30/-1.4, #29310c |
| 1 block headings #29310c | fixed | |
| 1 body and list 16/20, gaps 24 / 56 / 20, pad-bottom 120 | fixed | first heading y262 (262), body y329 (330), second heading y1065 (1066), 120 below |
| 1 footer CTA | global | |

## Press

| Row | Action | Result at 390 (Figma) |
|---|---|---|
| 1 hero | none | as audit |
| 1 selector at hero bottom | queued | Figma's y784 is the fixed-bottom pin in the first viewport; `stickyTabs.ts` (shared with blog and happenings) pins only once the bar is reached |
| 1 intro heading 53.4/64.1 #29310c, two lines | fixed (tab-pills Press variant) | 53.44/64.1, #29310c, "A room / for every stay" |
| 2 section title 24/26.4 | already fixed globally | |
| 2 caption 14/16.8/-0.42 | fixed (Press Left, Right variants) | 14/16.8/-0.42 |
| 2 publication line hidden | fixed | display none below 768 |
| 3 enquiries pad-top 120, heading 42/50.4, gaps 32 / 64 / 12, fieldset heading 20/27/-1, groups merged gap 24, pad-bottom 120 | fixed (form Press variant) | heading +120 at 42/50.4, group gap 24, 120 below |
| 3 email label 14/16.8 | queued | the label combo is shared with contact, whose Figma keeps 12/18 |
| 3 submit | global | |
| 4 offers pager arrows 36x36, gap 16 | fixed (Offers Home Press variant) | arrows 36x36, counter gap 16 |
| 4 button | global | |
| 5 carousel card pad 24, label ls -1 | fixed (Carousel Press variant) | |
| 6 FAQ, 7 CTA and footer | global | |

## Desktop check

Every value is set at `small` or `tiny`; new classes, combos and duplicated variants carry no base or tablet styles, so desktop renders as before. Checked by eye at 1440 (`img/after-<page>-<n>-1440.jpg`): meetings, rooms, wellness, dining, art and the contact form look as they did. One element change reaches desktop: the contact consent link now sits inside the checkbox label (a flex row with a 12px gap), so on desktop it stays on the same line beside the checkbox text. No pixel baseline existed for 1440, so this is a visual check, not a pixel diff.

Not verified: the home intro drawing (`script-intro-centered_image`) did not lazy-load in the in-app browser pane, so its 280px width is confirmed from the figure box only; the Playwright shots show it loaded.

## After shots

`img/after-home-1..11.jpg`, `img/after-contact-1..4.jpg`, `img/after-static-1.jpg`, `img/after-press-1..5.jpg` (390x844, staging).
