# Final review fixes, Lane B: Webflow record (2026-11-25)

Brief: [final-review-2026-11-25-fixes.md](final-review-2026-11-25-fixes.md). Part 1 is on staging. Part 2 (names and folders) was not published for its own sake, as briefed, but the last Part 1 correction (22:22) carried the saved names to staging. Ids that changed or were added: the last section of `docs/reference/webflow-ids.md`.

## How it was checked

- **Baseline.** Staging was published once with no change of mine (21:18), so Stephen's unpublished edits are in the baseline and not mistaken for mine. 24 pages and the 404 were captured at 1440, 991, 800, 650 and 390 before (set C) and after (set H): every element's position, size, display, text, link, alt, colour and font size, plus a picture. All 125 differ, and each difference was read and traced to a row below, or to three known moving parts: the newsletter spam check, map tiles and lazy images in the gallery and footer.
- **After the renames.** All 25 pages were captured again after the 22:22 publish (set I) and compared with set H: 12 of 125 differ, all from the two footer logos loading late, plus the guidelines headline fixed in between. The renames changed nothing visitors see.
- **Limit.** Sets C, H and I were captured with animations off. Behaviour (pop-ups, controls, hidden items) was checked with animations on.
- **Console.** Full scroll of all 24 pages at 1440 and 390 after the last publish: no page errors. The only two messages are on Contact, from the form spam check, and were there before.
- **Part 2.** Schemas, folders, 205 items, 55 components with props and variants were saved before. After each collection the fields, slugs, types, options, help text, folders and every item were compared by script. Same for every prop and variant.

## Part 1

| Row | Result | What changed, evidence |
|---|---|---|
| P-E1 | Done | The heading carried the card's own indent a second time. Removed from `article-card-staggered_header.is-group`. Heading and card are both at 152 (1440) and 64 (991, 800); 650 and 390 unchanged. |
| P-E2 | Done | The empty wrapper Webflow puts round a slot took one gap. A one-line style embed in tab-pills-intro removes it. Equal padding on Blog, Happenings, Packages and Press. |
| P-D6, D7 | Done | Empty logo boxes hidden (23). The logo uses its own alt instead of the card blurb. |
| P-B6 | Done | Solana Coffee goes to its page. |
| P-B12 | Done | "submit your request" closes the pop-up and scrolls to the form on Meetings, Legal and Corporate (clicked at 1440 and 390). The legal form section needed an id. |
| P-B13 | Done | No artist: plain text. With an artist: still a link to the artist. |
| P-B14 | Done | Address (Google Maps directions), phone and four emails are underlined links using the text shown. The phone number is the one on the page: P-C15 still needs the right number. Instagram and facebook wait for addresses. |
| W-L5 | Part | "browse the menu" hidden while its field is empty; Zuma's website link stays. **Choice needed:** "enquire" on every dining page has no destination in the brief, so it still shows as `#`. |
| W-L6, L7 | Done | Floorplan and the Retail slider buttons hidden while empty. |
| W-L4 | Not in the brief | Room "view floorplan" is still `#`: it has no field. |
| P-E9 | Done | The four legal tabs fit from 768 up (769 wide on 800). A combo on that page only. |
| P-E11 | Done | 800: both headings on one line and level. 650: email and button reach the edge. |
| P-E12 | Done | Wellness heading at 20, level with the images, at 650. The same fault on the dining pages' "group dining" heading is fixed too. |
| P-E13 | Done | 800: heading clear of the photo, "@username" inside its photo, the headline on two lines (slight tablet tracking below 830 only). |
| P-D11 | Part | The button reads "Go Home" once. **Not possible with the tools:** Webflow refuses the footer on a 404 page (it holds a CMS list), the menu alone would add a dead Book button, and the title inside Webflow's own block cannot be reached to become an H1. |
| P-D14 | Done, one point open | Names: Photoshoot Request, Meetings Proposal Request, Legal and Corporate Proposal Request (one shared form), Press Enquiry. First name, last name and email required on all four. **Choice needed:** stored field names (Press "Organization" is `shoot-date`, and similar on two others) were not in the brief and are unchanged. Nothing was submitted. |
| P-D3 | Done | Title "Packages \| The Guild Hotel", own description. |
| P-D8 | Done | 17 History photos described from the photo itself. |
| P-D9, D15, W-M27 | Done | Venue cards, room previews, dining pair, story and package insets use the photo's own alt. The four packages' inset photos have none in the CMS yet, so theirs is empty. |
| P-D10 | Part | 19 library photos described from the photo (hero, carousels, trios, room and wellness photos). Menu photos are now hidden from screen readers, booking and footer photos stay silent. **Left:** photos that live in the CMS (offers slides, press, gallery, package pairs, dining gallery). Their alt is inside the image field, which must not be written; type it in the editor. |
| P-D1, D2 | Not done, as briefed | See options below. |
| P-F4 | Done | Below 992 each control is 36 x 44 (was 13 x 13), named Day and Night, Day first. Icons sit at the same edge, bar height and logo unchanged. Switching clicked at 991, 800, 650 and 390. |
| W-C19 | Done | One Gallery Canvas Styles on Arts, one Global Styles on Gallery. |
| W-C20 | Part | Empty pop-up header and three hidden footer links (Zuma, lobby bar, pool lounge: duplicates of the CMS list) removed. **Reported, not removed:** the hidden "the lobby terrace" link appears nowhere else. |
| W-C22 | Done | 24 descriptions corrected. |
| W-M12 | Done | Amenities, room gallery and Discover Other Rooms sorted by their order field. |
| W-M13 | Not possible with the tools | Sorting a list inside a component is refused ("No source connected", a known limit). Three lists, by hand in the Designer: Booking Menu (reserve list), Footer Links (dining), Map Feature Image Bg (places). Each: sort by Sort Order, smallest first. |

