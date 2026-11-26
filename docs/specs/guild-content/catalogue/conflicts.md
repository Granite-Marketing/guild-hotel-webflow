# Conflicts and shared-component report

Generated 2026-11-26T17:49:09.990Z.

## a. Shared components

Heading tags come from the component DOM when the text is hardcoded (tag fixed inside the component, so one change hits every instance). For prop-bound or CMS-bound text the Data API does not expose the tag, so it is taken from the visible live headings (matched by text, or placed by section class when CMS-bound). More than one tag for one property means the tag is not fixed in the component, or a text match was shared. Page counts treat each CMS template as one page, however many items it serves.

| component | pages | instances | pages (list) |
|---|---|---|---|
| Global Styles | 24 | 24 | /packages, /accessibility, /happenings, /blog, /neighborhood, /privacy-policy, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /404, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma, /legal-corporate/corporate |
| CTA Booking Newsletter | 23 | 23 | /packages, /accessibility, /happenings, /blog, /neighborhood, /privacy-policy, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma, /legal-corporate/corporate |
| Footer Links | 23 | 23 | /packages, /accessibility, /happenings, /blog, /neighborhood, /privacy-policy, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma, /legal-corporate/corporate |
| Site Nav | 23 | 23 | /packages, /accessibility, /happenings, /blog, /neighborhood, /privacy-policy, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma, /legal-corporate/corporate |
| Booking Menu | 23 | 23 | /packages, /accessibility, /happenings, /blog, /neighborhood, /privacy-policy, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma, /legal-corporate/corporate |
| Booking Menu Panel | 23 | 23 | /packages, /accessibility, /happenings, /blog, /neighborhood, /privacy-policy, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma, /legal-corporate/corporate |
| Hero Fullbleed Centered | 20 | 23 | /packages, /happenings, /blog, /neighborhood, /meetings, /wellness, /gallery, /arts x2, /press, /rooms, /guidelines, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen x2, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma x2, /legal-corporate/corporate |
| FAQ Accordion | 19 | 19 | /packages, /happenings, /blog, /neighborhood, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /post-categories/<no live item>, /, /rooms/cozy-queen, /dining/dining-zuma, /legal-corporate/corporate |
| Offers Slider | 17 | 17 | /packages, /happenings, /blog, /neighborhood, /meetings, /wellness, /gallery, /arts, /rooms, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /legal-corporate/corporate |
| Card Carousel Header Left | 12 | 12 | /packages, /happenings, /blog, /gallery, /arts, /contact, /press, /history, /packages/romance-at-the-guild, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /legal-corporate/corporate |
| Card Carousel Card | 11 | 61 | /packages x6, /happenings x6, /blog x6, /gallery x6, /arts x3, /contact x6, /press x6, /history x6, /packages/romance-at-the-guild x5, /happenings-stories/locals-night-at-rodeo-bar x5, /legal-corporate/corporate x6 |
| script-intro-centered | 9 | 9 | /neighborhood, /arts, /rooms, /guidelines, /dining, /history, /, /rooms/cozy-queen, /legal-corporate/corporate |
| Gallery Mosaic Item | 6 | 17 | /neighborhood x4, /meetings x4, /history x3, /rooms/cozy-queen, /dining/dining-zuma, /legal-corporate/corporate x4 |
| Gallery Mosaic Captioned | 6 | 6 | /neighborhood, /meetings, /history, /rooms/cozy-queen, /dining/dining-zuma, /legal-corporate/corporate |
| tab-pills-intro | 5 | 5 | /packages, /happenings, /blog, /press, /post-categories/<no live item> |
| Map Feature | 4 | 4 | /rooms, /dining, /, /rooms/cozy-queen |
| image-inset-single | 4 | 4 | /arts, /packages/romance-at-the-guild, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar |
| Split image text light | 3 | 4 | /neighborhood, /, /dining/dining-zuma x2 |
| Map Feature Image Bg | 3 | 3 | /neighborhood, /meetings, /legal-corporate/corporate |
| Image Trio Text | 2 | 2 | /, /dining/dining-zuma |
| Gallery Canvas Styles | 2 | 2 | /gallery, /arts |
| Legal Rich Text Styles | 2 | 2 | /accessibility, /privacy-policy |
| Split Image Text Compact | 2 | 2 | /packages/romance-at-the-guild, /happenings-stories/locals-night-at-rodeo-bar |
| Venue Detail Modal | 2 | 2 | /meetings, /legal-corporate/corporate |
| Key Features Item | 1 | 18 | /meetings x18 |
| Overlay Detail Panel Modal | 1 | 10 | /arts x10 |
| Scatter Image Item | 1 | 4 | /guidelines x4 |
| Corporate Services Card | 1 | 4 | /neighborhood x4 |
| Article Card Tall Item | 1 | 3 | /neighborhood x3 |
| Key Features Card | 1 | 3 | /meetings x3 |
| Split Image Slide | 1 | 3 | /history x3 |
| Art Detail Modal | 1 | 2 | /arts x2 |
| Split Image Text Edge | 1 | 2 | /rooms/cozy-queen x2 |
| timeline-scatter-images | 1 | 1 | /guidelines |
| Venue Card Fullbleed Tall | 1 | 1 | / |
| Venue Card Fullbleed Left | 1 | 1 | / |
| Map Feature Centered | 1 | 1 | /history |
| Image Trio Text Left | 1 | 1 | /legal-corporate/corporate |
| Image Trio Text Left Offset | 1 | 1 | /legal-corporate/corporate |
| Article Card Staggered Tall | 1 | 1 | /neighborhood |
| Split image text slider | 1 | 1 | /history |
| Corporate & Services | 1 | 1 | /neighborhood |
| Key Features | 1 | 1 | /meetings |
| Room Template Styles | 1 | 1 | /rooms/cozy-queen |
| Retail Slider | 1 | 1 | / |
| Arts & Culture Slider | 1 | 1 | /neighborhood |
| Split Image Text Edge Large | 1 | 1 | /arts |
| Split Image Text Wide | 1 | 1 | /neighborhood |
| Split Image Text Stagger Left | 1 | 1 | /dining/dining-zuma |
| Split Image Text Stagger Mid | 1 | 1 | /neighborhood |
| Form Photoshoot Request | 1 | 1 | /guidelines |
| Form Request for Proposal | 1 | 1 | /meetings |
| Form Legal Corporate Proposal | 1 | 1 | /legal-corporate/corporate |
| Form Press Enquiries | 1 | 1 | /press |
| Contact Details Map | 1 | 1 | /contact |
| Place Detail Modal | 1 | 1 | /neighborhood |

