# Final review round 1: independent check (2026-11-26)

Checked on live staging (https://the-guild-hotel-c34e71.webflow.io, bundle v1.3.24) with a browser at 1440, 991, 800, 650 and 390, scrolling each page so lazy content and animations ran. CMS and component facts come from Webflow's own data (read only; nothing was written or published). I did not read the builders' reports. Item numbers follow section 1 of the list; row ids point at the two review files.

Known noise left out of every "console" line: Webflow's own turnstile and font-size warnings, and one Google Maps tile that fails to load. The one warning that comes from the site is "OTS parsing error: Size of decompressed WOFF 2.0 is less than compressed size" (a font file is damaged). It shows on most pages and is not part of this round.

## Proven

**1. Component rebuild damage**
- W-R1, Retail slider (Home, 1440 and 390): button fill dark (#262118), label light blue (#b2c5d5). The five buttons are hidden because they have no link (this also proves W-L7). Arts & Culture slider (/neighborhood, 1440 and 390): fill cream (#f4efdf), label tan (#906e58), links go to /arts.
- W-R3, George Marston heading (/history): at 650 and 390 the heading is rotated exactly -5deg through `rotate`, with clear space (15px above and 26px below at 390, 25px and 38px at 650). At 800, 991 and 1440 it is level. The 7.4 degree tilt is gone.
- W-R4: ids `33c1374c`, `1993beed`, `9cd3f054`, `0e56f707` no longer appear in the live bundle, the live stylesheet or the page HTML. `72048989` is still in the page's embedded button CSS, which the brief said to leave. The seven ids that had to survive are still present.

**2. Listing pages (Packages, Blog, Happenings, Press)**
- P-E1: group headings start at the same left edge as their cards at all five widths (152 at 1440, 64 at 991 and 800, 20 at 650 and 390).
- P-E2: pill bars are centred on the page (offset 0) with equal space before the first label and after the last (24 at 1440, 20 or 32 at 991 and 800) and equal gaps between labels. No hidden item takes a gap. At 650 and 390 the pills are not shown at all on these pages (they are hidden by design in the page, not by the fix).

**3. Press**
- P-D6 and D7: 23 of 24 cards have no logo box in the layout (hidden, zero size); the one card with a logo shows it. The empty-source images are hidden too. Same at all five widths.

**4. Links we can set ourselves**
- P-B6: the Solana card on /dining goes to /dining/solana-coffee.
- P-B12: in the venue pop-ups on /meetings (1440 and 390) and Corporate (800) "submit your request" goes to `#request-for-proposal`. I clicked it: the pop-up closes and the form scrolls into view. The empty "floorplan" button is hidden in every pop-up (also proves W-L6).
- P-B13: /arts: 32 "by the guild collection" bylines and 1 "unknown photographer" are plain text, not links. The one real artist (Eva Struble) is still a link. Checked by opening a pop-up.
- P-B14: /contact: phone is a `tel:` link, three emails are `mailto:` links, the address is a Google Maps directions link.

**5. Dead buttons**
- "Browse the menu" is hidden on all five dining pages (W-L5, part).
- The invisible layer over the rooms button (P-B8): I hit-tested every button on /rooms/cozy-king at 1440, 650 and 390 and the floorplan button is not covered by anything.

**7. Layout slips**
- P-E9 (Corporate venue tabs, 800): all four tabs sit inside the screen, 35 to 765 on an 800 screen. They were cut at both ends before.
- P-E11: at 650 the email field and Join button span 20 to 630, a 20px gutter on both sides. At 800 "Book your escape" and "Stay in the loop" are both one line and start at the same height.
- P-E12 (Home Wellness, 650): heading, paragraph, link and first image all start at 20.
- P-E13 (Guidelines, 800): "@username" is whole on all four photos, the "work from our collaborators" heading is clear of the photos, and the closing headline wraps on two lines with "shoot!" not alone (looked at a screenshot as well as measuring).
- P-E7 (artwork pop-up, 390 and 650): with the pop-up open, nothing from outside covers its text (hit-tested each text line). The screenshot is clean.
- P-D11 (404): the button reads "Go Home" once.

**8. Forms**
- P-D14: names are now Meetings Proposal Request, Photoshoot Request (Guidelines only), Press Enquiry, Legal and Corporate Proposal Request, Contact Request and Newsletter. Required fields are first name, last name and email (plus the consent box on Contact). Nothing else is required.

**9. Alt text and page settings**
- P-D3: /packages title is "Packages | The Guild Hotel" with its own description.
- P-D9 and W-M27 (venue cards): every venue card on Meetings and on Corporate has its own alt text.
- P-D15: the ten preview images in the all-rooms pop-up have ten different alts.

**10. Day and night**
- P-F4: at 991, 800, 650 and 390 each control is 36 x 44 with a name (Day, Night) and role button, and Day comes before Night. At 1440 they are 47 x 16 and 64 x 16 with names.
- P-F6: the head script tag now carries only its own marker; no button role and no pressed state.

**11. Editor tidying**
- W-C22: no component description still contains "22 props", "eight visibility", "stamp", "Items are fixed", "not built yet", or the build codes (Q0.., V02). Searched all 55 components.
- W-C19: no style block is duplicated on /arts or /gallery.
- W-C20: the Booking Menu has no empty header, and the footer has no hidden links (30 links, all visible).

**Console on the pages above (E20, E21):** no animation-target or package-card warnings on Legal, Corporate, the four listing pages, Home, Dining, Rooms, Meetings, Neighborhood or History. Only the font warning described above.

**Part 2, CMS rollout (read from Webflow)**
- All 22 collections have folders. Only Name and Slug sit outside folders.
- Every collection that has any settings field has a folder named exactly "Settings" and it is first (20 of 22). Legal Corporates and Post Categories have no settings fields, so they have no Settings folder. Sort order, "Show On ...", page colour, category, topic and date fields are all inside it, nothing of that kind sits outside.
- Night fields in Meeting Venues, Dinings, Rooms and Beyond Downtown all follow `<day name> (Night)`, e.g. "Card - Image (Night)", "Home Card - Tagline (Night)", "Pop-up - Text (Night)", and the agreed exceptions "Room - Image (Night, Hero / Card / Feature)" and "Card - Image (Night, Pop-up)". Where a day twin exists, the night field sits directly after it (Meeting Venues image and intro, Dinings image and tagline, Rooms hero intro, Beyond Downtown image and text). Field slugs are unchanged (for example `night---card-image`), and the item data is intact.
- Three bound night elements still show their night value on the live page with `guild-mode=night`, and the day value without it: /rooms card heading "cozy king by lamplight" and its night photo; /rooms/cozy-king H1 "cozy king by lamplight" and night photo; /neighborhood Coronado Beach pop-up text "At night the beach turns quiet...".
- Component variant renames from list 2A are applied: Hero "Mobile Short Button Label", Gallery Mosaic "Mobile Lower Heading", Map Feature "Mobile Full Bleed", Map Feature Image Bg "Mobile Stacked", Image Trio Text "Mobile Left Aligned", Split light "Mobile Text First", all script-intro, tab-pills-intro and Card Carousel names in the table. Nothing was deleted: the variants are all still there.

**Other pages, console (/, /dining, /rooms, /meetings, /neighborhood, /history, 1440 and 390):** no console errors on any of them; the only warning is the font one. No broken images, no sideways page scroll, one H1 on each, and Home at 390 looks correct (hero, short "Book" label).

## Not done

- **P-E3, menu colour on dark photos.** Still happens. On Garden Terrace (1440) at scroll 4550 and 9800, on /press at 4900 and 6300, and on /neighborhood at 3150 the dark logo and "Book now" sit on a dark photo and are hard to read (contrast about 1.0 to 1.5; I measured the real pixels, not the stylesheet). Same sort of spots at 390.
- **P-B8, "view floorplan" on room pages.** Still a visible button with link `#` on /rooms/cozy-king and /rooms/guild-loft-suite at 1440, 650 and 390. Only the venue pop-up floorplans got hidden.
- **W-M13, sorting the Footer and Booking Menu lists.** Live order is still newest first: Solana Coffee, Pool Lounge, Lobby Bar, Garden Terrace, Zuma, in the footer and the Reserve pop-up. The sort order field says Zuma 1, Lobby 2, Garden 3, Pool 4, Solana 5. Either the sort was not set or it was not published.
- **P-D10, empty alt text.** Still empty on the five offers-slider images on every page, and on the Meetings hero. Dining trio and gallery are fixed. (Press and Packages card photos are now empty alt inside a link whose text names the card, which is acceptable, but see "Differs".)
- **P-D4, room search descriptions.** Cozy King and Guild Loft Suite still share one description, and the placeholder rooms still say "Remove before launch". Not in the round 1 brief for Webflow as far as the fixes file lists it.
- **P-D1 and D2, tab icon and share image.** Unchanged, as the brief said (needs an image choice): the pages still use `icon-publish.png` and `icon-relume-dark.png` for the icon, and none of the 7 pages I read has an `og:image`. /packages and /blog have no share tags at all.
- **P-C15, phone on Legal and Corporate.** Corporate still shows "+1 (619) 975-6000" in the proposal block, while the `tel:` link is 795-6000. Waiting for the client, as planned.

## Differs from what the row asked

- P-F5 (night load): the page looks right from the start (`is-night` is set at about 170 ms and Day is dimmed), but Day still reports "pressed" to screen readers until the script is ready, about 0.6 s at 1440 and 0.1 s at 390. Before it was 0.5 to 1.7 s.
- W-L5, "enquire" on every dining page is still `#` and visible (the destination is the client's; the row said to set the enquire page).
- P-D7: the press card photos now have an empty alt instead of the blurb. Fine for a linked card, but a screen reader hears nothing for the photo.
- Variant rename: Split light "Olive Home" and "Olive Dining" kept their names (list 2A wanted "Olive"), so the rename was only done where it did not create duplicate names. Not a fault.
- Night names in Meeting Venues ("Card - Name (Night)") and Dinings ("Home Card - Name (Night)") and Rooms ("Hero - Name", "Card - Name") have no day field with that name; the day name is the item's own Name field. Naming rule fits, the twin just does not exist.
- Component night props (Hero, Split, Venue Card, modals, Article Card): most sit in the same group as their day twin but not directly after it (only the Stagger and Compact Split "Image (Night)" and the three modals' "Text (Night)" are directly after). Article Card Tall Item has no groups at all. The brief said "moved to their day twin's group"; groups match, order does not.
- P-D11: the 404 page still has no menu, no footer and no H1 (not asked in the brief).

## Look at these (taste or things I cannot judge)

- /press at 1440: the one card that shows a logo (check it sits well on the photo) and the cards without a logo (check nothing looks missing).
- /legal-corporate/corporate at 650 and 390: the venue tabs show one tab at a time with a small 22px overflow; it looks like a swipe or dropdown. Open it by hand to see it behaves.
- Nav colour on dark photos (P-E3 above): the fix choice is a design call, see Garden Terrace gallery and /press.
- /dining/dining-zuma: "Bar and dining room at The Guild" is still the alt on the image pair on every venue (it is the same photo; right alt is a content call).
- Pills on listing pages are not shown at 650 and 390: confirm that is meant.

## Not checked

- The 10 History timeline alts (P-D8): need a person to look at each photo.
- P-E10 (gallery filter with a mouse in a narrow window): I could not find the filter control on /gallery in the page, so no measurement.
- W-M12, sorting the Rooms template lists: the data order and creation order are identical, so live pages cannot show whether a sort exists.
- W-M27 Stories and Packages inset image alt: no story or package detail page is linked from the listings.
- Component prop folders (W-C23) and component night-prop renames on instances inside the Designer (needs the Designer open; only definitions were read).
- Real phones and Safari, form submission, the CMS editor screen, taps (touch) at 991 to 390: I used a desktop browser with narrow windows.
- Whether the Home Blue (Retail) slider buttons look right once links exist: they are hidden today, so only the stored colours could be read.
