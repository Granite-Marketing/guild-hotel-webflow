# Final review, Lane A: pages and content (2026-11-25)

Read-only check of https://the-guild-hotel-c34e71.webflow.io (footer bundle v1.3.23) with headless Playwright. Nothing was changed, submitted, published or deleted. The 20 Nov reviews were treated as claims, not evidence.

**How it was checked.** 34 pages loaded and scrolled at 1440, 991, 800, 650 and 390 (170 loads): every static page, all 5 dining venues, 4 rooms, both Legal and Corporate items, 3 Happenings and Stories posts, 2 packages and the 404. The other 8 rooms, 3 posts and 2 packages were read for content. URLs came from crawling links after JavaScript ran. Eight helper checks (six by page group, two for tablet widths) ran separately. Their main failures were re-run by the reviewing session; a row marked **(helper)** was seen live by a helper and not re-run. Claims that did not hold are under "Checked and rejected".

**Variants.** Each variant's class was removed from the live instance, so the same content rendered as Base. Both states were screenshotted and measured at all five widths. This tests the CSS a variant adds, not settings a Designer instance might hide.

Widths: "all" means all five. Evidence images are in `refs/final-review-2026-11-25/`.

## Answer first

1. The split is not finished. 34 variant ids are still on live pages and another 40 sit in the stylesheet with no page found using them.
2. Of the 34: **3 change nothing you can see**, **2 only affect something nobody can reach**, 3 make only a tiny change (A6 to A8), and the rest are genuinely different.
3. 91% of the site stylesheet (2.18 of 2.40 MB, before compression) is variant rules. Most come from 26 variants that each copied rules for over 500 unrelated classes (8 of those 26 were not found on any page).
4. Biggest visitor-facing faults: dead Reserve and Book buttons, the same room and dining copy on every item, another hotel's maps, two other-hotel posts, quiz results that are placeholder rooms, empty boxes on 23 of 24 press cards, and nav text that vanishes on dark photos.

## Findings

Suggested actions are proposals for Stephen. Names are proposals too.

### A. Variants

"Same" means no visible pixel change against Base. D = 1440, T = 991 and 800, P = 650 and 390.

