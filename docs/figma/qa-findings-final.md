# W03 final QA findings (2026-10-20)

Baseline vs now: broken 10 to 2, drift 44 to 18 (section counts). Source: `qa-report.html` in the w03-final scratch dir. Severity: broken = missing or unusable content; drift = visible difference that does not block use.

Global: FAQ first item is open in Figma and closed on staging (not counted). Scroll-pinned sections spot-checked at 1440 and 390 on Home, History, Dining, Wellness, Meetings, Legal, Corporate: working.

## Home

Baseline 0 broken, 1 drift; now 0 broken, 1 drift.

- [ ] (drift) 12-the-neighborhood (map-feature): Map artwork is labelled "Hotel Clermont" (another hotel). The Figma crop has the same artwork, so it is a design placeholder. At 390 the map renders small.

## History

Baseline 1 broken, 2 drift; now 0 broken, 1 drift.

- [ ] (drift) 05-once-opened-never-closed (history-timeline): New and minor: the sticky 1924 pill sits over the "A YMCA landmark is born" body copy at one scroll position (seen at 1440). Figma places pills on the photos.

## Dining

Baseline 0 broken, 1 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.

## Guidelines

Baseline 1 broken, 1 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.

## Rooms

Baseline 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: 13-all-rooms: room list hover preview is a dialog (id all-rooms); not exercised.

## Room Detail (static)

Baseline 0 broken, 1 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.

## Press

Baseline 1 broken, 5 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: Not visual: the Press form still submits under the photoshoot field names, and the "Example Text" placeholders are hidden, not removed (Designer fix).

## Gallery

Baseline 0 broken, 1 drift; now 0 broken, 1 drift.

- [ ] (drift) 02-all (gallery-all): The category pill bar is sticky and sits over the first photo row instead of mid-grid as in Figma. At 390 the pills now wrap to three lines and still cover part of the first row.

## Arts

Baseline 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: 12-arts-artist and 13-arts-modal: ten overlay-detail-panel dialogs exist in the DOM; hidden by default, not exercised.

## Wellness

Baseline 0 broken, 1 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.

## Static Template (Privacy Policy)

Baseline 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.

## Contact

Baseline 0 broken, 0 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: capture: networkidle never settles on this page (a persistent request); captured after load plus 8s. Contact details, form and dark CTA match the Figma crops.

## Meetings

Baseline 1 broken, 1 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: 14-meetings-overlay: Council Boardroom overlay is a dialog; not exercised.

## Neighborhood

Baseline 1 broken, 3 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: 07 reuses two photos twice and keeps the Coronado Beach and Oceanside captions; Figma has the same placeholder captions. 16-neighborhood-overlay is a dialog; not exercised.

## Dining item: Zuma

Baseline 1 broken, 3 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: Document title is still "The Guild Hotel" on all four dining items (SEO, not scored).

## Dining item: Garden Terrace

Baseline 0 broken, 2 drift; now 0 broken, 1 drift.

- [ ] (drift) 02 and 10 (split-image-text-light, card-stagger-header-left): Section 02 is navy where Figma shows olive green for non-Zuma venues. "Other dining options" is the same two cards on every item and appears to list this venue (not checked in the DOM).

## Dining item: Lobby Bar

Baseline 0 broken, 2 drift; now 0 broken, 1 drift.

- [ ] (drift) 02 and 09 (split-image-text-light, card-stagger-header-left): Section 02 is navy where Figma shows olive green for non-Zuma venues. "Other dining options" is a shared Pool Lounge and Lobby Terrace pair.

## Dining item: Pool Lounge

Baseline 0 broken, 2 drift; now 0 broken, 1 drift.

- [ ] (drift) 02 and 09 (split-image-text-light, card-stagger-header-left): "Other dining options" lists Pool Lounge on the Pool Lounge page. Section 02 is navy where Figma shows olive green.

## Legal Corporates item: Legal

Baseline 1 broken, 2 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: 17-legal overlay: Council Boardroom overlay is a dialog; not exercised.

## Legal Corporates item: Corporate

Baseline 1 broken, 2 drift; now 0 broken, 0 drift.

- [x] No remaining issues against the Figma crops.
- Note: Form shows the legal labels (Law firm, Team size), the same as the Figma corporate crop. 17-corporate-overlay is a dialog; not exercised.

## Post Categories item: Happenings

Baseline 1 broken, 4 drift; now 1 broken, 4 drift.

- [ ] (broken) 03-the-best-san-diego-hotels-for (posts list): The list is not filtered by category: all six posts (Happenings and Blog) show on the Happenings page.
- [ ] (drift) 04 to 07 (posts list): Category eyebrow (DINING, CULTURE) above each card is missing; tab pills (DINING, CULTURE, CONFERENCES) do not filter.

## Post Categories item: Blog

Baseline 1 broken, 4 drift; now 1 broken, 4 drift.

- [ ] (broken) 03-the-best-san-diego-hotels-for (posts list): Identical to the Happenings page: the same six posts are listed, no category filter applied.
- [ ] (drift) 04 to 07 (posts list): Category eyebrow missing above each card; tab pills do not filter.

## Happenings & Stories item: Locals Night at Rodeo Bar

Baseline 0 broken, 3 drift; now 0 broken, 2 drift.

- [ ] (drift) 03 and 04 (image-inset-single, split-image-text-light): Images and copy are static and identical on every post, not CMS-driven. Layout matches Figma.
- [ ] (drift) 05-more-around-town (split-card-pair-captioned): Static pair (Historical tours, A guide to dining) on every post; Figma shows Historical tours and Autumn at Spa Adolphus. Not related posts.

## Happenings & Stories item: Best San Diego Hotels (blog)

Baseline 0 broken, 3 drift; now 0 broken, 2 drift.

- [ ] (drift) 03 and 04 (image-inset-single, split-image-text-light): Images and copy are static and identical on every post, not CMS-driven. Layout matches Figma.
- [ ] (drift) 05-more-around-town (split-card-pair-captioned): Static pair on every post, not related posts.

## Cross-page patterns

- [ ] (broken) Post Categories pages (Happenings, Blog) list all six posts; the collection list needs a category filter in the Designer.
- [ ] (drift) Post template inset, split and More around town sections are static on every post.
- [ ] (drift) Dining item template: non-Zuma venues use navy where Figma shows olive green; Other dining options is a shared pair that can list the current venue.
- [ ] (drift) Gallery pill bar overlays the first photo row (sticky).
- [ ] (drift) Design placeholders shared with Figma: Home map label, repeated photos, FAQ first item closed.
