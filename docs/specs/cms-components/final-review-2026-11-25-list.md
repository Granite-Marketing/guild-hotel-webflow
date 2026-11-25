# Final review: the one list (2026-11-25)

Merged from the [page review](final-review-2026-11-25-pages.md) (P rows, "helper" rows were not re-run) and the [Webflow review](final-review-2026-11-25-webflow.md) (W rows). Nothing here is applied except the Meeting Venues pilot. Where the two disagree, the rendered page wins and both are noted.

Re-checked by the coordinating session on live staging, 25 Nov: slider button colours, Reserve pop-up buttons, the George Marston heading, listing headings, the empty press logos, the placeholder room. The rest is the two reviews' word.

## 1. Fix now (faults, no decision needed)

1. **Damage from the component rebuild.** Retail and Arts & Culture slider buttons are cream with burgundy; they should be dark with light blue, and cream with tan (W-R1, label colour confirmed). The George Marston heading on phones no longer uses the 5 degree tilt you asked for: 7.4 degrees measured (W-R3 says it has no tilt, which is wrong). Replace variant ids in code with named classes so a rename cannot break them (W-R4).
2. **Listing pages.** Headings sit at 224px while their cards start further left, on Packages, Blog and Happenings, at desktop and tablet (P-E1, confirmed on all three at 1440). This is the Culture alignment Stephen reported; an earlier report called it done. Pill bars are off centre, a blank list item takes a gap (P-E2).
3. **Press.** 23 of 24 cards have an empty logo that leaves a cream box (P-D6, D7, 23 confirmed).
4. **Links we can set ourselves.** Solana card on /dining (P-B6, W-L2); "submit your request" in venue pop-ups to the form (P-B12); phone and email on Contact (P-B14); plain text where an artwork has no artist (P-B13); Contact page phone conflict needs the right number (P-C15, section 3).
5. **Dead buttons with nothing behind them.** Hide them when the field is empty: floorplan, browse the menu, Retail slider (W-L5 to L7, P-B8). The invisible layer over the rooms button on phones (P-B8).
6. **Menu colour on dark photos** (P-E3): reported before; fix the split-section choice in code.
7. **Layout slips.** Venue tabs cut off at 800 (P-E9); Home Wellness heading at 650 (P-E12); "Book your escape" and "Stay in the loop" at 650 and 800 (P-E11); Guidelines at 800 (P-E13); artwork pop-up covered by pills on phones (P-E7); 404 button "Go HomeGo Home" (P-D11).
8. **Forms.** All five share the name "Photoshoot Request", and none has required fields (P-D14).
9. **Alt text and page settings** (P-D1 to D4, D7 to D10, D15; W-M27): template icon, no share image, shared alt text, Packages search title.
10. **Day and night.** Controls on phones are 13px with no name; Day looks pressed on a night load until the script runs; a script tag is treated as a button (P-F4, F5, F6).
11. **Editor tidying, no visible change.** Wrong component descriptions, missing sort on three lists, empty or duplicate blocks (W-C19, C20, C22, M12, M13).

## 2. Stephen decides

**A. Variant renames (real differences, keep).** Names say what they do. "Mobile" means Webflow's mobile widths.

| Component | Today | Proposed |
|---|---|---|
| Hero | Home | Mobile Short Button Label (the label is clipped, fix it too) |
| Gallery Mosaic | Dining | Mobile Lower Heading |
| Map Feature | Home and Dining | Mobile Full Bleed (merge if the render matches) |
| Map Feature Image Bg | Stacked | Mobile Stacked |
| Image Trio Text | Home and Dining | Mobile Left Aligned (merge, 2px apart) |
| Split image text light | Olive Home and Olive Dining | Olive (identical, merge) |
| Split image text light | Neighborhood Downtown | Mobile Text First |
| script-intro | Arts | Mobile Tight Heading |
| script-intro | Neighborhood | Mobile Medium Heading |
| script-intro | Legal Corporate | Short Padding, Wide Heading |
| script-intro | History | Short Bottom Padding |
| script-intro | Small Heading | Mobile Small Heading |
| script-intro | Large Heading | Tight Padding, Mobile Large Heading |
| script-intro | Tall | Extra Bottom Space |
| script-intro | Bottom | Image Below |
| tab-pills-intro | Press | Mobile Small Heading, Wide Pill |
| Card Carousel | Legal Corporate | Desktop Tight Top |
| Card Carousel | Contact | Short Bottom Padding |

