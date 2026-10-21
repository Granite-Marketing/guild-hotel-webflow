# W03 baseline QA findings (2026-10-20)


## W02 status (2026-10-20, after two fix rounds, verified live)

Fixed and verified on staging (details in `docs/figma/build-plans/W02/`):
- History 05 year pills render with text; first timeline photo replaced.
- Form labels on Guidelines, Press, Meetings, Legal, Corporate (component props). Gap: Press and Legal submit under the photoshoot field names; "Example Text" placeholders are hidden, not removed (Designer).
- gallery-mosaic-captioned captions and heading readable everywhere (top and bottom scrims, cream text).
- timeline-scatter-images captions: cream over photos on Guidelines, dark below photos on Neighborhood 07 (`is-tall`).
- Tab pill rows wrap at 390 (Wellness, Gallery, Dining venue tabs).
- Neighborhood 09 three cards; 05 pill bar; 07 and 08 photos.
- Press "press" section header.
- Dinings template: navy split, no overlap with DRESS CODE, distinct hero per item (new `hero-image` field), card and pair photos match captions.
- Gallery 02 and Legal/Corporate 03 first photos.
- Happenings & Stories article body heading and "learn more" button.

Still open: Home map artwork label (design placeholder), Press publication logos (need logo files), Zuma logotype in hero and British Vogue logo (need files), post template inset/split/"more around town" are static, dining "other dining options" lists the current venue, Post Categories list unfiltered (Designer: collection list filter), Gallery pill bar position.

