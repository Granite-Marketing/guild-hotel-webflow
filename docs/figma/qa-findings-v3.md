# W03 QA findings, version 3 (2026-10-21)

Broken sections went from 10 to 2 and drift from 44 to 8 across 24 URLs (baseline to now; version 2 was 2 broken and 18 drift). Counts are sections. Source: `qa-report.html` in the w03-r3 scratch dir. Severity: broken = missing or unusable content; drift = visible difference that does not block use.

Runtime: v1.1.4 plus PR 105, footer bump pending. The live footer still loads v1.1.3; the bundle request was routed to a local v1.1.4 build with the history pill fix (commit d203a3e).

Global: FAQ first item is open in Figma and closed on staging (not counted). Scroll-pinned sections spot-checked at 1440 and 390 on Home, History, Dining, Wellness, Meetings, Legal, Corporate: working. Page titles are unique on all 24 URLs.

## Home

`/`. Baseline 0 broken, 1 drift; v2 0 broken, 1 drift; now 0 broken, 1 drift.

- [ ] v2 item, improved: Map label and small map at 390. 390 map now fills the width. The label is the Figma placeholder, so the page stays at 1 drift.
- [ ] (drift) 12-the-neighborhood (map-feature): Map artwork is labelled "Hotel Clermont" (another hotel). The Figma crop has the same artwork, so it is a design placeholder. The 390 size is fixed: the map now fills the width (image 326 x 408 px).

## History

`/history`. Baseline 1 broken, 2 drift; v2 0 broken, 1 drift; now 0 broken, 0 drift.

- [x] v2 item, fixed: Sticky 1924 pill covers body text. 75 scroll positions at 1440 and 51 at 390: whenever a text block passes under the pill its opacity is 0; it is visible only over photos.
- [x] No remaining issues against the Figma crops.

## Dining

`/dining`. Baseline 0 broken, 1 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.

## Guidelines

`/guidelines`. Baseline 1 broken, 1 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.

## Rooms

`/rooms`. Baseline 0 broken, 0 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: 13-all-rooms: room list hover preview is a dialog (id all-rooms); not exercised.
- Note: Room card details (guests, size, VIEW MORE) now show only on hover at 1440, as in Figma. On touch (390) there is no hover, so the details stay hidden.

## Room Detail (static)

`/rooms-individual`. Baseline 0 broken, 1 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.

## Press

`/press`. Baseline 1 broken, 5 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: Not visual: the Press form still submits under the photoshoot field names, and the "Example Text" placeholders are hidden, not removed (Designer fix).

## Gallery

`/gallery`. Baseline 0 broken, 1 drift; v2 0 broken, 1 drift; now 0 broken, 1 drift.

- [ ] v2 item, improved: Pill bar overlays first photo row, 3 lines at 390. 390 is one swipeable line now. The bar is still sticky over the photos.
- [ ] (drift) 02-all (gallery-all): The category pill bar is sticky and sits over the first photo row instead of mid-grid as in Figma. At 390 it is now one swipeable line (670 px of pills in a 358 px bar, no wrap) but it still covers the bottom of the photo row.

## Arts

`/arts`. Baseline 0 broken, 0 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: 12-arts-artist and 13-arts-modal: ten overlay-detail-panel dialogs exist in the DOM; hidden by default, not exercised. The pill bar is one swipeable line at 390 (568 px in 358 px).

## Wellness

`/wellness`. Baseline 0 broken, 1 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: Nav turns dark (class is-on-light, text rgb 38, 33, 24) over the cream intro at 1440 and 390, and is cream over the photo hero.

## Static Template (Privacy Policy)

`/privacy-policy (was /static-template, now 404)`. Baseline 0 broken, 0 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: The page was renamed Privacy Policy and now lives at /privacy-policy. The old /static-template URL returns 404. The capture used /privacy-policy; it matches the Figma crop. A redirect may be needed if the old URL was shared.

## Contact

`/contact`. Baseline 0 broken, 0 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: capture: networkidle is slow on this page (a persistent request); captured after load plus 6s. Contact details, form and dark CTA match the Figma crops.

## Meetings

`/meetings`. Baseline 1 broken, 1 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: 14-meetings-overlay: Council Boardroom overlay is a dialog; not exercised.
- Note: /meetings#request-for-proposal now lands with the Request for Proposal form at the top of the viewport (scroll 4840 px at 1440, 4530 px at 390).

## Neighborhood