| # | Component and variant (current name, id) | What visibly differs from Base, and where | Evidence | Width | Action | Lane |
|---|---|---|---|---|---|---|
| A1 | Hero, Dining `a38fd15c` (/dining) | Nothing. It narrows a text block that renders no differently | 0 changed pixels at all five | none | ask: remove, or drop to Base | Designer |
| A2 | Hero, Short Mobile `54ea4c9c` (Guidelines, Legal, Corporate) | Nothing. Every hero is now full height on phones, so the short version no longer exists | 0 changed pixels at all five on /guidelines and /legal | none | ask: remove | Designer |
| A3 | Card Carousel, Press `49cffb92` (/press) | Nothing | 0 changed at 991 to 390; at 1440 only the nav overlay moved | none | ask: remove | Designer |
| A4 | Hero, Left `75108921` (/arts) | Left-aligns the hero text, but its only use is a hidden hero section nobody sees (see E6) | 0 x 0 on the page; differs when forced visible | all, if shown | ask: remove with the hidden section, or keep as "Left Aligned" | Designer |
| A5 | Overlay Detail Panel Modal, Dark `569f778f` (/arts, ten old pop-ups) | A different layout and dark colours, but no visible link opens any of the ten (see E5) | Opened by forcing it visible | all, if shown | ask: remove with the ten pop-ups | Designer |
| A6 | Gallery Mosaic, Dining `76af03c7` (5 venues) | Gallery heading sits 20px lower | Heading 20 to 40px from the top | P | rename "Phone Lower Heading", or merge into Base | Designer |
| A7 | tab-pills-intro, Press `59a1b413` (/press) | Script heading 56 to 53px; 38px more space below at 390 | 386 to 420px tall at 390, 374 to 370 at 650 | P | merge into Base, or rename "Phone Spacing". A head CSS rule also names this id | Designer, code |
| A8 | script-intro, Arts `0fb367ce` (/arts) | 16px less space under the heading | 474 to 458px tall at 390 | P | merge with A9 to A12 | Designer |
| A9 | script-intro, History `7a7cf0d6` | D: 112px less space below. T: same. P: smaller heading (35 to 31px), 40px less space | 736 to 624px tall at 1440 | D, P | rename "Tight Bottom" | Designer |
| A10 | script-intro, Neighborhood `4395a28c` | D and T same. P: heading 35 to 33.6px, wider, about 63px less height | 568 to 505 at 650 | P | merge with A11 as "Phone Small Heading" | Designer |
| A11 | script-intro, Small Heading `a23a1a12` (Guidelines) | D and T same. P: heading 35 to 27px, about 84 to 103px less height | 576 to 493 at 390 | P | rename "Phone Small Heading" | Designer |
| A12 | script-intro, Legal Corporate `53add6a3` | D: 160px less padding, heading capped at 752px. T: heading capped at 608px. P: heading 35 to 37px, about 51px less height | 743 to 679 at 1440 | all | rename "Narrow Heading" | Designer |
| A13 | script-intro, Large Heading `e4bd4c20` (12 rooms) | D: 240px shorter, heading capped at 480px. T: about 107px shorter. P: heading 35 to 56px | 760 to 520 at 1440 | all | rename "Compact, Phone Large Heading" | Designer |
| A14 | script-intro, Bottom `211f09b3` (/rooms) | Drawing moves below the text and shrinks; heading capped. P: heading 35 to 56px | 1202 to 1058 at 1440 | all | rename "Image Below" | Designer |
| A15 | script-intro, Wide `16b2e029` (/dining) | D and T: paragraph 588 to 744px wide. P: 80px more padding, slightly larger heading | 880 to 860 at 1440, 594 to 663 at 390 | all | keep, or "Wide Text" | Designer |
| A16 | script-intro, Tall `ac455635` (/) | 40px more space below (24px on tablet). P: also 40px above and a smaller heading | 1132 to 1172 at 1440 | all | rename "Extra Bottom Space" | Designer |
| A17 | Hero, Home `1eb6c0d5` (/) | D and T same. P: the button is cut to "book" by limiting its label to 42px, so "your stay" is clipped, not removed | Only the button changes; label 42px wide | P | rename "Phone Short Button"; fix the clipped label | Designer |
| A18 | Hero, Blue Button `e8c11cfd` (Zuma) and Burgundy Button `81c5f9ea` (other 4 venues) | Button blue or burgundy instead of cream. P: text block also sits about 24px lower and the button is wider | Button fill; P heading moves | all | keep; names already functional | none |
| A19 | Split image text light, Olive Home `50d0d660` (/) and Olive Dining `42c9f9a1` (4 venues) | Both do the same thing: olive band, image bleeding below at D, extra padding at P. No separate difference measured | 886 to 817 and 886 to 816 at 1440; both +112 at 390 | all | merge as "Olive" (an unused "Olive" already exists) | Designer |
| A20 | Split image text light, Blue `f30ba1e7` (Zuma) | Navy band, same geometry as Olive, caption hidden at D and T | 1054 to 816 at 1440 | all | keep | none |
| A21 | Split image text light, Neighborhood Downtown `755a49f7` | D and T same. P: image and text swap order, smaller image, 256px shorter at 650 | 1199 to 943 at 650 | P | rename "Phone Text First" | Designer |
| A22 | Split image text slider, Tan `...431a38e` (/history) | Tan band, script heading, different columns | 886 to 932 at 1440 | all | keep | none |
| A23 | Image Trio, Home `45b71a39` (/) and Dining `0d31b24e` (5 venues) | D and T same. P: heading and text left-aligned and larger, about 140 to 165px more height. The two differ from each other by 2px of padding and the link spacing | 779 to 931 and 779 to 945 at 390 | P | merge as "Phone Left Aligned" | Designer |
| A24 | Map Feature, Home `a65a3b03` (/, /rooms, 12 rooms) and Dining `0a163214` (/dining) | P: more top space, narrow text, map runs to the bottom. Home also moves the button 8px down at D and T; Dining is the same as Base there | +50px (Dining) and +40px (Home) at 390 | P (Home: all, 8px) | merge as "Phone Full Bleed" | Designer |
| A25 | Map Feature Image Bg, Stacked `a6eedfb4` (Meetings, Neighborhood, Legal, Corporate) | D and T same. P: map stacked above the list, small list on the photo hidden, about 264 to 424px shorter | 1330 to 906 at 390 | P | rename "Phone Stacked" | Designer |
| A26 | Card Carousel, Compact `c59c2441` (History, rooms) | D: 158px less padding. T: 64px less. P same | 967 to 809 at 1440 | D, T | keep | none |
| A27 | Card Carousel, Contact `d0c45960` | D: 111px less below. T same. P: 48px less | 966 to 855 at 1440 | D, P | rename "Short Bottom" | Designer |
| A28 | Card Carousel, Legal Corporate `69ec3688` | D: 183px less above. T and P same | Top padding 215 to 32px | D | rename "Desktop Short Top" | Designer |
| A29 | image-inset-single, Small `ed48680f` (posts, packages) | Narrower image and different crop at every width; on P a tall crop instead of wide | 867 to 621 at 1440 | all | keep | none |
| A30 | Site Nav, Dark `08083309` (Contact, Privacy, Accessibility) | Dark nav instead of cream | Colour only | all | keep | none |
| A31 | Stylesheet only | 40 variant ids have rules but no class on any page crawled, including older Split image text (Edge, Stagger, Wide, Compact, Tan, Olive) and the whole second set left by the slider duplicate. A variant hidden in Designer or on an unpublished page could still use one | `w-variant` scan of 48 saved pages against the stylesheet | n/a | ask, after Lane B gives instance counts | Designer |
| A32 | Stylesheet size | 26 variants, mostly page-named, each carry over 800 selectors for about 500 unrelated classes (accordion, forms, every section). Whole file 169 KB compressed, 2.4 MB unpacked | Counted in the published CSS | n/a | fix by retiring copied variants as A1 to A31 are settled | Designer |

