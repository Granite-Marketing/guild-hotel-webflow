# CMS field audit (#332), 2026-11-20, read-only

Applied 2026-11-20: all 57 "Proposed name" renames done (the "before" names are the Current name column); Packages `category` deleted (empty, unbound). Gallery Photos `category` and Beyond Downtown `pop-up---gallery` kept pending Omar.

Site `6ad6405eae8eac6d7b7c41a3`. Rules: D2 "<Section> - <Field>" display names (slugs untouched, Name/Slug stay), D3 one-line values are single-line Plain Text, X2 per-item content is a field and identical-on-every-item content stays static, unsure items are questions.

Method: schema from `get_collection_details`; usage from template pages and main listing pages (settings read with `all_raw_settings`); values from the first 2 to 6 items of each collection. The single-line/multi-line setting is not exposed by the API, so "check single-line" means the values look one-line and the field type should be confirmed in the Designer.

Naming convention used for proposals: "Card - X" for the tile or listing card, "Pop-up - X" for the modal, "Hero - X", "Intro - X", "Focus - X" for page sections, and the collection noun for generic fields (for example "Art - Sort Order", following the already-done "Media - Sort Order"). Title Case after the dash, matching "Card - Topic" and "Media - Video Link".

Collections not in the request but found: none beyond the excluded list (site has 20 collections; 13 audited here).

## Summary counts

| Collection | Fields | Renames needed | Unused candidates | Questions |
|---|---|---|---|---|
| Happenings & Stories | 12 | 9 | 0 (category is used as a list filter) | 3 |
| Packages | 12 | 9 | 1 (`category`) | 3 |
| Post Categories | 3 | 1 | 0 | 1 |
| Legal Corporates | 9 | 7 (casing and dash only) | 0 | 1 |
| Map Places | 5 | 3 | 0 (bindings unverified) | 2 |
| Quiz Options | 6 | 4 | 0 | 1 |
| Press | 8 | 6 | 0 | 2 |
| Press Categories | 3 | 1 | 0 | 0 |
| Art Collection | 13 | 10 | 0 | 3 |
| Gallery Photos | 7 | 5 | 1 (`category` Option) | 1 |
| FAQs | 4 | 2 | 0 | 2 |
| Meeting Venues | 26 | 1 (`Sort order`) | 0 | 2 |
| Beyond Downtown Places | 7 | 1 (`Sort order`) | 1 (`pop-up---gallery`) | 2 |

---

## 📰 Happenings & Stories `6ad67d759914af41be21de7e` (template `6ad67d759914af41be21de84`, listings /happenings `6adf8565c9208d434c321a85`, /blog `6adf856512eff9c0216feca8`)

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Date | `date` | `ad0c2566ded18b287e0d7f5313169e44` | DateTime | Template: eyebrow paragraph (`d0f68cf6-...`) | Post - Date | |
| Hero image | `hero-image` | `e36ae823db95ead0fa58ec6c1b246390` | Image | Template Hero Image prop; listing card image (`a9dddc51-...`) | Hero - Image | Also the card image on listings, so Card - Image would be as valid (question 1) |
| Excerpt | `excerpt` | `c25832d101a86377abced703154a077c` | PlainText | Template Hero Text prop; listing card paragraph (`248a58a5-...`); SEO description | Hero - Excerpt | Values are 1 to 2 sentences (70 to 140 chars), no line breaks. Paragraph-sized: keep multi-line |
| Body | `body` | `719d754b805d05fc5e1d5a811a9602da` | RichText | Template article rich text (`4b816f3a-...`) | Body - Text | |
| Body highlight | `body-highlight` | `7dc35af6b101817c0c72c4feabfd46a5` | PlainText | Template Split image text light Body prop | Highlight - Text | Same sentence on all 6 sampled items (placeholder?). X2 static candidate if it stays identical. Paragraph, keep multi-line |
| Category | `category` | `3d27986165618c5d45dcff873530a2ae` | Reference (Post Categories), required | /happenings and /blog list filter (Category equals happenings or blog) | Post - Category | Used. Required |
| Topic | `topic` | `b31d639e86a84543aeb8dcb1aa2fcba6` | Option (dining, culture, conferences) | Template Hero Eyebrow prop | Post - Topic | Overlaps Card - Topic (reference to Topics). Question 2 |
| Inset image | `inset-image` | `b82a0fa7bdf0f18df6840996489fc07d` | Image | Template image-inset-single | Inset - Image | Identical image on all 6 sampled items. X2 static candidate if it stays identical |
| Highlight image | `highlight-image` | `2f8361400cfe1081d5e1faec6ac5116b` | Image | Template Split image text light Image prop | Highlight - Image | Identical on all 6 sampled items. Same X2 flag |
| Card - Topic | `card---topic` | `101bc574a26dc6f44acb63f556b40042` | Reference (Topics) | Listing item attributes `data-category`, `data-category-order`, section heading h2 | Card - Topic | Already compliant |
| Name | `name` | `c2faac5623dab0a0e70d8057511c0dc4` | PlainText | Template hero heading; listing card h3 | Name | Keep |
| Slug | `slug` | `af3e51c35655f4da9c0aa3a81db2295d` | PlainText | Card links | Slug | Keep |

