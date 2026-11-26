# Trello feedback status, 26 November 2026

Board: Guild-Dev-QA (`Jvfr4sv3`). Prepared for the 16:30 review, launch 1 Dec. Staging bundle v1.3.25.

**Source caveat.** The live Trello board could not be read (the board URL returned 401, login needed). Everything here comes from the repo catalogues, GitHub issues and release history on main. Anything Omar added to Trello after 16 Nov, or any card moved since, is not reflected. Omar's 17 Nov mobile round and the 19 Nov animation walk were not Trello cards (Loom videos and a call), so they have no card links. Staging was not re-checked live; "done" means the catalogue or a closed issue says so.

## Counts

| Group | Done | Partly | Not started | Waiting on Omar |
|---|---|---|---|---|
| Trello card rows (18, Arts/Gallery appears twice) | 14 | 1 | 1 | 2 (Arts/Gallery, Meetings collection) |
| Omar mobile round, M1 to M41 | 37 | 0 | 0 | 4 (M1, M5b, M33, M35) |
| Animation walk 19 Nov (30 items) | 30 | 0 | 0 | 0 |

## Not done, grouped

### Waiting on Omar

1. **Arts/Gallery card ([IgLotIVs](https://trello.com/c/IgLotIVs)), filter menu shape.** Needs his SVG for the softer filter-menu corners on every filter menu. Everything else on the card is done. [#191](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/191), open.
2. **Meetings collection card ([zlJ4hyvS](https://trello.com/c/zlJ4hyvS)), form questions.** His answers are out of the build until he replies. No issue filed.
3. **Mobile M1, animation speed.** Asked him to recheck on a real iPhone; change speeds only if still fast. [#248](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/248).
4. **Mobile M5b, Home Meetings & Events tabs on phones.** We recommended tap-to-switch over sticky. Needs his yes. #248.
5. **Mobile M33, gallery canvas draggable on phones.** Needs his answer (dragging blocks scrolling past it). #248. The 19 Nov tap-to-enter mobile gallery (v1.3.9, U2) may already cover part of this.
6. **Mobile M35, what a tapped gallery image opens.** Lightbox or the artwork modal. #248.
7. **Press card ([E0QHDkqQ](https://trello.com/c/E0QHDkqQ)), real article URLs.** Card is built; links are placeholder publication homepages until he sends the real ones.
8. **Final review, client content.** Booking links, right phone number (Corporate still shows 975-6000, link says 795-6000), room and dining descriptions, FAQ answers, offers, videos, History photos, tab icon and share image. See the final review list, section 3.

### Not started

1. **Arts/Gallery Animation (same card as above, listed under Animations in the 9 Nov catalogue).** Missing "canvas" style animations on both pages. Marked Parked on 9 Nov; no work found since.
2. **Site-wide reveal audit (General Text/Image Scroll Animation card, [KqYXqR5h](https://trello.com/c/KqYXqR5h)).** Stephen wanted every block checked against the reveal rules; the audit doc was never written. [#192](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/192), open, "later".
3. **Scroll mask sections take too much scrolling, worst on phones.** Stephen's own deep dive, no options chosen. [#257](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/257), open.
4. **Animation attributes set on each element in the Designer, none applied in code.** Parked; the 19 Nov walk-through was meant to decide the approach. [#293](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/293), open.

### Partly done

1. **General Text/Image Scroll Animation card.** Reveals live since v1.1.58 and tuned through 12 Nov; the audit above is the gap.
2. **Final review round 1 leftovers (not Trello).** From the 26 Nov independent check, v1.3.24:
   - Nav stays dark over dark photos (P-E3). A further fix shipped in v1.3.25; not re-checked.
   - "View floorplan" on room pages is still a visible `#` button (P-B8).
   - Footer and Reserve pop-up venue order still newest first, not by sort order (W-M13).
   - Empty alt text on offers-slider images and the Meetings hero (P-D10).
   - Cozy King and Guild Loft Suite share one search description and say "Remove before launch" (P-D4).
   - Decisions waiting on Stephen: variant merges and deletes, dead blocks, CMS clean-ups, night content (15 of 21 blocks empty).
3. **Packages page (M41).** Live on staging and checked at 1440 and 390, but [#246](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/246) is still open and the hero still has the Blog intro copy. Count as done, tidy the ticket.
4. **Stale tickets.** [#247](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/247) (release) is superseded by v1.3.x releases; [#175](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/175) and [#229](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/229) stay open only for the items above.

### Small open questions

- Mobile M25: History heading says "George Marston", paragraph says "George Marsden". Question for Omar drafted in the mobile doc but not on #248.
- Press "empty logo" fix and Contact phone: see final review.
- S5 (map freezes on appear) fixed v1.3.7 but not tried on a real trackpad.

## Done

| Card | Link | Asked | Evidence |
|---|---|---|---|
| Nav-Desktop | [hL8CHoP2](https://trello.com/c/hL8CHoP2) | Per-page nav images, hover dissolve, Book Now | #186, #188, v1.2.x |
| Offers & Packages | [CNbZe6BS](https://trello.com/c/CNbZe6BS) | Text mask, exactly 100vh everywhere | v1.1.58, #183, slider intro v1.3.10 |
| Paragraphs-Desktop | [BL9zxd94](https://trello.com/c/BL9zxd94) | 16px test, Omar chose 16px | #182 |
| Press-Desktop | [E0QHDkqQ](https://trello.com/c/E0QHDkqQ) | CMS external links, new tab | #181 (placeholder URLs, see above) |
| Desktop-CTA-Buttons | [SZuQQHRK](https://trello.com/c/SZuQQHRK) | Outlined hover, crisp hexagon edges | v1.1.58, #179, #190 |
| Desktop-CTA-UnderlineText | [gZijWKzF](https://trello.com/c/gZijWKzF) | Underline mask on hover | v1.1.58 |
| Script Reveal | [EYNUTb3D](https://trello.com/c/EYNUTb3D) | Script heading reveal | v1.1.58 |
| Homepage-Desktop | [jpoQvaQd](https://trello.com/c/jpoQvaQd) | Slower wellness, Meetings links | v1.1.58, v1.1.64 |
| RoomsIndividual-Desktop | [TUnd0W4L](https://trello.com/c/TUnd0W4L) | Offset section dissolve | v1.1.58 |
| History-Desktop | [WoIQFRFW](https://trello.com/c/WoIQFRFW) | Stamp, timeline number, spacing | v1.1.58, #177, #189 |
| Corporate/LegalTemplate-Desktop | [IQLsNstG](https://trello.com/c/IQLsNstG) | Key features overlay, image masks, map stutter | #184, #176 |
| Neighborhood-Desktop | [soExZdmc](https://trello.com/c/soExZdmc) | Slight image hover zoom | #185 |
| HappeningsIndividual-Desktop | [5STTyFvH](https://trello.com/c/5STTyFvH) | Slight image hover zoom | #185 |
| Subnav | [FjjStvdO](https://trello.com/c/FjjStvdO) | Slower eased anchor scroll | `anchorScrollOptions`, 9 Nov |

Mobile round (no cards): M2 to M32, M34, M36 to M41 done, tickets #230 to #245 closed 17 Nov, shipped in the v1.3.x bundles; Packages M41 via #246. Animation walk (no cards): S1 to S5, A1 to A5, R1 to R3, H1, D1 to D4, G1 to G3, B1, P1, N1, N2, M1, C1, K1, U1, U2 all live on staging v1.3.1 to v1.3.10.

## Corrections (Stephen, 26 Nov, after review)

This list was built from tickets that had not been closed. Stephen's corrections, which override the sections above:

- Filter menu shape: done (softer corners, 19 Nov). #191 closed.
- Gallery canvas, reveal audit and scroll mask length: done.
- Gallery drag and tapped image (M33, M35): built and working on /gallery.
- Animation attributes in the Designer (#293): not doing. Animations stay in code served from the CDN, never moved into Webflow unless required. #293 closed.
- Nav colour over dark photos: fine in most places, dropped.
- 404 page: only needs to link home, dropped.
- Alt text and room descriptions: sort with content. Dining "enquire" links: the client provides them.
- For the 26 Nov call with Omar: the Meetings "Submit your request" form, Home Meetings & Events tabs on phones (M5b), the floorplan link, the tab icon and share image.
- Venue order in the footer and the Book Now pop-up: Stephen checks.