### B. Links and buttons that go nowhere

| # | Page or component | What is wrong | Evidence | Width | Action | Lane |
|---|---|---|---|---|---|---|
| B1 | 5 dining pages | "reserve a table" (hero and sticky bar) does nothing | `href="#"`, clicked on Solana: no page change, no pop-up | all | fix (open Reserve a table, or the venue link) | Designer |
| B2 | Reserve a table pop-up (every page) | Solana, Pool Lounge, Lobby Bar and Garden Terrace "reserve" go to `#`; only Zuma works | Dialog links read live | all | fix, needs the booking links | content |
| B3 | Book menu (every page) | "book a stay", "host an event" and "book an appointment" link to the menu itself, so nothing happens | `#book` inside `#book` | all | ask for destinations | content |
| B4 | Book your escape band (27 of the 33 pages counted) | "book now" goes to `#` | Link scan | all | ask for the booking link | content |
| B5 | Footer (every page) | amenities, services, resortpass, in-room dining, instagram, facebook, tiktok and studio circa are all `#` | Link scan | all | ask | content |
| B6 | /dining | Solana Coffee card "discover more" is `#`; the same card on / goes to /dining/solana-coffee | Link scan on both | all | fix | Designer |
| B7 | 5 dining pages | "browse the menu" and "enquire" are `#` | Link scan | all | ask | content |
| B8 | /rooms/<slug> | "view floorplan" is `#`, and at 390 (and 650, **helper**) an invisible pinned area of the next section covers it, so it could not be tapped anyway | Hit test at 390 returned the next section's `pin-spacer` | P | fix | code, content |
| B9 | / Retail slider | All five "discover more" links are `#` | Link scan | all | ask | content |
| B10 | /wellness | All four panel buttons are `#` | Link scan | all | ask | content |
| B11 | /neighborhood pop-ups | "learn more" is `#` in the Coronado pop-up; Oceanside also **(helper)** | Opened live | all | ask | content |
| B12 | Meetings, Legal, Corporate venue pop-ups | "submit your request" and "floorplan" are `#` | Meetings council boardroom opened at 1440 and 390; others **(helper)** | all | fix (jump to the proposal form) | Designer |
| B13 | /arts artwork pop-ups | "by the guild collection" looks like a link with an arrow but does nothing, on 32 pop-ups | 33 links with an empty opener (32 of them this label) | all | fix (plain text when there is no artist) | Designer |
| B14 | /contact | Phone, address and emails are plain text; no directions link; instagram and facebook `#` | Link scan | all | fix | Designer |
| B15 | Legal, Corporate | "book your space" goes to /contact although the proposal form is on the page (on Meetings the same label jumps to the form) | Link scan | all | ask | Designer |
| B16 | /legal-corporate/legal | Nothing links to it; menu, footer and Neighborhood link only to Corporate | Crawl of every page | n/a | ask (known open question) | content |
| B17 | Quiz helper links | 14 hidden `/quiz-options/*` links return 404. Visitors never see them, crawlers do | Crawl | n/a | ask | Designer |
| B18 | Blog, Happenings and Packages cards | In the served page every card link is `#`; JavaScript fills it in. Guests are fine, crawlers see dead links | `curl` against the rendered page | n/a | ask | code or Designer |
| B19 | Post Categories template | /post-categories/blog and /happenings return 404; nothing links to them | Crawl | n/a | ask: retire the template | Designer |