Unused: none.

Questions for Omar:
1. Hero - Image and Hero - Excerpt also feed the listing cards. Keep "Hero" naming, or move to "Card - Image" and "Card - Excerpt"?
2. Topic Option (`topic`) and Card - Topic reference (`card---topic`) hold the same three values. The Option now only drives the template hero eyebrow. Drop the Option and bind the eyebrow to Card - Topic?
3. Are Body highlight, Highlight image and Inset image meant to differ per article? Today they are identical on every item.

---

## 🎁 Packages `6afc5ac0f547318572484bb6` (template `6afc5ac0f547318572484bda`, listing /packages `6afc5759981249dd386c4008`)

Copy of the Happenings schema. Template bindings verified for hero (image, topic, name, excerpt), inset image, highlight text and image, body, date.

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Date | `date` | `6617b2f977dee9cbb66fe99c1fe0c60a` | DateTime | Template eyebrow paragraph (`0e855457-...`) | Package - Date | Question: does a package need a publish date? Used as sort on the list |
| Hero image | `hero-image` | `7ed4662a1ea1b38b4f00802ad5d36f91` | Image | Template Hero Image | Hero - Image | |
| Excerpt | `excerpt` | `f21b41ecec69a8ac2b792ec1d677da0b` | PlainText | Template Hero Text | Hero - Excerpt | 1 sentence, paragraph-size, keep multi-line |
| Body | `body` | `b67e60a1cac65c5bee29ba380079a8a3` | RichText | Template rich text (`f234796b-...`) | Body - Text | Identical on 4 of 4 items (placeholder copy) |
| Body highlight | `body-highlight` | `22de5893d67b6800ce4b9b947bede6f4` | PlainText | Template Split image text light Body | Highlight - Text | Identical on 4 of 4 items. X2 static candidate if it stays identical |
| Category | `category` | `e7fdae9ddc219ef903c73e5ca404e19c` | Reference (Post Categories), optional | Not bound anywhere found (list has no category filter, template has no binding); null on all 4 items | Package - Category | Unused candidate. Doc says it was copied from Happenings and no Packages category exists |
| Topic | `topic` | `d2d60380fc929173561617806480fcaa` | Option | Template Hero Eyebrow | Package - Topic | Overlaps Card - Topic, same as Happenings |
| Inset image | `inset-image` | `4561658e29a43402a10201ffe14e446b` | Image | Template image-inset-single | Inset - Image | Identical on 4 of 4 |
| Highlight image | `highlight-image` | `ab9fdefc07d130aea306713f0fcae591` | Image | Template Split image text light | Highlight - Image | Identical on 4 of 4 |
| Card - Topic | `card---topic` | `3781b9f8bcdbacfc34435b74840cb713` | Reference (Topics) | /packages list item attributes and heading | Card - Topic | Compliant |
| Name | `name` | `d4f8a358ea52be372502f83b2d3d6934` | PlainText | Hero heading, card title | Name | Keep |
| Slug | `slug` | `50b0c7a3e9dff29839c5badaf075a135` | PlainText | Card link slug | Slug | Keep |

