# Copy upload round report (#418, 26 Nov 2026)

The client's copy from the 20 content docs is on staging (https://the-guild-hotel-c34e71.webflow.io), published 26 Nov. CMS copy went in through the Webflow Data API; page copy went in through the Designer, because the Data API refuses page text on the site's main language. Every write is logged with its doc line, the old text and the new text in [`upload-log.csv`](upload-log.csv) (twin: `upload-log.json`), ready to share with the client for review.

Sources: the copy map ([`catalogue/copy-map.md`](catalogue/copy-map.md)), the picks for the 160 rows to confirm ([`catalogue/picks.json`](catalogue/picks.json)), the copy check rerun after the upload ([`catalogue/copy-check.md`](catalogue/copy-check.md)), and Stephen's decisions C1 to C8 in [`notes.md`](notes.md).

## At a glance

- Written: 203 CMS text values (13 of them the pop-up corrections after the eye check), 72 page texts and props, and 14 new CMS fields; 3 earlier texts put back where a line had gone to the wrong place. Nothing else was touched: no image field, no class, no layout.
- Copy check after the upload: 259 rows done (91 before), 51 differs, 26 missing, 479 unchecked by design (second versions, not on site, no copy yet, held, joined lines).
- Of the 77 differs and missing rows: 57 are copy waiting for the Designer to bind the new fields; 14 are live, confirmed by reading the published page (the check found the same placeholder text in another block on the page); 5 are item names kept as they are; 1 is a room size that shows on the room cards, not on the room page the check opens.

## 1. Proven

Each page's mapped lines are on staging, by the copy check plus a direct text check of the published page for the rows the check could not see.

- Pages ready to tick as uploaded in the tracker: Homepage, History, Dining collection, Wellness collection, Meetings collection, Legal, Corporate (except the lines waiting for bindings), Rooms collection, Press, Gallery, Arts, Neighborhood, Happenings, Blog.
- Venue pages: Zuma, Garden Terrace, Lobby Bar and Pool Lounge carry their own hero, intro, explore, image pair and dress code copy. Their Group Dining heading waits for its binding.
- Meeting pop-ups: Council Boardroom, Garden Terrace (the "lobby terrace" venue, see Differs) and 1 America Plaza carry their pop-up text; Council Boardroom and Garden Terrace also their size and layouts; the Small and Large Conference Centers their text and five feature lines. Checked in the open pop-ups.
- Rooms: every room item with doc copy has its own hero line, description, stats list and card labels; no two rooms share description text. The two placeholder rooms keep today's text.
- No image field was written: the upload script refuses any field that is not plain or rich text, and the log shows only text fields.

### Eye check (headless, 390 and 1440, plus 991 on the longest pages)

- Script check of all 28 changed pages at 390 and 1440 (64 page and width runs): no horizontal overflow at 390 or 991, no clipped buttons, no text running out of its box, except one.
- Fixed: on History at 1440 the new script heading "George Marston, The Founder" ran off the page, because that block's style kept the heading on one line. The style now lets it wrap inside its own box (no line break added); checked at 1440, 991 and 390.
- Fixed: the meeting pop-ups showed the room size and the furniture note inside the layout list, and the two conference centers showed their feature list as layouts. The size and feature lines now sit in the five feature lines, the layouts in the layout list, and the conference centers' layout text is back as it was. All six pop-ups checked open at 1440 and 390.
- Looked at by eye: History script heading, the Neighborhood court cards and hero at 390 and 1440, the Dining hero at 390, and the Council Boardroom, lobby terrace, 1 America Plaza and Small Conference Center pop-ups. The other pages rest on the script check; nobody has looked at every full-page screenshot.
- Console: no errors from the site's own code on any changed page. Every page logs the same third-party Cloudflare Turnstile messages from the booking widget's security check, which were there before this round.

## 2. Not done, with reasons

- 57 rows are written into the new CMS fields but do not show yet: the template text has to be bound to each field in the Designer (list in section 7). Until then the pages show today's template text.
- Lobby Bar meeting pop-up (15 lines): staging has no Lobby Bar meeting venue (Meetings shows Council Boardroom, lobby terrace and 1 America Plaza). Not created.
- Four ADA rooms (Society King, Artisan King, Apprentice Queen and Apprentice King ADA): no room items. Not created.
- Contact: the doc is empty (C3). Wellness sub-pages (in-room wellness, fitness centre, mindful dining, wellness events): on hold (C3). All left as they are.
- Homepage and Dining collection: the docs stop part way ("stopping here"), so their lower sections keep today's copy.
- Lines with no place on staging (300 doc lines, counted by reason in the tables below): mostly room amenity lists (amenities are shared items, not per room), modal intro blocks the pop-ups do not have, and the ADA and Lobby Bar sections above.
- Night copy: none in any doc, so no night field was written (see section 5).

## 3. Differs from the doc

- Homepage dining card: the doc's "Lobby Terrace" card ("Fresh Mediterranean inspiration meets the Pacific") went on the Garden Terrace card, which keeps the name Garden Terrace. The doc's "The Lobby Bar" card shows "Lobby Bar".
- Meetings: the doc's Garden Terrace pop-up went on the venue named "lobby terrace", whose card intro comes from the Meetings doc. Venue names stay as they are: "1 america plaza" (doc: "One America Plaza" and "1 America Plaza"), "lobby terrace".
- Council Boardroom card intro: one field serves the Meetings, Legal and Corporate pages. The Meetings doc's line is used ("Impeccably appointed space for intimate executive and board meetings"); the Legal and Corporate docs' line ("Refined space for small boards and gatherings") is not.
- Pop-up taglines ("Dedicated Corporate Spaces", "The Guild's superb al fresco venue", "Comfortable space for casual gatherings and networking"): the pop-up has no tagline slot, so they are not used.
- Room names stay as they are: "Guild City Level Loft" (doc: City Level Loft, matched by C7) and "Two Bedroom Loft Suite" (doc: Two-Bedroom Loft Suite).
- Room sizes: where the doc gives two sizes on two lines, they are joined with " | " (for example "180sqft / 16sqm | 206sqft / 19sqm."). The Guild Loft Suite's "463sqft" and "42sqm." are one size, joined with " / ".
- Room stats: the room page's bullet list now shows the doc's stats lines (bed, guests, view, size), replacing the sample bullets. Bed and view lines show only there, not on the room cards.
- Case: the site styles most headings and links in lower case, so lines that differ only in case ("Discover More", "KEY FEATURES") read as done, and six such lines inside shared components were not rewritten.