### C. Wrong, placeholder or repeated content

| # | Page or component | What is wrong | Evidence | Width | Action | Lane |
|---|---|---|---|---|---|---|
| C1 | All 12 rooms | Row 1 says "1 Queen Bed" on every room checked, including Cozy King and Two Bedroom Loft Suite (6 guests, 85 m²) | Read on Cozy King, Cozy Queen and Two Bedroom; helper found all 12 the same | all | fix | content |
| C2 | All 12 rooms | Description, three of six detail rows, the 8 amenities, gallery photos and captions are the same on every room. The gallery heading is "deluxe king suite gallery" on every one | Compared live | all | fix per room, or a neutral heading | content, Designer |
| C3 | /rooms/placeholder-single-1 and -2 | Live and open to anyone. Hero says "Placeholder room for the rooms quiz. Remove before launch." | Live pages | all | fix before launch | content |
| C4 | Rooms quiz | "Just me" recommends only the placeholder rooms (all 25 answer paths, **helper**; one path re-run). 4 of 100 paths end in "We could not find a room" **(helper)** | [quiz result](refs/final-review-2026-11-25/quiz-placeholder-result-1440.webp) | 1440, 390 | fix | content |
| C5 | Cozy Courtyard Queen | Says 4 guests and 52 m²; Cozy Courtyard King says 2 guests and 26 m² **(helper, may be right)** | Detail rows | all | ask | content |
| C6 | 5 dining pages | Eyebrow "contemporary japanese dining at the guild hotel", Zuma's dinner hours, dress code, intro, image trio, gallery, second split image and captions are the same on every venue. "contemporary japanese" is wrong on four | Text compared; eyebrow re-checked on Garden Terrace and Solana | all | fix | content |
| C7 | Lobby Bar, Pool Lounge, Garden Terrace | Hero line and search description are "Lorem ipsum dolor sit amet, consectetur adipiscing elit." | Live page and head | all | fix | content |
| C8 | Garden Terrace card (/, /dining, Reserve pop-up) | Has Solana Coffee's sentence ("Mediterranean inspiration...") | Read live on all three | all | fix | content |
| C9 | Dining group block | Group Dining photos show a guest in a robe and a facial **(helper)** | Image list | all | fix | content |
| C10 | /happenings | Two live posts are about other hotels: "Autumn at Spa Adolphus" and "Locals night at Rodeo Bar" | Live pages | all | ask: remove or replace | content |
| C11 | /, /dining, /rooms | The neighborhood map is Hotel Clermont in Atlanta | [map](refs/final-review-2026-11-25/map-clermont-1440.webp) | all | ask for a San Diego map (known) | content |
| C12 | 12 rooms, /history | The map is another resort's site plan (cottages, tennis court, golf lawn) | [room map](refs/final-review-2026-11-25/room-map-other-resort-1440.webp); /history **(helper)** | all | ask (known) | content |
| C13 | Corporate | Legal wording: "attorney-client privilege standards", "trial team concierge", legalteams@theguildhotel.com, field "Law firm / Company". Everything from the packages down matches Legal | Text of both compared | all | ask Omar (open question C1) | content |
| C14 | Legal | Gallery is headed "corporate gallery" and the packages are "tailored corporate packages" | Headings read live | all | ask | content |
| C15 | Legal and Corporate | Proposal block phone is +1 (619) 975-6000; everywhere else is (619) 795-6000 | Page source | all | fix, ask which is right | content |
| C16 | FAQ (20 of the 33 pages counted, incl. Dining, Contact, Press, Guidelines) | Room questions on pages with no room, and every answer is the same sentence pasted twice with no full stop | Six questions, one distinct answer | all | fix or remove per page | content |
| C17 | Offers & Packages slider (23 pages) | Five slides are two offers repeated ("save on 5+ nights" 3 times, "wellness staycation" twice), one line lorem, all to /packages | Slides read live | all | fix | content |
| C18 | Neighborhood Arts slider, Home Retail slider | One real slide each, then the same two offers repeated four times | Slides read live | all | fix | content |
| C19 | /neighborhood | Corporate & Services repeats San Diego convention center and superior court; Dining Around the Guild lists "dining 1, 2, 3" with lorem and no links. Most lorem of any static page (about 32 lines) | Read live | all | fix | content |
| C20 | Wellness | Four panels share one lorem sentence | Read live | all | fix | content |
| C21 | Venue pop-ups | Same lorem, "510 SQ FT", "50+" and the same photos for every venue; several cards show unrelated photos (artichokes for a meeting room) **(helper)** | Pop-ups and cards | all | fix | content |
| C22 | Coronado and Oceanside pop-ups | One photo each (a martini, a woman at a pool **(helper for Oceanside)**); no slider, though Stephen's note asks for one | 0 slides | all | ask, content | content |
| C23 | Packages | Public "A placeholder package..." text, blog-style categories and dates (one is 1 December) | Read live; dates **(helper)** | all | fix | content |
| C24 | Post and package detail pages | Same two inset photos on every post and package checked; package photos stand in for other subjects; highlight text the same lorem on all posts **(helper)** | Image list on 4 pages | all | fix | content |
| C25 | Related posts on posts | Not filtered: a blog post shows happenings and the reverse. Nothing on the page says which it is | Links read on 2 posts; helper all 6 | all | ask | Designer |
| C26 | Press | Two pairs of cards share a photo; one photo is a screenshot; one quote is credited to California Meetings & Events but links to Interior Design; a Houston tequila card is listed **(helper)** | Link read for the Interior Design card; rest helper | all | ask | content |
| C27 | Typos and wording | /dining "an invitation to to savor"; "connaisseurs" on Lobby Bar (3 places); dining hours run together **(helper)**; Meetings says "Marriott Rewards Program" where the footer says Bonvoy **(helper)** | Text scan | all | fix | content |
| C28 | Privacy and accessibility | Privacy stops after "What information is collected". Accessibility publicly says it is "a general placeholder" **(helper)** | Page text | all | ask | content |
| C29 | Home order | Cards run Zuma, Lobby, Garden, Pool, Solana; /dining and Figma run Zuma, Lobby, Pool, Garden, Solana; the Reserve pop-up is Solana first **(Figma compare by helper)** | Read live | all | ask | Designer |
| C30 | /guidelines | "@username" labels on every collaborator photo | Live | all | fix | content |
| C31 | /history | Marston slider uses one photo three times (marked temporary in earlier feedback) **(helper)** | Image sources | all | ask for photos | content |

