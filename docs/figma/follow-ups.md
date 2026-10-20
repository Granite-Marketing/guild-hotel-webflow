# Guild build follow-ups

Kept by the orchestrator; tick items as they are done. Sources: merged PRs #32, #33, #35, #36, #37, #38 and the Q012 to Q015 `plan.json` deviations on main.

## Stephen, in the Designer
- [ ] Q005: optional look at `/build-site-nav` on staging (https://the-guild-hotel-c34e71.webflow.io/build-site-nav): light nav over grey, Dark instance one screen down, hamburger opens the full-screen menu. Agent check results: `docs/figma/build-plans/Q005/staging-notes.md`.
- [ ] Q024: visual check of `/build-image-inset-single` (base instance with the rooms-individual image, and the is-small reference section) against `docs/figma/build-plans/Q024/preview-*-1440.png` and the reference crops. No rich text styling is needed.
- [ ] Q021: visual check of `/build-venue-card-fullbleed` (two component instances, the home and dining snap groups, is-tall and is-left) against `docs/figma/build-plans/Q021/preview-*.png` and the reference crops; check the clip-path chamfers on the frame and tab bar, and the is-left list row height and divider bleed.
- [ ] V02-Q021: visual check of the three new instances on `/build-venue-card-fullbleed` (Media Center variant after the dining snap group, Venue Card Fullbleed Tall after is-tall, Venue Card Fullbleed Left after is-left) against the reference sections above them; not published or seen yet.
- [ ] V02-Q021: delete the old is-tall and is-left reference sections once the new instances check out (keep the two snap group sections; they are not components).
- [ ] V02-Q021: add list props to Venue Card Fullbleed Left (Show List, List Item 1 to 3 text and link) and bind them; the classifier blocked `create_prop`, so the rows are static.
- [ ] V02-Q021: update the Venue Card Fullbleed description (still says is-tall and is-left are plain sections); the classifier blocked `set_component_metadata`. Text is in `docs/figma/build-plans/Q021/plan.json` `v02`.
- [ ] Q021: home/11 heading break: Figma breaks "rooms" / "& suites"; add a line break if the real font wraps differently.

- [ ] Q019: visual check of `/build-map-feature` (base instance plus the is-image-bg and is-centered reference sections) against `docs/figma/build-plans/Q019/preview-*-1440.png`. No rich text styling is needed.
- [ ] V02-Q019: visual check of the two new instances on `/build-map-feature` (Map Feature Image Bg after the is-image-bg section, Map Feature Centered after the is-centered section) against the reference sections above them; not published yet (the classifier blocked the staging publish).
- [ ] V02-Q019: delete the old is-image-bg and is-centered reference sections once the new instances check out.

- [ ] Q012: set the email input placeholder to `*Email` on the newsletter form (the Data API rejects `placeholder`).
- [ ] Q012: mark the background image decorative, so future library alt text does not apply to it.
- [ ] Q012: visual check of `/build-cta-booking-newsletter` against `docs/figma/build-plans/Q012/preview-base-1440.png` and the home/18 crop (nothing was compared yet).
- [ ] Q013: visual check of `/build-footer-links` in the Designer or on staging after a publish (no screenshots were taken).
- [ ] Q013: after a publish, check the live markup: the trailing span in the legal line, `role` on the `ul`, and decorative alt on the background image.
- [ ] Q014: upload the Zuma wordmark (`figma/vectors/group-270989670-416x101-250-1958.svg`) and set it on the dining-zuma reference hero logo slot.
- [ ] Q014 (V02): visual check of the Blue Button and Burgundy Button variant instances (last two on `/build-hero-fullbleed-centered`) in the Designer. Staging computed styles already match the reference buttons (fill, cream label, 194px min-width).
- [ ] Q014 (V02): delete the old reference sections (is-text-dark, is-left, blue and burgundy dining heroes) on `/build-hero-fullbleed-centered` once the variant instances are approved. Keep the combo classes until no page uses them.
- [ ] Q014: visual check of `/build-hero-fullbleed-centered` was done on 2026-10-20 and looked good; re-check once the Zuma logo and the blue and burgundy wide buttons are in.
- [ ] Q015: visual check of `/build-faq-accordion` in the Designer (fonts and the static chevron are the known differences).
- [ ] Q016: visual check of `/build-script-intro-centered` against `docs/figma/build-plans/Q016/preview-*-1440.png` (rotated Morello heading, building drawing, stamp below the text, back link). Nothing was compared yet.
- [ ] Q017: visual check of `/build-split-image-text-light` (component plus eight reference sections) against `docs/figma/build-plans/Q017/preview-*.png` and the reference crops; tune the tan stamp offset once Morello and Gatch load.
- [ ] Q017: upload the history stamp SVG (`figma/vectors/group-263x263-228-7875.svg`) and set it on the tan reference section stamp image.
- [ ] Q017: mark the blue (dining-zuma) and tan (history) reference images decorative if their library alt should not apply; the plan alt is empty.
- [ ] C02: review the 6 draft sample posts (3 per category) and their invented dates; nothing is published.
- [ ] K02: visual spot-check the 15 `🧱 <component>` draft pages for the new classes (padding, `text-size-large`, `text-style-script`, chamfer outline buttons).
- [ ] Q012, Q013, Q014, Q015: delete each build page (`/build-<component>`) once its component sits on the real pages, and delete the probe pages `x01-probe` and `x01-probe-b`.
- [ ] Q012, Q013, Q014, Q015: no rich text styling is needed for any of these four components.
- [ ] Q018: visual check of `/build-gallery-mosaic-captioned` in the Designer against `docs/figma/build-plans/Q018/preview-base-1440.png` and the meetings-collection/09 crop (nothing was compared yet; tiles show Webflow's placeholder image).
- [ ] Q022: visual check of `/build-form-split-script-contact` (base instance plus the is-tall reference section) against `docs/figma/build-plans/Q022/preview-base-1440.png`, `preview-is-tall-1440.png` and the crops. Inputs show no placeholder text yet.
- [ ] Q022: set the placeholder on every form input to its label (the Data API rejects `placeholder`); the labels are in each input's aria-label and in `plan.json` instances.
- [ ] Q022: decide whether to turn the form block, details and links into component slots (the Data API cannot: no slot prop type, and moving an element into a ComponentSlot fails). Without slots, every instance shows the photoshoot form.
- [ ] Q016, Q020, Q021, Q022: visual check of `/build-script-intro-centered`, `/build-image-trio-text`, `/build-venue-card-fullbleed` and `/build-form-split-script-contact` in the Designer.
- [x] Q025: visual check of `🧱 article-card-staggered` (`/build-article-card-staggered`) against the plan previews and crops in `docs/figma/build-plans/Q025/`: base instance, is-right, is-right with "culture", is-tall. Recheck spacing with the real Sackers and Gatch fonts. Stephen approved on 2026-10-20 ("all look pretty good").

- [ ] Q042: visual check of `/static-template` on staging (https://the-guild-hotel-c34e71.webflow.io/static-template): Dark Site Nav, privacy policy section, CTA Booking Newsletter, Footer Links. Agent check: `docs/figma/build-plans/Q042/staging-notes.md`.
- [ ] Q040: visual check of `/gallery` on staging (https://the-guild-hotel-c34e71.webflow.io/gallery): Site Nav, hero, filter grid with the sticky tag pill, two placeholders, FAQ, CTA, footer. Agent screenshots: `docs/figma/build-plans/Q040/`.

## Decisions for Stephen
- [ ] Q040: gallery/02 is grey placeholders in Figma. The page uses 10 library photos tagged design, rooms, dining, wellness, guests and amenities as stand-ins. Decide the real photo set, and whether the grid becomes a CMS collection list with a category field (the filter already matches CMS-bound category names). The active tag shows the tab-pills underline; Figma shows only full opacity.
- [ ] Q005: day and night switch has no specified behaviour (built as static controls, day active, hidden below 992px); booking URL for book now (Book link prop defaults to `#book`); experiences links to /arts until an experiences or happenings page exists; Shield nav states (236:8363, 236:8498) are unused in Figma and not built.
- [ ] Q024: `is-small` cannot switch on an image-inset-single instance (same decision as Q014); it sits as a plain section on the build page. The plan's open questions also stand: is rooms-individual/04 a background video, which image fills the small variant on happenings-indiv and blog-indiv, should the rooms image bind to a CMS field, and the mobile aspect ratio.
- [ ] Q021: open questions OQ2 (wellness and meetings intro moves from Q023 into this snap section) and OQ3 (legal and corporate as a static stack) are still on their defaults; confirm before those pages are built.

- [x] Q019: `is-image-bg` and `is-centered` cannot switch on a Map Feature instance (same as Q014). Options: Webflow component variants, or separate components for the two variants. Done in V02 as separate components Map Feature Image Bg and Map Feature Centered (the heading classes differ, which a variant cannot swap).
- [ ] Q019: the base map art shows Atlanta streets and Hotel Clermont; confirm it ships or supply a San Diego map. Also the four Directions URLs, and whether to export the masked history illustration (node 236:8254).

- [x] Q014: per-instance variants (`is-text-dark`, `is-left`, button colours `is-blue`, `is-burgundy`) cannot switch on a component instance. Options: Webflow component variants, or a second component for the dark-text heroes (and separate ones for the button colours). Done as component variants (V01, V02): Text Dark, Left, Blue Button, Burgundy Button.
- [ ] Q012: the book now URL (`#` for now), the newsletter provider with success and error copy, and whether the Bonvoy logo should link.
- [ ] Q013: the 16 placeholder hrefs, the Studio circa URL, the responsive proposal, and `section role=contentinfo` versus `footer`.
- [ ] Q013: footer background image is shared with the book-your-escape section above it in Figma. Options: keep two separate crops, or one continuous image decided at page level.
- [ ] Q014: button links are a `#` placeholder because the plan has no booking URL. Supply the URL, or keep `#`.
- [ ] Q015: Link Block trigger (Enter works, Space does not) versus finding another way to get a native button. Options: accept the Link Block, or add Space handling in the accordion module.
- [ ] Q015: `accordion_*` classes are shared by the module contract. Confirm they stay shared rather than being renamed to `faq-accordion_*`.
- [ ] Q016: per-instance variants `is-tall`, `is-wide` and `is-bottom` cannot switch on a component instance (same decision as Q014). Until then they sit as plain sections on the build page.
- [ ] Q016: plan open questions still stand: arts/02 green heading (`is-accent`?), the back-link target on every room page (`/rooms`), and the responsive scale.
- [ ] Q013: sections with an extra "other dining options" slider (Group 270990062) belong to the dining venue page entries, not the footer. Confirm.
- [ ] Q018: who supplies the 40 gallery images (4 per instance), and should the dining and legal/corporate galleries take them from CMS (Q027, Q028) instead of the Image props?
- [ ] Q018: show the "A Landmark Reimagined" feature title on the meetings instance (Show Feature Title is off by default)? Also confirm the real gallery headings for dining-gardenterrace, dining-lobbybar and dining-poollounge (Figma copies "zuma gallery").
- [ ] Q022: which form fields are required (all are optional now), plus the plan's open questions: submit destination, contact page media, social URLs.
- [ ] Q025: collection pages as one Collection List (alternating left and right with an even-item rule) or five static sections as Figma draws them (plan open question 1). The component holds one card; V02: is-right is now the Right variant and is-tall the separate component Article Card Staggered Tall.
- [ ] Q025: card image source (CMS image field on collection pages, manual upload for the neighborhood dining cards) and whether the neighborhood header should stick (plan open questions 4 and 5).

## Agent follow-ups
- [ ] Q005: the site has no custom code yet. Ship the bundle (navToggle is enabled in `src/index.ts`) via a release and the Site Settings footer tag, with GSAP, ScrollTrigger and Lenis CDN tags before it, then remove the page-only head and footer code from `🧱 site-nav`.
- [ ] Q005: page sessions insert Site Nav (`fc94d1a2-3399-4de0-e836-0233a6c86cdf`) as the first body child on every page, Dark variant on static-template and contact; then remove the build page. Only one Site Nav per page: navToggle binds the first `[data-nav]` set.
- [ ] Q005: 21 classes and 2 combos created (`docs/figma/build-plans/Q005/plan.json` `build`). Add an `aria-current` state for the current page link if wanted.
- [ ] Q024: place image-inset-single on rooms-individual and arts (base, arts uses asset `6ad66fff134731ad1b927c11` with alt "Palm leaves in front of the Guild Hotel sign at night"), and is-small on happenings-indiv and blog-indiv once the variant and image decisions are made, then remove the build page.
- [ ] Q021: four empty combos were created (`docs/figma/build-plans/Q021/plan.json` `build.classesCreated`). When placing on real pages, copy the home or dining snap section for each snap group (wellness and meetings need their tab labels and intro), and use the Venue Card Fullbleed component for the legal and corporate static cards, then remove the build page.
- [ ] Q014: the Zuma wordmark is now uploaded (`6ad74d2ed0e5a6a8fc1be09e`, by Q021); set it on the dining-zuma reference hero logo slot.

- [ ] Q017 (V02): colour variants, compact and the four base layouts are now component variants (ids in `docs/reference/webflow-ids.md`). Page entries insert the instance and set the Variant prop by id as `type: "string"`, plus the visibility booleans each layout needs (Second image for Edge and Wide, Stamp for Tan, Header off for Compact).
- [ ] Q017 (V02): `/build-split-image-text-light` was un-drafted so the webflow.io staging publish includes it; set it back to draft (or delete it) before any custom-domain publish.
- [ ] Q017 (V02): visual check of the eight variant instances on `/build-split-image-text-light`, each placed right after its old reference section (heading text "v02 <variant>").
- [ ] Q017 (V02): delete the eight old reference sections on `/build-split-image-text-light` once the variant instances are verified (Stephen's yes; the Q017 combos stay until no page uses them).
- [ ] Q017 (V02): arts/05 needs an h3-size heading on an Edge instance; the variant keeps h4. Options: an Edge Large variant with heading-style-h4 variant styles at the h3 values, or accept h4.
- [ ] Q017: eight empty combo paths were created (listed in `docs/figma/build-plans/Q017/plan.json` `build.classesCreated`); `.button.is-link.text-style-caps-caption-16` sits under the shared `button` and may be reused by other families.
- [x] K02 (via Q014): create the missing combos `.button.is-chamfer.is-wide.is-blue` and `.button.is-chamfer.is-wide.is-burgundy` with the 12.125rem min-width, then update the dining reference buttons to use them. Done in V02 (empty combos; the min-width comes from `.button.is-chamfer.is-wide`).
- [ ] Q015: `.heading-style-h2.text-weight-normal` and the four accordion combos exist but are empty; decide whether they need styles or can stay empty, and promote `.heading-style-h2.text-weight-normal` to a shared combo if other families need it.
- [ ] Q015: add the chevron custom code `.accordion_header.is-active .accordion_icon { transform: rotate(0deg); }` to site custom code.
- [ ] Q015: change the accordion module so the first item is open on load.
- [x] Q019 (from the K02 check): bind the `map-feature_pin` colour to the new Tan variable (Colors/Tan #906E58). Done in the Q019 build.
- [ ] Q019: `.map-feature_content.is-image-bg` background is still a raw `#906E58`; bind it to Colors/Tan too.
- [ ] Q019: place Map Feature on home, dining-collection, rooms-collection and rooms-individual (base), and decide how the is-image-bg (meetings, neighborhood, legal, corporate) and is-centered (history) sections ship, then remove the build page.
- [ ] K02 cleanup: replace six family image classes that duplicate `u-image` (`hero-fullbleed-centered_image`, `split-image-text-light_image`, `gallery-mosaic-captioned_image`, `image-trio-text_image`, `venue-card-fullbleed_image`, `image-inset-single_image`) with `u-image` on the components.
- [ ] K02 cleanup: merge the four identical logo classes (`cta-booking-newsletter_logo`, `footer-links_logo-image`, `hero-fullbleed-centered_logo`, `venue-card-fullbleed_logo`) into one shared logo class.
- [ ] K02: `accordion_item` border-bottom colour is a literal `rgba(38, 33, 24, 0.3)` and not bound to Neutral Darkest; rebind if Webflow allows an alpha variable.
- [x] Q020: apply `is-left` to `image-trio-text_header`, `_list` and `_figure` as well as the section. Done in the Q020 build reference sections.
- [x] Q020: `is-left` and `is-left` + `is-offset` are plain reference sections, not instances. V02: now the separate components Image Trio Text Left and Image Trio Text Left Offset (no style-only variants fit; see `docs/figma/build-plans/Q020/plan.json` `v02`).
- [ ] V02-Q020: visual check of the Image Trio Text Left and Left Offset instances on `/build-image-trio-text` in the Designer (computed styles on staging already match the reference sections at 1440).
- [ ] V02-Q020: delete the old `is-left` and `is-left` + `is-offset` reference sections (`5141da76-b14c-77b7-cfa3-601014da1ddf`, `a4806fe0-dc51-3988-2b80-2c56fdf9c6fc`) on `/build-image-trio-text` after the visual check.
- [ ] V02-Q020: the Left Offset instance's card texts are line-broken paragraphs; the instance prop API takes plain text only. Page sessions (legal/11, corporate/11) build the `ul` bullets inside the Item Text props with the element builder (see the Q020 rich text notes).
- [ ] V02-Q020: base Image Trio Text keeps heading-style-h3 (wellness); the dining group-dining instances want heading-style-h4. Decide whether dining gets its own component or accepts h3.
- [ ] Q020 (Designer): set the Rich Text nested list styling on `image-trio-text_item-text` (list `padding-left` about 1rem, bullet colour inherit), which the MCP cannot do.
- [ ] Q020: the reference-section figures have no image (grey #D9D9D9 placeholders). Add Image elements when the legal, corporate and dining photos arrive, and check `object-position` on the wellness middle photo (Figma crop).
- [x] Q014: add the per-instance variant mechanism once the decision above is made (component variants or a second component), and set the missing wide button combos on it.
- [ ] Q012: upload and record any remaining assets in `figma/assets.json` and `webflow-ids.md` (Bonvoy `6ad744318e4b52f5c4d49ec6` and Tribute Portfolio `6ad744312406f6ae5126bc5f` are already recorded).
- [ ] Q015: fix `validate-plan.mjs` failing on main with "proposedShared needs why" (K01 removed the `why` fields).
- [ ] Q013: place the Footer Links component on the 24 pages (left for a later step), then remove the build page.
- [ ] Q022: four empty combos were created (listed in `docs/figma/build-plans/Q022/plan.json` `build.classesCreated`).
- [ ] Q022: place the component on guidelines, press, contact, legal and corporate (and the is-tall section on meetings-collection) once the slot decision is made, then remove the build page.
- [ ] Q016: place `script-intro-centered` on the 9 pages (home uses `is-tall` once variants are decided), then remove the build page. happenings-indiv/02 and blog-indiv/02 still need their own entry.
- [ ] Q021: add `data-eager` (and `loading=eager`) to the Venue Card Fullbleed component image; the wellness, meetings, legal and corporate tab groups are not built yet.
- [ ] Q022: add `target=_blank` to the social links in the form-split-script-contact component.
- [x] Q020: the is-left reference sections have no `data-image-stack-collapse` attributes; add them where the A02 animation applies. V02: the plan keeps the attributes on base instances only; the Left components have none, by design.
- [ ] Q023 (Designer): add the `panels` slot to the tab-pills-intro frame (before the nav) and, if wanted, swap the four fixed tabs for a `tabs` slot. The Data API has no slot props.
- [ ] Q023: the `media` variant (is-media on component, header, stage, frame and tabs) is two plain reference sections on the build page. Apply the V01 route, then place the component on wellness-collection and meetings-collection with the Q021 venue cards as panels.
- [x] Q023 (Designer): visual check of `/build-tab-pills-intro` (base instance and both is-media sections). Stephen confirmed it looks fine on 2026-10-20.
- [ ] Q023: three empty combos were created (listed in `docs/figma/build-plans/Q023/plan.json` `build.classesCreated`).
- [ ] Q023: place the base component on press, happenings-collection and blog-collection (Show tab 4 off, tab links `#press` etc.), then remove the build page. Plan open questions still stand (scroll-spy or filters for base tabs, sticky pill, console warning on base instances, meetings tab copy, mobile tab overflow).
- [ ] Q025: four empty combos were created (`docs/figma/build-plans/Q025/plan.json` `build.createdCombos`), including the shared `.heading-style-h3.text-weight-normal`, which other families can reuse.
- [ ] Q025: place Article Card Staggered on happenings-collection and blog-collection, and copy the is-tall reference section to neighborhood/09, then remove the build page. Remove the #d9d9d9 figure fill once real images are bound.
- [x] Q026 (Designer): visual check of `🧱 timeline-scatter-images` (base instance and `is-tall` reference section) against `docs/figma/build-plans/Q026/preview-*.png` and the guidelines/04 and neighborhood/07 crops; nothing was published. Checked by Stephen in the Designer on 2026-10-20: looks good.
- [ ] Q026 (Designer): the `items` slot could not be created through the API. Convert `timeline-scatter-images_list` into a slot (or decide on static items plus component variants) so instances can add, reorder and re-size items; the is-tall instance on neighborhood needs this.
- [ ] Q026: no photos exist for either instance; add Image elements (`u-image timeline-scatter-images_image`, needs the empty combo) when the collaborator and location photos arrive, and decide whether the guidelines list becomes a CMS collection list (plan open question 1).
- [ ] Q026: thirteen empty combos were created (listed in `docs/figma/build-plans/Q026/plan.json` `build.createdCombos`).
- [ ] Q026: place the component on guidelines (base) and neighborhood (`is-tall`, once the slot or variant decision is made), then remove the build page.
- [ ] Q042: the privacy copy is native elements (paragraphs, `ul`), not a Rich Text element, because rich text child styling (h2 size, list indent) cannot be set headlessly. If the client must edit the legal copy, either style a Rich Text in the Designer and move the copy into it, or bind the page to the `🧑‍⚖️ Legal Corporates` collection. The six contents lines are plain text, not anchor links; only the first legal section exists in the design.
- [ ] Q042: the Site Nav "Book link" keeps its default `#book` on `/static-template`; set the real booking URL site-wide when known.
- [ ] V02-Q016: visual check of the Tall, Wide and Bottom variant instances at the end of `/build-script-intro-centered` against reference sections S2 to S4 (staging).
- [ ] V02-Q016: delete the old is-tall, is-wide and is-bottom reference sections on `/build-script-intro-centered` after the visual check (keep the combos until no page uses them).
- [ ] Q036: visual check of `/history` on staging (notes and screenshots in `docs/figma/build-plans/Q036/`).
- [ ] Q036: enable `historyStickyYear()` in `src/index.ts` (slot G) and release a bundle; `/history` carries the A04 attributes (`data-history-sticky-year*` on history/05, `data-history-collapse*` on history/06) but the module is still commented out, so the badge stays on 1924 and the gallery does not collapse.
- [ ] Q036: replace the Q009 (history/09 card-carousel-header-left, is-compact) and Q008 (history/11 offers-slider-split) placeholders (`section_placeholder`, `data-placeholder="Q009"` / `"Q008"`) once those sliders exist.
- [ ] Q036: every one-off image on `/history` (history/03 portrait, the 14 timeline figures, the 4 landmark figures) is an empty `figure` with a #d9d9d9 fill and `data-image-placeholder`, because Figma has only grey rectangles. Add `u-image` Image elements (with `object-fit: cover` for the collapse items) when the archive photos arrive, then drop the fill; the history/07 gallery mosaic images are empty for the same reason.
- [ ] Q036: the timeline uses a simplified rows layout (figures left, right or centred per row) instead of the free scatter in Figma, and the sticky badge sits at viewport centre rather than at each year's own position. Review against the history/05 crop.
- [ ] Q036: the George Marston (Tan) stamp is off (`Stamp visible` false): `figma/vectors/group-263x263-228-7875.svg` is not uploaded and the stamp image is not an instance prop. Upload it and place it on the component.
- [ ] Q036: the Map Feature Centered image is the unmasked rectangular jpg (`6ad66fed1ce40a5a6239b98e`); the Figma mask hides the inset key map and compass.
- [ ] Q036 (component level, seen on `/history`): the faq-accordion instance publishes with all six answers open and underlined questions (Figma shows only item 1 open), and the Gallery Mosaic Captioned tiles show a broken-image icon when no image prop is set. Fix in the Q015 and Q018 components, not per page.
- [ ] Q040: enable `galleryFilter()` in `src/index.ts` slot E and release; `/gallery` carries `[data-gallery-filter]` now. Until then the tags do nothing on staging.
- [ ] Q040: replace the two `section_placeholder` sections on `/gallery` (`data-placeholder` Q008 offers-slider-split, Q009 card-carousel-header-left) with the slider instances once built.
- [ ] Q040: the page brief listed gallery/02 as a Q010 gallery-mosaic-captioned `is-compact` placeholder; it was built as the one-off `section_gallery-all` instead so the A05 filter could be wired. If Q010 later ships a filterable mosaic, swap it in and drop the family.
- [ ] Q040: alt text for the 10 gallery photos (`/asset-metadata`); the images inherit library alt.
- [ ] Q040: the faq-accordion instance on `/gallery` shows the component's default questions (no props); gallery/05 uses the same room questions.
- [ ] Q040: on mobile the gallery tag pill is wider than the screen and scrolls sideways (`tab-pills-intro_tabs` overflow-x auto) with no scroll cue; consider wrapping or a fade edge.
- [ ] Q033: visual check of `/rooms` on staging (notes and screenshots in `docs/figma/build-plans/Q033/`).
- [ ] Q033: two marked placeholders on `/rooms` (`section_placeholder`, `data-placeholder`): Q008 offers-slider-split `is-cream` (rooms-collection/09) after the map, and Q007 room-list-hover-preview (rooms-collection/13, id `all-rooms`, target of every "see all rooms" link) after the footer. Replace each when its entry is built; Q007 may become a modal, in which case point the links at it with `data-modal-open`.
- [ ] Q033: the quiz (three `section_rooms-collection-quiz` steps, `data-quiz-step` 1 to 3, buttons carry `data-quiz-option`) is static: all three steps show stacked, option buttons link to `#`, and the selected state is a fixed class. A quiz module (step switching, selection, filtering the recommendations) needs a brief; "back to the quiz" points at `#rooms-quiz`.
- [ ] Q033: the room grid shows the guests and size line and the view more pill on every card; Figma reveals them on hover (card 4). Hover reveal needs CSS or a small module. The guests and size values on cards 1 to 3 repeat card 4 ("4 guests", "52 m² size") until the Rooms CMS exists; the guests and size icons (figma/vectors frame-32x32 and group-270990163) are not placed.
- [ ] Q033: room cards link to the static `/rooms-individual` page; rebind to Rooms CMS items once that collection exists (see `docs/figma/cms-proposal.md`). Card images carry `data-hover-scale="1.05"`, which needs `imageHoverScale` enabled in `src/index.ts` (slot D).
- [ ] Q033: the hero has no image (Figma shows a grey placeholder); set the Image prop and Show Image when the rooms hero photo arrives. Quiz step 2 and 3 images inherit the library alt text (empty or generic); run `/asset-metadata`.
- [ ] Q033 staging check (shared components, not fixed on the page): faq-accordion shows all six answers open with underlined questions (Figma: first open, no underline; check the accordion module and `a.accordion_header` text-decoration); script-intro-centered Bottom is about 210px taller than Figma; Hero Fullbleed Centered is 900px vs 1009px; Map Feature tagline wraps to two lines; CTA Booking Newsletter is missing the "*Email" label; one WOFF2 font is rejected by the browser (OTS parsing error). Details in `docs/figma/build-plans/Q033/staging-notes.md`.
- [ ] Q033: quiz option text is 16px (the shared `button is-chamfer` size); Figma uses H5-CAPS at 20px. Height was fixed to 70px through `rooms-collection-quiz_option`.

## Q031 Home (2026-10-20)
- [ ] Q031: visual check of `/` on staging (https://the-guild-hotel-c34e71.webflow.io/) against the home section crops. Agent results: `docs/figma/build-plans/Q031/staging-notes.md`.
- [ ] Q031: enable `scrollEnlargeSnap()` (slot B), `imageTrailHover()` (slot D) and `imageStackCollapse()` (slot G) in `src/index.ts`, release a tag and update the footer script URL. Home now carries all three attribute sets (A01 on the 04 to 09 snap section, A03 on `home-art-stories_media`, A02 inside Image Trio Text). Left out of the Q031 PR because other page sessions share `src/index.ts`.
- [ ] Q031: replace the two `section_placeholder` sections (home/13 retail, home/16 offers and packages, `data-placeholder="Q008"`) with Q008 offers-slider-split once it exists.
- [ ] Q031: home/14 trail images are four static links to `/arts`. Bind them to the Arts CMS collection (`href="/arts#{{slug}}"`, Collection List items carrying `data-image-trail-hover-item`) once that collection exists; the Arts page items need `id` bound to the slug.
- [ ] Q031: home/01 hero has no media (Figma shows a grey slot, likely a video). Add the hero image or `backgroundVideo` source when the asset arrives, and turn Show Image on.
- [ ] Q031: home/03 Split (Olive) shows the component's placeholder image; the design has no photo yet.
- [ ] Q031: Site Nav "Book link" and the hero button use `#book`; set the real booking URL site-wide when known.
- [ ] Q031: alt text is empty on the five snap panel photos (`venue-card-fullbleed_image`) and the four trail images; run `/asset-metadata` for the Home assets.
- [ ] Q031 (V02-Q017 owner): on Home the Olive Split renders as a full 730px olive block with no cream bands or image overhang, the "uncover our history" CTA is dark on olive (Figma cream), and the empty Image prop publishes `src=""` (broken icon). Fix in the component or its Olive variant; set the image when a photo arrives. Staging notes: `docs/figma/build-plans/Q031/staging-notes.md`.
- [ ] Q031 (Q015 owner): faq-accordion publishes with all six items expanded; Figma shows only the first open.
- [ ] Q031 (Q012 owner): the CTA newsletter email field has no "*Email" placeholder (Designer-only, see the Q022 placeholder gotcha).
- [ ] Pages: two global `section_placeholder` styles exist (ids 34766799 and 9333d82a, created by Q040 and Q036 in parallel). Keep one, repoint the other's elements, delete the duplicate.

## Q027 Dinings template (2026-10-20)
- [ ] Q027: visual check of the Dinings template on staging with sample items `https://the-guild-hotel-c34e71.webflow.io/dining/dining-zuma` (quote band on, intro image set) and `/dining/dining-gardenterrace` (quote band off) against the Q027 section crops.
- [ ] Q027: the template uses one look for all four venues: hero Burgundy Button and intro split Olive. Zuma's design uses the Blue Button hero, the Zuma logo and the Blue, media-left split; a variant cannot be bound to a CMS field. Options: a Switch per look with two conditionally shown instances, or accept one look.
- [ ] Q027: hero has no background image or logo; add `hero-image` and `hero-logo` Image fields and bind the Image and Logo props when the photos arrive. The intro split image is bound to `intro-image` (set on Zuma only); the other three render an empty img.
- [ ] Q027: the "other dining options" section is a static stand-in for a card carousel (`data-placeholder="Q009"`, arrows not built). Card labels are bound to `other-dining-label-1..3`, identical on every item, so each venue lists itself; decide whether to replace the cards with a Collection List of the other Dinings items (filter: not the current item) once Q009 lands. Card images and links are empty.
- [ ] Q027: Zuma's dress code section has an extra "discover zuma" link; the template shows only "browse the menu" (`#`). Add a link field per venue for the menu and the venue site.
- [ ] Q027: quote band press logo slot is an empty figure (`data-image-placeholder`); upload `figma/vectors/logo-3-1-385x90-306-260.svg` and add a `press-logo` Image field.
- [ ] Q027: gallery heading is static "gallery" (Figma copies "zuma gallery" on every venue); gallery images, group dining images and the image pair photos are placeholders; reservation, enquire and menu links are `#`.
- [ ] Q027: all four Dinings items were switched from draft to ready so the staging publish renders them. Switch them back if they should not publish with the next site publish.

- [ ] V02-Q025: build cards 2 and 3 inside Article Card Staggered Tall (`658f6b02-60da-4e60-799a-540b8a036180`): two `article-card-staggered_item is-tall` blocks in the list, each with figure `is-tall` > Image `u-image`, header `article-card-staggered_content` > h3 `text-style-caps-caption-16` and `article-card-staggered_text is-tall text-size-medium` > p. Bind them to the Card 2 and Card 3 props (Image, Show Image as visibility, Caption, Text; ids in `docs/figma/build-plans/Q025/plan.json` `v02`). The element builder inside the definition was denied by the auto-mode classifier in the V02 session.
- [ ] V02-Q025: visual check of the Right, Right with culture and Tall instances on `/build-article-card-staggered` in the Designer (the page is a draft, so staging returns 404; the published CSS for Right matches the is-right combo).
- [ ] V02-Q025: delete the old is-right, is-right with culture and is-tall reference sections (`7c3e1186-1454-9c66-deb0-48f9bd90e5eb`, `e5321bc8-1e6d-2af8-4cca-d799d593168a`, `3c2ba3b7-47fa-4b0e-2bfe-a32ad505af29`) after the visual check and after Tall has its three cards.

## Q008 offers-slider-split (2026-10-20)
- [ ] Q008 (R00): enable `offersSliderSplit()` in `src/index.ts` (slot C, after `swiperSliders()`), and add the Swiper 12 CSS (head) and JS (footer, before the bundle) to the site custom code if R00 has not; then release a tag. Until then staging shows the first slide only, with dead arrows.
- [ ] Q008: replace the `section_placeholder[data-placeholder="Q008"]` sections with Offers Slider Split instances: `/` home/13-retail (Blue, retail props and Image 1 + Show image 1) and home/16 (Base); `/rooms` rooms-collection/09 (Base); `/history` history/11 (Base); `/gallery` gallery/03 (Base). Instance props per page: `docs/figma/build-plans/Q008/plan.md`. Pages built later place the instance directly.
- [ ] Q008: real offer content (headings, text, links, photos) for slides 1 to 5; Figma shows one slide per instance, so slides 3 to 5 repeat placeholder copy. Hide unused slides with Show slide N.
- [ ] Q008: visual check of `/build-offers-slider-split` in the Designer and on staging against the crops (agent notes in `docs/figma/build-plans/Q008/staging-notes.md`).
- [ ] Q008: home/13 retail crop shows a cream cross logo over the photo; confirm whether it is part of the photo asset or an overlay to add.
