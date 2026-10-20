# fix-c: image swaps (agent opus-5.5|claude-code|fixc7, session ses_3KyWC48fbiDco0HqIpTTmsmj0kQ)

Bad assets: Google Maps screenshot `6ad6701edd7f0762ee12bb55`, property illustration `6ad66fed1ce40a5a6239b98e`, coffee `6ad6701b6684c3e22ea4f00f`, Zuma sign `6ad66ff45794075272b9663f` / `6ad6701fde86688556052e83`, artichoke `6ad66fe91ce40a5a6239b8ad`.
Contact sheets of all library photos: `fixc-sheets/sheet0-2.jpg` (index map in `fixc-index.json`).

## 1. /history section 05 timeline
Done. Native Image `dace0db9-928d-b604-4a6a-b11e2e227afd` (in `section_history-timeline` `7209acee-...`): map -> historic facade `6ad66fed15beaf9a7285e5c8`; alt "Historic entrance and facade of The Guild". Read back OK.

## 2. /gallery section 02-all
Done. First tile (figure `acd0152b-...`, filter tag "design"), Image `b8fc58b9-bcbb-5cfd-d3ff-dcc9f25a47cf`: illustration -> library lounge interior `6ad6701cf08ff78c37d862e1`. Read back OK.

## 3. Legal Corporates template section 03 key-features
Done. Static instance prop, not CMS bound. Image Trio Text Left instance `8d6ed2de-4492-327f-2236-20b3f19afb0e`, prop Image 1 `3af045ac-8867-7574-0b8e-38ec6d207b60`: illustration -> boardroom `6ad67016f8bf4846e80a023a`. Applies to both legal and corporate items (template-level). Read back OK.

## 4. /neighborhood
Done.
- 08 corporate-services: Image `61052a88-9f1a-0190-fbb3-e1f6a5939ba7`: map -> suite with work table `6ad67001f08ff78c37d85427`; alt "Suite with a large work table at The Guild".
- 07: images are in the `timeline-scatter-images Tall` definition `33e949df-43c2-4806-b73e-d403ed483051` (neighborhood is its only use). Item 1 Image `fbce3430-c894-30df-ef1a-440f12b6ac85` (facade, "Coronado Beach") -> martini over sea `6ad66ff5cd6d481041d16956`. Item 3 Image `8a61f07f-3cb1-abb6-04b8-17a14c97b0c8` (library lounge, also captioned "Coronado Beach") -> cocktail over sea `6ad6700aba96f2e53726c671`. Alts updated. Captions untouched.
- Residual: items 2 and 4 are captioned "oceanside" but show a velvet lounge and a plated dish. The library has no beach or coast photo, so these could not be matched well; left as is.
- Not changed: Map Feature Image Bg instance `c40253a1-...` uses the map screenshot as its map base on purpose.

## 5. Dining CMS
Done.
- Hero: the template Hero (`726f3724-5fec-e4c7-caa6-8f1195d5abdd`) Image prop was a static coffee photo, and Dinings had no hero image field. Added Image field `hero-image` (`c3e904183cdd02f7727bdf3cc1fd860a`, "Hero image") and bound Hero prop Image `6e5a3125-015e-ad6e-e587-2060517d5457` to it. Values (probed Zuma first, read back, then the rest):
  - dining-zuma: sashimi platter `6ad6700ca0940436780a6d02`
  - dining-gardenterrace: courtyard terrace `6ad670004c7f57894534c08d`
  - dining-lobbybar: lobby lounge `6ad670147e3d6550932e0fac`
  - dining-poollounge: guest in pool `6ad66ffdba96f2e53726bd55`
  Items stay ready to publish (isDraft false). Update webflow-ids.md with the new field.
- Section 10 other-dining cards: static template images; labels are CMS (label-1 "pool lounge", label-2 "lobby terrace", label-3 "the lobby bar", same on all items). Image `abed587e-339c-4a7a-8921-923bd59b2f7f` Zuma sign -> pool `6ad67015134731ad1b928187`; `898c7597-5af7-4603-3c96-5f02301a6be9` artichoke -> terrace `6ad66fee735773f253407335`; `617e59dc-0517-d8e6-1251-a7752eeebefa` fitness photo -> lobby bar `6ad66fef6684c3e22ea4dc76`. Alts updated.
- Section 05 image pair (static, all items): Image `62efa24a-e660-b29d-f591-9d0e4b8067bc` Zuma sign -> guests with cocktails `6ad66fe66684c3e22ea4d923`; alt updated.
- Note: the cards are static, so each venue page still lists itself among "other dining options" (labels are the same on every item). That is a content/structure issue outside image scope.

Not published.