### CTA Booking Newsletter (23 pages, 23 instances)

- FIXED h2: "Book your escape" (hardcoded in the component DOM; changing the tag or text changes all 23 instances on 23 pages)
- FIXED h2: "Stay in the loop" (hardcoded in the component DOM; changing the tag or text changes all 23 instances on 23 pages)
- prop "fixed text "Book your escape"": rendered as h2 x22 (same tag everywhere: tag is set inside the component)
- prop "fixed text "Stay in the loop"": rendered as h2 x22 (same tag everywhere: tag is set inside the component)

### Footer Links (23 pages, 23 instances)

- FIXED h2: "the hotel" (hardcoded in the component DOM; changing the tag or text changes all 23 instances on 23 pages)
- FIXED h2: "experience" (hardcoded in the component DOM; changing the tag or text changes all 23 instances on 23 pages)
- FIXED h2: "dining" (hardcoded in the component DOM; changing the tag or text changes all 23 instances on 23 pages)
- FIXED h2: "social" (hardcoded in the component DOM; changing the tag or text changes all 23 instances on 23 pages)
- FIXED h2: "links" (hardcoded in the component DOM; changing the tag or text changes all 23 instances on 23 pages)
- prop "fixed text "the hotel"": rendered as h2 x22 (same tag everywhere: tag is set inside the component)
- prop "fixed text "experience"": rendered as h2 x22 (same tag everywhere: tag is set inside the component)
- prop "fixed text "social"": rendered as h2 x22 (same tag everywhere: tag is set inside the component)
- prop "fixed text "links"": rendered as h2 x22 (same tag everywhere: tag is set inside the component)
- prop "fixed text "dining"": rendered as h2 x11 (same tag everywhere: tag is set inside the component)
- prop "fixed text "press"": rendered as h1 x1 (same tag everywhere: tag is set inside the component)

### Hero Fullbleed Centered (20 pages, 23 instances)

- prop "Content/Heading": rendered as h1 x13 (same tag everywhere: tag is set inside the component)
- prop "CMS-bound heading (section section_hero-fullbleed-centered)": rendered as h1 x5 (same tag everywhere: tag is set inside the component)

### FAQ Accordion (19 pages, 19 instances)

- prop "Title": rendered as h2 x18 (same tag everywhere: tag is set inside the component)

### Card Carousel Header Left (12 pages, 12 instances)

- prop "Content/Heading": rendered as h2 x12 (same tag everywhere: tag is set inside the component)
- prop "CMS-bound heading (section section_card-carousel-header-left)": rendered as h2 x1 (same tag everywhere: tag is set inside the component)

### Card Carousel Card (11 pages, 61 instances)

- prop "Label": rendered as h2 x14, h3 x1 (varies per page: check whether the tag is a per-instance setting)
- prop "CMS-bound heading (section section_article-card-staggered)": rendered as h3 x32, h2 x10 (varies per page: check whether the tag is a per-instance setting)

### script-intro-centered (9 pages, 9 instances)

- prop "Content/heading": rendered as h2 x8 (same tag everywhere: tag is set inside the component)
- prop "CMS-bound heading (section section_script-intro-centered)": rendered as h2 x1 (same tag everywhere: tag is set inside the component)

### Gallery Mosaic Captioned (6 pages, 6 instances)

- prop "Header/Heading": rendered as h2 x4 (same tag everywhere: tag is set inside the component)
- prop "CMS-bound heading (section section_gallery-mosaic-captioned)": rendered as h2 x1 (same tag everywhere: tag is set inside the component)

### tab-pills-intro (5 pages, 5 instances)

- prop "Content/Heading": rendered as h2 x4, h3 x1 (varies per page: check whether the tag is a per-instance setting)
- prop "fixed text "From movement and produce to ..."": rendered as h2 x1 (same tag everywhere: tag is set inside the component)
- prop "fixed text "in-room wellness"": rendered as h3 x1 (same tag everywhere: tag is set inside the component)

### Map Feature (4 pages, 4 instances)

- prop "Content/Heading": rendered as h2 x4 (same tag everywhere: tag is set inside the component)