**B. Variants with no visible effect.** Hero Centred Mobile, Hero Short Mobile and Card Carousel Press change nothing. Hero Dining caps the text at 180px on phones, and the page render shows no changed pixel today. Merge into Base? This is the only group with no real difference; Stephen's "don't nuke" does not cover it, but it still needs a yes.

**C. Variants with no instance anywhere (28, W).** Includes the six Split layouts that are now components, and 12 unused copies on the Split slider. The page review found 40 variant ids in the stylesheet with no page; 12 are already deleted ones (W-V1). Remove?

**D. Dead blocks.** Ten unreachable old art pop-ups and the hidden hero on Arts (P-E5, E6); four hidden room cards on Rooms; two hidden sections on the Rooms template; the draft Room Detail page; the old Overlay pop-up (W-C1, C15 to C18, C21). Delete?

**E. CMS.**
1. Folders and night names for the other 20 collections, after Stephen looks at Meeting Venues (proposal in the Webflow review, every one of 166 fields placed once).
2. Settings labels, e.g. `Settings - Sort Order`, `Settings - Show On Meetings`.
3. Rooms: one day image feeds three places with three night images. Recommended names `Room - Image (Night, Hero)`, `(Night, Card)`, `(Night, Feature)`.
4. Rooms Feature text and video at night have no day field: add a day field or drop them.
5. Beyond Downtown: night pop-up image pairs with the card image. Recommended `Card - Image (Night, Pop-up)`. The pop-up gallery field connects to nothing: build the slider you asked for, or remove.
6. Meeting Venues Features: ten text and image fields never show. Remove?
7. Move /dining venue list (W-H1), the Home venue tabs (W-C4) and /wellness panels (W-H2) into the CMS? /dining and Home are recommended, they are your X2 rule.
8. Two topic fields on Packages and Stories (W-M15) and an old Gallery category (W-M14): merge. Five dining switches repeat "is it filled" (W-M5).
9. Reserve a table: the pop-up reads Info - Venue Site Link, not Booking - Reserve Link, so filling Reserve links would not fix it (W-M1, the binding is inferred). Rebind to the Reserve field.
10. Placeholder rooms are live, and the quiz recommends only them for "Just me" (P-C3, C4; W-M8). Unpublish: the quiz would then find no room for that answer until real rooms are tagged.

**F. Component props.** Trim hero and card toggles never used (W-C10, C11), merge Image Trio Left and Left Offset (W-C14), merge the three sliders (W-C13), make the Reserve pop-up buttons outline again or keep them filled (W-R2, filled now), one global set for More of the Guild (W-C25), name the two mixed component folders (W-C23).

**G. Title size and width controls (assessment only).** Possible with named steps; the Designer shows them if the CSS sits in an embed on the page. script-intro needs it most: 4 sizes and 4 widths would replace six of its variants (W-T1 to T5). Not approved.

**H. Night content.** 15 of 21 blocks are empty; all four night photos are the same picture (P-F1, F2).

## 3. Needs the client (Omar) or real content

Booking links (nav, band, pop-ups, footer, social), right phone number, two other-hotel posts, two other-hotel maps, room and dining descriptions that repeat, venue pop-ups, packages, FAQ answers, offers, Neighborhood lorem, Corporate and Legal wording, privacy and accessibility text, videos, History photos. Rows P-B2 to B5, B7, B9 to B11, C1, C2, C5 to C28, C30, C31, D5; W-L1, L3, L8, M3, M4, M10, M19 to M24.

## 4. Not checked by either review

Real iPhones and Safari, form submission, Figma section by section, night video and night buttons (no content exists), the CMS editor screen, and whether a text prop is single or multi-line.
