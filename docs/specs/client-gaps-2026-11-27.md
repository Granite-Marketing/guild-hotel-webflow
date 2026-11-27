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
6. **"Why teams choose The Guild"** (Corporate and Legal): the docs give the five headings with notes in brackets, such as "(prime location story)", not the sentences.
7. **Meeting venue pop-ups:** the feature lines and room counts the docs don't cover still show sample text on every pop-up, and the One Columbia Place pop-up is sample text.
8. **Packages (4), blog and happenings posts (6), and the offers slider on every page:** sample content. These need real items, or the sample items get removed before launch.
9. **Lower page text with filler paragraphs** on History, Meetings, Neighborhood, Arts, Gallery, Contact, Press ("Press Inquiries" paragraph) and the dining venue pages: these sections are not in the docs.
10. **Neighborhood:** the doc's Balboa Park, Petco Park, Rady Shell, Museum of Art and Seaport Village sections have no place on the page, and the Downtown and Midway paragraphs are filler. Should we add these places to the map list?
11. **Arts:** two artists are real; the other eight artworks carry stand-in descriptions.
12. **Accessibility statement:** its own text says it is a placeholder.
13. **Night versions:** no doc has any night copy, so the night mode shows stand-in lines in six places.

### Decisions only the client can make

1. **Accessible rooms:** the doc has full copy for four ADA rooms (Society King, Artisan King, Apprentice Queen, Apprentice King), but the site has no rooms for them. Should we create them? Apprentice Queen ADA's size reads "XX sq.m." in the doc.
2. **Lobby Bar as a meeting venue:** the doc has a pop-up for it, but Meetings has no Lobby Bar venue. Should we add one?
3. **Venue names:** "Lobby Terrace", "Garden Terrace" and "The Courtyard" are all used for the outdoor space. Which is right where? Are "One America Plaza" and "One Columbia Place" different venues?
4. **Homepage retail card:** the doc says "FashionPhile"; the site says "Shops at the Guild".
5. **Corporate line 9** ("After hours, you'll adjourn to the Lobby Bar...") is marked as a second version, but it reads like a second paragraph.
6. **Second versions** (Omar) and **suggested H1 wording** (Kevin): the lists are in the two round reports.
7. **"Fitness Centre"** on Wellness follows the doc; the rest of the site uses US spelling.

### SEO items for the SEO team

1. **Meta titles and descriptions** are now on every room, dining venue, legal and corporate page, story, package and wellness item ([record](../seo/cms-meta-2026-11-27.md)). The stories and packages ones follow sample titles and need rewriting with the real content.
2. **Before launch:** canonical tags, share images (og:image) and schema are missing on every page; the redirects, meta and schema drafts are waiting for review in the SEO launch pack ([PR 408](https://github.com/Granite-Marketing/guild-hotel-webflow/pull/408)).
3. **Heading questions:** the open designer-note question is in the heading report.

## B. Ours to fix (not for the client)

1. **Corporate page shows Legal wording** in its key features ("virtual proceedings", "attorney-client privilege"). The feature text is fixed in the template, so both pages show Legal's lines. Fix: give each item its own fields, as for the earlier template texts (C6).
2. **Every room page has the heading "deluxe king suite gallery"** with a filler paragraph. Fix: use each room's name and copy, or remove the paragraph.
3. **Rooms page leftovers:** hidden "deluxe king suite" and "premium twin room" labels.
4. **Room FAQ** sits hidden on about 40 pages, including Contact and Press, as six H3s.
5. **Run-together words:** "littlelonger", "stewardsof", "choosingthe".
6. **Empty alt text** on content photos: 24 on Press, 15 on Neighborhood, the 10 shared photos on most pages, and a few on Home, the dining venues and packages.
7. **Placeholder rooms** "Placeholder Single 1 and 2" are still published (to remove before launch, per the SEO pack).
8. **SEO field limits:** the API could not set the 75 and 150 character limits on the new fields; set "Max length" in each field's settings in the Designer.