### Split image text light (3 pages, 4 instances)

- prop "Content/Heading": rendered as h2 x2 (same tag everywhere: tag is set inside the component)
- prop "CMS-bound heading (section section_split-image-text-light)": rendered as h2 x1 (same tag everywhere: tag is set inside the component)

### Map Feature Image Bg (3 pages, 3 instances)

- prop "Content/Heading": rendered as h2 x3 (same tag everywhere: tag is set inside the component)

### Image Trio Text (2 pages, 2 instances)

- prop "Header/Heading": rendered as h2 x2 (same tag everywhere: tag is set inside the component)

### Corporate Services Card (1 pages, 4 instances)

- prop "Title": rendered as h3 x4

### Article Card Tall Item (1 pages, 3 instances)

- prop "Heading": rendered as h3 x3

### Key Features Card (1 pages, 3 instances)

- prop "Heading": rendered as h3 x3

### timeline-scatter-images (1 pages, 1 instances)

- prop "fixed text "beyond downtown san diego"": rendered as h2 x1
- prop "Header/Heading": rendered as h2 x1

### Venue Card Fullbleed Tall (1 pages, 1 instances)

- prop "Content/Heading": rendered as h2 x1

### Venue Card Fullbleed Left (1 pages, 1 instances)

- FIXED h2: "meetings & events" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- FIXED h2: "meetings & events" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- prop "fixed text "Intimate spaces for celebrati..."": rendered as h2 x1
- prop "CMS-bound heading (section section_venue-card-fullbleed)": rendered as h3 x2
- prop "fixed text "an unexpected resort dining e..."": rendered as h2 x1
- prop "Content/Heading": rendered as h2 x1

### Map Feature Centered (1 pages, 1 instances)

- prop "Content/Heading": rendered as h2 x1

### Image Trio Text Left (1 pages, 1 instances)

- prop "Header/Heading": rendered as h2 x1
- prop "Items/Item 1 Heading": rendered as h3 x1
- prop "Items/Item 2 Heading": rendered as h3 x1
- prop "Items/Item 3 Heading": rendered as h3 x1

### Image Trio Text Left Offset (1 pages, 1 instances)

- prop "Header/Heading": rendered as h2 x1
- prop "Items/Item 1 Heading": rendered as h3 x1
- prop "Items/Item 2 Heading": rendered as h3 x1
- prop "Items/Item 3 Heading": rendered as h3 x1

### Article Card Staggered Tall (1 pages, 1 instances)

- prop "Header/Heading": rendered as h2 x1

### Split image text slider (1 pages, 1 instances)

- prop "Content/Heading": rendered as h2 x1

### Corporate & Services (1 pages, 1 instances)

- FIXED h2: "corporate & services" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- prop "fixed text "corporate & services"": rendered as h2 x1

### Key Features (1 pages, 1 instances)

- FIXED h2: "key features of our spaces" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- prop "fixed text "key features of our spaces"": rendered as h2 x1

### Split Image Text Edge Large (1 pages, 1 instances)

- prop "Content/Heading": rendered as h2 x1

### Split Image Text Wide (1 pages, 1 instances)

- prop "Content/Heading": rendered as h2 x1

### Split Image Text Stagger Left (1 pages, 1 instances)

- prop "Content/Heading": rendered as h2 x1

### Split Image Text Stagger Mid (1 pages, 1 instances)

- prop "Content/Heading": rendered as h2 x1

### Form Photoshoot Request (1 pages, 1 instances)

- FIXED h2: "Photoshoot Request" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- FIXED h3: "contact information" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- FIXED h3: "shoot details" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- prop "fixed text "Photoshoot Request"": rendered as h2 x1
- prop "fixed text "contact information"": rendered as h3 x1
- prop "fixed text "shoot details"": rendered as h3 x1

### Form Request for Proposal (1 pages, 1 instances)

- FIXED h2: "Request for Proposal" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- FIXED h3: "contact information" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- FIXED h3: "event details" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- prop "fixed text "Request for Proposal"": rendered as h2 x1
- prop "fixed text "contact information"": rendered as h3 x1
- prop "fixed text "event details"": rendered as h3 x1
- prop "fixed text "your request"": rendered as h3 x1

### Form Legal Corporate Proposal (1 pages, 1 instances)

- FIXED h2: "Request for Proposal" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- FIXED h3: "contact information" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- prop "fixed text "Request for Proposal"": rendered as h2 x1
- prop "fixed text "contact information"": rendered as h3 x1

### Form Press Enquiries (1 pages, 1 instances)

- FIXED h2: "Press Enquiries" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- FIXED h3: "contact information" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- prop "fixed text "Press Enquiries"": rendered as h2 x1
- prop "fixed text "contact information"": rendered as h3 x1

### Contact Details Map (1 pages, 1 instances)

- FIXED h1: "contact us" (hardcoded in the component DOM; changing the tag or text changes all 1 instances on 1 pages)
- prop "fixed text "contact us"": rendered as h1 x1

Fixed-tag heading elements inside components in use: 22 (7 of them in components used on more than one page). Unused components hold 0 more.

## b. Hardcoded (non-prop) text inside components

Text a writer cannot change per page. "Pages" shows reach; text on a component used on more than one page is shared copy, listed here so it can be judged page by page.