## 4. Look at these

- Picks for the rows to confirm (C5): 94 kept as mapped, 122 moved (template text to the new per-item fields, room stats, photo captions, City Level Loft, the Press subtitle, Hall of Justice), 23 left off the site (no matching slot or venue). Each pick and its reason is in the picks table below; if a line looks misplaced, it is fixed in a later round (C5).

- Meeting pop-ups: the feature lines the docs do not cover still show sample text (for example "Modern executive seating for 12" on Council Boardroom and the terrace), and 1 America Plaza and One Columbia Place keep sample layouts. The Small Conference Center's sixth line ("Catering services are available") has no slot.
- Doc typos fixed (27 Nov, Stephen: clear mistakes get fixed, not parked): Neighborhood "Since the1860s, the Gaslight has seen it all" now reads "Since the 1860s, the Gaslamp has seen it all"; the Guild Loft Suite photo caption and feature text named the "City Level Loft" (pasted from that section) and now name the Guild Loft Suite.
- "Fitness Centre" on Wellness follows the doc; the rest of the site uses US spelling ("center").
- Corporate line 9 ("After hours, you'll adjourn to the Lobby Bar...") is listed as a second version of line 7, but it reads like a second paragraph. Worth asking Omar.
- Placeholder text still showing in blocks the docs do not cover, seen while checking: the Neighborhood dining articles, lower Arts sections and the room template's photo caption and feature text (until bound).
- Two Press fixes after the first check: the Press subtitle had gone into the lower intro, so it was moved to the hero and the intro's own copy was put back; the doc's fourth court (Hall of Justice) went on the fourth Corporate & Services card, which still showed placeholder text.

## 5. For Omar: deviations

Shared with Omar as agreed in C1: "we did the night and day versions based on what we had inside of Figma. Here are the deviations."

1. Second versions not used (the first version is live):
   - Guild-Corporate line 7: using "The Guild has mastered the art and science of helping corporate tea..."; also given: line 9 "After hours, you’ll adjourn to the Lobby Bar, The Courtyard or Pool..."
   - Guild-Dining-Collection line 2: using "The Many Pleasures of Guild Dining"; also given: line 4 "Unforgettable Dining Pleasures"
   - Guild-Dining-Collection line 5: using "A world of invention, craft and sophisticated menus."; also given: line 7 "Our collection of restaurants offers a world of invention, craft an..."; line 9 "Our collection of restaurants offer a world of inspiration."
   - Guild-Dining-Zuma line 13: using "You’ve been waiting to get dressed up. Please leave flip-flops, act..."; also given: line 15 "San Diego’s a beach town, which makes dressing up even more wonderf..."
   - Guild-History line 34: using "A LANDMARK REIMAGINED"; also given: line 37 "A LANDMARK REIMAGINED" (no "or" in doc)
   - Guild-History line 35: using "INC Architecture brought depth, material richness, and careful atte..."; also given: line 38 "INC Architecture interpreted rather than replicated historical refe..." (no "or" in doc)
   - Guild-Homepage line 7: using "A Century of Stories Meets a New Hospitality"; also given: line 9 "A Spirited History Meets a New Hospitality"
   - Guild-Homepage line 44: using "Generous comfort and stylish details."; also given: line 45 "Generous comfort and luxe, stylish details." (no "or" in doc); line 46 "Generous comfort and chic in-room details" (no "or" in doc)
   - Guild-Meeting-Collection line 5: using "Spaces for celebration and collaboration"; also given: line 8 "Spaces for small teams or big deals"
   - Guild-Rooms-SubPages line 5: using "The Art of Solo Travel"; also given: line 7 "Small is Beautiful"
