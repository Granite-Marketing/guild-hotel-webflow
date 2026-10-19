# Slicing changes

Produced by the slicer boundary pass (crop mapping fix, splitBeforeText, mergeSplitGrids, figma/slicer.overrides.json, minCropHeight).
Old keys are the section folders the vision review (figma/review/vision-*.json) was run against.

## Section counts

| Page | Old | New |
|---|---|---|
| arts | 9 | 13 |
| blog-collection | 10 | 12 |
| blog-indiv | 7 | 9 |
| contact | 4 | 7 |
| corporate | 19 | 17 |
| dining-collection | 10 | 13 |
| dining-gardenterrace | 10 | 10 |
| dining-lobbybar | 10 | 10 |
| dining-poollounge | 10 | 10 |
| dining-zuma | 10 | 11 |
| gallery | 4 | 7 |
| guidelines | 8 | 9 |
| happenings-collection | 10 | 12 |
| happenings-indiv | 7 | 9 |
| history | 20 | 21 |
| home | 17 | 19 |
| legal | 19 | 17 |
| meetings-collection | 14 | 14 |
| nav-elements | 3 | 3 |
| neighborhood | 19 | 16 |
| press | 11 | 13 |
| rooms-collection | 13 | 13 |
| rooms-individual | 13 | 15 |
| static-template | 2 | 3 |
| wellness-collection | 9 | 10 |

## Old key to new key

Only sections whose key changed. Several old keys pointing at one new key means a merge; an old key whose content now spans two new keys maps to the one holding its first text.