### D. Media, alt text and page settings

| # | Page or component | What is wrong | Evidence | Width | Action | Lane |
|---|---|---|---|---|---|---|
| D1 | Whole site | Browser tab and phone icons are Relume's template icon | Files fetched and looked at | n/a | fix | Designer settings |
| D2 | Whole site | No share image on any page: link previews have no picture | No `og:image` on any of the pages read | n/a | fix | Designer settings |
| D3 | /packages | Search title is just "Packages" and its description is the blog's | Page head | n/a | fix | Designer settings |
| D4 | Rooms | All three rooms compared share one search description; the placeholders' says "Remove before launch" | Page heads | n/a | fix | content |
| D5 | Videos | Every video slot is empty on every page except Zuma's sample video, so hero and gallery video have never run with real content | `data-video-link` scan | all | ask | content |
| D6 | /press | 23 of 24 cards have an empty publication logo. It leaves a cream box (304 x 48, 183 x 48 or 183 x 32) over the photo; the 24th logo is cream on cream **(helper)** | [press card](refs/final-review-2026-11-25/press-empty-logo-box-1440.webp) | all | fix (hide when empty) | Designer |
| D7 | /press | 23 images with no source (the same logos) whose alt is the card blurb | Served HTML | n/a | fix with D6 | Designer |
| D8 | /history | 10 or so timeline photos have the wrong alt (ring fight "Artist at The Guild", sailors "Guest room") **(helper, photos viewed)** | Contact sheet against alts | n/a | fix | content |
| D9 | Meetings, Legal, Corporate | All venue cards on a page share one alt: "The council boardroom" or "The small conference center" | Read live | n/a | fix | content |
| D10 | Whole site | Empty alt on content images: offers slider, hero (9 pages), dining trio and gallery, carousels, package pairs. The footer and booking photos are probably decorative | Alt scan | n/a | fix | content |
| D11 | 404 | Button reads "Go HomeGo Home"; no menu or footer, and no H1 (the title is an H2) | [404](refs/final-review-2026-11-25/404-doubled-label-1440.webp) | 1440 to 390 | fix | Designer |
| D12 | 401 | Stock Webflow password page, no branding **(helper)** | Live | all | ask | Designer |
| D13 | Body font | The body font family is named "Gatchtest", which looks like a trial name | Published CSS | n/a | ask: confirm the licence | Designer |
| D14 | Forms | Meetings, Guidelines, Press, Legal and Corporate forms are all named "Photoshoot Request", and none has a required field, so a blank form can be sent. Press fields labelled "Organization" and "Expected publish date" are stored as `shoot-date` and `start-time` **(field names helper)** | Form names and required marks read live; not submitted | all | fix | Designer |
| D15 | /rooms, all rooms pop-up | All 10 preview images share one alt **(helper)** | Pop-up alts | n/a | fix | content |