Unused candidate: `category` `e7fdae9ddc219ef903c73e5ca404e19c` (no binding, no filter, empty on every item).

Questions for Omar: same three as Happenings, plus: delete Category here, or will packages get a category later?

---

## 🏷️ Post Categories `6ad67d74485ab8562b6e34da` (template `6ad67d75485ab8562b6e34e0`)

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Hero heading | `hero-heading` | `0af5cdb8abb9c97b54f59decff37e1d3` | PlainText | Template Hero Heading (per webflow-ids.md, not re-read) | Hero - Heading | Single-line heading, values "blog" and "happenings". Check single-line. Differs from Name only by case |
| Name | `name` | `db29760651f9663bd8534536e8f556cb` | PlainText | Filter value, SEO | Name | Keep |
| Slug | `slug` | `5db7cb81a370ac6e5bf5a3d08b1b7318` | PlainText | | Slug | Keep |

Question: Hero heading is just the lower-case Name. Drop the field and style the heading in lower case?

---

## 🧑‍⚖️ Legal Corporates `6ad67d74943352af06e37843` (template `6ad67d74943352af06e37850`, items legal and corporate)

All seven content fields verified bound on the template (hero instance props, script-intro instance props, focus heading `e2badae8-...`, focus paragraph `33b83d58-...`).

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Hero Heading | `hero-heading` | `db07dee1dad8a585505d5401deafa965` | PlainText | Hero Heading prop | Hero - Heading | One line. Check single-line |
| Hero Text | `hero-text` | `42736c35f04338d22674a4d32b304eba` | PlainText | Hero Text prop; SEO description | Hero - Text | Help text says "One line"; values are one sentence (66 to 72 chars). Check single-line |
| Hero Image | `hero-image` | `1b2841347d62727df418322ac155f151` | Image | Hero Image prop | Hero - Image | |
| Intro Heading | `intro-heading` | `0a0776cf9b0f67e6565821b8538eeb6f` | PlainText | script-intro-centered heading | Intro - Heading | Contains a line break ("Refined focus,\nunmatched convenience."), so multi-line is needed. Identical on both items: X2 static candidate |
| Intro Text | `intro-text` | `644db29b64005969232cc9bf1bf1dd0a` | PlainText | script-intro-centered paragraph | Intro - Text | Paragraph, multi-line OK |
| Focus Heading | `focus-heading` | `646a98eead2d19434a9ee6823fb4a515` | PlainText | Sticky heading `e2badae8-...` | Focus - Heading | One line (differs per item). Check single-line |
| Focus Text | `focus-text` | `d20219d92802d779b8d922414f684076` | PlainText | Focus paragraph `33b83d58-...` | Focus - Text | One sentence. Paragraph, keep multi-line |
| Name | `name` | `91b6a0155af3703c7f23b118a95e0f82` | PlainText | | Name | Keep |
| Slug | `slug` | `d900f99a94a4e1d364b9b03bb5c8021c` | PlainText | | Slug | Keep |

Unused: none. The only change is the dash: current names use "Hero Heading" without " - ".

Question: Intro Heading is identical on both items. Make it static on the template (keeping the field only if the two pages should diverge)?

---