`/neighborhood`. Baseline 1 broken, 3 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: 07 reuses two photos twice and keeps the Coronado Beach and Oceanside captions; Figma has the same placeholder captions. 16-neighborhood-overlay is a dialog; not exercised.

## Dining item: Zuma

`/dining/dining-zuma`. Baseline 1 broken, 3 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.

## Dining item: Garden Terrace

`/dining/dining-gardenterrace`. Baseline 0 broken, 2 drift; v2 0 broken, 1 drift; now 0 broken, 0 drift.

- [x] v2 item, fixed: Section 02 navy where Figma shows olive. Olive green on Garden Terrace, Lobby Bar and Pool Lounge; Zuma stays navy.
- [x] v2 item, fixed: Other dining options lists this venue. Lists the other three venues, read from the DOM.
- [x] No remaining issues against the Figma crops.

## Dining item: Lobby Bar

`/dining/dining-lobbybar`. Baseline 0 broken, 2 drift; v2 0 broken, 1 drift; now 0 broken, 0 drift.

- [x] v2 item, fixed: Section 02 navy where Figma shows olive. Olive green.
- [x] v2 item, fixed: Other dining options shared pair. Lists Zuma, Garden Terrace and Pool Lounge.
- [x] No remaining issues against the Figma crops.

## Dining item: Pool Lounge

`/dining/dining-poollounge`. Baseline 0 broken, 2 drift; v2 0 broken, 1 drift; now 0 broken, 0 drift.

- [x] v2 item, fixed: Other dining options lists Pool Lounge. Lists Zuma, Garden Terrace and Lobby Bar.
- [x] v2 item, fixed: Section 02 navy where Figma shows olive. Olive green.
- [x] No remaining issues against the Figma crops.

## Legal Corporates item: Legal

`/legal-corporate/legal`. Baseline 1 broken, 2 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: 17-legal overlay: Council Boardroom overlay is a dialog; not exercised.
- Note: 04 hover photo (data-hover-image) is hidden at rest and follows the pointer: figure centre moved from (500, 300) to (900, 550) with the pointer. The photo itself is a food dish, a placeholder.

## Legal Corporates item: Corporate

`/legal-corporate/corporate`. Baseline 1 broken, 2 drift; v2 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: Form shows the legal labels (Law firm, Team size), the same as the Figma corporate crop. 17-corporate-overlay is a dialog; not exercised.

## Post Categories item: Happenings

`/post-categories/happenings-collection`. Baseline 1 broken, 4 drift; v2 1 broken, 4 drift; now 1 broken, 1 drift.

- [ ] v2 item, unchanged: List not filtered by category. All six posts still show. Needs the Designer collection list filter.
- [x] v2 item, fixed: Category eyebrow missing. DINING, CULTURE and CONFERENCES eyebrows sit above each card title.
- [ ] v2 item, unchanged: Tab pills do not filter. Pills are #anchors.
- [ ] (broken) 03-the-best-san-diego-hotels-for (posts list): The list is not filtered by category: all six posts (Happenings and Blog) show on the Happenings page.
- [ ] (drift) 02-whats-on-in-san-diego (tab-pills-intro): Tab pills (DINING, CULTURE, CONFERENCES) do not filter; they are #dining, #culture and #conferences anchors and DINING shows active while all six posts are listed.
- Note: Post card links are still "#" (Designer: card Link Block to the current post), not visible in a capture.

## Post Categories item: Blog

`/post-categories/blog-collection`. Baseline 1 broken, 4 drift; v2 1 broken, 4 drift; now 1 broken, 1 drift.

- [ ] v2 item, unchanged: List not filtered by category. Same six posts as Happenings.
- [x] v2 item, fixed: Category eyebrow missing. Eyebrows are in.
- [ ] v2 item, unchanged: Tab pills do not filter. Pills are #anchors.
- [ ] (broken) 03-the-best-san-diego-hotels-for (posts list): Identical to the Happenings page: the same six posts are listed, no category filter applied.
- [ ] (drift) 02-whats-on-in-san-diego (tab-pills-intro): Tab pills do not filter (same anchors as Happenings).
- Note: Post card links are still "#" (same Designer step).

## Happenings & Stories item: Locals Night at Rodeo Bar

`/happenings-stories/locals-night-at-rodeo-bar`. Baseline 0 broken, 3 drift; v2 0 broken, 2 drift; now 0 broken, 2 drift.

