# Guild punch list (wave 4)

Built 2026-10-20 from `docs/figma/follow-ups.md` (now superseded; add new items here). Staging: https://the-guild-hotel-c34e71.webflow.io. Ids come from `docs/reference/webflow-ids.md` and the per-entry plans in `docs/figma/build-plans/`. Tick `- [ ]` when done; fix sessions touch only their own `###` heading.

## Summary

| Group | Count | Who |
|---|---|---|
| (a) Stephen in the Designer | 27 | Stephen |
| (b) Agent-fixable (Data API or code) | 142 | fix sessions, one per `###` heading |
| (c) Real content needed | 22 | Stephen supplies |
| (d) Decisions | 33 | Stephen |

Group (b) headings in recommended fix order. Four at a time; the first three batches are independent of one another, so any four can run together. The earlier a heading sits, the more others benefit from it (runtime first, then shared components, then pages).

1. Site code and release
2. FAQ Accordion (component and `accordion.ts`)
3. Split Image Text Light (component)
4. Hero Fullbleed Centered (component)
5. Form Split Script Contact (component)
6. Tab Pills Intro (component)
7. Venue Card Fullbleed (components)
8. CTA Booking Newsletter and Footer Links (components)
9. Map Feature, Gallery Mosaic, Image Trio Text, Article Card Staggered, Timeline Scatter (small component fixes)
10. Site Nav and modals (component and `modals.ts`)
11. Home
12. Rooms
13. Dining
14. Gallery
15. History
16. Wellness
17. Meetings
18. Neighborhood
19. Guidelines
20. Contact
21. Arts
22. Press
23. Rooms individual
24. Static Template
25. Dinings Template (CMS)
26. Legal Corporates Template (CMS)
27. Post Categories Template (CMS)
28. Happenings & Stories Template (CMS)
29. Shared styles and docs

Verified against staging on 2026-10-20 before writing: every page has one Site Nav and the Footer Links; no empty `src=""`; site scripts are live (v1.1.1 URL in the footer, GSAP 3.15.0 host, Swiper 12); `/contact` has no `h1`; the newsletter email placeholder is empty; forms on `/meetings`, `/guidelines`, `/contact`, `/press` and `/legal-corporate/legal` still carry `placeholder="Example Text"`; `cardCarouselHeaderLeft()` and `roomListHoverPreview()` are not enabled in `src/index.ts`.

---

## (a) Stephen in the Designer

Page ids are in `docs/reference/webflow-ids.md`. All of these are things the Data API cannot do.