| component | pages | tag | fixed text | live evidence |
|---|---|---|---|---|
| CTA Booking Newsletter | 23 | h2 | Book your escape | seen live on 22 page(s) |
| CTA Booking Newsletter | 23 | a | book now | not matched live (hidden or not a heading-sized element) |
| CTA Booking Newsletter | 23 | h2 | Stay in the loop | seen live on 22 page(s) |
| CTA Booking Newsletter | 23 | label | *Email | not matched live (hidden or not a heading-sized element) |
| CTA Booking Newsletter | 23 | div | Thank you! Your submission has been received! | not matched live (hidden or not a heading-sized element) |
| CTA Booking Newsletter | 23 | div | Oops! Something went wrong while submitting the form. | not matched live (hidden or not a heading-sized element) |
| CTA Booking Newsletter | 23 | p | Earn Marriott Bonvoy® Points on Every Stay | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | h2 | the hotel | seen live on 22 page(s) |
| Footer Links | 23 | a | rooms | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | history | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | amenities | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | services | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | corporate | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | gallery | seen live on 20 page(s) |
| Footer Links | 23 | a | press | seen live on 1 page(s) |
| Footer Links | 23 | a | blog | seen live on 18 page(s) |
| Footer Links | 23 | a | contact | seen live on 22 page(s) |
| Footer Links | 23 | h2 | experience | seen live on 22 page(s) |
| Footer Links | 23 | a | wellness | seen live on 10 page(s) |
| Footer Links | 23 | a | dining | seen live on 10 page(s) |
| Footer Links | 23 | a | neighborhood | seen live on 22 page(s) |
| Footer Links | 23 | a | meetings & events | seen live on 13 page(s) |
| Footer Links | 23 | a | happenings | seen live on 17 page(s) |
| Footer Links | 23 | a | services | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | resortpass | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | packages | seen live on 21 page(s) |
| Footer Links | 23 | h2 | dining | seen live on 10 page(s) |
| Footer Links | 23 | div | No items found. | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | the lobby terrace | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | in-room dining | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | h2 | social | seen live on 22 page(s) |
| Footer Links | 23 | a | instagram | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | facebook | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | tiktok | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | h2 | links | seen live on 22 page(s) |
| Footer Links | 23 | a | privacy policy | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | accessibility | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | a | photoshoot guidelines | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | p | copyright © 2026 the guild hotel | not matched live (hidden or not a heading-sized element) |
| Footer Links | 23 | p | brand & website by Studio circa | not matched live (hidden or not a heading-sized element) |
| Site Nav | 23 | a | book now | not matched live (hidden or not a heading-sized element) |
| Site Nav | 23 | a | stay | seen live on 22 page(s) |
| Site Nav | 23 | a | dine | seen live on 22 page(s) |
| Site Nav | 23 | a | wellness | seen live on 10 page(s) |
| Site Nav | 23 | a | happenings | seen live on 17 page(s) |
| Site Nav | 23 | a | our history | seen live on 22 page(s) |
| Site Nav | 23 | a | meetings & events | seen live on 13 page(s) |
| Site Nav | 23 | a | neighborhood | seen live on 22 page(s) |
| Site Nav | 23 | a | art | seen live on 22 page(s) |
| Site Nav | 23 | a | gallery | seen live on 20 page(s) |
| Site Nav | 23 | a | blog | seen live on 18 page(s) |
| Site Nav | 23 | a | packages | seen live on 21 page(s) |
| Site Nav | 23 | a | contact | seen live on 22 page(s) |
| Site Nav | 23 | a | book | not matched live (hidden or not a heading-sized element) |
| Site Nav | 23 | a | instagram | not matched live (hidden or not a heading-sized element) |
| Site Nav | 23 | a | facebook | not matched live (hidden or not a heading-sized element) |
| Site Nav | 23 | a | tiktok | not matched live (hidden or not a heading-sized element) |
| Site Nav | 23 | p | 500 W. Broadway San Diego, CA 92101 | not matched live (hidden or not a heading-sized element) |
| Site Nav | 23 | a | (619) 795-6000 | not matched live (hidden or not a heading-sized element) |
| Site Nav | 23 | a | booking@theguildhotel.com | not matched live (hidden or not a heading-sized element) |
| Booking Menu | 23 | a | reserve | not matched live (hidden or not a heading-sized element) |
| Booking Menu | 23 | div | No items found. | not matched live (hidden or not a heading-sized element) |
| Booking Menu Panel | 23 | a | book a stay | not matched live (hidden or not a heading-sized element) |
| Booking Menu Panel | 23 | a | reserve a table | not matched live (hidden or not a heading-sized element) |
| Booking Menu Panel | 23 | a | host an event | not matched live (hidden or not a heading-sized element) |
| Booking Menu Panel | 23 | a | book an appointment | not matched live (hidden or not a heading-sized element) |
| FAQ Accordion | 19 | div | No items found. | not matched live (hidden or not a heading-sized element) |
| Offers Slider | 17 | a | discover more | not matched live (hidden or not a heading-sized element) |
| Offers Slider | 17 | div | No items found. | not matched live (hidden or not a heading-sized element) |
| Map Feature Image Bg | 3 | a | Directions | not matched live (hidden or not a heading-sized element) |
| Map Feature Image Bg | 3 | div | No items found. | not matched live (hidden or not a heading-sized element) |
| Overlay Detail Panel Modal | 1 | a | reserve | not matched live (hidden or not a heading-sized element) |
| Overlay Detail Panel Modal | 1 | div | No items found. | not matched live (hidden or not a heading-sized element) |
| Venue Card Fullbleed Left | 1 | h2 | meetings & events | seen live on 13 page(s) |
| Venue Card Fullbleed Left | 1 | p | Inspired spaces breed bright ideas | not matched live (hidden or not a heading-sized element) |
| Venue Card Fullbleed Left | 1 | a | discover more | not matched live (hidden or not a heading-sized element) |
| Venue Card Fullbleed Left | 1 | h2 | meetings & events | seen live on 13 page(s) |
| Venue Card Fullbleed Left | 1 | p | Inspired spaces breed bright ideas | not matched live (hidden or not a heading-sized element) |
| Venue Card Fullbleed Left | 1 | a | discover more | not matched live (hidden or not a heading-sized element) |
| Venue Card Fullbleed Left | 1 | div | council boardroom | seen live on 1 page(s) |
| Venue Card Fullbleed Left | 1 | div | courtyard | seen live on 1 page(s) |
| Venue Card Fullbleed Left | 1 | div | conference center | seen live on 1 page(s) |
| Corporate & Services | 1 | h2 | corporate & services | seen live on 1 page(s) |
| Corporate & Services | 1 | p | Pellentesque dui metus, tempus vel sodales sit amet, lobortis ac arcu. Proin varius semper tempor. Nam ac lobortis orci... | not matched live (hidden or not a heading-sized element) |
| Corporate & Services | 1 | a | corporate & legal packages | not matched live (hidden or not a heading-sized element) |
| Key Features | 1 | h2 | key features of our spaces | seen live on 1 page(s) |
| Key Features | 1 | p | Vestibulum id justo eget erat porta consequat. Donec et massa congue, aliquet sem non, consectetur sem proin et. | not matched live (hidden or not a heading-sized element) |
| Key Features | 1 | a | book your space | not matched live (hidden or not a heading-sized element) |
| Retail Slider | 1 | a | discover more | not matched live (hidden or not a heading-sized element) |
| Retail Slider | 1 | div | No items found. | not matched live (hidden or not a heading-sized element) |
| Retail Slider | 1 | p | retail | not matched live (hidden or not a heading-sized element) |
| Arts & Culture Slider | 1 | a | discover more | not matched live (hidden or not a heading-sized element) |
| Arts & Culture Slider | 1 | div | No items found. | not matched live (hidden or not a heading-sized element) |
| Arts & Culture Slider | 1 | p | arts & culture downtown san diego | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | h2 | Photoshoot Request | seen live on 1 page(s) |
| Form Photoshoot Request | 1 | h3 | contact information | seen live on 4 page(s) |
| Form Photoshoot Request | 1 | label | First Name | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | label | Last Name | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | label | Email Address | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | label | Phone Number | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | label | Company or Organization | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | h3 | shoot details | seen live on 1 page(s) |
| Form Photoshoot Request | 1 | label | Nature of the shoot | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | label | Shoot Date | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | label | Number of people | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | label | Start Time | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | label | End Time | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | label | Additional Details | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | div | Thank you! Your submission has been received! | not matched live (hidden or not a heading-sized element) |
| Form Photoshoot Request | 1 | div | Oops! Something went wrong while submitting the form. | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | h2 | Request for Proposal | seen live on 2 page(s) |
| Form Request for Proposal | 1 | h3 | contact information | seen live on 4 page(s) |
| Form Request for Proposal | 1 | label | First Name | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | label | Last Name | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | label | Email Address | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | label | Phone Number | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | label | Company or Organization | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | h3 | event details | seen live on 1 page(s) |
| Form Request for Proposal | 1 | label | Event Date | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | label | Number of people | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | label | Start Time | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | label | End Time | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | label | Additional Details | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | div | Thank you! Your submission has been received! | not matched live (hidden or not a heading-sized element) |
| Form Request for Proposal | 1 | div | Oops! Something went wrong while submitting the form. | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | h2 | Request for Proposal | seen live on 2 page(s) |
| Form Legal Corporate Proposal | 1 | p | Proin sed nisl nisi. Quisque porttitor, nisl sed eleifend mattis, risus tellus pulvinar metus, a lacinia lacus neque si... | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | div | trial team concierge | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | p | legalteams@theguildhotel.com | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | h3 | contact information | seen live on 4 page(s) |
| Form Legal Corporate Proposal | 1 | label | First Name | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | label | Last Name | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | label | Email Address | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | label | Phone Number | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | label | Law firm / Company | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | label | Team size | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | label | Check-in date | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | label | Check-out date | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | label | Special requirements | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | div | Thank you! Your submission has been received! | not matched live (hidden or not a heading-sized element) |
| Form Legal Corporate Proposal | 1 | div | Oops! Something went wrong while submitting the form. | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | h2 | Press Enquiries | seen live on 1 page(s) |
| Form Press Enquiries | 1 | p | Proin sed nisl nisi. Quisque porttitor, nisl sed eleifend mattis, risus tellus pulvinar metus, a lacinia lacus neque si... | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | div | email | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | p | press@theguildhotel.com | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | h3 | contact information | seen live on 4 page(s) |
| Form Press Enquiries | 1 | label | First Name | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | label | Last Name | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | label | Email Address | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | label | Phone Number | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | label | Organization | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | label | Expected publish date | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | label | Details | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | div | Thank you! Your submission has been received! | not matched live (hidden or not a heading-sized element) |
| Form Press Enquiries | 1 | div | Oops! Something went wrong while submitting the form. | not matched live (hidden or not a heading-sized element) |
| Contact Details Map | 1 | h1 | contact us | seen live on 1 page(s) |
| Contact Details Map | 1 | div | address | not matched live (hidden or not a heading-sized element) |
| Contact Details Map | 1 | p | 500 W. Broadway San Diego, CA 92101 | not matched live (hidden or not a heading-sized element) |
| Contact Details Map | 1 | p | Phone: (619) 795-6000 Email: info@theguildhotel.com | not matched live (hidden or not a heading-sized element) |
| Contact Details Map | 1 | p | Email: sales@theguildhotel.com | not matched live (hidden or not a heading-sized element) |
| Contact Details Map | 1 | p | Email: billing@theguildhotel.com | not matched live (hidden or not a heading-sized element) |
| Contact Details Map | 1 | a | instagram | not matched live (hidden or not a heading-sized element) |
| Contact Details Map | 1 | a | facebook | not matched live (hidden or not a heading-sized element) |

