# fix-r2 notes (W02 round 2)

Webflow session `ses_3KyZCoZZB15VqXQrntDCc4ntR7u`, agent `opus-5.5|claude-code|fxr2k`. Published once to the webflow.io subdomain only (task `af11794f-6600-4441-b91b-ed7f0f012c59`, customDomains []). Screenshots are in `r2/`, and the script is `r2/v.js`.

## 1. /happenings-stories/<slug> 404
Done, and no write was needed. **PASS** at 1440 and 390.
- All 6 Happenings & Stories items have isDraft false, isArchived false and lastPublished 2026-10-20T18:45:42Z. So do the 2 Post Categories items and the 2 Legal Corporates items. The 4 Dinings items show lastPublished 21:11:58Z.
- When I first checked, before my own publish, all 14 CMS URLs already returned 200, and the CDN showed last-modified 21:27:53Z. That means a site publish ran just after the verifier's run.
- I polled four CMS URLs every 10s during my own publish. None returned 404.
- Cause: not certain, but nothing was wrong with the items. Most likely the verifier's run hit the site during or just before that 21:27 site publish. It may also have been misled by the stale line in webflow-ids.md that calls the sample posts "6 draft sample posts" (that line should be updated).
- 200 after publish:
  - /happenings-stories/locals-night-at-rodeo-bar and best-san-diego-hotels-for-every-traveler (plus the other 4 posts by curl)
  - /post-categories/happenings-collection and blog-collection
  - all 4 /dining items
  - /legal-corporate/legal and corporate
- The bare collection roots /happenings-stories and /legal-corporate return 404. That is expected, because no static page exists at those paths.

## 2. timeline-scatter-images Tall captions
Done. **PASS.**
- Combo `timeline-scatter-images_caption.is-tall` (e4b8e9c1-78f8-0476-f344-7a5981d5d27e) now sets colour `relume-variable--neutral-shade-7` and text-shadow none. Position static is kept.
- Only the Tall component uses this combo.
- Live /neighborhood 07 captions compute to rgb(38,33,24) at both widths and read clearly on cream (r2/s_nb-scatter-1440.png, r2/nb-scatter-390.png).
- Guidelines captions are still cream rgb(244,239,223) and absolute over the photo.

## 3. gallery-mosaic-captioned heading and captions
Done. **PASS.**
- Figma neighborhood/11 has the heading over the first photo at top left, and the captions over each tile at bottom left.
- `gallery-mosaic-captioned_figure` (f08402be-a816-5fd3-8e43-a5111483e0f8) now has an ::after scrim:
  - content "", absolute, inset 0, z-index 0, pointer-events none
  - linear-gradient 180deg: black 0.4 at 0%, clear from 25% to 55%, black 0.6 at 100%
  - It sits above the image and below the caption (z 1) and the header (z 2).
- `gallery-mosaic-captioned_heading` (7f7b9f20-132b-430a-4911-081aae809308): colour changed from shade-7 to shade-1 (cream), plus text-shadow 0 1px 8px rgba(0,0,0,0.55).
- The change is in the component classes, so it applies to every instance.
- Live results:
  - "NEIGHBORHOOD GALLERY" is cream and readable over the teal bedroom (r2/s_nb-gallery-1440.png, r2/nb-gallery-390.png).
  - The /history 07 caption over the bright facade is now readable (r2/s_history-gallery-1440.png).
  - Meetings shots are in r2/meetings-gallery-*.png.

## 4. /neighborhood 07 "oceanside" photos
Done. **PASS (closest match).**
- The library has no beach or coast photo. The only open-water shots are the two sea cocktails already used on items 1 and 3, so I used the two remaining water photos.
- Changes in the Tall definition 33e949df-43c2-4806-b73e-d403ed483051:
  - Item 2 Image `1632a4aa-9628-e79c-1408-a6dba7a7068b`: velvet lounge -> guest with a drink at the pool edge `6ad67015134731ad1b928187`. Alt: "A guest with a drink at the edge of sunlit blue water".
  - Item 4 Image `633569da-29ea-1659-6f91-5cfbe4e88acb`: plated dish -> woman swimming `6ad66ffdba96f2e53726bd55`. Alt: "A woman swimming in shimmering water".
- The live order of the four images is sea, pool, sea, pool.
- Note: the pool-guest photo also appears as tile 4 of the gallery further down the same page. Real beach or Oceanside photos are a content ask for Stephen.

## 5. /neighborhood 09 dining cards
Done. **PASS.**
- Instance `81ccf045-59c6-11a6-486f-47b0cb3a75e9` (Article Card Staggered Tall), prop overrides:
  - Image (c650b826-...): Zuma sign -> sashimi platter `6ad6700ca0940436780a6d02`
  - Image 2 (dcc5c911-...): artichoke -> cafe table with sandwiches and drinks `6ad67005cf42363c3ffe3c69`
  - Image 3 (805f3fe2-...): boardroom -> guests with cocktails `6ad66fe66684c3e22ea4d923`
- Live: three distinct food and bar photos at 1440 and 390 (r2/s_nb-cards-1440.png).
- Labels are unchanged. Figma 09 spec.json only has placeholders ("dining 1", "dining 2", "dining 2"), so "dining 1/2/3" stays until real venue names are supplied.

## Designer step for Stephen
None.