**Caught while checking:** the first version of the menu rule also hid Zuma's website link. Fixed in the next publish and checked.

### P-D1 and P-D2 options (nothing uploaded)

1. Icons: the Guild postmark stamp, the "G" from the wordmark, or a file from the client. A 32 x 32 tab icon and a 256 x 256 phone icon are needed.
2. Share image: one site-wide photo (the entrance arch or the suite with green walls, 1200 x 630), or one per page using each page's hero.

## Part 2

| Item | Result |
|---|---|
| CMS names and folders | 21 of 21 collections, 50 fields renamed (Meeting Venues labels included). Read back after each: ids, slugs, types, options, help text unchanged; folders exactly as the table; all 205 items unchanged. |
| Night props | 51 of 51 renamed and in their day twin's group (13 components). No Night group left. Instance values kept (Home hero night image and heading read back). |
| Variants | 19 of 21 renamed. "Mobile Full Bleed" and "Mobile Left Aligned" each covered two variants that were to be merged, so the second has a "2"; the merges wait. **Choice needed:** Olive Home and Olive Dining keep their names, because an unused variant is already called Olive. |
| Hero "Mobile Short Button Label" | Renamed only. The clipped label is a look change and waits. |
| Bindings | All 119 CMS bindings on the 23 bound instances match the before record. One bound element or list read in 17 of 21 collections through elements or instances; Gallery Categories and Art Categories filters not read, Legal Corporates and Post Categories read through their hero. Night image, text, video and link attributes read on the Hero, Split, Split Edge and Place pop-up: bound to the same prop ids, now named (Night). |

Where Webflow puts a moved prop: at the end of its group, so a night prop follows its block but is directly under its twin only where the twin is last (for example Venue Detail Modal). The exact order inside a group needs a drag in the Designer.

**Waiting, not approved:** deleting or merging anything, unpublishing placeholder rooms, new fields, moving page content into the CMS, title size and width controls, outline Reserve buttons.

## Not for this lane (code)

- The artwork byline, hidden buttons and 404 label are done in a style embed because the tools cannot set Webflow's own conditional visibility. If preferred, they can be set by hand and the embed lines removed.
- Retail slider buttons are hidden now, so the colour fix in Lane A shows only once links are filled.

## Independent check

A separate Sonnet session checked 19 claims at the five widths with animations on.

- **It found one real fault:** the Retail slider buttons showed again with animations on. The reveal code wraps the button, so my rule missed it, and my own captures had animations off. Rule fixed, published 22:22, and every hidden item re-checked with animations on at five widths: 0 buttons on all five slides, 0 dead menu links, 0 floorplan links, 0 dead bylines, one press logo (the filled one).
- **It reported one thing outside the brief:** every room's gallery is headed "deluxe king suite gallery" (typed on the template).
- It saw the form land 224 to 396 px down after the pop-up closes. Re-measured: 92 at 1440 and 64 at 390 once the scroll ends.
- The rest passed, except items it did not screenshot at every width.

## Not checked

- Real iPhones and Safari, screen readers, and form submission.
- The CMS editor and props panel as an editor sees them (folder order, prop order inside groups).
- Figma: no row pointed at a design.
- Split-sticky photos on Legal and Corporate have alt text that does not match the photo (a note being written is called "a private suite"). Found while looking, not in the brief, unchanged.