2. Dining title pair: "The Many Pleasures of Guild Dining" is live; "Unforgettable Dining Pleasures" is listed, not used as night copy, since Figma decides which blocks switch.
3. No night copy in any doc. The sample night content from the day and night build (#338) is still showing in night mode as stand-in: Homepage hero ("the bold, handsome heart of san diego after dark"), Garden Terrace home card tagline, Cozy King night hero and card heading ("cozy king by lamplight"), lobby terrace night card intro, Coronado Beach night pop-up text.
4. Contact: the doc is empty, so the page is unchanged.
5. Wellness sub-pages: on hold, unchanged.
6. Rooms with no item: the four ADA rooms in the doc. Items with no copy: Placeholder Single 1 and 2 (to be removed before launch per the SEO pack).
7. Shared texts: the 14 template texts now have their own CMS fields, filled per item, and show once bound (section 7). Six case-only lines in shared components were left as they are.
8. Pages ready to tick as uploaded: listed in section 1.

## 6. For Kevin: the SEO sheet's H1 suggestions (not used, C2)

The content docs' wording is live. The SEO sheet suggests these H1s, "wording to agree with Kevin":

| Page | H1 on staging | Suggested |
|---|---|---|
| Homepage | the bold, handsome heart of san diego (doc wording, shown in lower case) | "The Guild Hotel: the bold, handsome heart of San Diego" |
| History | Bold Promise, Bright Future | "Our history since 1924: bold promise, bright future" |
| Neighborhood | EXCITEMENT AT YOUR DOORSTEP | "Downtown San Diego: a city at your fingertips" |
| Rooms | rooms & suites | "Rooms & suites at The Guild Hotel, San Diego" |
| Blog | THE GUILD BLOG | "The Guild Hotel blog" or "Stories from The Guild" |
| Gallery | THE GUILD GALLERY | "Photo gallery of The Guild Hotel" |
| Happenings | happenings | "Happenings at The Guild Hotel" |
| Press | GUILD PRESS ROOM | "Press and media" or "The Guild Hotel in the press" |
| Packages | Packages | "Hotel packages at The Guild" or "Packages and offers at The Guild Hotel" |

Note: the Neighborhood suggestion was written for the old H1; the doc's new H1 is "EXCITEMENT AT YOUR DOORSTEP".

## 7. Designer bindings left (Stephen's Mac)

Bind each template element to its new plain text field (Designer: select the element or component instance on the CMS template page, then bind the text or prop to the field). Every item already has a value, so binding never blanks a page. Field ids are in `docs/reference/webflow-ids.md`.

| Template | Element | Field |
|---|---|---|
| Rooms template | script-intro-centered heading (component prop Content/heading) on the Rooms template | Intro - Script Heading |
| Rooms template | "view floorplan" link text in the room description section | Description - Floorplan Button Text |
| Rooms template | paragraph over the full-bleed room photo (venue-card-fullbleed), the doc's "Cutline on photo" | Photo - Caption |
| Rooms template | Split Image Text Edge body text (component prop Content/Body, both instances), the doc's "(Next text block)" | Feature - Text |
| Rooms template | "in room amenities" heading | Amenities - Heading |
| Rooms template | paragraph under the amenities heading | Amenities - Text |
| Dinings template | Image Trio Text heading (component prop Header/Heading) on the Dinings template | Group Dining - Heading |
| Legal Corporates template | Image Trio Text Left heading (Header/Heading) | Features - Heading |
| Legal Corporates template | Image Trio Text Left first item heading (Items/Item 1 Heading) | Features - Item 1 Heading |
| Legal Corporates template | Image Trio Text Left third item heading (Items/Item 3 Heading) | Features - Item 3 Heading |
| Legal Corporates template | eyebrow heading in the dark feature grid (section_feature-grid-dark-eyebrow) | Why Choose - Eyebrow |
| Legal Corporates template | "discover more" link in the dark feature grid | Why Choose - Link Text |
| Legal Corporates template | Map Feature Image Bg heading (Content/Heading) | Map - Heading |
| Legal Corporates template | Map Feature Image Bg text (Content/Text) | Map - Text |

Two of these (Photo - Caption and Feature - Text on Rooms) go beyond the 12 spots in the copy map: the same check found two more texts fixed on the room template (the photo caption and the text block under it), which the docs give per room ("Cutline on photo", "(Next text block)"), so C6 was applied to them too.

## 8. Tables

### Change rows by page

| page | done | waits for Designer binding | other |
|---|---|---|---|
| / | 27 | 0 | 1 |
| /arts | 5 | 0 | 2 |
| /beyond-downtown-places/* | 2 | 0 | 0 |
| /blog | 4 | 0 | 0 |
| /dining | 4 | 0 | 0 |
| /dining/* | 4 | 0 | 0 |
| /dining/dining-gardenterrace | 7 | 0 | 0 |
| /dining/dining-lobbybar | 6 | 1 | 0 |
| /dining/dining-poollounge | 6 | 1 | 0 |
| /dining/dining-zuma | 7 | 0 | 0 |
| /gallery | 2 | 0 | 0 |
| /happenings | 3 | 0 | 1 |
| /history | 7 | 0 | 0 |
| /legal-corporate/corporate | 9 | 4 | 0 |
| /legal-corporate/legal | 10 | 1 | 0 |
| /meeting-venues/* | 25 | 0 | 0 |
| /meetings | 5 | 0 | 0 |
| /neighborhood | 10 | 0 | 8 |
| /press | 3 | 0 | 1 |
| /rooms | 5 | 0 | 1 |
| /rooms/city-level-below-ground | 6 | 5 | 0 |
| /rooms/cozy-courtyard-king | 6 | 5 | 0 |
| /rooms/cozy-courtyard-queen | 6 | 5 | 0 |
| /rooms/cozy-king | 6 | 5 | 0 |
| /rooms/cozy-queen | 6 | 5 | 0 |
| /rooms/guild-city-level-loft | 6 | 5 | 0 |
| /rooms/guild-corner-loft-suite | 5 | 5 | 0 |
| /rooms/guild-double | 5 | 5 | 0 |
| /rooms/guild-loft-suite | 5 | 5 | 1 |
| /rooms/two-bedroom-loft-suite | 5 | 5 | 0 |
| /wellness | 12 | 0 | 0 |

### Change rows not done

| row | page | target | new text | reason |
|---|---|---|---|---|
| `Guild-Arts:11` | /arts | p | Openings, events, music and tours – our art is alive, and... | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Arts:14` | /arts | Split Image Text Edge Large / Content... | The works of eight artists have been chosen for The Guild... | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Corporate:14` | /legal-corporate/corporate | Features - Item 1 Heading | High-Speed Encrypted Wi-Fi | written to the new field "Features - Item 1 Heading"; shows once the Designer binds it |
| `Guild-Corporate:20` | /legal-corporate/corporate | Features - Item 3 Heading | Elevated Work Spaces | written to the new field "Features - Item 3 Heading"; shows once the Designer binds it |
| `Guild-Corporate:78` | /legal-corporate/corporate | Map - Heading | Steps From Downtown | written to the new field "Map - Heading"; shows once the Designer binds it |
| `Guild-Corporate:79` | /legal-corporate/corporate | Map - Text | The Guild offers privacy for meetings on the doorstep of ... | written to the new field "Map - Text"; shows once the Designer binds it |
| `Guild-Dining-LobbyBar:14` | /dining/dining-lobbybar | Group Dining - Heading | GROUP DINING AND EVENTS | written to the new field "Group Dining - Heading"; shows once the Designer binds it |
| `Guild-Dining-PoolLounge:13` | /dining/dining-poollounge | Group Dining - Heading | GROUP DINING AND EVENTS | written to the new field "Group Dining - Heading"; shows once the Designer binds it |
| `Guild-HappeningsCollection:4` | /happenings | Hero Fullbleed Centered / Content/Text | There’s always something on in the Guild neighborhood. Do... | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Homepage:63` | / | Venue Card Fullbleed Left / Content/Text | Three smart, stylish spaces breed brighter ideas. | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Legal:68` | /legal-corporate/legal | Map - Text | The Guild is the right place to prepare, and it puts your... | written to the new field "Map - Text"; shows once the Designer binds it |
| `Guild-Neighborhood:17` | /neighborhood | Split Image Text Stagger Mid / Conten... | San Diego is always on in the historic, dynamic Gaslamp, ... | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Neighborhood:20` | /neighborhood | Split Image Text Wide / Content/Body | At 48 walkable, delicious blocks, ours is the biggest Lit... | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Neighborhood:47` | /neighborhood | Corporate Services Card / Text | The Guild is proud to be a home away from home for attend... | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Neighborhood:50` | /neighborhood | Corporate Services Card / Text | The Guild regularly and securely hosts many firms researc... | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Neighborhood:52` | /neighborhood | Corporate Services Card / Title | U.S. DISTRICT COURT FOR THE SOUTHERN DISTRICT OF CALIFORNIA | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Neighborhood:53` | /neighborhood | Corporate Services Card / Text | The Guild is just two blocks away from this court, and se... | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Neighborhood:55` | /neighborhood | Corporate Services Card / Title | HALL OF JUSTICE | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Neighborhood:56` | /neighborhood | Corporate Services Card / Text | The Guild is a three-minute walk from the Hall of Justice... | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Press:2` | /press | Hero Fullbleed Centered / Content/Hea... | GUILD PRESS ROOM | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Rooms-Collection:6` | /rooms | script-intro-centered / Content/parag... | From cozy spaces to generous loft suites, our rooms offer... | live (read on the published page); the check matched the same placeholder text in another block on the page |
| `Guild-Rooms-SubPages:5` | /rooms/cozy-queen | Intro - Script Heading | The Art of Solo Travel | written to the new field "Intro - Script Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:21` | /rooms/cozy-queen | Photo - Caption | After a night out, the Cozy Queen offers privacy and room... | written to the new field "Photo - Caption"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:24` | /rooms/cozy-queen | Feature - Text | The Cozy Queen is an intimate room with big ideas. Colors... | written to the new field "Feature - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:26` | /rooms/cozy-queen | Amenities - Heading | In-Room Amenities | written to the new field "Amenities - Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:27` | /rooms/cozy-queen | Amenities - Text | The little things make all the difference. The scent of t... | written to the new field "Amenities - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:44` | /rooms/cozy-courtyard-queen | Intro - Script Heading | Intimacy with a Point of View | written to the new field "Intro - Script Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:61` | /rooms/cozy-courtyard-queen | Photo - Caption | After a night out, the Courtyard Queen offers room to bre... | written to the new field "Photo - Caption"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:64` | /rooms/cozy-courtyard-queen | Feature - Text | The Courtyard Queen feels expansive and restful. Colors a... | written to the new field "Feature - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:66` | /rooms/cozy-courtyard-queen | Amenities - Heading | In-Room Amenities | written to the new field "Amenities - Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:67` | /rooms/cozy-courtyard-queen | Amenities - Text | The little things make all the difference. The scent of t... | written to the new field "Amenities - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:84` | /rooms/cozy-king | Intro - Script Heading | King-Sized Comfort | written to the new field "Intro - Script Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:101` | /rooms/cozy-king | Photo - Caption | After a night out, the Cozy King is a sanctuary. | written to the new field "Photo - Caption"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:104` | /rooms/cozy-king | Feature - Text | The Cozy King thinks big. Cool interior colors are restfu... | written to the new field "Feature - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:106` | /rooms/cozy-king | Amenities - Heading | In-Room Amenities | written to the new field "Amenities - Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:107` | /rooms/cozy-king | Amenities - Text | Details deliver in the Cozy King. The scent of the room s... | written to the new field "Amenities - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:124` | /rooms/cozy-courtyard-king | Intro - Script Heading | Intimacy with a Point of View | written to the new field "Intro - Script Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:141` | /rooms/cozy-courtyard-king | Photo - Caption | After a night out, the Courtyard King offers room to brea... | written to the new field "Photo - Caption"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:144` | /rooms/cozy-courtyard-king | Feature - Text | The Courtyard King offers a soothing space with cool neut... | written to the new field "Feature - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:146` | /rooms/cozy-courtyard-king | Amenities - Heading | In-Room Amenities | written to the new field "Amenities - Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:147` | /rooms/cozy-courtyard-king | Amenities - Text | Take a deep breath; the scent of the room sets the luxuri... | written to the new field "Amenities - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:164` | /rooms/city-level-below-ground | Intro - Script Heading | Space meets privacy | written to the new field "Intro - Script Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:182` | /rooms/city-level-below-ground | Photo - Caption | After a day downtown, the City Level Below Ground offers ... | written to the new field "Photo - Caption"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:185` | /rooms/city-level-below-ground | Feature - Text | The City Level Below Ground has it all. Colors and textur... | written to the new field "Feature - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:187` | /rooms/city-level-below-ground | Amenities - Heading | In-Room Amenities | written to the new field "Amenities - Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:188` | /rooms/city-level-below-ground | Amenities - Text | This is a room for all the senses: a luxurious scent sets... | written to the new field "Amenities - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:205` | /rooms/guild-city-level-loft | Intro - Script Heading | Street Smart City Space. | written to the new field "Intro - Script Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:221` | /rooms/guild-city-level-loft | Photo - Caption | After a night out, the City Level Loft offers room to bre... | written to the new field "Photo - Caption"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:224` | /rooms/guild-city-level-loft | Feature - Text | The City Level Loft is as generously proportioned as it i... | written to the new field "Feature - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:226` | /rooms/guild-city-level-loft | Amenities - Heading | In-Room Amenities | written to the new field "Amenities - Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:227` | /rooms/guild-city-level-loft | Amenities - Text | Every detail is intentional: the room scent is luxurious ... | written to the new field "Amenities - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:244` | /rooms/guild-loft-suite | Intro - Script Heading | Loft Space For All. | written to the new field "Intro - Script Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:259` | /rooms/guild-loft-suite | size-label | 463sqft / 42sqm. | written; the size shows on room cards, not on the room page the check opens |
| `Guild-Rooms-SubPages:263` | /rooms/guild-loft-suite | Photo - Caption | After a night in San Diego, the City Level Loft offers ro... | written to the new field "Photo - Caption"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:266` | /rooms/guild-loft-suite | Feature - Text | The City Level Loft soothes and stimulates, with custom f... | written to the new field "Feature - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:268` | /rooms/guild-loft-suite | Amenities - Heading | In-Room Amenities | written to the new field "Amenities - Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:269` | /rooms/guild-loft-suite | Amenities - Text | The pleasing scent of the room sets a luxurious, welcomin... | written to the new field "Amenities - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:286` | /rooms/guild-corner-loft-suite | Intro - Script Heading | The view from here | written to the new field "Intro - Script Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:301` | /rooms/guild-corner-loft-suite | Photo - Caption | Room to get ready. Space to stretch out. The Guild Corner... | written to the new field "Photo - Caption"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:304` | /rooms/guild-corner-loft-suite | Feature - Text | Guild Corner Loft Suites offer thoughtful interiors, cust... | written to the new field "Feature - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:306` | /rooms/guild-corner-loft-suite | Amenities - Heading | In-Room Amenities | written to the new field "Amenities - Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:307` | /rooms/guild-corner-loft-suite | Amenities - Text | Every detail delights in the Guild Corner Loft Suite: the... | written to the new field "Amenities - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:325` | /rooms/guild-double | Intro - Script Heading | Perfect Proportions | written to the new field "Intro - Script Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:339` | /rooms/guild-double | Photo - Caption | Going out is grand. Coming home is better. The Guild Doub... | written to the new field "Photo - Caption"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:342` | /rooms/guild-double | Feature - Text | Guild Doubles offer custom interiors and tailored furnitu... | written to the new field "Feature - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:344` | /rooms/guild-double | Amenities - Heading | In-Room Amenities | written to the new field "Amenities - Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:345` | /rooms/guild-double | Amenities - Text | The Guild Double is full of luxurious details, like the p... | written to the new field "Amenities - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:362` | /rooms/two-bedroom-loft-suite | Intro - Script Heading | You Belong at the Top | written to the new field "Intro - Script Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:379` | /rooms/two-bedroom-loft-suite | Photo - Caption | Going out is grand. Coming home to the Two-Bedroom Loft S... | written to the new field "Photo - Caption"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:382` | /rooms/two-bedroom-loft-suite | Feature - Text | More than a mere home away from home, the Two-Bedroom Lof... | written to the new field "Feature - Text"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:384` | /rooms/two-bedroom-loft-suite | Amenities - Heading | In-Room Amenities | written to the new field "Amenities - Heading"; shows once the Designer binds it |
| `Guild-Rooms-SubPages:385` | /rooms/two-bedroom-loft-suite | Amenities - Text | Two Bedroom Loft Suites offer details designed to please:... | written to the new field "Amenities - Text"; shows once the Designer binds it |

### Doc lines with no place on staging (not on site)

| reason | lines |
|---|---|
| amenity list item: amenities are items of the Amenities collection shared by every room | 80 |
| no element on the template page is left to hold this line | 50 |
| no room item named APPRENTICE KING ADA | 23 |
| no room item named SOCIETY KING ADA | 22 |
| no room item named ARTISAN KING ADA | 22 |
| no room item named APPRENTICE QUEEN ADA | 22 |
| no element on the page is left to hold this line | 18 |
| no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 Amer... | 15 |
| restates the room name under the description label | 10 |
| accessible-room paragraph: no room field holds it | 10 |
| section label: the venue page holds only the text under it | 5 |
| Council Boardroom has one card intro on every page | 2 |
| further text block: the dining item has no field for a second intro section | 2 |
| pop-up tagline: the pop-up has no tagline slot and the card intro takes the Meetings do... | 2 |
| restates the room name above the stats | 2 |
| checked on staging: the slot is the "beyond downtown" section heading, not a place | 1 |

### Picks for the rows to confirm and the moved rows (C5 to C7)

Every pick is also in `catalogue/picks.json` and on its row in the copy map.

| row | pick | note |
|---|---|---|
| `Guild-Corporate:12` | retarget | C6: per-item CMS field "Features - Heading" on Corporate (template text is bound in the Designer) |
| `Guild-Corporate:14` | retarget | C6: per-item CMS field "Features - Item 1 Heading" on Corporate (template text is bound in the Designer) |
| `Guild-Corporate:20` | retarget | C6: per-item CMS field "Features - Item 3 Heading" on Corporate (template text is bound in the Designer) |
| `Guild-Corporate:23` | retarget | C6: per-item CMS field "Why Choose - Eyebrow" on Corporate (template text is bound in the Designer) |
| `Guild-Corporate:67` | retarget | C6: per-item CMS field "Why Choose - Link Text" on Corporate (template text is bound in the Designer) |
| `Guild-Corporate:78` | retarget | C6: per-item CMS field "Map - Heading" on Corporate (template text is bound in the Designer) |
| `Guild-Corporate:79` | retarget | C6: per-item CMS field "Map - Text" on Corporate (template text is bound in the Designer); the doc wraps this sentence onto the next line, joined into one |
| `Guild-Dining-GardenTerrace:16` | retarget | C6: per-item CMS field "Group Dining - Heading" on Garden Terrace (template text is bound in the Designer) |
| `Guild-Dining-LobbyBar:14` | retarget | C6: per-item CMS field "Group Dining - Heading" on Lobby Bar (template text is bound in the Designer) |
| `Guild-Dining-PoolLounge:13` | retarget | C6: per-item CMS field "Group Dining - Heading" on Pool Lounge (template text is bound in the Designer) |
| `Guild-Legal:9` | retarget | C6: per-item CMS field "Features - Heading" on Legal (template text is bound in the Designer) |
| `Guild-Legal:12` | retarget | C6: per-item CMS field "Why Choose - Eyebrow" on Legal (template text is bound in the Designer) |
| `Guild-Legal:56` | retarget | C6: per-item CMS field "Why Choose - Link Text" on Legal (template text is bound in the Designer) |
| `Guild-Legal:67` | retarget | C6: per-item CMS field "Map - Heading" on Legal (template text is bound in the Designer) |
| `Guild-Legal:68` | retarget | C6: per-item CMS field "Map - Text" on Legal (template text is bound in the Designer); the doc wraps this sentence onto the next line, joined into one |
| `Guild-Rooms-SubPages:5` | retarget | C6: per-item CMS field "Intro - Script Heading" on Cozy Queen (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:7` | retarget | C6: per-item CMS field "Intro - Script Heading" on Cozy Queen (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:13` | retarget | C6: per-item CMS field "Description - Floorplan Button Text" on Cozy Queen (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:26` | retarget | C6: per-item CMS field "Amenities - Heading" on Cozy Queen (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:27` | retarget | C6: per-item CMS field "Amenities - Text" on Cozy Queen (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:44` | retarget | C6: per-item CMS field "Intro - Script Heading" on Cozy Courtyard Queen (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:52` | retarget | C6: per-item CMS field "Description - Floorplan Button Text" on Cozy Courtyard Queen (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:66` | retarget | C6: per-item CMS field "Amenities - Heading" on Cozy Courtyard Queen (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:67` | retarget | C6: per-item CMS field "Amenities - Text" on Cozy Courtyard Queen (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:84` | retarget | C6: per-item CMS field "Intro - Script Heading" on Cozy King (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:91` | retarget | C6: per-item CMS field "Description - Floorplan Button Text" on Cozy King (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:106` | retarget | C6: per-item CMS field "Amenities - Heading" on Cozy King (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:107` | retarget | C6: per-item CMS field "Amenities - Text" on Cozy King (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:124` | retarget | C6: per-item CMS field "Intro - Script Heading" on Cozy Courtyard King (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:132` | retarget | C6: per-item CMS field "Description - Floorplan Button Text" on Cozy Courtyard King (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:146` | retarget | C6: per-item CMS field "Amenities - Heading" on Cozy Courtyard King (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:147` | retarget | C6: per-item CMS field "Amenities - Text" on Cozy Courtyard King (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:164` | retarget | C6: per-item CMS field "Intro - Script Heading" on City Level Below Ground (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:171` | retarget | C6: per-item CMS field "Description - Floorplan Button Text" on City Level Below Ground (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:187` | retarget | C6: per-item CMS field "Amenities - Heading" on City Level Below Ground (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:188` | retarget | C6: per-item CMS field "Amenities - Text" on City Level Below Ground (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:205` | retarget | C6: per-item CMS field "Intro - Script Heading" on Guild City Level Loft (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:212` | retarget | C6: per-item CMS field "Description - Floorplan Button Text" on Guild City Level Loft (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:226` | retarget | C6: per-item CMS field "Amenities - Heading" on Guild City Level Loft (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:227` | retarget | C6: per-item CMS field "Amenities - Text" on Guild City Level Loft (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:244` | retarget | C6: per-item CMS field "Intro - Script Heading" on Guild Loft Suite (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:251` | retarget | C6: per-item CMS field "Description - Floorplan Button Text" on Guild Loft Suite (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:268` | retarget | C6: per-item CMS field "Amenities - Heading" on Guild Loft Suite (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:269` | retarget | C6: per-item CMS field "Amenities - Text" on Guild Loft Suite (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:286` | retarget | C6: per-item CMS field "Intro - Script Heading" on Guild Corner Loft Suite (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:306` | retarget | C6: per-item CMS field "Amenities - Heading" on Guild Corner Loft Suite (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:307` | retarget | C6: per-item CMS field "Amenities - Text" on Guild Corner Loft Suite (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:325` | retarget | C6: per-item CMS field "Intro - Script Heading" on Guild Double (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:344` | retarget | C6: per-item CMS field "Amenities - Heading" on Guild Double (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:345` | retarget | C6: per-item CMS field "Amenities - Text" on Guild Double (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:362` | retarget | C6: per-item CMS field "Intro - Script Heading" on Two Bedroom Loft Suite (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:384` | retarget | C6: per-item CMS field "Amenities - Heading" on Two Bedroom Loft Suite (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:385` | retarget | C6: per-item CMS field "Amenities - Text" on Two Bedroom Loft Suite (template text is bound in the Designer) |
| `Guild-Rooms-SubPages:21` | retarget | cutline over the room photo: new per-item field "Photo - Caption" on Cozy Queen |
| `Guild-Rooms-SubPages:24` | retarget | checked on staging: the details field is the stats list, so this "(Next text block)" paragraph goes to the block under the photo, new field "Feature - Text" ... |
| `Guild-Rooms-SubPages:16` | retarget | checked on staging: the room page shows the doc's stats as the bullet list in the description (rich text field Room Description - Details); the list is writt... |
| `Guild-Rooms-SubPages:61` | retarget | cutline over the room photo: new per-item field "Photo - Caption" on Cozy Courtyard Queen |
| `Guild-Rooms-SubPages:64` | retarget | checked on staging: the details field is the stats list, so this "(Next text block)" paragraph goes to the block under the photo, new field "Feature - Text" ... |
| `Guild-Rooms-SubPages:55` | retarget | checked on staging: the room page shows the doc's stats as the bullet list in the description (rich text field Room Description - Details); the list is writt... |
| `Guild-Rooms-SubPages:101` | retarget | cutline over the room photo: new per-item field "Photo - Caption" on Cozy King |
| `Guild-Rooms-SubPages:104` | retarget | checked on staging: the details field is the stats list, so this "(Next text block)" paragraph goes to the block under the photo, new field "Feature - Text" ... |
| `Guild-Rooms-SubPages:95` | retarget | checked on staging: the room page shows the doc's stats as the bullet list in the description (rich text field Room Description - Details); the list is writt... |
| `Guild-Rooms-SubPages:141` | retarget | cutline over the room photo: new per-item field "Photo - Caption" on Cozy Courtyard King |
| `Guild-Rooms-SubPages:144` | retarget | checked on staging: the details field is the stats list, so this "(Next text block)" paragraph goes to the block under the photo, new field "Feature - Text" ... |
| `Guild-Rooms-SubPages:135` | retarget | checked on staging: the room page shows the doc's stats as the bullet list in the description (rich text field Room Description - Details); the list is writt... |
| `Guild-Rooms-SubPages:182` | retarget | cutline over the room photo: new per-item field "Photo - Caption" on City Level Below Ground |
| `Guild-Rooms-SubPages:185` | retarget | checked on staging: the details field is the stats list, so this "(Next text block)" paragraph goes to the block under the photo, new field "Feature - Text" ... |
| `Guild-Rooms-SubPages:175` | retarget | checked on staging: the room page shows the doc's stats as the bullet list in the description (rich text field Room Description - Details); the list is writt... |
| `Guild-Rooms-SubPages:179` | retarget | joined into the stats list |
| `Guild-Rooms-SubPages:221` | retarget | cutline over the room photo: new per-item field "Photo - Caption" on Guild City Level Loft |
| `Guild-Rooms-SubPages:224` | retarget | checked on staging: the details field is the stats list, so this "(Next text block)" paragraph goes to the block under the photo, new field "Feature - Text" ... |
| `Guild-Rooms-SubPages:215` | retarget | checked on staging: the room page shows the doc's stats as the bullet list in the description (rich text field Room Description - Details); the list is writt... |
| `Guild-Rooms-SubPages:263` | retarget | cutline over the room photo: new per-item field "Photo - Caption" on Guild Loft Suite |
| `Guild-Rooms-SubPages:266` | retarget | checked on staging: the details field is the stats list, so this "(Next text block)" paragraph goes to the block under the photo, new field "Feature - Text" ... |
| `Guild-Rooms-SubPages:255` | retarget | checked on staging: the room page shows the doc's stats as the bullet list in the description (rich text field Room Description - Details); the list is writt... |
| `Guild-Rooms-SubPages:256` | retarget | joined into the stats list |
| `Guild-Rooms-SubPages:258` | retarget | joined into the stats list |
| `Guild-Rooms-SubPages:301` | retarget | cutline over the room photo: new per-item field "Photo - Caption" on Guild Corner Loft Suite |
| `Guild-Rooms-SubPages:304` | retarget | checked on staging: the details field is the stats list, so this "(Next text block)" paragraph goes to the block under the photo, new field "Feature - Text" ... |
| `Guild-Rooms-SubPages:293` | retarget | checked on staging: the room page shows the doc's stats as the bullet list in the description (rich text field Room Description - Details); the list is writt... |
| `Guild-Rooms-SubPages:294` | retarget | joined into the stats list |
| `Guild-Rooms-SubPages:296` | retarget | joined into the stats list |
| `Guild-Rooms-SubPages:339` | retarget | cutline over the room photo: new per-item field "Photo - Caption" on Guild Double |
| `Guild-Rooms-SubPages:342` | retarget | checked on staging: the details field is the stats list, so this "(Next text block)" paragraph goes to the block under the photo, new field "Feature - Text" ... |
| `Guild-Rooms-SubPages:333` | retarget | checked on staging: the room page shows the doc's stats as the bullet list in the description (rich text field Room Description - Details); the list is writt... |
| `Guild-Rooms-SubPages:379` | retarget | cutline over the room photo: new per-item field "Photo - Caption" on Two Bedroom Loft Suite |
| `Guild-Rooms-SubPages:382` | retarget | checked on staging: the details field is the stats list, so this "(Next text block)" paragraph goes to the block under the photo, new field "Feature - Text" ... |
| `Guild-Rooms-SubPages:370` | retarget | checked on staging: the room page shows the doc's stats as the bullet list in the description (rich text field Room Description - Details); the list is writt... |
| `Guild-Rooms-SubPages:371` | retarget | joined into the stats list |
| `Guild-Rooms-SubPages:372` | retarget | joined into the stats list |
| `Guild-Rooms-SubPages:374` | retarget | joined into the stats list |
| `Guild-Rooms-SubPages:375` | retarget | joined into the stats list |
| `Guild-Neighborhood:40` | reject | checked on staging: the slot is the "beyond downtown" section heading, not a place; the SDMA has no place card on staging |
| `Guild-Neighborhood:55` | retarget | checked on staging after upload: the fourth Corporate & Services card (placeholder) holds the doc's fourth court, Hall of Justice |
| `Guild-Neighborhood:56` | retarget | checked on staging after upload: the fourth Corporate & Services card (placeholder) holds the doc's fourth court, Hall of Justice |
| `Guild-Corporate:73` | reject | Council Boardroom has one card intro on every page; the Meetings doc line (Guild-Meeting-Collection:14) is used, this one is listed as differs |
| `Guild-Legal:62` | reject | Council Boardroom has one card intro on every page; the Meetings doc line (Guild-Meeting-Collection:14) is used, this one is listed as differs |
| `Guild-Meetings-Modals:92` | reject | pop-up tagline: the pop-up has no tagline slot and the card intro takes the Meetings doc line (Guild-Meeting-Collection:17) |
| `Guild-Meetings-Modals:66` | reject | pop-up tagline: the pop-up has no tagline slot and the card intro takes the Meetings doc line (Guild-Meeting-Collection:20) |
| `Guild-Rooms-SubPages:259` | accept | sizes are one size in two units: joined with " / " |
| `Guild-Homepage:31` | accept | checked on staging: the doc's Lobby Terrace card is the Garden Terrace dining card (Mediterranean); the card keeps the item name Garden Terrace, listed as di... |
| `Guild-Arts:2` | accept | checked on staging: same slot, doc wording |
| `Guild-Arts:3` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Arts:5` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Arts:6` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Arts:8` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Arts:11` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Arts:14` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-BlogCollection:2` | accept | checked on staging: same slot, doc wording |
| `Guild-BlogCollection:4` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-BlogCollection:6` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-BlogCollection:8` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Dining-Collection:2` | accept | checked on staging: same slot, doc wording |
| `Guild-Dining-GardenTerrace:2` | accept | checked on staging: the Zuma page h1 shows the Hero Heading field, so this item's h1 is the same field |
| `Guild-Dining-LobbyBar:2` | accept | checked on staging: the Zuma page h1 shows the Hero Heading field, so this item's h1 is the same field |
| `Guild-Dining-PoolLounge:2` | accept | checked on staging: the Zuma page h1 shows the Hero Heading field, so this item's h1 is the same field |
| `Guild-Gallery:2` | accept | checked on staging: same slot, doc wording |
| `Guild-Gallery:3` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-HappeningsCollection:4` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-HappeningsCollection:6` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-HappeningsCollection:8` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-History:37` | accept | checked: repeated variant, listed for Omar |
| `Guild-History:38` | accept | checked: repeated variant, listed for Omar |
| `Guild-Homepage:19` | accept | checked: Zuma is the Zuma San Diego item |
| `Guild-Homepage:20` | accept | checked: Zuma is the Zuma San Diego item |
| `Guild-Homepage:17` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Homepage:40` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Homepage:44` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Homepage:45` | accept | checked: repeated variant, listed for Omar |
| `Guild-Homepage:46` | accept | checked: repeated variant, listed for Omar |
| `Guild-Homepage:59` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Homepage:63` | accept | checked on staging: same slot, doc wording |
| `Guild-Legal:2` | accept | checked: the Legal item exists in the CMS |
| `Guild-Legal:3` | accept | checked: the Legal item exists in the CMS |
| `Guild-Legal:5` | accept | checked: the Legal item exists in the CMS |
| `Guild-Legal:7` | accept | checked: the Legal item exists in the CMS |
| `Guild-Legal:39` | accept | checked: the Legal item exists in the CMS |
| `Guild-Legal:40` | accept | checked: the Legal item exists in the CMS |
| `Guild-Meeting-Collection:14` | accept | checked: no conflict left after the picks |
| `Guild-Meeting-Collection:16` | accept | checked: no conflict left after the picks |
| `Guild-Meeting-Collection:17` | accept | checked: no conflict left after the picks |
| `Guild-Meeting-Collection:19` | accept | checked: no conflict left after the picks |
| `Guild-Meeting-Collection:20` | accept | checked: no conflict left after the picks |
| `Guild-Meeting-Collection:3` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Meeting-Collection:5` | accept | checked on staging: same slot, doc wording |
| `Guild-Meeting-Collection:6` | accept | checked on staging: same slot, doc wording |
| `Guild-Meeting-Collection:9` | accept | checked on staging: same slot, doc wording |
| `Guild-Meeting-Collection:11` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Meetings-Modals:27` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:37` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:38` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:40` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:41` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:43` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:45` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:46` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:47` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:48` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:49` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:50` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:51` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:52` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:53` | reject | no Lobby Bar meeting venue on staging (only Council Boardroom, lobby terrace and 1 America Plaza show on Meetings); not created |
| `Guild-Meetings-Modals:55` | accept | checked: no conflict left after the picks |
| `Guild-Meetings-Modals:65` | accept | checked: no conflict left after the picks |
| `Guild-Meetings-Modals:81` | accept | checked: no conflict left after the picks |
| `Guild-Meetings-Modals:91` | accept | checked: no conflict left after the picks |
| `Guild-Neighborhood:4` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Neighborhood:5` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Neighborhood:8` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Neighborhood:11` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Neighborhood:17` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Neighborhood:20` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Neighborhood:47` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Neighborhood:50` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Neighborhood:52` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Neighborhood:53` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Press:2` | accept | checked on staging: same slot, doc wording |
| `Guild-Press:3` | retarget | checked on staging after upload: the line sits under the hero heading, so it goes to the hero text (placeholder); the lower intro keeps its own copy |
| `Guild-Press:5` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Press:6` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Press:8` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Rooms-Collection:3` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Rooms-Collection:6` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Rooms-Collection:8` | accept | checked on staging: same slot, doc wording |
| `Guild-Rooms-Collection:9` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Rooms-SubPages:57` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:58` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:97` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:98` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:137` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:138` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:177` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:178` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:217` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:218` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:260` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:297` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:298` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:335` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Rooms-SubPages:336` | accept | sizes joined with " \| " as two room sizes |
| `Guild-Wellness-Collection:4` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Wellness-Collection:6` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Wellness-Collection:7` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Wellness-Collection:10` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Wellness-Collection:12` | accept | checked on staging: same slot, doc wording |
| `Guild-Wellness-Collection:13` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Wellness-Collection:16` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Wellness-Collection:19` | accept | checked on staging: the slot holds placeholder text in the section this doc line describes |
| `Guild-Corporate:80` | retarget | second half of the sentence in Guild-Corporate:79, joined |
| `Guild-Legal:69` | retarget | second half of the sentence in Guild-Legal:68, joined |
| `Guild-Meetings-Modals:18` | retarget | checked in the open pop-up: a feature line, shown as feature 1 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:19` | retarget | checked in the open pop-up: the layout lines go to Layout options; the size line is feature 1 and the furniture note is printed by the pop-up |
| `Guild-Meetings-Modals:20` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:21` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:22` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:23` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:24` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:25` | reject | the pop-up prints "*requires furniture removal, charges may apply" under the layouts already |
| `Guild-Meetings-Modals:72` | retarget | checked in the open pop-up: a feature line, shown as feature 1 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:73` | retarget | checked in the open pop-up: the layout lines go to Layout options; the size line is feature 1 and the furniture note is printed by the pop-up |
| `Guild-Meetings-Modals:74` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:75` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:76` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:77` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:78` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:79` | retarget | joined into the layout list |
| `Guild-Meetings-Modals:80` | reject | the pop-up prints "*requires furniture removal, charges may apply" under the layouts already |
| `Guild-Meetings-Modals:103` | retarget | checked in the open pop-up: a feature line, shown as feature 1 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:104` | retarget | checked in the open pop-up: a feature line, shown as feature 2 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:105` | retarget | checked in the open pop-up: a feature line, shown as feature 3 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:106` | retarget | checked in the open pop-up: a feature line, shown as feature 4 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:107` | retarget | checked in the open pop-up: a feature line, shown as feature 5 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:108` | reject | sixth feature line: the pop-up has five feature slots |
| `Guild-Meetings-Modals:113` | retarget | checked in the open pop-up: a feature line, shown as feature 1 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:114` | retarget | checked in the open pop-up: a feature line, shown as feature 2 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:115` | retarget | checked in the open pop-up: a feature line, shown as feature 3 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:116` | retarget | checked in the open pop-up: a feature line, shown as feature 4 (the doc lists it under "Features") |
| `Guild-Meetings-Modals:117` | retarget | checked in the open pop-up: a feature line, shown as feature 5 (the doc lists it under "Features") |