### Same component, differing fixed text across pages

Fixed text does not differ per page by construction (one component DOM). The pages most likely to want different copy are those where the same fixed text appears under different page contexts:

- CTA Booking Newsletter: "Book your escape"; "book now"; "Stay in the loop"; "*Email"; "Thank you! Your submission has been received!"; "Oops! Something went wrong while submitting the form."; "Earn Marriott Bonvoy® Points on Every Stay" on 23 pages
- Footer Links: "the hotel"; "rooms"; "history"; "amenities"; "services"; "corporate"; "gallery"; "press"; "blog"; "contact"; "experience"; "wellness"; "dining"; "neighborhood"; "meetings & events"; "happenings"; "services"; "resortpass"; "packages"; "dining"; "No items found."; "the lobby terrace"; "in-room dining"; "social"; "instagram"; "facebook"; "tiktok"; "links"; "privacy policy"; "accessibility"; "photoshoot guidelines"; "copyright © 2026 the guild hotel"; "brand & website by Studio circa" on 23 pages
- Site Nav: "book now"; "stay"; "dine"; "wellness"; "happenings"; "our history"; "meetings & events"; "neighborhood"; "art"; "gallery"; "blog"; "packages"; "contact"; "book"; "instagram"; "facebook"; "tiktok"; "500 W. Broadway San Diego, CA 92101"; "(619) 795-6000"; "booking@theguildhotel.com" on 23 pages
- Booking Menu: "reserve"; "No items found." on 23 pages
- Booking Menu Panel: "book a stay"; "reserve a table"; "host an event"; "book an appointment" on 23 pages
- FAQ Accordion: "No items found." on 19 pages
- Offers Slider: "discover more"; "No items found." on 17 pages
- Map Feature Image Bg: "Directions"; "No items found." on 3 pages