### Input placeholders
- [ ] Form inputs on `/meetings`, `/guidelines`, `/contact` (Q043), `/press` and `/legal-corporate/legal` (all `form-split-script-contact` instances, component `2f0cac24-8156-b0d7-520c-f5128139d6b0`): select each input and replace "Example Text" with the field label (labels are in each input's `aria-label`). Click path: Designer > page > select input > Element settings (gear) > Placeholder. Fixing it once in the component definition (Components panel > Form Split Script Contact > Edit) covers every instance.
- [ ] CTA Booking Newsletter (component `916e4ffc-007b-3572-a686-946c6645b2e8`): set the email input placeholder to `*Email`. Same click path; appears on every page.

### Collection List filters and collection page links
- [ ] Post Categories Template (`6ad67d75485ab8562b6e34e0`): Collection List `a5c0e5b3-38b1-7fef-1453-daeccc3d156e` > Settings > Filter > add "Category equals Current Post Category". Until done, both category pages list all six posts.
- [ ] Same template: card Link Block `a4d6f938-3965-0d25-f0f8-3d055912b2df` > Link settings > Collection page > Current Happenings & Stories (link is `#` now).
- [ ] Happenings & Stories Template (`6ad67d759914af41be21de84`): more-posts Collection List `4048e357-02ea-e0d3-0a14-0d95030910f9` > Filter > "Category equals Current Post's Category".
- [ ] Same template: card Link Block `bcf99744-d3ed-d1a5-4a9f-c5cf373c5aff` > Link settings > Collection page > Current Happenings & Stories.

### Rich text child styling
- [ ] Happenings & Stories Template: select the RichText `4b816f3a-c88d-4ef9-31bf-2c33aa413a3f` (class `article-body_rich-text`) > style "All Heading 2s/3s", "All Lists", "All Links" with the site type scale if posts will use them.
- [ ] Image Trio Text components (`eae1d08c-c012-be1b-bafe-4ca88d995c14`, Left `46897c76-730a-1978-c362-54be3e026510`, Left Offset `f6f42b26-759f-d2b6-03de-516393880a37`): on `image-trio-text_item-text` set the nested list styling (list padding-left about 1rem, bullet colour inherit).
- [ ] Static Template `/static-template` (`6ad66fd802cc199b55b924be`): only if the client edits legal copy: style a Rich Text element and move the privacy copy into it, or bind the page to the Legal Corporates collection (see decision D-legal-copy).

### Slots
- [ ] Tab Pills Intro (`30192280-e01e-6f0a-638c-42d4686bee29`): add a `panels` slot before the nav and optionally a `tabs` slot. Click path: Components panel > Edit component > select the frame > Add slot. Unblocks a real snap-group component (Home, Dining, Wellness currently plain sections).
- [ ] Timeline Scatter Images (`144b7315-3604-2419-b046-c09d180f1163`) and Tall (`33e949df-43c2-4806-b73e-d403ed483051`): convert `timeline-scatter-images_list` into an `items` slot (needed for the Neighborhood Tall instance).
- [ ] Form Split Script Contact: make the form block, details and links into slots so each page can carry its own form (photoshoot, contact, RFP, press enquiries, legal RFP). Pages affected: `/meetings`, `/legal-corporate/*`, `/press`, `/guidelines`.

### Component props and metadata blocked by the classifier
- [ ] Venue Card Fullbleed Left (`100e1eab-d304-3568-6d93-6fa936f8c0af`): add list props (Show List, List Item 1 to 3 text and link) and bind the three rows.
- [ ] Venue Card Fullbleed: update the component description (text in `docs/figma/build-plans/Q021/plan.json` `v02`).

### Custom code
- [ ] Site Settings > Custom Code > Footer: after the v1.1.2 release (see Site code and release), change the bundle URL to `@v1.1.2`.
- [ ] Site Settings > Custom Code > Head: add `.accordion_header.is-active .accordion_icon { transform: rotate(0deg); }` (Q015 chevron).
- [ ] `🧱 site-nav` page (`6ad769cad74aa30b7c564578`) footer code still holds duplicate GSAP, Lenis and an inline navToggle; clear it (or delete the page, below).

### Delete pages and reference sections
- [ ] Delete the build pages once nothing links to them: `/build-cta-booking-newsletter` `6ad712be4a1db356ac74034b`, `/build-footer-links` `6ad712c0de3165cd9f83bb50`, `/build-hero-fullbleed-centered` `6ad712c2faaaa1926dd00419`, `/build-faq-accordion` `6ad712c2faaaa1926dd004e3`, `/build-script-intro-centered` `6ad712c471aebc47c94f1c20`, `/build-split-image-text-light` `6ad712c53e506fddaa973858`, `/build-gallery-mosaic-captioned` `6ad712c63e506fddaa973910`, `/build-map-feature` `6ad712c79096987033862a20`, `/build-image-trio-text` `6ad712c8f7fb71b6e78048f9`, `/build-venue-card-fullbleed` `6ad712c8f7fb71b6e780492e`, `/build-form-split-script-contact` `6ad712c99096987033862bfc`, `/build-tab-pills-intro` `6ad712caa15308564d06f1a8`, `/build-image-inset-single` `6ad712cc8669ab49cd2c7290`, `/build-article-card-staggered` `6ad712cd74b1a594d93c88aa`, `/build-timeline-scatter-images` `6ad712cefaaaa1926dd00d80`, `/build-site-nav` `6ad769cad74aa30b7c564578`, `/build-offers-slider-split` `6ad77f7b41c3b044b01140a4`, `/build-overlay-detail-panel-modal` `6ad7885b7f5d5d50523f997f`, `/build-card-carousel-header-left` `6ad78814d14363c9008ddeff`, `/build-room-list-hover-preview` `6ad7b5d7fc756e91b34c370c`, plus probe pages `x01-probe` and `x01-probe-b`. Click path: Pages panel > hover page > Settings > Delete. At minimum set each back to Draft before any custom-domain publish (several were un-drafted for staging).
- [ ] Delete the old reference sections after the matching variant instance checks out (each page above): wellness and meetings is-media on tab-pills-intro; is-tall and is-left on venue-card-fullbleed; is-tall `328c638d-c47a-4194-5885-3dbab2040954` on form-split-script-contact; is-image-bg and is-centered on map-feature; is-small `69dad370-ed49-de04-cfe5-af6e70602539` on image-inset-single; `5141da76-b14c-77b7-cfa3-601014da1ddf` and `a4806fe0-dc51-3988-2b80-2c56fdf9c6fc` on image-trio-text; the eight on split-image-text-light; is-text-dark, is-left, blue and burgundy on hero-fullbleed-centered; is-tall, is-wide and is-bottom on script-intro-centered; is-tall `ff99cbf2-2677-0282-70e3-bb267dce160e` on timeline-scatter-images; is-right x2 and is-tall (`7c3e1186-1454-9c66-deb0-48f9bd90e5eb`, `e5321bc8-1e6d-2af8-4cca-d799d593168a`, `3c2ba3b7-47fa-4b0e-2bfe-a32ad505af29`) on article-card-staggered. Keep combos until no page uses them. Moot if the whole build page is deleted above.

### Visual checks (Designer or staging)
- [ ] `/` home vs home crops (notes `docs/figma/build-plans/Q031/staging-notes.md`), including the home/11 heading break ("rooms" / "& suites").
- [ ] `/rooms` (`docs/figma/build-plans/Q033/`), `/dining` (Q032), `/gallery` (Q040), `/history` (Q036), `/wellness` (Q034), `/meetings` (Q035), `/neighborhood` (Q044, mainly 08 and the dialog 16), `/guidelines` (Q037), `/contact` (Q043), `/arts` (Q041, mainly 06 and the Dark dialogs), `/press` (Q039), `/rooms-individual` (Q038, 03 and 07), `/static-template` (Q042).
- [ ] Dinings Template: `/dining/dining-zuma` and `/dining/dining-gardenterrace` (Q027).
- [ ] Legal Corporates Template: `/legal-corporate/legal` and `/corporate`, desktop and mobile (Q028).
- [ ] Post Categories (`/post-categories/happenings-collection`, `/blog-collection`) and Happenings & Stories (`/happenings-stories/locals-night-at-rodeo-bar`), after the filters and links above are set.
- [ ] Build-page variant instances (skip if the build pages are deleted unchecked): Hero Fullbleed Centered Blue and Burgundy Button; Venue Card Fullbleed (Media Center, Tall, Left); Form Split Script Contact Tall; Tab Pills Intro Media x2; Map Feature Image Bg and Centered; Image Trio Text Left and Left Offset; Image Inset Single Small; Script Intro Centered Tall, Wide, Bottom; Split Image Text Light eight variants; Article Card Staggered Right, Right with culture, Tall; Timeline Scatter Images Tall; Gallery Mosaic Captioned; FAQ Accordion; Site Nav; Offers Slider Split; Card Carousel Header Left.
- [ ] Draft sample posts (C02): review the six sample posts (3 per category) and their invented dates.
- [ ] 15 `🧱 <component>` pages (K02): spot-check new classes (padding, `text-size-large`, `text-style-script`, chamfer outline buttons). Moot if the build pages are deleted.

---

## (b) Agent-fixable (Data API or code)

Each `###` heading is one session. Do not touch another heading's page or component.

### Site code and release
Repo only (`src/`, `tests/`, `docs/reference/site-scripts.md`, release). Verified: `cardCarouselHeaderLeft` and `roomListHoverPreview` are absent from `src/index.ts`; `v1.1.1` is pushed and live.
- [ ] Enable `cardCarouselHeaderLeft()` in `src/index.ts` slot C (after `swiperSliders()`), release `v1.1.2`, push the tag, curl the jsDelivr URL (carousels on History, Gallery, Contact, Rooms individual, Happenings posts, Dinings stand-in are dead until then).
- [ ] Enable `roomListHoverPreview()` in `src/index.ts` slot D (after `modals()`, `galleryFilter()` is already wired) in the same release (R01); hover over a room in the `/rooms` all-rooms dialog must change the preview.
- [ ] `modals.ts`: add Enter and Space handling on non-link triggers so the Neighborhood timeline items (Coronado Beach, dialog 16) work from the keyboard.
- [ ] `tests/visual/example.spec.ts` times out waiting for a visible `section` on Home; replace with a real spec or delete.
- [ ] `docs/figma/build-plans/Q015/validate-plan.mjs` fails with "proposedShared needs why" (K01 removed the `why` fields); fix the validator or the plan.
- [ ] `docs/reference/site-scripts.md` shows GSAP 3.13.0 from jsDelivr; Webflow rewrote the tags to `cdn.prod.website-files.com/gsap/3.15.0/`. Update the doc to match what is live.
- [ ] `docs/reference/webflow-ids.md` has duplicate rows (Room Detail x2, Press x2 in Pages; Legal Corporates Template and Post Categories Template each twice in CMS template pages) and a stale blank-note row each; merge to one row each, keeping the assembled-by notes.
- [ ] `/build-site-nav` has a second `[data-nav="header"]` (Dark instance) that never opens; expected on the build page only. No code change; closes when the page is deleted.

### FAQ Accordion
Component `064f3089-65e4-65ec-6f9a-dc5cb4ab8ee7`, `src/utils/accordion.ts`, classes `accordion_*`. Staging confirms six `accordion_item` per page; Q031, Q033, Q036 and Q040 report all six answers open with underlined questions.
- [ ] Open only the first item on load (Figma) and remove the underline on `a.accordion_header` (text-decoration none).
- [ ] Set `aria-expanded="false"` on every header at init in `accordion.ts`.
- [ ] Decide-then-do: Space key support if D-accordion-keys is approved (Link Block trigger currently answers Enter only).
- [ ] `.heading-style-h2.text-weight-normal` and the four accordion combos are empty; give them styles or delete them; promote `.heading-style-h2.text-weight-normal` to a shared combo if used elsewhere.
- [ ] `accordion_item` border-bottom is a literal `rgba(38, 33, 24, 0.3)`; rebind to Neutral Darkest if Webflow allows an alpha variable.
- [ ] Give the component question and answer props so `/gallery` (room questions), `/contact` and others can carry their own copy (Q040: `/gallery` shows the default questions).

### Split Image Text Light
Component `663131a8-3362-867e-25ef-28b6d3d209a2` and eight variants (ids in webflow-ids.md).
- [ ] Olive variant on Home: renders as a full 730px olive block with no cream bands or image overhang, the "uncover our history" CTA is dark on olive (Figma cream), and the empty Image prop publishes a broken image (default image now set; recheck).
- [ ] Add an Edge Large variant (h3-size heading, `heading-style-h4` variant styles at the h3 values) for arts/05, or note acceptance of h4 (see D-edge-heading).
- [ ] Tune the tan stamp offset once Morello and Gatch load; place the history stamp SVG `figma/vectors/group-263x263-228-7875.svg` (upload it first) on the Tan variant and Neighborhood/History instances.
- [ ] `.button.is-link.text-style-caps-caption-16` sits under the shared `button`; review reuse.

### Hero Fullbleed Centered
Component `f91dcf8c-5c66-6cf4-32b6-a2f2427f7bfa`.
- [ ] Hero is 900px vs 1009px in Figma (Q033 staging check); set the section height to match at 1440.
- [ ] Set Show Image false on instances that want a plain hero, or set Image on the eight instances inheriting the default (`6ad670147e3d6550932e0fac`): `/rooms`, `/gallery`, `/dining` (Text Dark, no overlay), Dinings Template and the build page. `/history` already overrides Show Image to false (`39f63008-e245-a805-3e0b-fd98f3dd4087`). Needs the hero photo (c) first; until then confirm each page intentionally shows the stand-in.
- [ ] Logo prop has no default (Show Logo false); once the Zuma wordmark (`6ad74d2ed0e5a6a8fc1be09e`) is set on the dining-zuma hero, check the logo slot renders.
- [ ] Add a heading-tag prop (h1 by default) so pages can choose the tag (feeds the Contact h1 fix).

### Form Split Script Contact
Component `2f0cac24-8156-b0d7-520c-f5128139d6b0`; variants Tall `c284c9dc-42be-882d-5aca-03608bebfc95`, Contact `cb87b4cf-bba7-94cc-e25e-670072dbadea`.
- [ ] Add a heading-tag prop (the Contact page has no `h1`; staging confirms 0 `<h1>` on `/contact`).
- [ ] Add link props for instagram and facebook (no URLs today) and `target=_blank` on the social links.
- [ ] Contact variant: labels sit above each line instead of in-line placeholders; remove `is-labelled` once Designer placeholders are set (see (a)).
- [ ] Make required flags explicit once D-form-fields is decided.
- [ ] Meetings RFP and Legal RFP field sets need a form variant if slots are not done (Meetings: first name, last name, email, phone, company, event date, number of people, start and end time, additional details; Legal: first and last name, law firm, team size, check-in and check-out dates, special requirements). Depends on D-form-slot.

### Tab Pills Intro
Component `30192280-e01e-6f0a-638c-42d4686bee29`, Media variant `9bd0d616-a2cc-7ffb-c508-bf993eecf81b`.
- [ ] On mobile the tab pill is wider than the screen (Q040 `/gallery`, Q034 `/wellness` clips "fitness center" at 390): wrap or add a fade edge on `tab-pills-intro_tabs`.
- [ ] Tab pill sits about 50px above the frame bottom on Wellness (Figma lower): adjust the Media variant's bottom offset.
- [ ] Tabs on `/press` link to `#press`, `#design`, `#community` with no targets; add ids on the target sections or change the hrefs (page edit goes in the Press group, component default only here).
- [ ] The `is-media` combos must stay while Wellness uses them (Q034); do not remove when cleaning the build page.

### Venue Card Fullbleed
Components `bbccdbb5-db17-02a1-a0cc-43ce0f5da371`, Tall `f8269db7-7b82-27f1-dd64-8dd069d633f6`, Left `100e1eab-d304-3568-6d93-6fa936f8c0af`.
- [ ] At 375px the `venue-card-fullbleed_tabs` row runs past the viewport (Q032); fix overflow and wrap at `small` and `tiny`.
- [ ] Add `data-eager` and `loading=eager` to the component image.
- [ ] Logo prop has no default (off by default); fine unless an instance turns it on.
- [ ] Merge the four identical logo classes (`cta-booking-newsletter_logo`, `footer-links_logo-image`, `hero-fullbleed-centered_logo`, `venue-card-fullbleed_logo`) into one shared class. Touches four components, so run this under Shared styles and docs, not here.

### CTA Booking Newsletter and Footer Links
Components `916e4ffc-007b-3572-a686-946c6645b2e8` and `14efd120-8e4c-efe3-75b9-396e4792ed73`.
- [ ] CTA: the "*Email" label is missing (Q033); add a visible label as a stopgap until the Designer placeholder is set.
- [ ] Footer: check live markup for the trailing span in the legal line, `role` on the `ul`, and decorative alt on the background image; fix any miss.
- [ ] Footer: the 16 placeholder hrefs stay `#` until D-footer-links; replace the ones whose target pages now exist (rooms, dining, wellness, meetings, gallery, arts, history, press, contact, neighborhood, guidelines).
- [ ] Mark the CTA and footer background images decorative in the asset library (`PATCH /assets` is safe; do not touch CMS image fields).

### Map Feature, Gallery Mosaic, Image Trio Text, Article Card Staggered, Timeline Scatter
Small independent component fixes; touch only the named components.
- [ ] Map Feature (`8e90ff20-1ed1-43a7-edce-89b7ea10c487`): bind `.map-feature_content.is-image-bg` background (raw `#906E58`) to the Colors/Tan variable; tagline wraps to two lines vs one in Figma (Q033).
- [ ] Map Feature Centered (`d6e2f6bc-b2b0-8951-1f0a-59832380519b`): History uses the unmasked rectangular jpg (`6ad66fed1ce40a5a6239b98e`); the Figma mask hides the inset key map and compass. Export the masked illustration (node 236:8254) once D-map-art is decided.
- [ ] Gallery Mosaic Captioned (`560e1b31-d612-0921-8773-8f9de2e2b06f`): tiles show a broken-image icon when no image prop is set; give the four Image props default images.
- [ ] Image Trio Text (`eae1d08c-c012-be1b-bafe-4ca88d995c14`): Left Offset card texts are plain text; page sessions build `ul` bullets inside Item Text with the element builder (applies to Legal Corporates template, listed there).
- [ ] Article Card Staggered Tall (`658f6b02-60da-4e60-799a-540b8a036180`): build cards 2 and 3 (two `article-card-staggered_item is-tall` blocks, figure `is-tall` > `u-image`, header > h3 `text-style-caps-caption-16`, text `article-card-staggered_text is-tall text-size-medium`) and bind them to the Card 2 and Card 3 props (ids in `docs/figma/build-plans/Q025/plan.json` `v02`). Image 2 and 3 defaults exist but the cards are not built.
- [ ] Article Card Staggered: remove the `#d9d9d9` figure fill once images are bound.
- [ ] Timeline Scatter Images: thirteen empty combos; delete the unused ones (listed in `docs/figma/build-plans/Q026/plan.json` `build.createdCombos`).
- [ ] Script Intro Centered (`bdff66b3-92d9-e1e3-dbc0-86a28e384c9b`): Bottom variant is about 210px taller than Figma on `/rooms` (Q033); adjust the Bottom variant spacing.

### Site Nav and modals
Component `fc94d1a2-3399-4de0-e836-0233a6c86cdf`, Overlay Detail Panel Modal `44cccc51-37cb-2526-e426-133987071983`, Room List Hover Preview `a9d40053-f1b0-f862-ee0a-4f021e1933a9`.
- [ ] Light nav text is low contrast over the cream intro on Wellness (Q034) and the Offers Slider label collides with the nav text; fix nav text colour on the cream band or switch Wellness to the Dark variant (the Wellness page edit sits in the Wellness group).
- [ ] Add an `aria-current` state for the current page link if wanted.
- [ ] Add `data-modal-open` triggers on a "dining" menu entry and the "book" button for the Dining (Image Bg) and Booking (Burgundy) dialogs once D-booking-url is decided.
- [ ] Overlay Detail Panel Modal: add a link prop on the eyebrow so Arts can link the "by eva struble" byline to the artist dialog.
- [ ] Room List Hover Preview: "back to the quiz" should scroll to `#rooms-quiz` after closing; the dialog hides the nav (z-index 1000), see D-dialog-nav.

### Home
Page `6ad64060ae8eac6d7b7c4241`. Notes `docs/figma/build-plans/Q031/`.
- [ ] home/14 image trail: four static links to `/arts`; bind to the Arts CMS collection once it exists (blocked, see D-arts-cms) or point each at `/arts#<artwork-id>`.
- [ ] Alt text is empty on the five snap panel photos (`venue-card-fullbleed_image`) and the four trail images; run `/asset-metadata` for Home.
- [ ] Offers sliders hold placeholder copy on slides 1 to 5 (retail has real copy); hide unused slides with Show slide N until real copy arrives.
- [ ] Snap group (home/04 to 09) is plain sections with `data-scroll-enlarge-snap`; leave until the Tab Pills Intro panels slot exists, then convert.
- [ ] Hero button and Site Nav Book link use `#book`; set the booking URL after D-booking-url.

### Rooms
Page `6ad66fd5f8bf4846e809dbee`. Notes `docs/figma/build-plans/Q033/`.
- [ ] Quiz (three `section_rooms-collection-quiz` steps, `data-quiz-step` 1 to 3, buttons `data-quiz-option`) is static: write a `roomsQuiz` module (step switching, selected state, recommendations) after a brief (see D-quiz); "back to the quiz" points at `#rooms-quiz`.
- [ ] Room grid: hover reveal of the guests and size line and view-more pill (Figma card 4) by CSS or a small module; place the guests and size icons (`figma/vectors` frame-32x32 and group-270990163); cards 1 to 3 repeat card 4 values ("4 guests", "52 m²").
- [ ] Quiz option text is 16px; Figma uses H5-CAPS 20px.
- [ ] Card images carry `data-hover-scale="1.05"` and `imageHoverScale` is enabled; confirm hover works on staging after the overlay `pointer-events: none` fix (reported fixed by Q007).
- [ ] Quiz step 2 and 3 images and hero inherit library alt; run `/asset-metadata`.
- [ ] Offers slider (rooms-collection/09) placeholder copy; hide unused slides until real copy.

### Dining
Page `6ad66fd476d24ed37ac4c5cb`. Notes `docs/figma/build-plans/Q032/`.
- [ ] Solana coffee has no `🍴 Dinings` item so its "discover more" button has no link; add a CMS item or set a URL (needs D-solana).
- [ ] Rename the "garden terrace" tab/panel to "lobby terrace" or keep per D-venue-name.
- [ ] Venue photo alt text is empty; run `/asset-metadata`.
- [ ] Dining snap group renders statically until the bundle runs (now live); verify panels and tabs switch on staging and close.
- [ ] Hero: Text Dark was switched to Base; confirm readable on staging.

### Gallery
Page `6ad66fd65794075272b95584`. Notes `docs/figma/build-plans/Q040/`.
- [ ] Alt text for the 10 gallery photos (`/asset-metadata`).
- [ ] FAQ accordion shows the component defaults; set room questions via props once FAQ props exist (FAQ Accordion heading).
- [ ] `section_gallery-all` is a one-off instead of Q010; keep unless Q010 ships a filterable mosaic.
- [ ] Verify the filter tags now filter on staging (`galleryFilter()` is enabled and live); record the result.

### History
Page `6ad66fd276d24ed37ac4c52f`. Notes `docs/figma/build-plans/Q036/`.
- [ ] Timeline uses a simplified rows layout and the sticky badge sits at viewport centre instead of at each year; review against the history/05 crop and tune.
- [ ] Stamp for George Marston (Tan) is off (Stamp visible false); upload the SVG and turn it on.
- [ ] history/07 gallery mosaic images and archive photo slots hold stand-ins (c).
- [ ] History Map Feature Centered image unmasked (see Map Feature group).
- [ ] Verify the sticky year and collapse (`historyStickyYear()`, `imageStackCollapse()`) on staging now they are live.

### Wellness
Page `6ad66fd7735773f253406791`. Notes `docs/figma/build-plans/Q034/`.
- [ ] Four snap panel "discover more" buttons have no link; point at anchors or pages (needs D-wellness-links).
- [ ] Panel image alt: review with `/asset-metadata`.
- [ ] Mobile: tab pill clips "fitness center" at 390 (fixed in Tab Pills Intro); nav text contrast over the cream intro (Site Nav group).

### Meetings
Page `6ad66fd96684c3e22ea4d417`. Notes `docs/figma/build-plans/Q035/`.
- [ ] The Request for Proposal section uses the Tall variant but shows the photoshoot fields and "Example Text" placeholders (11 on staging); needs the form slot or RFP variant (Form Split Script Contact group).
- [ ] "book your space" links to `/contact`; point it at the RFP section id once the section can carry one.
- [ ] Only council boardroom has a dialog; lobby terrace and 1 america plaza "discover more" buttons have no link.
- [ ] Key features at 390 is 2714px tall (431px figures); use smaller figures or a two-up layout at `small` after client review.
- [ ] Tab names (council boardroom, lobby terrace, 1 america plaza) vs Figma (council boardroom, terrace, conference center): confirm (D-meetings-tabs).

### Neighborhood
Page `6ad66fdb02cc199b55b926ba`. Notes `docs/figma/build-plans/Q044/`.
- [ ] Corporate CTA "corporate & legal packages" links to `/meetings`; repoint to `/legal-corporate/corporate`.
- [ ] neighborhood/05 burgundy pill nav (dining, arts, beyond downtown, services) is not built; build it as an in-page sticky nav if approved (D-neighborhood-nav).
- [ ] Coronado Beach dialog image is the retail placeholder asset; swap when photo arrives (c).
- [ ] Timeline uses Timeline Scatter Images Tall without the items slot; convert after the slot exists.

### Guidelines
Page `6ad66fd44c7f57894534ada5`. Notes `docs/figma/build-plans/Q037/`.
- [ ] Form shows "Example Text" placeholders (11 on staging); handled by Form Split Script Contact once slots/variant exist.
- [ ] Timeline Scatter Images (base) holds placeholder photos; decide whether the list becomes a CMS collection (D-guidelines-cms).
- [ ] Feature figure has a `data-image-placeholder`; real collaborator photo (c).

### Contact
Page `6ad66fd8e0b7968459e18f22`. Notes `docs/figma/build-plans/Q043/`.
- [ ] No `h1` on the page; set the heading tag once the Form Split Script Contact prop exists.
- [ ] "privacy policy" links to `/static-template`; keep until a privacy page exists (D-privacy-page).
- [ ] Carousel shows a static clipped row until `v1.1.2` ships (Site code and release).
- [ ] Form submit destination and notification address are unset (site form settings; needs D-form-fields).

### Arts
Page `6ad66fd7ba96f2e53726a2eb`. Notes `docs/figma/build-plans/Q041/`.
- [ ] Artwork dialogs 03 to 10 carry draft copy and hotel photos; replace per catalogue (c) or build an Artworks CMS collection with the CMS dialog pattern (`docs/reference/modal-setup.md`, D-arts-cms).
- [ ] Gallery wraps centred; Figma bleeds off both edges (D-arts-gallery).
- [ ] "by eva struble" byline plain text (Site Nav and modals group adds the prop).
- [ ] Arts image-inset-single (base, asset `6ad66fff134731ad1b927c11`, alt "Palm leaves in front of the Guild Hotel sign at night"): confirm placed; place if missing.

### Press
Page `6ad66fd5735773f253406642`. Notes `docs/figma/build-plans/Q039/build.md`.
- [ ] Press cards show hotel photos, not publication logos; upload National Geographic, Forbes and Architectural Digest SVGs (`figma/vectors/`) and add a logo overlay (image prop and Show boolean) to Article Card Staggered, or use logo-on-photo images (touches Article Card Staggered, so do after that component's group).
- [ ] Enquiries form: organization and expected publish date fields (form variant/slot).
- [ ] Tab links `#press`, `#design`, `#community` need target ids on the sections.
- [ ] "more of the guild" carousel arrows dead until `v1.1.2`.

### Rooms individual
Page `6ad66fd5f8bf4846e809dc45`. Notes `docs/figma/build-plans/Q038/build.md`.
- [ ] "view floorplan" links to `#`; attach a floorplan PDF asset (c).
- [ ] Discover Other Rooms cards all link to `/rooms`; point each at its room page once rooms exist as items (D-rooms-cms).
- [ ] Review alt text on the two hero images with `/asset-metadata`.
- [ ] Carousel dead until `v1.1.2`.

### Static Template
Page `6ad66fd802cc199b55b924be`. Notes `docs/figma/build-plans/Q042/`.
- [ ] Six contents lines are plain text, not anchor links; only the first legal section exists in the design. Add anchors if more sections are written (c).
- [ ] Site Nav "Book link" keeps `#book`; set after D-booking-url.
- [ ] Dark Site Nav confirmed on staging (data-nav present); no action.

### Dinings Template (CMS)
Page `6ad67d7416e13e66c2b76107`, collection `6ad67d7316e13e66c2b760d7`. Notes `docs/figma/build-plans/Q027/`.
- [ ] Add `hero-image` and `hero-logo` Image fields, bind the Hero Image and Logo props (Zuma wordmark `6ad74d2ed0e5a6a8fc1be09e`); needs photos (c).
- [ ] Intro split image bound to `intro-image`; the other three items now have stand-ins, replace later.
- [ ] Zuma's look (Blue Button hero, Blue split, media-left) vs one look for all four: two conditionally shown instances (Switch field) or accept (D-zuma-look).
- [ ] Press quote band: upload `figma/vectors/logo-3-1-385x90-306-260.svg` and add a `press-logo` Image field (the slot is an empty figure, staging shows `data-image-placeholder`).
- [ ] Add a menu link field and a venue-site link field per venue (Zuma has an extra "discover zuma" link); menu link is `#` today.
- [ ] Gallery heading is static "gallery"; add a `gallery-heading` field. Reservation, enquire and menu links are `#`.
- [ ] "Other dining options" is the Q009 stand-in `86d57348-f224-7d1f-8ca3-1011769f1eb2` with labels bound to `other-dining-label-1..3`: convert to a Card Carousel Header Left instance or a Collection List filtered to other venues (D-dining-cards); staging still shows `data-placeholder="Q009"`.
- [ ] All four Dinings items were switched from draft to ready for the staging publish; switch back if not wanted (D-dinings-status).

### Legal Corporates Template (CMS)
Page `6ad67d74943352af06e37850`, collection `6ad67d74943352af06e37843`. Notes `docs/figma/build-plans/Q028/`.
- [ ] Static sections (key features, packages, why teams choose, form details, map) use the legal wording on both items; move to CMS fields when corporate copy exists (c).
- [ ] legal/04 hover image (`2e81693530e933aa43a6c48a794614cca7c8822d`) is not built; add with the image-hover interaction.
- [ ] The four venue cards' body text is Figma lorem; only council boardroom has a dialog; other three "discover more" buttons have no target.
- [ ] RFP form shows "Example Text" and the "Shoot Details" heading (staging: 11 placeholders); needs the form variant (Form Split Script Contact group).
- [ ] Left Offset card texts: build the `ul` bullets inside Item Text with the element builder (legal/11, corporate/11).
- [ ] Offers Slider Split holds placeholder copy.
- [ ] Both Overlay Detail Panel Modal wirings (dialog `council-boardroom`) open from the council boardroom card; confirm on staging.

### Post Categories Template (CMS)
Page `6ad67d75485ab8562b6e34e0`, collection `6ad67d74485ab8562b6e34da`. Notes: `docs/figma/build-plans/Q029` section in follow-ups.
- [ ] tab-pills-intro tabs link to `#dining`, `#culture`, `#conferences` with no targets; wire as Finsweet CMS filter on Topic or remove (D-post-tabs).
- [ ] Category `hero-heading` values are lowercase and render uppercase via style; add an image and intro field to Post Categories if the two pages should differ.
- [ ] Hero text and tab-pills copy are Figma lorem.
- [ ] Offers Slider Split placeholder copy.
- [ ] After the Designer filter and link (a): visual check at 1440 and mobile.

### Happenings & Stories Template (CMS)
Page `6ad67d759914af41be21de84`, collection `6ad67d759914af41be21de7e`. Notes `docs/figma/build-plans/Q030/build.md`.
- [ ] Sections 03 (inset) and 04 (split) use static photos (courtyard `6ad66fee735773f253407335`, lounge `6ad670147e3d6550932e0fac`); add `inset-image` and `highlight-image` fields and bind.
- [ ] Add the burgundy "learn more" button from Figma section 02 if a destination is decided (D-post-learnmore).
- [ ] Hero eyebrow shows Topic and article eyebrow shows Date; confirm (D-post-eyebrow).
- [ ] Offers Slider Split placeholder copy.
- [ ] Staging shows no FAQ and no `accordion_item` on this template; confirm that matches the Figma and note it.

### Shared styles and docs
Style and doc hygiene across the site; run last, as it touches many components.
- [ ] Two global `section_placeholder` styles exist (ids `34766799` and `9333d82a`); keep one, repoint the other's elements, delete the duplicate (only Dinings Template still uses `data-placeholder`).
- [ ] K02 cleanup: replace six family image classes that duplicate `u-image` (`hero-fullbleed-centered_image`, `split-image-text-light_image`, `gallery-mosaic-captioned_image`, `image-trio-text_image`, `venue-card-fullbleed_image`, `image-inset-single_image`) with `u-image`.
- [ ] K02 cleanup: merge the four identical logo classes (`cta-booking-newsletter_logo`, `footer-links_logo-image`, `hero-fullbleed-centered_logo`, `venue-card-fullbleed_logo`) into one shared logo class.
- [ ] Delete empty combos nobody uses once their pages are gone (Q017 eight, Q021 four, Q022 four, Q023 three, Q025 four); lists in each `plan.json` `build.classesCreated` or `createdCombos`.
- [ ] Browser rejects one WOFF2 font with an OTS parsing error (Q033 staging check); identify which of Sackers Gothic `6ad67b3ff294f472f82ca72c`, Gatchtest `6ad67b1b1c2db33882637dce` / `6ad67b211c2db33882637e72`, Morello Pen `6ad67b4109d470f005e31d2b` and re-upload a clean file.
- [ ] `/asset-metadata` run for all stand-in photos (alt text is generic; real photos replace them later).

---

## (c) Real content needed

- [ ] Hero photo and video for Home (home/01 slot, likely video), Rooms, Dining, Gallery, Wellness, Guidelines and Meetings (stand-ins now).
- [ ] Rooms: per-room photography (only seven photos for ten rooms), real guests and size for the nine rooms other than cozy courtyard queen, floorplan PDF.
- [ ] Offers: real offer copy, links and photos for slides 1 to 5 on Home, Rooms, History, Gallery, Dining, Neighborhood, Wellness and the templates.
- [ ] History: archive photos (portrait history/03, 14 timeline figures, 4 landmarks, gallery mosaic) and the George Marston stamp placement.
- [ ] Arts: real artwork catalogue (titles, artists, years, dimensions, mediums, lorem replaced) for dialogs 03 to 10; the artist bio for arts/12.
- [ ] Press: publication logos (National Geographic, Forbes, Architectural Digest SVGs from `figma/vectors/`), press-form fields.
- [ ] Meetings: council boardroom photo, three key-feature card photos, four gallery tiles, hero; real room names for the tabs.
- [ ] Neighborhood: real photos for hero, splits, timeline, corporate cards, dining cards, gallery, Coronado Beach dialog.
- [ ] Legal and corporate: client copy for corporate (the Figma pages are identical), venue card body text (lorem now), package and why-teams-choose wording.
- [ ] Dinings: hero photos and logos per venue, press logo for the quote band (British Vogue on Zuma), menu and venue URLs, gallery headings for gardenterrace, lobbybar and poollounge, group dining images.
- [ ] Happenings and blog: real posts with real dates, per-post inset and highlight images.
- [ ] Wellness: link targets or pages for the four snap-panel buttons; panel alt copy.
- [ ] Gallery: real photo set (10 stand-ins today, 40 images across Gallery Mosaic instances) and alt text.
- [ ] Booking URL (Site Nav Book link, hero buttons, CTA), newsletter provider with success and error copy.
- [ ] Social URLs (instagram, facebook), Bonvoy link target, Studio circa URL, 16 footer hrefs.
- [ ] Contact: form submit destination and notification address, privacy page copy.
- [ ] Map: a San Diego map if the Atlanta-streets art does not ship, four Directions URLs.
- [ ] Static template: remaining legal sections beyond the first.
- [ ] Tab labels and venue names confirmed with the client: lobby terrace vs garden terrace, meetings tabs, quiz option copy.
- [ ] Taxonomy for Arts filter (painting, photography, sculpture, artists) and Gallery tags.
- [ ] Hero copy and tab-pills copy for the Post Categories pages (Figma lorem) and offer copy.
- [ ] Alt text decisions for decorative images: Q012 background, Q017 blue and tan reference images, Q013 footer background.

---

## (d) Decisions

IDs are referenced from group (b) lines.

- [ ] D-orphan-pages (client question, 2026-10-21): the Figma design links to none of these pages from any nav, footer or page: Legal (`/legal-corporate/legal`), Corporate (`/legal-corporate/corporate`), the Happenings and Blog category pages (`/post-categories/*`) and the posts (`/happenings-stories/*`). Ask the client whether each is a direct landing page (email, sales, ads) or should be findable, and from where (the menu has "discovery" and "experiences" groups that may be meant for them). Staging today: corporate is linked from the footer and the Neighborhood "corporate & legal packages" button (both added by us, not in Figma); legal, categories and posts have no inbound links. Once decided, also rename the CMS templates and slugs to names a client can find (Designer, since the API cannot rename collections).
- [ ] D-booking-url: the book now URL (Site Nav, hero buttons, CTA all `#book` or `#`), and whether the Bonvoy logo links.
- [ ] D-newsletter: newsletter provider and success and error copy.
- [ ] D-footer-links: the 16 placeholder hrefs, Studio circa URL, responsive proposal, `section role=contentinfo` vs `footer`.
- [ ] D-footer-bg: footer background image shared with the book-your-escape section: two separate crops or one continuous page-level image.
- [ ] D-accordion-keys: accept the Link Block trigger (Enter only) or add Space handling in `accordion.ts`.
- [ ] D-accordion-classes: keep `accordion_*` shared or rename to `faq-accordion_*`.
- [ ] D-sitenav: day and night switch behaviour (static, day active, hidden below 992px today); experiences link target (`/arts` until a page exists); Shield nav states (236:8363, 236:8498) not built.
- [ ] D-dialog-nav: Room List Hover Preview and other dialogs sit above the nav at z-index 1000; keep the nav visible as in Figma or leave.
- [ ] D-image-inset: rooms-individual/04 background video?; image for small variant on happenings and blog; bind rooms image to a CMS field; mobile aspect ratio.
- [ ] D-snap-intro: Q021 open questions OQ2 (wellness and meetings intro moves into the snap section) and OQ3 (legal and corporate as a static stack) stay on defaults; confirm.
- [ ] D-venue-name: tab "garden terrace" vs Figma "lobby terrace".
- [ ] D-solana: solana coffee needs a Dinings item or a URL.
- [ ] D-map-art: ship the Atlanta street map or supply a San Diego one; export the masked history illustration (node 236:8254)?
- [ ] D-edge-heading: Edge Large variant for arts/05 or accept h4.
- [ ] D-script-intro: arts/02 green heading (`is-accent`?), back-link target on every room page (`/rooms`), responsive scale.
- [ ] D-dining-trio: dining group-dining Image Trio Text wants `heading-style-h4`; separate component or accept h3.
- [ ] D-form-fields: which form fields are required, submit destination, contact page media, social URLs.
- [ ] D-form-slot: turn the form block, details and links into slots (Designer) or build form variants (affects Meetings, Legal, Press, Guidelines).
- [ ] D-gallery-source: who supplies the 40 gallery images, and whether Dining and Legal Corporates galleries come from CMS.
- [ ] D-gallery-titles: show the "A Landmark Reimagined" title on Meetings; real gallery headings for gardenterrace, lobbybar, poollounge.
- [ ] D-gallery-cms: Gallery grid as a CMS collection list with a category field, and the real photo set; active tag shows the tab-pills underline vs Figma full opacity.
- [ ] D-article-cards: Collection pages as one Collection List (alternating with an even-item rule) or five static sections; card image source; whether the neighborhood header sticks.
- [ ] D-quiz: quiz module brief (step switching, filtering) and the Figma H5-CAPS 20px option size.
- [ ] D-arts-cms: Artworks CMS collection with the CMS dialog pattern vs ten static instances; Arts CMS collection for the Home image trail; edge-to-edge gallery (D-arts-gallery).
- [ ] D-rooms-cms: Rooms CMS collection so cards, the all-rooms dialog and rooms-individual bind to items.
- [ ] D-zuma-look: one look for all four Dinings or a Switch per look.
- [ ] D-dining-cards: Dinings Template "other dining options" as Card Carousel instance or filtered Collection List.
- [ ] D-dinings-status: leave the four Dinings items ready (published) or return to draft.
- [ ] D-post-tabs: Post Categories tabs filter by Topic (Finsweet) or link elsewhere.
- [ ] D-post-eyebrow and D-post-learnmore: hero eyebrow shows Topic, article eyebrow shows Date (Figma lorem); add the burgundy "learn more" button and its target.
- [ ] D-legal-copy: Static Template privacy copy native or Rich Text, or bound to Legal Corporates.
- [ ] D-privacy-page, D-neighborhood-nav, D-wellness-links, D-meetings-tabs, D-guidelines-cms: contact "privacy policy" target, neighborhood/05 pill nav, wellness button targets, meetings tab names, guidelines list as CMS.
- [ ] D-sample-posts: keep, edit or delete the six sample posts (C02) and their invented dates before any custom-domain publish.

---

## Appendix: dropped

Dropped: ticked `[x]` lines (Q025, Q026, Q023 checks, Q019 pin colour and variants, Q014 variants and wide buttons, Q020 is-left, Q037 hero, Q008 placeholder swaps, Q009 swaps, Q027 hero, Q032 hero, Q031 placeholders, fill-placeholder-images bullets, R00 hover and staging check, Q033 placeholders, K02 combos).

Dropped as stale (verified against staging or repo, 2026-10-20):
- R00 "push tag v1.1.1": `git ls-remote --tags origin` shows `refs/tags/v1.1.1`.
- R00 "paste head and footer code", "switch footer URL to the tag", "check behaviours after publish", "GSAP host": staging footer loads `@v1.1.1/dist/index.js`, Swiper 12, GSAP 3.15.0, Lenis; the GSAP doc line is kept in (b).
- Q005 "site has no custom code yet", Q005/Q013 "place Site Nav and Footer Links on every page": staging shows one `data-nav="header"` and a Footer Links on all 14 pages and four templates.
- Q031 "empty Image prop publishes `src=""`": 0 empty `src` across 18 staging URLs.
- Enable `scrollEnlargeSnap`, `imageTrailHover`, `imageStackCollapse`, `historyStickyYear`, `galleryFilter`, `offersSliderSplit`, `navToggle`, `imageHoverScale`, `modals`, `accordion`: all present in `src/index.ts` (the open ones are `cardCarouselHeaderLeft` and `roomListHoverPreview`).
- Q033 "imageHoverScale needs enabling": enabled.
- Q014 Zuma wordmark on reference hero, Q012/Q013/Q014/Q015 visual checks of build pages, Q019 base map art: build pages are queued for deletion, and the visuals are covered by page-level checks.
- Duplicate "delete the Q012 to Q015 build pages" lines: merged into the single delete line in (a).
- Duplicates merged: V02 delete-old-sections lines (14 of them), Q012/Q031/Q043/Q029 placeholder items, five faq-accordion all-open reports, five "release v1.1.x" items, `cardCarouselHeaderLeft` enable lines (Q009, Q038, Q039, Q043, Q044, v1.1.2).
- Q040 "mobile tag pill overflow" and Q034's duplicate: merged into the Tab Pills Intro heading.
- R00 "`/build-site-nav` second `[data-nav]`": no code change needed; kept as a note in Site code and release.
- Q017/Q024 "un-drafted for staging, set back to draft": merged into the delete-build-pages line.
- "Pages: two global `section_placeholder` styles": kept in Shared styles and docs.