## 📍 Map Places `6adf73e0711cfc5e16f51bb5` (list lives inside the Map Feature Image Bg component `5d830b69-6507-7d04-4828-069b2539cffb`)

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Walk time | `walk-time` | `cc589e25d5e071f1efb5a65e09c1759a` | PlainText | Not confirmed (see below) | Place - Walk Time | One line ("6-minute walk"). Check single-line |
| Coordinates | `coordinates` | `46a398ff78a7d9c2bc795635df2fb516` | PlainText, required | Not confirmed | Place - Coordinates | One line "lat, lng". Check single-line |
| Order | `order` | `e2c905ef609b7282c8e1318e89b98aeb` | Number | Not confirmed; list sort is empty | Place - Sort Order | Doc says the list sort could not be set, so Order is not driving the order. Slug `order` vs "Sort order" naming elsewhere |
| Name | `name` | `31b5b12dcf26ea5454f31d24b3ff95e4` | PlainText | | Name | Keep |
| Slug | `slug` | `df15c3e35c774bbe18577538fb8e6460` | PlainText | | Slug | Keep |

Verification gap: reading the list item inside the component definition returned empty bindings (item `data-map-coordinates` null, paragraphs without text bindings, filters and sort empty). That may be how component-scope reads behave, or the bindings are not set. Not marked unused, but worth a Designer look.

Questions for Omar: (1) Confirm in the Designer that Walk time, Coordinates and Name are bound in the Map Feature Image Bg list. (2) The list should sort by Order; the MCP cannot set the sort, so someone must set it in the Designer.

---

## 🧭 Quiz Options `6ae08d40ba5f0d2f0a4a2720` (lists on /rooms `6ad66fd5f8bf4846e809dbee`; template page `6ae08d40ba5f0d2f0a4a2726` is empty)

Bindings below are from `docs/reference/webflow-ids.md` (F26 notes) and not re-read on /rooms. Item values sampled (4 of 14).

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Step | `step` | `91064fea8f4a9beaeba1a64cc6bc3740` | Option (1, 2, 3) | Each step's list filters on it | Quiz - Step | |
| Sort order | `sort-order` | `cdf2eecffd244da5ec3f27434adc52e0` | Number | List sort | Quiz - Sort Order | |
| Image | `image` | `66a64f4dab349c192adbdab5df4dd4ad` | Image | Hover image per option | Quiz - Image | |
| Image alt | `image-alt` | `65f0fdd072f1b3e6179908646766d55e` | PlainText | Hover image alt | Quiz - Image Alt | One sentence, no line breaks. Check single-line |
| Name | `name` | `808e173f264830b6ed018d3c90d65a18` | PlainText | Option button text | Name | Keep |
| Slug | `slug` | `289e90b6bfbcc456505e226faa3d32f0` | PlainText | `data-rooms-quiz-option` | Slug | Keep |

Unused: none. Question: "Quiz" prefix, or "Option - X" since the item is a Quiz Option?

---

## 📰 Press `6afb2abe0f4d8650f6774820` (/press `6ad66fd5735773f253406642`)

All fields verified bound on the /press list item.

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Publication | `publication` | `3050155dcdbcab181b86167917ed612a` | PlainText, required | Card paragraph (`94d93f36-...`) and logo alt text | Card - Description | Mismatch: the field is named Publication, but the sampled values are long sentences (excerpts, up to about 190 chars), not outlet names. Question 1 |
| External URL | `external-url` | `220f80cd24b47f6a23dfb1fdfc382956` | Link, required | Card link href | Card - Link | |
| Image | `image` | `41732b3109069e580d9ca6ece2314f06` | Image | Card image | Card - Image | |
| Logo | `logo` | `db231d8144faf15aa5d9d4fe835adba2` | Image | Card logo | Card - Logo | Null on the first 3 items. Check how many items use it |
| Order | `order` | `3243cd1e205c48536b3e4656eec32274` | Number | List sort ascending | Card - Sort Order | Null on the first 3 items (24 total) |
| Press Category | `press-category` | `376cecea332874074444310c7d676cfb` | Reference, required | Item attributes and group heading | Card - Category | |
| Name | `name` | `0e46547820f605e99380132f24d35a2b` | PlainText | Card title h3 | Name | Keep. Values include curly quotes and long titles |
| Slug | `slug` | `99b4090843faf2b750d005fab8776dbf` | PlainText | | Slug | Keep |