Source: `qa-report.html` in the W03 scratch dir (24 captures of https://the-guild-hotel-c34e71.webflow.io at 1440 and 390, compared to `figma/pages/<page>/sections/*/section.webp`). Severity: broken = missing or unusable content, unfinished build; drift = visible difference that does not block use.

Global (not repeated per page): FAQ first item is open in Figma and closed on staging. Full-page captures show scroll-pinned sections blank; spot-checked live on Home, History, Wellness, Gallery, Legal.

## Home

URL: `/`  |  Figma: `figma/pages/home`

- [ ] (drift) 12-the-neighborhood (map-feature): Map artwork is labelled "Hotel Clermont" (another hotel). The Figma crop has the same artwork, so it is a design placeholder; at 390 the map renders very small.

## History

URL: `/history`  |  Figma: `figma/pages/history`

- [ ] (broken) 05-once-opened-never-closed (history-timeline): Year pills (1924, 1924-1970, 2019, 2026) collapse to flat dark green slivers with no visible text, also at 390.
- [ ] (drift) 05-once-opened-never-closed (history-timeline): First timeline image is a Google Maps screenshot (stand-in, wrong photo). Image sizes and offsets otherwise follow the Figma scatter.
- [ ] (drift) 07-1-etiam-imperdiet-sodales-dui-a (gallery-mosaic-captioned): Captions sit on top of the photos in dark green and are unreadable; Figma shows them as small text under each tile.

## Dining

URL: `/dining`  |  Figma: `figma/pages/dining-collection`

- [ ] (drift) 03-zuma (venue-card-fullbleed tab bar): At 390 the venue tab bar is clipped inside the rounded card ("PO" visible), no scroll cue.

## Guidelines

URL: `/guidelines`  |  Figma: `figma/pages/guidelines`

- [ ] (broken) 06-photoshoot-request (form-split-script-contact): Every field label reads "EXAMPLE TEXT" (First name, Email, Company, Shoot date etc. missing).
- [ ] (drift) 04-work-from-our-collaborators (timeline-scatter-images): "@USERNAME" captions are dark text on the photos, low contrast.

## Rooms

URL: `/rooms`  |  Figma: `figma/pages/rooms-collection`

- [x] No issues against the Figma crops.
- Note: 13-all-rooms: Room list hover preview is a dialog (id all-rooms); not visible in a page capture, not exercised.

## Room Detail (static)

URL: `/rooms-individual`  |  Figma: `figma/pages/rooms-individual`

- [ ] (drift) 09-deluxe-king-suite-gallery (gallery-mosaic-captioned): Captions overlap the photos and are unreadable (same issue as History 07).

## Press

URL: `/press`  |  Figma: `figma/pages/press`

- [ ] (broken) 08-press-enquiries (form-split-script-contact): All field labels read "EXAMPLE TEXT" and the second group is headed "SHOOT DETAILS" instead of the press fields (Organization, Expected publish date, Details).
- [ ] (drift) 03 to 07 (article-card-staggered x5): Cards use stock hotel photos where Figma shows publication logo cards (National Geographic, Forbes, There San Diego, Architectural Digest). Category eyebrow ("PRESS") above cards 3 to 5 is missing.

## Gallery

URL: `/gallery`  |  Figma: `figma/pages/gallery`

- [ ] (drift) 02-all (gallery-all): First tile is the property illustration (wrong photo). The category pill bar is sticky at the bottom of the viewport rather than mid-grid as in Figma; at 390 the pills are clipped (ALL, DESIGN, WELLNESS, DINING cut off).

## Arts

URL: `/arts`  |  Figma: `figma/pages/arts`

- [x] No issues against the Figma crops.
- Note: 12-arts-artist and 13-arts-modal: Ten overlay-detail-panel dialogs exist in the DOM; hidden by default, not exercised.

## Wellness

URL: `/wellness`  |  Figma: `figma/pages/wellness-collection`

- [ ] (drift) 02 to 06 (tab-pills-intro media stack): At 390 the tab pill row is clipped ("FITNESS C"). Pinned panels render correctly in a scrolling viewport; full-page capture shows them blank.

## Static Template (Privacy Policy)

URL: `/static-template`  |  Figma: `figma/pages/static-template`

- [x] No issues against the Figma crops.

## Contact

URL: `/contact`  |  Figma: `figma/pages/contact`

- [x] No issues against the Figma crops.
- Note: capture: networkidle never settles on this page (a persistent request); captured after load plus 8s. Contact details, form and dark CTA match the Figma crops.

## Meetings

URL: `/meetings`  |  Figma: `figma/pages/meetings-collection`

- [ ] (broken) 06-request-for-proposal (form-split-script-contact): All field labels read "EXAMPLE TEXT" and the second group is headed "SHOOT DETAILS" instead of "EVENT DETAILS" (Event date, Number of people, Start/End time).
- [ ] (drift) 09-meetings-events-gallery (gallery-mosaic-captioned): Captions overlap the photos and are unreadable.
- Note: 14-meetings-overlay: Council Boardroom overlay is a dialog; not exercised.

## Neighborhood

URL: `/neighborhood`  |  Figma: `figma/pages/neighborhood`

- [ ] (broken) 09-dining-around-the-guild (article-card-staggered): Only card 1 is built; Figma has three stacked cards (Dining 1, 2, 3). Cards 2 and 3 are missing.
- [ ] (drift) 05-little-italy: The pill tab bar (DINING, ARTS, BEYOND DOWNTOWN, SERVICES) under the split section is missing.
- [ ] (drift) 08-corporate-services (neighborhood-corporate): Map screenshot used as one of the four photo slots; the Guild facade is labelled "Coronado Beach" in 07 (photo and caption mismatch).
- [ ] (drift) 11-neighborhood-gallery (gallery-mosaic-captioned): Captions overlap the photos and are unreadable.
- Note: 16-neighborhood-overlay: Overlay is a dialog; not exercised.

## Dining item: Zuma

URL: `/dining/dining-zuma`  |  Figma: `figma/pages/dining-zuma`

- [ ] (broken) 01-zuma-san-diego (hero): The large "zuma" logotype is missing from the hero; a generic coffee photo is used (the same hero photo is on all four dining items).
- [ ] (drift) 02-contemporary-japanese-dining-at-the-guild: Background is olive green; Figma shows navy. The tall image overhangs into the next section and overlaps the "DRESS CODE" label.
- [ ] (drift) 06-with-every-bite-as-beautiful-to (quote-band-dark): British Vogue attribution logo is missing under the quote.
- [ ] (drift) 10-other-dining-options (card-stagger-header-left): Card images do not match captions (Zuma sign labelled POOL LOUNGE, artichoke labelled LOBBY TERRACE).

## Dining item: Garden Terrace

URL: `/dining/dining-gardenterrace`  |  Figma: `figma/pages/dining-gardenterrace`

- [ ] (drift) 01-lobby-bar style hero: Hero uses the same coffee photo as the other dining items (not per-item).
- [ ] (drift) 02 (split-image-text-light): Image overhang overlaps the "DRESS CODE" label in section 03.

## Dining item: Lobby Bar

URL: `/dining/dining-lobbybar`  |  Figma: `figma/pages/dining-lobbybar`

- [ ] (drift) 01-lobby-bar (hero): Hero uses the same coffee photo as the other dining items; Figma crop is a placeholder.
- [ ] (drift) 02 (split-image-text-light): Image overhang overlaps the "DRESS CODE" label in section 03. Section 05 image-pair shows the Zuma sign photo on the Lobby Bar page.

## Dining item: Pool Lounge

URL: `/dining/dining-poollounge`  |  Figma: `figma/pages/dining-poollounge`

- [ ] (drift) 01 (hero): Hero uses the same coffee photo as the other dining items (not per-item).
- [ ] (drift) 02 (split-image-text-light): Image overhang overlaps the "DRESS CODE" label in section 03.

## Legal Corporates item: Legal

URL: `/legal-corporate/legal`  |  Figma: `figma/pages/legal`

- [ ] (broken) 12-a-landmark-reimagined (form-split-script-contact): Field labels read "EXAMPLE TEXT" and group heading "SHOOT DETAILS" instead of Law firm, Team size, Check-in date, Check-out date.
- [ ] (drift) 03-key-features (image-trio-text): First feature image is the property illustration (wrong photo).
- [ ] (drift) 13-corporate-gallery (gallery-mosaic-captioned): Captions overlap the photos and are unreadable.
- Note: 17-legal overlay: Council Boardroom overlay is a dialog; not exercised.

## Legal Corporates item: Corporate

URL: `/legal-corporate/corporate`  |  Figma: `figma/pages/corporate`

- [ ] (broken) 12-a-landmark-reimagined (form-split-script-contact): Field labels read "EXAMPLE TEXT" and group heading "SHOOT DETAILS" instead of the corporate form fields.
- [ ] (drift) 03-key-features (image-trio-text): First feature image is the property illustration (wrong photo).
- [ ] (drift) 13-corporate-gallery (gallery-mosaic-captioned): Captions overlap the photos and are unreadable.
- Note: 17-corporate-overlay: Overlay is a dialog; not exercised.

## Post Categories item: Happenings

URL: `/post-categories/happenings-collection`  |  Figma: `figma/pages/happenings-collection`

- [ ] (broken) 03-the-best-san-diego-hotels-for (posts list): The list is not filtered by category: all six posts (Happenings and Blog) show on the Happenings page.
- [ ] (drift) 04 to 07 (posts list): Category eyebrow (DINING, CULTURE) above each card is missing; tab pills (DINING, CULTURE, CONFERENCES) do not filter.

## Post Categories item: Blog

URL: `/post-categories/blog-collection`  |  Figma: `figma/pages/blog-collection`

- [ ] (broken) 03-the-best-san-diego-hotels-for (posts list): Identical to the Happenings page: the same six posts are listed, no category filter applied.
- [ ] (drift) 04 to 07 (posts list): Category eyebrow missing above each card; tab pills do not filter.

## Happenings & Stories item: Locals Night at Rodeo Bar

URL: `/happenings-stories/locals-night-at-rodeo-bar`  |  Figma: `figma/pages/happenings-indiv`

- [ ] (drift) 02-the-guild-a-tribute-portfolio-hotel (article-body): Heading and the "LEARN MORE" button from Figma are missing in the article body.
- [ ] (drift) 03 and 04 (image-inset-single, split-image-text-light): Images and copy are static and identical on every post, not CMS-driven.
- [ ] (drift) 05-more-around-town (split-card-pair-captioned): Static two-card pair (Historical tours, A guide to dining) on every post; not related posts.

## Happenings & Stories item: Best San Diego Hotels (blog)

URL: `/happenings-stories/best-san-diego-hotels-for-every-traveler`  |  Figma: `figma/pages/blog-indiv`

- [ ] (drift) 02-the-guild-a-tribute-portfolio-hotel (article-body): Heading and the "LEARN MORE" button from Figma are missing in the article body.
- [ ] (drift) 03 and 04 (image-inset-single, split-image-text-light): Images and copy are static and identical on every post.
- [ ] (drift) 05-more-around-town (split-card-pair-captioned): Static two-card pair on every post; not related posts.

## Cross-page patterns

- [ ] (broken) form-split-script-contact shows "EXAMPLE TEXT" for every field label and a "SHOOT DETAILS" heading on Guidelines, Press, Meetings, Legal, Corporate. Needs per-page label props.
- [ ] (drift) gallery-mosaic-captioned captions render on top of the photos in dark green, unreadable (History, Rooms Detail, Meetings, Neighborhood, Legal, Corporate, Dining items).
- [ ] (drift) tab pill rows (venue-card-fullbleed, tab-pills-intro, gallery-all) clip at 390 with no scroll cue.
- [ ] (drift) split-image-text-light overhang overlaps the next section label on the dining item template (Zuma, Garden Terrace, Lobby Bar, Pool Lounge).
- [ ] (drift) property illustration and Google Maps screenshot used as photo stand-ins (History timeline, Gallery, Legal and Corporate key features, Neighborhood corporate).