### E. Layout and behaviour

| # | Page or component | What is wrong | Evidence | Width | Action | Lane |
|---|---|---|---|---|---|---|
| E1 | Blog, Happenings, Packages | Group headings are indented from their cards: 224 against 152 at 1440, 96 against 64 at 991 and 800. Level at 650 and 390. The same on all groups | [blog](refs/final-review-2026-11-25/blog-heading-and-pills-1440.webp), measured | D, T | fix | Designer |
| E2 | Pill bars on Blog, Happenings, Packages, Press | Off centre: 64px before the first label, 24px after the last. An empty hidden list item takes a gap | Empty first child, 40px gap (32px at 991 and 800) | D, T | fix | Designer |
| E3 | Nav over photos | Dark nav disappears on dark photos and half-dark splits: Garden Terrace gallery, Neighborhood split photos, Press cards at 1440 (logo almost gone) | [dark on dark](refs/final-review-2026-11-25/nav-dark-on-dark-garden-terrace-1440.webp), [split](refs/final-review-2026-11-25/nav-split-photo-neighborhood-1440.webp) | 1440, more at 390 **(helper)** | ask, fix the colour choice for split sections | code |
| E4 | Rooms quiz result | One matching room shows as a half-width card with an empty right half | [quiz](refs/final-review-2026-11-25/quiz-placeholder-result-1440.webp) | 1440 (phone is full width) | fix or ask | Designer |
| E5 | /arts | Ten old pop-ups in the page. Nine have no opener at all and one (artist-eva-struble) is linked only from inside another unreachable one. Eight are lorem shells | Opener count per id | all | ask to delete | Designer |
| E6 | /arts | A second hidden hero section with lorem is still in the page | Inside `.hide` | all | ask to delete | Designer |
| E7 | /arts artwork pop-up, phone | Filter, zoom and exit pills stay on top and cover the text | [pop-up](refs/final-review-2026-11-25/arts-popup-covered-390.webp) | 390 | fix | code |
| E8 | Coronado pop-up, phone | "learn more" sits above the heading, two close controls | [pop-up](refs/final-review-2026-11-25/coronado-popup-390.webp) | 390 | ask, fix order | Designer |
| E9 | Legal (and Corporate) venue tabs | Four tabs are 872px wide, cut at both ends | Left edge -36, right 836 on an 800 screen | 800 | fix | Designer |
| E10 | /gallery filter, narrow window with a mouse | Filter shrinks to a 32px sliver reading "ALL". On a real touch phone the gallery opens behind a tap and the filter is fine | Measured with and without touch | 650 and 390, mouse only | fix, low priority | code |
| E11 | Book your escape and Stay in the loop (shared) | 650: email and "join us" stop about 59px short of the right edge **(helper figure, seen live)**. 800: heading wraps on one side only, so the two columns do not line up | Seen live at both widths | 650, 800 | fix | Designer |
| E12 | Home Wellness heading | Heading and paragraph start at 47px, link and images at 20px | Measured | 650 | fix | Designer |
| E13 | Guidelines collaborators and closing headline | At 800 a heading sits against a photo and "@username" is cut; closing headline leaves "shoot!" alone **(closing line helper)** | Seen live | 800 | fix | Designer |
| E14 | Map on / and /rooms, phone and 650 | Cover crop cuts the sides, words lost mid-street | Image 552px in a 390 screen | 650, 390 | fix with the new map | Designer |
| E15 | Dining sticky "reserve a table" and post "learn more" pill | Cover text and photos while scrolling **(helper)** | Screens at 991 and 650 | 991, 650 | ask | code |
| E16 | Transparent nav | On phones and tablets the logo prints over body text and form labels as they scroll under | Seen on Contact at 390 | all | ask: intended? | Designer |
| E17 | / and /neighborhood, the 768 switch | At 767 to 768 sections change size hard (Neighborhood 23,882 to 16,632px tall) **(helper)** | Page height | 767/768 | ask | Designer |
| E18 | Staggered images on rooms and Neighborhood | Right-hand photo runs to the screen edge on tablet as on desktop **(helper)** | Image spans to the edge | 991, 800 | ask | Designer |
| E19 | Stacked pop-ups | X or Escape on Reserve a table returns to Book instead of closing both **(helper)** | Live | all | ask | code |
| E20 | Legal, Corporate | Console warning from empty paragraphs in the three package cards **(cause by helper)** | Warning seen on both at all widths | all | fix | code or Designer |
| E21 | Whole site | `.fade-in` and `.slide-in` animation targets not found on every page; `scrollEnlargeSnap` warning on the four listing pages | Console, 170 loads | all | fix, low priority | code |

