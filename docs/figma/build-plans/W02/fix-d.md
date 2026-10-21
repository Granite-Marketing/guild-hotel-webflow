# Fix agent D notes (W02, 2026-10-20)

Webflow session `ses_3KyWEoOgm1W8IEABSK7sNew8uGG`, agent `opus-5.5|claude-code|fxd4q`. Nothing published.

## 1. /neighborhood 09 dining-around-the-guild (cards 2 and 3)
Done.
- The live section is already an instance of **Article Card Staggered Tall** (`658f6b02-60da-4e60-799a-540b8a036180`, page instance `81ccf045-59c6-11a6-486f-47b0cb3a75e9`), not the base component. Its Card 2 and Card 3 props existed but no elements used them.
- Added two cards inside the component definition, after card 1 in `article-card-staggered_list is-tall`, same classes as card 1 (`article-card-staggered_item is-tall` > figure `article-card-staggered_figure is-tall` > `u-image`; header `article-card-staggered_content` > h3 `text-style-caps-caption-16` + `article-card-staggered_text is-tall text-size-medium` > p).
  - Card 2 item `3c9b2e71-dfcf-4019-9bb6-dcde6aba2935` (image `27849ee0-2471-cc2c-5f39-2a523bebd30e`, caption `663e2544-393a-6c26-218f-037ab5f39411`, text `c1acc019-adcd-ca8b-bdf9-695c6dafd51e`)
  - Card 3 item `d9acc3f6-150b-6fa0-0df1-cc1ba15ddb5a` (image `977cac4d-3fe2-88e4-0d4f-a1eadd921c1d`, caption `85b9163d-a4e7-fbe9-161a-fb3fa6ca1de2`, text `ec5d9f87-2e9e-2cb0-1944-5cf598830c55`)
- Bound to props: Image 2/3 (assetId), Caption 2/3 and Text 2/3 (text), Show Image 2/3 (item visibility). Defaults give "dining 2", "dining 3", the Figma paragraph copy and library photos `6ad66fe91ce40a5a6239b8ad`, `6ad67016f8bf4846e80a023a` (image agent may swap).
- Figma stacks all three cards in the right column (no alternation), which the is-tall grid already does, so no variant switching was needed.

## 2. /neighborhood 05 little-italy pill bar
Done.
- New native section `143d2d9b-bf90-6092-c821-c838310accc1` placed directly after the Little Italy split instance `f85756aa-10b5-f49b-d8eb-53ae035c4441`: `section_tab-pills-intro` > `tab-pills-intro_stage` > `tab-pills-intro_frame` > nav `tab-pills-intro_tabs` (aria-label "Neighborhood categories") > 4 text links `tab-pills-intro_tab text-style-eyebrow-caps` (dining has `is-active` and aria-current), hrefs `#dining`, `#arts`, `#beyond-downtown`, `#services` (static). No new classes.
- The API cannot anchor a move or insert next to a component instance, so I reordered via the native corporate section: Offers Slider Split (arts) `08ea048e-...` and timeline-scatter-images Tall `f0bc6eb9-...` were moved back after the pill section. Final order verified: Little Italy, pills, arts offers, beyond downtown timeline, corporate. Instance overrides verified intact after the move.

## 3. /press category eyebrow
Done.
- Figma has no "PRESS" eyebrow on each card; it is a section header "press" (H3-CAPS) above the first press card, the same pattern as the "design" header on card 4. Set Show Header = true and Heading = "press" on card 1 instance `3e96a282-bedc-102f-9c38-4fc3df9447cb` (matches `dc6a30c0-...` "design").

## 4. Dining template 02 (navy + overhang)
Done.
- Instance `e0471a1c-0f53-a890-8460-fbddb329850e` Variant switched Olive `654bb362-...` to Blue `f30ba1e7-28c4-ef9f-30bc-31294c23f46d` (navy background, same overhang margins).
- Overhang: Blue/Olive media has margin-bottom -12.4375rem on desktop only (0 from medium), so the image hangs about 87px past the section and the next section's 5rem top padding was not enough. Fixed on `section_text-columns-info` (used only on the Dinings template, right after this split): padding-top 16rem at main, 0rem at medium. Gives about 336px from navy bottom to DRESS CODE, matching Figma. Component and other pages untouched. Applies to all four dining items.

## 5. Happenings & Stories post template article body
Done.
- Heading `910a9c2d-d204-5591-c168-1724ad77166a` (h2, `heading-style-h5`, static "the guild, a tribute portfolio hotel") prepended in `article-body_header`. Not bound to the post name: the Figma text is the hotel name, and the hero already shows the post name. The date eyebrow stays beside it (header wraps).
- New footer `019c90a0-8ab1-4d03-59d3-05ab8d7cadd9` (class `article-body_footer`, new element class in the existing article-body family: flex, centered) after the RichText, holding button `c1eddcc9-5bd4-9bc3-cb8c-db7424196d0d` (`button is-chamfer is-burgundy`, "learn more", url `/post-categories/happenings-collection`). Figma shows the button overlapping the paragraph; I placed it under the body instead.

## Designer steps for Stephen
1. **Post Categories template filter** (`🏷️ Post Categories Template`, page `6ad67d75485ab8562b6e34e0`): Pages panel > CMS Collection pages > Post Categories Template > Navigator > posts list section `d2131c51-...` > Collection List `a5c0e5b3-38b1-7fef-1453-daeccc3d156e` > Settings (gear) > Filter > + Add Filter > field "Category" > "Is Current Post Category" > Save. Without it every category page lists all posts.
2. **Post template "more around town" links** (`📰 Happenings & Stories Template`, Collection List `4048e357-...`): select card link `bcf99744-d3ed-d1a5-4a9f-c5cf373c5aff` > Settings > Link > Collection page > Current Happenings & Stories item (the API can only set `#`). Same for the Post Categories card link `a4d6f938-3965-0d25-f0f8-3d055912b2df`.
3. Optional: if the "learn more" button should point to each post's own category page, select `c1eddcc9-...` > Link > Collection page bound to the Category reference (not settable through the API).