## c. Duplicates on one page

### /packages

- "packages" x2 [a,h1] (hidden:visibility:hidden, visible) in -, section_hero-fullbleed-centered via Hero Fullbleed Centered
- "dining" x2 [h2,h2] (visible, visible) in section_article-card-staggered, section_footer-links via Card Carousel Card
- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /happenings

- "happenings" x2 [a,h1] (hidden:visibility:hidden, visible) in -, section_hero-fullbleed-centered via Hero Fullbleed Centered
- "dining" x2 [h2,h2] (visible, visible) in section_article-card-staggered, section_footer-links via Card Carousel Card
- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /blog

- "blog" x2 [a,h1] (hidden:visibility:hidden, visible) in -, section_hero-fullbleed-centered via Hero Fullbleed Centered
- "dining" x2 [h2,h2] (visible, visible) in section_article-card-staggered, section_footer-links via Card Carousel Card
- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /neighborhood

- "wellness staycation" x4 [h2,h2,h2,h2] (visible, visible, visible, visible) in section_offers-slider-split
- "save on 5+ nights" x5 [h2,h2,h2,h2,h2] (visible, visible, visible, visible, visible) in section_offers-slider-split
- "san diego convention center" x2 [h3,h3] (visible, visible) in section_neighborhood-corporate via Corporate Services Card
- "san diego superior court" x2 [h3,h3] (visible, visible) in section_neighborhood-corporate via Corporate Services Card

### /meetings