- [ ] v2 item, unchanged: Inset and split are static. Same images and copy on both posts.
- [ ] v2 item, unchanged: More around town is a static pair. Same pair on both posts.
- [ ] (drift) 03 and 04 (image-inset-single, split-image-text-light): Images and copy are the same on every post (same inset and split photo on both posts checked). Layout matches Figma.
- [ ] (drift) 05-more-around-town (split-card-pair-captioned): Static pair (Historical tours, A guide to dining) on every post; Figma shows Historical tours and Autumn at Spa Adolphus. Not related posts.

## Happenings & Stories item: Best San Diego Hotels (blog)

`/happenings-stories/best-san-diego-hotels-for-every-traveler`. Baseline 0 broken, 3 drift; v2 0 broken, 2 drift; now 0 broken, 2 drift.

- [ ] v2 item, unchanged: Inset and split are static. Same images and copy on both posts.
- [ ] v2 item, unchanged: More around town is a static pair. Same pair on both posts.
- [ ] (drift) 03 and 04 (image-inset-single, split-image-text-light): Images and copy are the same on every post. Layout matches Figma.
- [ ] (drift) 05-more-around-town (split-card-pair-captioned): Static pair on every post, not related posts.

## Changes since version 2 (all ten hold)

- [x] Dinings: other dining options list only the other three venues: Read from the DOM on all four items: Zuma lists Garden Terrace, Lobby Bar, Pool Lounge; Garden Terrace lists Zuma, Lobby Bar, Pool Lounge; Lobby Bar lists Zuma, Garden Terrace, Pool Lounge; Pool Lounge lists Zuma, Garden Terrace, Lobby Bar. Section 02 is olive on the three non-Zuma venues.
- [x] Gallery and Arts pill bar is one swipeable line at 390: Gallery bar: nowrap, overflow-x auto, 670 px of pills in a 358 px bar, 48 px tall. Arts bar: 568 px in 358 px, 48 px tall. At 1440 the bar fits (892 px). The sticky bar still covers the lower photo row, which stays as the Gallery drift.
- [x] History 05 pill no longer covers text: Stepped through the whole timeline in 120 px steps (75 positions at 1440, 51 at 390) and read the pill opacity against every text block overlapping it: the pill is at opacity 0 for each overlap and 0 positions showed it over text. Runtime used: PR 105 build.
- [x] Wellness nav turns dark over the cream intro: Nav gets is-on-light and dark text (rgb 38, 33, 24) from the intro onward at 1440 and 390; it is cream over the photo hero.
- [x] /rooms card details show only on hover: At rest each card shows only the room name. Hovering shows 4 GUESTS, 52 m2 SIZE and VIEW MORE. On touch there is no hover, so the details stay hidden (opacity 0 at 390).
- [x] Map Feature larger at 390 on Home: Map image is 326 x 408 px at 390 and fills the width (v2 rendered it small). The label is still Hotel Clermont, which is in the Figma crop too.
- [x] Post Categories cards show the topic eyebrow: Every card has its eyebrow (DINING, CULTURE, CONFERENCES) on both category pages. The list is still the same six posts on both pages and the pills are still anchors.
- [x] Page titles are no longer "The Guild Hotel": All 24 captured URLs have a unique title ending in "| The Guild Hotel" (table below).
- [x] /meetings#request-for-proposal lands on the form: After load plus 2.5s the anchor is at 92 px from the top at 1440 (scroll 4840) and 53 px at 390 (scroll 4530) with the form below it.
- [x] legal/04 hover photo follows the pointer on /legal-corporate/legal: The photo (data-hover-image-media) is hidden at rest, appears on hover and tracks the pointer: centre (500, 300) with the pointer at (500, 300), then (900, 550) at (900, 550).

## Cross-page patterns

- [ ] (broken) Post Categories pages (Happenings, Blog) list all six posts; the collection list needs a category filter in the Designer.
- [ ] (drift) Post Categories tab pills are #anchors and do not filter; card links are still `#`.
- [ ] (drift) Post template inset, split and More around town sections are the same on every post.
- [ ] (drift) Gallery pill bar overlays the photo row (sticky).
- [ ] (drift) Design placeholders shared with Figma: Home map label, repeated photos, FAQ first item closed.
- [x] Dining item template: olive on non-Zuma venues, Other dining options lists the other three venues.
- Note: /static-template now returns 404; the page is /privacy-policy (redirect needed if the old URL was shared).