Questions for Omar: (1) Should "Publication" hold the outlet name (Forbes) with a separate description, or is it the card description? (2) Logo and Order are empty on the first items; confirm they are still wanted.

---

## 🏷️ Press Categories `6afb3561e46519364ff54c39`

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Order | `order` | `c6af895139bdcf06d1a9c236f2ada149` | Number | Press item attribute `data-press-category-order` | Category - Sort Order | Used |
| Name | `name` | `262d60527759350c9025b85adeb719bd` | PlainText | Group h2 | Name | Keep |
| Slug | `slug` | `7ccef46d45d4114041df7cff6559b5ec` | PlainText | `data-press-category` | Slug | Keep |

Sampled order values: Reviews 1, F&B 2, Design 2, Lists 1, Community 3. Duplicate numbers across categories (two at 1, two at 2): the order is ambiguous.

---

## 🖼️ Art Collection `6aea1e6d64c7d7b0d10c4012` (/arts `6ad66fd7ba96f2e53726a2eb`)

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Category | `category` | `0bd419969a18943fe61f5555ca0f076f` | Option (Painting, Photography, Sculpture, Artists) | Used only as a list filter (Artists vs artworks) | Art - Type | Overlaps Card - Category. Question 1 |
| Image | `image` | `75f824edc8b79ecadb308213e4191504` | Image | Grid tile and modal image | Card - Image | |
| Image alt | `image-alt` | `9de8650770412b88f80fa29296240576` | PlainText | Tile alt, link aria-label, modal alt | Card - Image Alt | One sentence. Check single-line |
| Byline | `artist-name` | `8af62c3e4e85f84ee4c5f0a1a9ff3ff7` | PlainText | Modal Eyebrow prop | Pop-up - Byline | One line ("by the guild collection"), same on sampled artworks. Check single-line. Display name differs from slug (`artist-name`) |
| Artist | `artist` | `6f5b6d91583e668c4383590cff5c6270` | Reference (self) | Modal "Artist dialog id" via artist slug | Pop-up - Artist | Null on the sampled artworks |
| Caption | `caption` | `d4cc155c801af29b34a6dc89e5ac4a07` | PlainText | Modal Caption | Pop-up - Caption | Two lines ("2023 \| 24 x 16 in\nArchival pigment print"). Multi-line correct |
| Description | `description` | `aead1451e80d910e2fe7f29f30413ccf` | PlainText | Modal Text | Pop-up - Description | Paragraph. Multi-line correct |
| Tile size | `tile-size` | `13fb4cc1ba1939fb8c3e2ea6bf41cbbf` | Option | Grid item `data-tile-size` | Card - Tile Size | |
| Sort order | `sort-order` | `ef04d9c4338c2194c7339ea5bb38eaaa` | Number | Grid list sort | Card - Sort Order | |
| Card - Category | `card---category` | `c5f18e1c77a4b9059f7482c551d64fc1` | Reference (Art Categories) | Grid item `data-gallery-filter-item`, filter tabs | Card - Category | Compliant |
| Name | `name` | `84fa6469a81cfd589939edf96044d6af` | PlainText | Modal heading | Name | Keep. Values in quotes |
| Slug | `slug` | `b213e9858baff670033abcf16e7cd52f` | PlainText | Modal dialog id, `data-modal-open` | Slug | Keep |

Unused: none, but `category` is a filter-only duplicate (see below).

Questions for Omar: (1) The `category` Option (4 values) drives "Artists vs artworks" in the lists, and Card - Category (Art Categories) drives the tabs. Keep both, or fold into one? (2) The "by ..." text is typed in each item; if the artist reference is set, should the byline come from the artist item? (3) Byline is identical on the sampled artworks ("by the guild collection"): static candidate if all artworks share it.