### F. Day and night

Of the 21 tagged blocks, 6 change anything and 15 have no night content, so they show day as agreed (DN3). Nothing has a night video, button text or link. Switching and the cookie work **(helper)**.

| # | Block or component | What is wrong | Evidence | Width | Action | Lane |
|---|---|---|---|---|---|---|
| F1 | 6 of 21 blocks | Change: Home hero, Garden Terrace card text, Cozy King card, Cozy King hero, one Meetings card, Neighborhood hero (plus the Coronado pop-up). Other 15: none **(helper)** | Compared before and after | all | ask: content for the rest | content |
| F2 | Night photos | All four filled night photos are the same lobby shot **(helper)** | Same file name | all | ask | content |
| F3 | Night copy | Reads like test text: "after dark", "cozy king by lamplight" (no longer the room's name) **(helper)** | Page text | all | ask | content |
| F4 | Switch below 992 | Each control is 13 x 13px on phone (16 x 16 on tablet **(helper)**) and has no name for screen readers; Night is drawn before Day, reversed from desktop | Measured at 390 | 991 to 390 | fix | Designer |
| F5 | Night load | Day shows as pressed until the script runs: from about 0.5s to 1.7s in one run | Sampled every 100ms at 1440 | 1440 and 390 **(390 helper)** | fix | code |
| F6 | Head script tag | It carries the same marker as the buttons, so the code gives a script tag a button role and a pressed state | Read from the live page | all | fix | code |
| F7 | Hooks off-list | Empty night hooks on blocks Stephen did not tag (Arts, History and more) | Attribute scan | all | keep or ask | Designer |

## CMS lists, tabs, filters, sliders and pop-ups (counts)

All opened live by a helper at 1440 and 390 except where said. "Works" means it opened, switched and closed.

| What | Count | Result |
|---|---|---|
| Nav menu | 12 links | Works; hover photos repeat on two pairs |
| Book menu / Reserve a table | 4 / 5 | Opens and closes; links dead as B2, B3 |
| Dining cards / Home venue cards | 5 / 5 | Works except B6 |
| Other dining options / Discover other rooms | 4 / 9 (10 on placeholders) | Works, excludes the current item; placeholders left out |
| Rooms quiz | 4 + 5 + 5 options, 100 paths | Works; 51 exact, 20 closest, 4 empty, 25 placeholder only |
| All rooms pop-up | 10 (Rooms 6, Suites 4) | Works |
| Room details / amenities / gallery / FAQ | 6 / 8 / 4 / 6 | Works, repeated content (C1, C2, C16) |
| Meetings venues / Legal, Corporate venues | 3 / 4 | Tabs, sliders and closing work |
| Neighborhood pop-ups / Arts slider / anchors | 2 / 5 / 4 | Works; content as C18, C22 |
| Interactive map (Meetings, Legal, Corporate, Neighborhood) | 1 hotel pin + 4 places | Works; directions open Google Maps |
| Wellness panels / FAQ | 4 / 6 | Tabs work as switches; content as C20 |
| Arts items and filters | 34 (3, 29, 2) | Works, 34 CMS pop-ups; two opened |
| Gallery items and filters | 35 (8, 4, 8, 5, 6, 4) | Works; lightbox works at 1440 |
| Press / Blog / Happenings / Packages groups | 5 (24 cards) / 3 / 2 / 3 | Pills match groups, jump and restart alternation |
| Offers slider / History timeline | 5 / 4 years, 13 photos | Works, loops |
| More of the Guild carousel | 6 (5 on posts and packages, 3 on /arts) | Links fine. Ask if /arts should have 3 |
| Press links | 24 | 19 answered normally; the other 5 blocked automated checks, so unknown |

## Checked and rejected

- "Year badge covers text on /history": Stephen asked for it to stay visible over text (F19, 26 Oct).
- "Home nav unreadable on first load at 390": readable in a live screenshot.
- "Nav vanishes on the /contact map at 390" and on Meetings at 1440: not reproduced at the stated scroll positions.
- "Dining image trio and home trio overflow": intended bleed and swipe row; all three items reachable.
- "Gallery filter broken on phones": only in a narrow window with a mouse (E10).
- "Room photos broken": only lazy loading.
- "Learn more on a package goes to /blog": it goes to /packages.
- Arts has no hand-built gallery tiles any more; all 34 items are CMS.

## Not checked

- Anything in Webflow itself: unused variants and instance counts, props, field types, bindings, unpublished pages. Those belong to Lane B. A31 and the "ask" rows on variants need it.
- Form validation messages and submission; nothing was submitted.
- Every page against Figma section by section. Only the pages and blocks named above were compared, and no Figma API was called.
- Real iPhones or Safari; all runs were headless Chromium. Keyboard-only use beyond the day and night switch.
- Nav colour below the widths 1440 and 390, and on /press, /gallery, /wellness, /arts beyond what is cited.
- Night video, button text and link swap: no content exists to test.
- Opening all 34 artwork pop-ups (2 opened) and the external articles that blocked checks.
- Whether a search engine or the share preview sees what the page shows; staging blocks crawling. The sitemap path returns 404 on staging.
- The "WOFF font decode" warning seen on 15 of 170 loads; cause unknown.
- 8 rooms, 3 posts and 2 packages were read for content only, not at all five widths (each template had at least two items at all five).

## Looks fine

- No page scrolls sideways at any of the five widths.
- No page errors; console otherwise only the Cloudflare captcha noise and E20, E21.
- Other dining options and Discover other rooms exclude the current item and link correctly.
- Category listings, pills, counts and alternation work on all four listings.
- Pop-ups close by Escape, close control and (where meant) outside click, and scrolling returns.
- First visit loads as day; night is remembered and Day restores the original (helper).
- Arts and Gallery filters add up; the FAQ opens one item at a time.
- Privacy and Accessibility are a single readable rich text layout; Contact map points at W Broadway.
- Posts, packages and rooms titles and headings match their addresses.