- "council boardroom" x2 [h3,h2] (visible, hidden:visibility:hidden) in section_venue-card-fullbleed, -
- "lobby terrace" x2 [h3,h2] (hidden:visibility:hidden, hidden:visibility:hidden) in section_venue-card-fullbleed, - via Footer Links
- "1 america plaza" x2 [h3,h2] (hidden:visibility:hidden, hidden:visibility:hidden) in section_venue-card-fullbleed, -
- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split
- "details" x3 [h3,h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Venue Detail Modal
- "layout options" x3 [h3,h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Venue Detail Modal
- "1510 SQ FT" x3 [div,div,div] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in -
- "2Modern executive seating for 12" x3 [div,div,div] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Venue Detail Modal
- "3Premium conference table with ultra connectivity" x3 [div,div,div] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Venue Detail Modal
- "4Oversized, built-in hi-res TV" x3 [div,div,div] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Venue Detail Modal
- "5Capacity: 50+" x3 [div,div,div] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in -

### /wellness

- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /gallery

- "gallery" x2 [a,h1] (hidden:visibility:hidden, visible) in -, section_hero-fullbleed-centered via Hero Fullbleed Centered
- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /arts

- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split
- "eva struble" x2 [h2,h2] (hidden:visibility:hidden, hidden:visibility:hidden) in - via Overlay Detail Panel Modal
- "‘oceano’" x2 [h2,h2] (hidden:visibility:hidden, hidden:visibility:hidden) in - via Overlay Detail Panel Modal
- "artwork title" x8 [h2,h2,h2,h2,h2,h2,h2,h2] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Overlay Detail Panel Modal

### /rooms

- "deluxe king suite" x2 [h3,h3] (hidden:display:none, hidden:display:none) in section_rooms-collection-room-grid
- "guild corner loft suite" x3 [h3,h3,h3] (hidden:display:none, hidden:visibility:hidden, hidden:visibility:hidden) in section_rooms-collection-room-grid, -
- "Guild City Level Loft" x2 [h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden) in section_rooms-collection-room-grid, -
- "Cozy Queen" x2 [h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden) in section_rooms-collection-room-grid, -
- "Cozy King" x2 [h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden) in section_rooms-collection-room-grid, -
- "Cozy Courtyard Queen" x2 [h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden) in section_rooms-collection-room-grid, -
- "Cozy Courtyard King" x2 [h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden) in section_rooms-collection-room-grid, -
- "City Level Below Ground" x2 [h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden) in section_rooms-collection-room-grid, -
- "Guild Loft Suite" x2 [h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden) in section_rooms-collection-room-grid, -
- "Guild Double" x2 [h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden) in section_rooms-collection-room-grid, -
- "Two Bedroom Loft Suite" x2 [h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden) in section_rooms-collection-room-grid, -
- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /dining

- "garden terrace" x2 [h3,div] (hidden:visibility:hidden, hidden:visibility:hidden) in section_venue-card-fullbleed, -
- "solana coffee" x2 [h3,div] (hidden:visibility:hidden, hidden:visibility:hidden) in section_venue-card-fullbleed, -
- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /history

- "2026" x2 [div,div] (visible, hidden:display:none) in section_history-timeline
- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /packages/romance-at-the-guild

- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /

- "wellness" x2 [a,h2] (hidden:visibility:hidden, visible) in -, section_image-trio-text via Image Trio Text
- "meetings & events" x4 [a,h2,h2,h2] (hidden:visibility:hidden, visible, hidden:visibility:hidden, hidden:visibility:hidden) in -, section_venue-card-fullbleed via Venue Card Fullbleed Left
- "Garden Terrace" x2 [h3,div] (hidden:visibility:hidden, hidden:visibility:hidden) in section_venue-card-fullbleed, -
- "Solana Coffee" x2 [h3,div] (hidden:visibility:hidden, hidden:visibility:hidden) in section_venue-card-fullbleed, -
- "wellness staycation" x4 [h2,h2,h2,h2] (visible, visible, visible, visible) in section_offers-slider-split
- "save on 5+ nights" x5 [h2,h2,h2,h2,h2] (visible, visible, visible, visible, visible) in section_offers-slider-split

### /rooms/cozy-queen

- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /happenings-stories/locals-night-at-rodeo-bar

- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split

### /dining/dining-zuma

- "zuma san diego" x2 [h1,div] (visible, hidden:visibility:hidden) in section_hero-fullbleed-centered, -

### /legal-corporate/corporate

- "council boardroom" x2 [h3,h2] (visible, hidden:visibility:hidden) in section_venue-card-fullbleed, -
- "small conference center" x2 [h3,h2] (hidden:visibility:hidden, hidden:visibility:hidden) in section_venue-card-fullbleed, -
- "large conference center" x2 [h3,h2] (hidden:visibility:hidden, hidden:visibility:hidden) in section_venue-card-fullbleed, -
- "one columbia place" x2 [h3,h2] (hidden:visibility:hidden, hidden:visibility:hidden) in section_venue-card-fullbleed, -
- "save on 5+ nights" x3 [h2,h2,h2] (visible, visible, visible) in section_offers-slider-split
- "wellness staycation" x2 [h2,h2] (visible, visible) in section_offers-slider-split
- "details" x4 [h3,h3,h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Venue Detail Modal
- "layout options" x4 [h3,h3,h3,h3] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Venue Detail Modal
- "1510 SQ FT" x4 [div,div,div,div] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in -
- "2Modern executive seating for 12" x4 [div,div,div,div] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Venue Detail Modal
- "3Premium conference table with ultra connectivity" x4 [div,div,div,div] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Venue Detail Modal
- "4Oversized, built-in hi-res TV" x4 [div,div,div,div] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in - via Venue Detail Modal
- "5Capacity: 50+" x4 [div,div,div,div] (hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden, hidden:visibility:hidden) in -

Duplicate groups: 84

## d. Footer, booking/newsletter, offers slider, FAQ

### Footer

- component "Footer Links" (14efd120-8e4c-efe3-75b9-396e4792ed73): 23 pages, 23 instances: /packages, /accessibility, /happenings, /blog, /neighborhood, /privacy-policy, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma, /legal-corporate/corporate

Live sections matching on pages: 22
  - /packages: section_footer-links
  - /accessibility: section_footer-links
  - /happenings: section_footer-links
  - /blog: section_footer-links
  - /neighborhood: section_footer-links
  - /privacy-policy: section_footer-links
  - /meetings: section_footer-links
  - /wellness: section_footer-links
  - /gallery: section_footer-links
  - /arts: section_footer-links
  - /contact: section_footer-links
  - /press: section_footer-links
  - /rooms: section_footer-links
  - /guidelines: section_footer-links
  - /dining: section_footer-links
  - /history: section_footer-links
  - /packages/romance-at-the-guild: section_footer-links
  - /: section_footer-links
  - /rooms/cozy-queen: section_footer-links
  - /happenings-stories/locals-night-at-rodeo-bar: section_footer-links
  - /dining/dining-zuma: section_footer-links
  - /legal-corporate/corporate: section_footer-links

### Booking / newsletter

- component "CTA Booking Newsletter" (916e4ffc-007b-3572-a686-946c6645b2e8): 23 pages, 23 instances: /packages, /accessibility, /happenings, /blog, /neighborhood, /privacy-policy, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma, /legal-corporate/corporate
- component "Booking Menu" (6c8187bb-b662-164c-29a2-e084f027a1a1): 23 pages, 23 instances: /packages, /accessibility, /happenings, /blog, /neighborhood, /privacy-policy, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma, /legal-corporate/corporate
- component "Booking Menu Panel" (2fbda863-9fc6-56a5-3f2d-8bb94ef82de3): 23 pages, 23 instances: /packages, /accessibility, /happenings, /blog, /neighborhood, /privacy-policy, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /dining/dining-zuma, /legal-corporate/corporate

Live sections matching on pages: 23
  - /packages: section_cta-booking-newsletter
  - /accessibility: section_cta-booking-newsletter
  - /happenings: section_cta-booking-newsletter
  - /blog: section_cta-booking-newsletter
  - /neighborhood: section_cta-booking-newsletter
  - /privacy-policy: section_cta-booking-newsletter
  - /meetings: section_cta-booking-newsletter
  - /wellness: section_cta-booking-newsletter
  - /gallery: section_cta-booking-newsletter
  - /arts: section_cta-booking-newsletter
  - /contact: section_cta-script-centered-dark
  - /contact: section_cta-booking-newsletter
  - /press: section_cta-booking-newsletter
  - /rooms: section_cta-booking-newsletter
  - /guidelines: section_cta-booking-newsletter
  - /dining: section_cta-booking-newsletter
  - /history: section_cta-booking-newsletter
  - /packages/romance-at-the-guild: section_cta-booking-newsletter
  - /: section_cta-booking-newsletter
  - /rooms/cozy-queen: section_cta-booking-newsletter
  - /happenings-stories/locals-night-at-rodeo-bar: section_cta-booking-newsletter
  - /dining/dining-zuma: section_cta-booking-newsletter
  - /legal-corporate/corporate: section_cta-booking-newsletter

### Offers slider

- component "Offers Slider" (d5df6734-af17-07ac-88ae-84551d59f46c): 17 pages, 17 instances: /packages, /happenings, /blog, /neighborhood, /meetings, /wellness, /gallery, /arts, /rooms, /dining, /history, /packages/romance-at-the-guild, /post-categories/<no live item>, /, /rooms/cozy-queen, /happenings-stories/locals-night-at-rodeo-bar, /legal-corporate/corporate

Live sections matching on pages: 16
  - /packages: section_offers-slider-split
  - /happenings: section_offers-slider-split
  - /blog: section_offers-slider-split
  - /neighborhood: section_offers-slider-split
  - /meetings: section_offers-slider-split
  - /wellness: section_offers-slider-split
  - /gallery: section_offers-slider-split
  - /arts: section_offers-slider-split
  - /rooms: section_offers-slider-split
  - /dining: section_offers-slider-split
  - /history: section_offers-slider-split
  - /packages/romance-at-the-guild: section_offers-slider-split
  - /: section_offers-slider-split
  - /rooms/cozy-queen: section_offers-slider-split
  - /happenings-stories/locals-night-at-rodeo-bar: section_offers-slider-split
  - /legal-corporate/corporate: section_offers-slider-split

### FAQ

- component "FAQ Accordion" (3a5f8147-3133-e200-3968-9ef6aac9f0b6): 19 pages, 19 instances: /packages, /happenings, /blog, /neighborhood, /meetings, /wellness, /gallery, /arts, /contact, /press, /rooms, /guidelines, /dining, /history, /post-categories/<no live item>, /, /rooms/cozy-queen, /dining/dining-zuma, /legal-corporate/corporate

Live sections matching on pages: 18
  - /packages: section_faq-accordion
  - /happenings: section_faq-accordion
  - /blog: section_faq-accordion
  - /neighborhood: section_faq-accordion
  - /meetings: section_faq-accordion
  - /wellness: section_faq-accordion
  - /gallery: section_faq-accordion
  - /arts: section_faq-accordion
  - /contact: section_faq-accordion
  - /press: section_faq-accordion
  - /rooms: section_faq-accordion
  - /guidelines: section_faq-accordion
  - /dining: section_faq-accordion
  - /history: section_faq-accordion
  - /: section_faq-accordion
  - /rooms/cozy-queen: section_faq-accordion
  - /dining/dining-zuma: section_faq-accordion
  - /legal-corporate/corporate: section_faq-accordion
