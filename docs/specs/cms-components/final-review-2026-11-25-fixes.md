# Final review fixes, round 1 (2026-11-25)

Stephen's go: "Yes, fix them", for section 1 of [the list](final-review-2026-11-25-list.md), the faults that need no decision. Sections 2 and 3 are not approved: no deletions, variant renames or merges, CMS schema changes, unpublishing, or title size controls. Row ids (P-, W-) point at the two review reports: read the row itself before fixing it.

Rules for both lanes: the page rendered on staging is the evidence, not a report. Where a row turns out wrong, say so and leave it. Where a fix would need a choice, stop on that row and report it. No em dashes in copy. Nothing is done until it is compared before and after at 1440, 991, 800, 650 and 390, the console is clean, and no other page changed.

## Lane A: code (T14, PR only, no release, no Webflow)

- P/W-R1: Retail and Arts & Culture slider buttons get their intended colours back (button-system.md rows 17 and 18). The sections now carry classes `blue` and `tan`; scope the selector to the slider section.
- W-R3, corrected: George Marston heading at phone widths follows M26 (`docs/feedback/mobile-2026-11-17.md`): -5 degrees, clear space above and below, desktop level. Live today it is rotated about 7.4 degrees through `transform` and `rotate` is none. Find what sets that before changing anything. The old variant id in `scriptTiltSpace.ts` and `script-tilt.css` no longer matches.
- W-R4: the five variant ids that match nothing (`33c1374c`, `1993beed`, `72048989`, `9cd3f054`, `0e56f707`). Remove or retarget each. Do not touch the live ones listed there. `72048989` is the Reserve pop-up outline: leave that rule as it is, the look is Stephen's choice.
- P-E3: nav colour over dark photos and half-dark split sections. Keep the mask-clone behaviour and the Day and Night fix (v1.3.17).
- P-E7: pills covering artwork pop-up text at 390. P-B8: the invisible pinned area over the rooms button at 390 and 650.
- P-F5 and P-F6: Day shown as pressed on a night load; the head script tag treated as a button.
- P-E21 and P-E20: console warnings, only where the fix is in code.
- `P-E10` (gallery filter with a mouse in a narrow window) is low priority: do it if small.

## Lane B: Webflow (one linked session, staging publish allowed)

- P-E1: listing headings line up with their cards on Blog, Happenings and Packages at every width (Stephen's Culture find, reported fixed before and not finished). P-E2: off-centre pill bars, the empty first list item.
- P-D6, D7: hide the press logo when it is empty.
- P-B6; P-B12 (venue pop-up "submit your request" goes to the form on the same page); P-B13 (no link when an artwork has no artist); P-B14 (phone, address and email on Contact become links using the text shown there).
- W-L5, L6, L7: buttons hidden when their field or link is empty. Leave buttons whose destination the client must supply (section 3).
- P-E9, E11, E12, E13, D11 layout and wording.
- P-D14: give each form its own name. Required marks: name and email only, on forms that have them.
- Alt text: W-M27, P-D7 to D10, D15. Use library alt or the image's own alt in the element. Never write a CMS image field (it re-imports the file). P-D3 title and description; P-D1 and D2 need an image choice: report the options, do not upload.
- P-F4: phone and tablet day and night controls: large enough to tap, named for screen readers, Day before Night.
- W-C19, C20, C22 (descriptions), M12, M13. C20 removes only the empty header and the four hidden links the row names: if either would count as deleting content, report it.

Both lanes: if a row belongs to the other lane, say so in the report.