---

## 📸 Gallery Photos `6af3531acf4b88863f651db9` (/gallery `6ad66fd65794075272b95584`)

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Image | `image` | `d78b5d2567a03b7dcdc34bea932e95ca` | Image, required | List image `22189d96-...` | Photo - Image | |
| Image alt | `image-alt` | `dee2c5a0760f95855e3dcf8593f41f61` | PlainText | List image alt | Photo - Image Alt | One sentence. Check single-line |
| Category | `category` | `0d0beb373da9a79311f499c757fc7316` | Option (6 values) | Not bound on /gallery (list has no filter, item attribute uses Card - Category) | Photo - Category | Unused candidate: superseded by Card - Category |
| Sort order | `sort-order` | `c16baba88e384fb59545764801a5cb90` | Number | List sort | Photo - Sort Order | |
| Card - Category | `card---category` | `f654122590fb89fbe5294025eb14d4bb` | Reference (Gallery Categories) | Item `data-gallery-filter-item` | Card - Category | Compliant |
| Name | `name` | `40f5791368cd447996dd1ec86fa8076a` | PlainText | | Name | Keep (values "Gallery photo 35") |
| Slug | `slug` | `7dfd0ae9d43393bce939dc1287c4b9ba` | PlainText | | Slug | Keep |

Unused candidate: `category` Option `0d0beb373da9a79311f499c757fc7316`, because Card - Category carries the filter. Only checked /gallery; the Home page or others might use it.

---

## ❓ FAQs `6b00284dcf7ddb2b615e8b7c` (Home FAQ list `0c979cd0-38fc-e636-b029-8ce73afc731f`)

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Answer | `answer` | `8bada67023cdc4d3df27b266ddf8cfa6` | RichText, required | Home list rich text `ffc9c44b-...` | Answer - Text | Identical sentence on the 2 sampled items (placeholder from the original accordion) |
| Sort order | `sort-order` | `f77d98b8a3df6ee8bf2719a30db26e23` | Number | Not read; doc says list sorts on it | FAQ - Sort Order | |
| Question | `name` | `35aabccee3c90080b51096f3c5f5cc99` | PlainText, required | Accordion question | Name (or keep "Question") | See question |
| Slug | `slug` | `eaa524af9425b085d6247ff6b2513edf` | PlainText | | Slug | Keep |

Questions for Omar: (1) The Name field is displayed as "Question". The rule says Name stays "Name"; keep the clearer label or revert? (2) Which pages use the FAQ list besides Home? Only Home was read; other faq-accordion instances may still be static.

---

## 🏛️ Meeting Venues `6b0036f73a65bcfa50f491e9` (/meetings `6ad66fd96684c3e22ea4d417`, Legal Corporates template)

All fields verified bound through the Art Detail Modal props, card image, heading, intro, and the two list filters (Pages - Meetings, Pages - Legal & Corporate). Six items; three sampled.

Naming already follows D2 for 25 of 26 fields. Only one rename:

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Sort order | `sort-order` | `fec7f04d7a1e5bccdae42dfc281d7884` | Number | List sort ascending | Card - Sort Order | Only field without a section prefix |

Compliant fields (verified bound): Card - Image `c132197b...`, Card - Intro `5bb75ffd...`, Pop-up - Image `bfc53d5c...`, Pop-up - Text `b7f0a39b...`, Pop-up - Layout Options `43be41bb...`, Pop-up - Floorplan Link `075d62cc...`, Pages - Meetings `1ffcb148...` (filter), Pages - Legal & Corporate `367e789b...` (filter), Features - 1..5 Title, Text, Image (15 fields, modal item props), Name, Slug.