| Old key | New key | Matched by |
|---|---|---|
| arts/05-section | arts/06-section | crop centre |
| arts/06-more-of-the-guild | arts/07-more-of-the-guild | first text: "more of the guild" |
| arts/07-book-your-escape | arts/10-book-your-escape | first text: "Book your escape" |
| arts/08-arts-artist | arts/12-arts-artist | first text: "back" |
| arts/09-arts-modal | arts/13-arts-modal | first text: "back" |
| blog-collection/02-the-best-san-diego-hotels-for | blog-collection/03-the-best-san-diego-hotels-for | first text: "The best San Diego hotels for every kind" |
| blog-collection/03-the-best-san-diego-hotels-for | blog-collection/04-the-best-san-diego-hotels-for | first text: "The best San Diego hotels for every kind" |
| blog-collection/04-the-best-san-diego-hotels-for | blog-collection/05-the-best-san-diego-hotels-for | first text: "The best San Diego hotels for every kind" |
| blog-collection/05-culture | blog-collection/06-culture | first text: "culture" |
| blog-collection/06-the-best-san-diego-hotels-for | blog-collection/07-the-best-san-diego-hotels-for | first text: "The best San Diego hotels for every kind" |
| blog-collection/07-offers-packages | blog-collection/08-offers-packages | first text: "offers & packages" |
| blog-collection/08-more-of-the-guild | blog-collection/09-more-of-the-guild | first text: "more of the guild" |
| blog-collection/09-faqs | blog-collection/10-faqs | first text: "faqs" |
| blog-collection/10-book-your-escape | blog-collection/11-book-your-escape | first text: "Book your escape" |
| blog-indiv/02-section | blog-indiv/03-section | crop centre |
| blog-indiv/03-nam-eleifend-venenatis-erat-sit-amet | blog-indiv/04-nam-eleifend-venenatis-erat-sit-amet | first text: "Nam eleifend venenatis erat sit amet bib" |
| blog-indiv/04-more-around-town | blog-indiv/05-more-around-town | first text: "more around town" |
| blog-indiv/05-more-of-the-guild | blog-indiv/06-more-of-the-guild | first text: "more of the guild" |
| blog-indiv/06-offers-packages | blog-indiv/07-offers-packages | first text: "offers & packages" |
| blog-indiv/07-book-your-escape | blog-indiv/08-book-your-escape | first text: "Book your escape" |
| contact/02-more-of-the-guild | contact/03-more-of-the-guild | first text: "more of the guild" |
| contact/03-cant-find-what-youre-looking-for | contact/05-cant-find-what-youre-looking-for | first text: "Can’t find what you’re looking for?" |
| contact/04-book-your-escape | contact/06-book-your-escape | first text: "Book your escape" |
| corporate/05-wellness-programming-extended-stay-amenities | corporate/05-designed-for-focused-work-confidential-strategy | first text: "Wellness Programming & Extended-Stay Ame" |
| corporate/06-quiet-professional-environment | corporate/05-designed-for-focused-work-confidential-strategy | first text: "Quiet, Professional Environment" |
| corporate/07-secure-storage-services | corporate/05-designed-for-focused-work-confidential-strategy | first text: "Secure Storage & Services" |
| corporate/08-small-conference-center | corporate/06-small-conference-center | first text: "small conference center" |
| corporate/09-large-conference-center | corporate/07-large-conference-center | first text: "large conference center" |
| corporate/10-council-boardroom | corporate/08-council-boardroom | first text: "council boardroom" |
| corporate/11-one-columbia-place | corporate/09-one-columbia-place | first text: "one columbia place" |
| corporate/12-steps-from-key-legal-addresses | corporate/10-steps-from-key-legal-addresses | first text: "Steps from key legal addresses" |
| corporate/13-tailored-corporate-packages | corporate/11-tailored-corporate-packages | first text: "tailored corporate packages" |
| corporate/14-a-landmark-reimagined | corporate/12-a-landmark-reimagined | first text: "A Landmark Reimagined" |
| corporate/15-corporate-gallery | corporate/13-corporate-gallery | first text: "corporate gallery" |
| corporate/16-4-duis-posuere-lorem-lacinia-justo | corporate/13-corporate-gallery | first text: "4 Duis posuere lorem lacinia justo commo" |
| corporate/17-faqs | corporate/14-faqs | first text: "faqs" |
| corporate/18-book-your-escape | corporate/15-book-your-escape | first text: "Book your escape" |
| corporate/19-corporate-overlay | corporate/17-corporate-overlay | first text: "council boardroom" |
| dining-collection/03-dress-up-for-the-rich-worldly | dining-collection/04-dress-up-for-the-rich-worldly | first text: "Dress up for the rich, worldly sophistic" |
| dining-collection/04-cocktail-classics-and-drinks-for-connaisseurs | dining-collection/05-cocktail-classics-and-drinks-for-connaisseurs | first text: "Cocktail classics and drinks for connais" |
| dining-collection/05-our-new-pool-serves-up-san | dining-collection/06-our-new-pool-serves-up-san | first text: "Our new pool serves up San Diego’s brigh" |
| dining-collection/06-garden-terrace | dining-collection/07-garden-terrace | first text: "garden terrace" |
| dining-collection/07-solana-coffee | dining-collection/08-solana-coffee | first text: "solana coffee" |
| dining-collection/08-the-neighborhood | dining-collection/09-the-neighborhood | first text: "The Neighborhood" |
| dining-collection/09-faqs | dining-collection/10-faqs | first text: "faqs" |
| dining-collection/10-book-your-escape | dining-collection/12-book-your-escape | first text: "Book your escape" |
| dining-gardenterrace/08-4-duis-posuere-lorem-lacinia-justo | dining-gardenterrace/07-zuma-gallery | first text: "4 Duis posuere lorem lacinia justo commo" |
| dining-gardenterrace/09-faqs | dining-gardenterrace/08-faqs | first text: "faqs" |
| dining-gardenterrace/10-book-your-escape | dining-gardenterrace/09-book-your-escape | first text: "Book your escape" |
| dining-lobbybar/08-4-duis-posuere-lorem-lacinia-justo | dining-lobbybar/07-zuma-gallery | first text: "4 Duis posuere lorem lacinia justo commo" |
| dining-lobbybar/09-faqs | dining-lobbybar/08-faqs | first text: "faqs" |
| dining-lobbybar/10-book-your-escape | dining-lobbybar/09-book-your-escape | first text: "Book your escape" |
| dining-poollounge/08-4-duis-posuere-lorem-lacinia-justo | dining-poollounge/07-zuma-gallery | first text: "4 Duis posuere lorem lacinia justo commo" |
| dining-poollounge/09-faqs | dining-poollounge/08-faqs | first text: "faqs" |
| dining-poollounge/10-book-your-escape | dining-poollounge/09-book-your-escape | first text: "Book your escape" |
| dining-zuma/04-curabitur-at-magna-diam-suspendisse-tempor | dining-zuma/05-curabitur-at-magna-diam-suspendisse-tempor | first text: "Curabitur at magna diam. Suspendisse tem" |
| dining-zuma/05-with-every-bite-as-beautiful-to | dining-zuma/06-with-every-bite-as-beautiful-to | first text: "“with every bite as beautiful to look at" |
| dining-zuma/06-group-dining-events | dining-zuma/07-group-dining-events | first text: "group dining & events" |
| dining-zuma/07-zuma-gallery | dining-zuma/08-zuma-gallery | first text: "zuma gallery" |
| dining-zuma/08-4-duis-posuere-lorem-lacinia-justo | dining-zuma/08-zuma-gallery | first text: "4 Duis posuere lorem lacinia justo commo" |
| gallery/02-offers-packages | gallery/03-offers-packages | first text: "offers & packages" |
| gallery/03-more-of-the-guild | gallery/04-more-of-the-guild | first text: "more of the guild" |
| gallery/04-book-your-escape | gallery/06-book-your-escape | first text: "Book your escape" |
| happenings-collection/02-the-best-san-diego-hotels-for | happenings-collection/03-the-best-san-diego-hotels-for | first text: "The best San Diego hotels for every kind" |
| happenings-collection/03-the-best-san-diego-hotels-for | happenings-collection/04-the-best-san-diego-hotels-for | first text: "The best San Diego hotels for every kind" |
| happenings-collection/04-the-best-san-diego-hotels-for | happenings-collection/05-the-best-san-diego-hotels-for | first text: "The best San Diego hotels for every kind" |
| happenings-collection/05-culture | happenings-collection/06-culture | first text: "culture" |
| happenings-collection/06-the-best-san-diego-hotels-for | happenings-collection/07-the-best-san-diego-hotels-for | first text: "The best San Diego hotels for every kind" |
| happenings-collection/07-offers-packages | happenings-collection/08-offers-packages | first text: "offers & packages" |
| happenings-collection/08-more-of-the-guild | happenings-collection/09-more-of-the-guild | first text: "more of the guild" |
| happenings-collection/09-faqs | happenings-collection/10-faqs | first text: "faqs" |
| happenings-collection/10-book-your-escape | happenings-collection/11-book-your-escape | first text: "Book your escape" |
| happenings-indiv/02-section | happenings-indiv/03-section | crop centre |
| happenings-indiv/03-nam-eleifend-venenatis-erat-sit-amet | happenings-indiv/04-nam-eleifend-venenatis-erat-sit-amet | first text: "Nam eleifend venenatis erat sit amet bib" |
| happenings-indiv/04-more-around-town | happenings-indiv/05-more-around-town | first text: "more around town" |
| happenings-indiv/05-more-of-the-guild | happenings-indiv/06-more-of-the-guild | first text: "more of the guild" |
| happenings-indiv/06-offers-packages | happenings-indiv/07-offers-packages | first text: "offers & packages" |
| happenings-indiv/07-book-your-escape | happenings-indiv/08-book-your-escape | first text: "Book your escape" |
| history/16-4-duis-posuere-lorem-lacinia-justo | history/15-1-etiam-imperdiet-sodales-dui-a | first text: "4 Duis posuere lorem lacinia justo commo" |
| history/17-discover-the-property | history/16-discover-the-property | first text: "Discover the Property" |
| history/18-more-of-the-guild | history/17-more-of-the-guild | first text: "more of the guild" |
| history/19-faqs | history/18-faqs | first text: "faqs" |
| home/17-book-your-escape | home/18-book-your-escape | first text: "Book your escape" |
| legal/05-wellness-programming-extended-stay-amenities | legal/05-designed-for-focused-work-confidential-strategy | first text: "Wellness Programming & Extended-Stay Ame" |
| legal/06-quiet-professional-environment | legal/05-designed-for-focused-work-confidential-strategy | first text: "Quiet, Professional Environment" |
| legal/07-secure-storage-services | legal/05-designed-for-focused-work-confidential-strategy | first text: "Secure Storage & Services" |
| legal/08-small-conference-center | legal/06-small-conference-center | first text: "small conference center" |
| legal/09-large-conference-center | legal/07-large-conference-center | first text: "large conference center" |
| legal/10-council-boardroom | legal/08-council-boardroom | first text: "council boardroom" |
| legal/11-one-columbia-place | legal/09-one-columbia-place | first text: "one columbia place" |
| legal/12-steps-from-key-legal-addresses | legal/10-steps-from-key-legal-addresses | first text: "Steps from key legal addresses" |
| legal/13-tailored-corporate-packages | legal/11-tailored-corporate-packages | first text: "tailored corporate packages" |
| legal/14-a-landmark-reimagined | legal/12-a-landmark-reimagined | first text: "A Landmark Reimagined" |
| legal/15-corporate-gallery | legal/13-corporate-gallery | first text: "corporate gallery" |
| legal/16-4-duis-posuere-lorem-lacinia-justo | legal/13-corporate-gallery | first text: "4 Duis posuere lorem lacinia justo commo" |
| legal/17-faqs | legal/14-faqs | first text: "faqs" |
| legal/18-book-your-escape | legal/15-book-your-escape | first text: "Book your escape" |
| legal/19-legal | legal/17-legal | first text: "council boardroom" |
| meetings-collection/08-av-capabilities | meetings-collection/08-key-features-of-our-spaces | first text: "AV Capabilities" |
| meetings-collection/10-4-duis-posuere-lorem-lacinia-justo | meetings-collection/09-meetings-events-gallery | first text: "4 Duis posuere lorem lacinia justo commo" |
| meetings-collection/11-offers-packages | meetings-collection/10-offers-packages | first text: "offers & packages" |
| meetings-collection/12-faqs | meetings-collection/11-faqs | first text: "faqs" |
| meetings-collection/13-book-your-escape | meetings-collection/12-book-your-escape | first text: "Book your escape" |
| neighborhood/08-oceanside | neighborhood/07-beyond-downtown-san-diego | first text: "oceanside" |
| neighborhood/09-section | neighborhood/07-beyond-downtown-san-diego | crop centre |
| neighborhood/10-coronado-beach | neighborhood/07-beyond-downtown-san-diego | first text: "Coronado Beach" |
| neighborhood/11-corporate-services | neighborhood/08-corporate-services | first text: "corporate & services" |
| neighborhood/12-dining-around-the-guild | neighborhood/09-dining-around-the-guild | first text: "dining around the guild" |
| neighborhood/13-steps-from-key-legal-addresses | neighborhood/10-steps-from-key-legal-addresses | first text: "Steps from key legal addresses" |
| neighborhood/14-neighborhood-gallery | neighborhood/11-neighborhood-gallery | first text: "neighborhood gallery" |
| neighborhood/15-4-duis-posuere-lorem-lacinia-justo | neighborhood/11-neighborhood-gallery | first text: "4 Duis posuere lorem lacinia justo commo" |
| neighborhood/16-offers-packages | neighborhood/12-offers-packages | first text: "offers & packages" |
| neighborhood/17-faqs | neighborhood/13-faqs | first text: "faqs" |
| neighborhood/18-book-your-escape | neighborhood/14-book-your-escape | first text: "Book your escape" |
| neighborhood/19-neighborhood-overlay | neighborhood/16-neighborhood-overlay | first text: "coronado beach" |
| press/02-the-best-san-diego-hotels-for | press/03-the-best-san-diego-hotels-for | first text: "The best San Diego hotels for every kind" |
| press/03-the-12-best-hotels-in-san | press/04-the-12-best-hotels-in-san | first text: "The 12 Best Hotels In San Diego | The Gu" |
| press/04-section | press/05-section | crop centre |
| press/05-the-guild-hotel-kicks-off-new | press/06-the-guild-hotel-kicks-off-new | first text: "The Guild Hotel Kicks Off New Cocktail E" |
| press/06-here-are-the-must-see-san | press/07-here-are-the-must-see-san | first text: "Here Are the Must-See San Diego Hotels o" |
| press/07-press-enquiries | press/08-press-enquiries | first text: "Press Enquiries" |
| press/08-offers-packages | press/09-offers-packages | first text: "offers & packages" |
| press/09-more-of-the-guild | press/10-more-of-the-guild | first text: "more of the guild" |
| press/10-faqs | press/11-faqs | first text: "faqs" |
| press/11-book-your-escape | press/12-book-your-escape | first text: "Book your escape" |
| rooms-collection/08-guild-corner-loft-suite | rooms-collection/07-deluxe-king-suite | first text: "guild corner loft suite" |
| rooms-collection/09-the-neighborhood | rooms-collection/08-the-neighborhood | first text: "The Neighborhood" |
| rooms-collection/10-offers-packages | rooms-collection/09-offers-packages | first text: "offers & packages" |
| rooms-collection/11-faqs | rooms-collection/10-faqs | first text: "faqs" |
| rooms-collection/12-book-your-escape | rooms-collection/11-book-your-escape | first text: "Book your escape" |
| rooms-individual/02-room-description | rooms-individual/03-room-description | first text: "room description" |
| rooms-individual/03-section | rooms-individual/04-section | crop centre |
| rooms-individual/04-etiam-imperdiet-sodales-dui-a-vestibulum | rooms-individual/05-etiam-imperdiet-sodales-dui-a-vestibulum | first text: "Etiam imperdiet sodales dui a vestibulum" |
| rooms-individual/05-in-room-amenities | rooms-individual/07-in-room-amenities | first text: "in room amenities" |
| rooms-individual/06-morbi-gravida-augue-at-ipsum-ultricies | rooms-individual/08-morbi-gravida-augue-at-ipsum-ultricies | first text: "Morbi gravida augue at ipsum ultricies a" |
| rooms-individual/07-deluxe-king-suite-gallery | rooms-individual/09-deluxe-king-suite-gallery | first text: "deluxe king suite gallery" |
| rooms-individual/08-4-duis-posuere-lorem-lacinia-justo | rooms-individual/09-deluxe-king-suite-gallery | first text: "4 Duis posuere lorem lacinia justo commo" |
| rooms-individual/09-discover-other-rooms | rooms-individual/10-discover-other-rooms | first text: "discover other rooms" |
| rooms-individual/10-the-neighborhood | rooms-individual/11-the-neighborhood | first text: "The Neighborhood" |
| rooms-individual/11-offers-packages | rooms-individual/12-offers-packages | first text: "offers & packages" |
| rooms-individual/12-faqs | rooms-individual/13-faqs | first text: "faqs" |
| rooms-individual/13-a-landmark-reimagined | rooms-individual/14-a-landmark-reimagined | first text: "A Landmark Reimagined" |
## Notes for carrying vision names over

- history: the old crops were misaligned (see below), so vision-*.json entries for history describe what each old crop showed, not the section its key names. Carry history names over by the description, not by this table.
- Root cause of the history offset: Figma capped the history render at 16384px tall and scaled it to 1055x16384 instead of the requested 0.75 (1200x18650). The slicer multiplied frame y by the requested scale, so every crop drifted further down the page. Crops now use the decoded image size divided by the rendered box (the bounding box, or absoluteRenderBounds when the frame does not clip), recorded per frame as `renderScale` in sections.json.

## Remaining known issues

- dining-gardenterrace, dining-lobbybar, dining-poollounge: the last crop (`the-hotel`) also holds an other-dining carousel fragment and empty cream below the footer. It sits below the footer in the design itself.
- Slugs come from the first text in a band, so a few names read oddly: rooms-individual and legal/corporate `a-landmark-reimagined` (a stray text layer behind the CTA or form), gallery `all` (tab pill label), press `a-room-for-every-stay` (placeholder copy).
- happenings-collection and blog-collection `culture`: the CULTURE category heading sits with its own card, separate from the list above it (vision note, left as is).
- home, meetings-collection, wellness-collection 02: script intro and the framed image with tab pill stay one section; only dining-collection is split there (by override, per its vision note).
