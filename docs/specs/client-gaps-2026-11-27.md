# Content and SEO gaps, 27 Nov 2026

Built from two independent checks of live staging against the client's content docs and the SEO team's heading sheet: [copy review](guild-content/review-2026-11-27.md) and [SEO review](heading-structure/seo-review-2026-11-27.md). Earlier decisions are in [the copy notes](guild-content/notes.md) and the two round reports.

Part A goes to the client. Part B is ours to fix, not theirs.

## A. For the client

### Copy we still need

1. **Contact page:** the doc is empty.
2. **Wellness sub-pages** (In-Room Wellness, Fitness Center, Mindful Dining, Wellness Events): on hold in the tracker, so the four cards on Wellness link nowhere.
3. **Solana Coffee:** no doc, and its page is all sample text. It is linked from the homepage and Dining.
4. **Homepage below Meetings, and Dining below the intro:** both docs stop part way ("stopping here").
5. **Dining hours and dress codes:** all five venues show the same evening hours and dress code. We need each venue's own. Garden Terrace, Pool Lounge and Solana are daytime venues.
6. **"Why teams choose The Guild"** (Corporate and Legal, flagged for the client to write): the docs give eight headings with notes in brackets, such as "(prime location story)", not the sentences.
7. **Meeting venue pop-ups:** the feature lines and room counts the docs don't cover still show sample text on every pop-up, and the One Columbia Place pop-up is sample text.
8. **Packages (4), blog and happenings posts (6), and the offers slider on every page:** sample content. These need real items, or the sample items get removed before launch.
9. **Lower page text with filler paragraphs** on History, Meetings, Neighborhood, Arts, Gallery, Contact, Press ("Press Inquiries" paragraph) and the dining venue pages: these sections are not in the docs.
10. **Neighborhood:** the doc's Balboa Park, Petco Park, Rady Shell, Museum of Art and Seaport Village sections have no place on the page, and the Downtown and Midway paragraphs are filler. Should we add these places to the map list?
11. **Arts:** two artists are real; the other eight artworks carry stand-in descriptions.
12. **Accessibility statement:** its own text says it is a placeholder.
13. **Night versions:** no doc has any night copy, so the night mode shows stand-in lines in six places.

### Decisions only the client can make

1. **Accessible rooms:** created 27 Nov on Stephen's yes (Society King, Artisan King, Apprentice Queen and Apprentice King ADA), with the doc copy and stand-in photos, gallery and quiz answers from Cozy King and Cozy Queen. Open for the client: real photos, and Apprentice Queen ADA's size in square metres (the doc says "XX sq.m.", so only "200 sq. ft" is shown).
2. **Lobby Bar meeting venue:** created 27 Nov on Stephen's yes from the pop-ups doc (description, 510 sq ft, six layouts, dedicated amenities), shown on Meetings with stand-in Lobby Bar photos. Open for the client: real photos, and feature lines 3 to 5 of the pop-up (the doc gives two).
3. **Outdoor venue name:** the docs call the same space two names. The Homepage and Meetings docs say "Lobby Terrace"; the Meetings pop-ups doc says "Garden Terrace"; the Corporate doc says "The Courtyard". Which name is right? (Flagged for the client, Stephen 27 Nov.)
4. **Homepage retail card (open):** the doc says "FashionPhile"; the site says "Shops at the Guild".
5. **Corporate line 9:** the doc gives the intro's last two sentences twice, joined by "Or". The first version is live, as for every other "or" in the docs (C1); the second ("...Pool Lounge to unwind. Your last, essential order of business is dinner at California's only Zuma.") is in Omar's list.
6. **Second versions** (Omar) and the **SEO sheet's suggested H1 wording** (marked in the sheet "to agree with Kevin"; not applied, the content docs' wording is live): both lists are in the round reports, left for the client to agree.
7. **Spelling:** US throughout (Stephen, 27 Nov); "Fitness Centre" is now "Fitness Center".

### SEO items for the SEO team

1. **Meta titles and descriptions** are now on every room, dining venue, legal and corporate page, story, package and wellness item ([record](../seo/cms-meta-2026-11-27.md)). The stories and packages ones follow sample titles and need rewriting with the real content.
2. **Before launch:** canonical tags, share images (og:image) and schema are missing on every page; the redirects, meta and schema drafts are waiting for review in the SEO launch pack ([PR 408](https://github.com/Granite-Marketing/guild-hotel-webflow/pull/408)).
3. **Heading questions:** the open designer-note question is in the heading report.

### Found while fixing part B (27 Nov)

1. **Corporate page still carries Legal wording the docs don't cover:** the "tailored corporate packages" section ("War Room Setup", "Extended Stay Legal Comfort Package"), the proposal form ("Law firm / Company", "trial team concierge", legalteams@ email) and the map of courthouses. Neither doc gives Corporate versions. Open question for the client (left as is).
2. **FAQ:** the same six room questions show on every page, including Contact, Press and Dining. Flagged for the client: should each page get its own questions?
3. **Guidelines page:** its hero line and intro paragraph are still sample text, and the page is not in the content tracker.
4. **Gallery captions:** the photo captions under the room, venue and Corporate galleries are sample text.
5. **Offer "offer-1"** is marked as a draft but still live, so its photo description and text can't go live until someone publishes or removes it.

## B. Ours to fix: done 27 Nov, checked on staging

1. **Corporate key features and focus list:** each now reads its own CMS fields (three rich text "Features - Item N Body", "Focus - Item 1 to 4 Text", "Focus - Item 3 Title"), filled from the Corporate doc; Legal keeps its wording. Checked live: Corporate shows the doc's lines, Legal unchanged.
2. **Room gallery heading:** bound to a new per-room field "Gallery - Heading" ("cozy queen gallery" and so on). The filler captions under it come from the shared Media items (part A, item 4 above).
3. **Rooms page leftovers:** the hidden block of four old sample room cards was removed.
4. **Room FAQ on every page:** this is how the FAQ section was built, not a hidden leftover, so it moved to part A as a question.
5. **Run-together words:** the three script headings (History, Packages, Guidelines) now have a space before their line break, so they read "Proud stewards of city spirit" and so on; the look is unchanged (still two lines at 390 and 1440). The same fix went into 51 CMS texts with line breaks: art captions, dining hours, meeting venue layouts and amenity names.
6. **Photo descriptions (alt text):** 69 CMS photos and 3 library photos now have descriptions. Press, packages, wellness and dining images read new alt fields; offers, meeting venue and dining explore/intro photos had no responsive sizes to lose, so their descriptions were written onto the images; the Arts & Culture slider now uses each photo's own description. Left on purpose: the nav menu hover pictures and the footer and newsletter background photos are decorative, and offer-1 (part A, item 5).
7. **Placeholder rooms:** unpublished (reversible). The quiz answer "Just me" only matched those two, so Cozy Queen, Cozy King, Cozy Courtyard Queen and Cozy Courtyard King (the docs' solo-traveller rooms) now carry it; checked on /rooms.
8. **SEO field limits:** not done. The API cannot set "Max length"; it takes a click per field in the CMS settings.

Unused fields deleted 27 Nov on Stephen's yes: Legal Corporates "Features - Item 1/2/3 Text" (replaced by the rich text versions) and Offers "Slide - Image Alt".