Value notes:
- Card - Intro: one sentence, identical on all 3 sampled items. Check single-line. X2 static candidate if real copy never differs.
- Pop-up - Text: identical paragraph on all 3 (placeholder). Multi-line correct.
- Pop-up - Layout Options: one layout per line (multi-line by design), identical on all 3.
- Features - N Title and Text: short one-liners ("510 SQ FT", "A private room for focused sessions."). Check single-line for all ten. Features 1 and 2 are identical on all 3 sampled items, features 3 to 5 text identical: X2 static candidates; images identical too.
- Pop-up - Floorplan Link: null on all sampled.

Questions for Omar: (1) The five Features blocks repeat across venues with the same copy. Are they per-venue facts (keep as fields) or one shared list (static)? (2) Is the floorplan link used by any venue yet?

---

## 🏖️ Beyond Downtown Places `6b003ce85ffdb768a6e73915` (/neighborhood `6ad66fdb02cc199b55b926ba`)

Four items; three sampled. Modal binds Name, Slug, Card image, Pop-up text and Learn More link.

| Current name | Slug | Field id | Type | Bound where | Proposed name | Flags |
|---|---|---|---|---|---|---|
| Card - Image | `card---image` | `c20824ea90c5545bbd984f35fc0669ba` | Image | Timeline image and modal image | Card - Image | Compliant |
| Pop-up - Text | `pop-up---text` | `308010497de7a57775e3b2103f6aef1b` | PlainText | Modal Text | Pop-up - Text | Identical paragraph on the 3 sampled items (placeholder). Multi-line correct |
| Pop-up - Learn More Link | `pop-up---learn-more-link` | `c07d66741b6060390f7e1d93e1e426e2` | Link | Modal button link | Pop-up - Learn More Link | Compliant. Null on all sampled |
| Pop-up - Gallery | `pop-up---gallery` | `b8b34da828d433f0d61eb52249bce05d` | MultiImage | Not bound: the Art Detail Modal has no gallery prop | Pop-up - Gallery | Unused candidate. Help text says "first one shows today", suggesting a planned slider. Null on all sampled |
| Sort order | `sort-order` | `c841314d63ccd6780390adca7577820c` | Number | Not read; doc says list sorts on it | Card - Sort Order | Only rename needed |
| Name | `name` | `ac53efb4895b679e94a32a89bfd0b705` | PlainText | Modal heading, caption | Name | Keep (two items named "oceanside", slugs `oceanside` and `oceanside-2`) |
| Slug | `slug` | `bd615a61118e9127705effa6b942654f` | PlainText | Dialog id | Slug | Keep |

Unused candidate: `pop-up---gallery` `b8b34da828d433f0d61eb52249bce05d`.

Questions for Omar: (1) Is the pop-up gallery slider going to be built, or should the field go? (2) The Learn More link is empty on every item, and the button shows regardless. Is it intended to be hidden when empty?

---

## Cross-collection notes

- Unused candidates (ids): Packages `category` `e7fdae9ddc219ef903c73e5ca404e19c`; Gallery Photos `category` `0d0beb373da9a79311f499c757fc7316`; Beyond Downtown `pop-up---gallery` `b8b34da828d433f0d61eb52249bce05d`.
- Duplicate-pair candidates (both bound or half bound, not deletable without a decision): `topic` Option vs `card---topic` Reference in Happenings and Packages; `category` Option vs `card---category` Reference in Art Collection.
- Placeholder content: many identical values (Happenings highlight and images, Packages body, FAQ answers, Meeting Venues copy, Beyond Downtown text) are dummy content. X2 static flags assume they stay identical; confirm with real content before converting anything.
- Limits of this audit: bindings read directly on Happenings and Packages templates, Happenings listing, Legal template, Meetings, Press, Arts, Gallery, Home FAQ list, Neighborhood popups and the Map Feature component. Not read in the Designer: Post Categories template (relied on webflow-ids.md), Quiz Options lists on /rooms (docs only), other pages that might also list these collections (Home, Blog, Packages list items, Corporate or Neighborhood extras), and CMS-bound SEO fields.
- API cannot expose single-line vs multi-line, so every "check single-line" must be confirmed in the Designer.
