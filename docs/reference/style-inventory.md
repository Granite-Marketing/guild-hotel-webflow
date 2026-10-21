# Style & Component Inventory

This document is the **live reference** for what already exists in The Guild Hotel Webflow project. Before creating ANY new style or element, check here first. If a match exists, reuse it.

**Last updated:** 2026-10-20 by K02 (shared classes and wave 2 families), regenerated from `data_style_tool > get_styles(query: "all")` with every breakpoint on the live site: 901 styles (510 global, 364 combo, 27 tag).

---

## Existing Components (Reusable)

| Component | ID | Instances | Use For |
|---|---|---|---|
| Global Styles | `ab488b17-f25a-fbf8-5f54-4a3955eb57e5` | | Relume global styles embed (do not edit) |
| Site Nav | `fc94d1a2-3399-4de0-e836-0233a6c86cdf` | every page | Q005 navbar and full-screen menu. Insert as the first child of the body. Base variant (light text) on hero pages; set Variant to Dark (`08083309-2be0-2228-878a-7f1c05773f43`, `type: "string"`) on static-template and contact. Needs `navToggle` in the bundle. |

Navbar, modals and overlays, and sliders are built by hand in the Designer (see `docs/figma/inventory.md`). Add them here once they exist so agent builds insert instances instead of rebuilding. Q001 did not touch components; this table was carried over, not re-read.

---

## Variables

The site keeps Relume's variable names. The project convention names (`color-primary`, `color-neutral-100` and so on, from `CLAUDE.md` and `docs/reference/style-guide.md`) map onto them as below. Bind styles to these variables (`variable_as_value` with the ID); never hard-code the hex.

### Colours (collection Primitives, `collection-0220e3ad-eb86-03ea-3026-8a5979301dd2`)

| Convention name | Live variable | CSS name | Value | Variable ID |
|---|---|---|---|---|
| `color-primary` | Colors/Primary | `--_primitives---colors--primary` | #A48E59 | `variable-b7b5e306-73bb-3733-c9f4-0a63562df337` |
| `color-secondary` | Colors/Secondary | `--_primitives---colors--secondary` | #FBF5DE | `variable-49e9de8a-2e2b-a97d-e186-8f4b9ea86b49` |
| `color-accent` | Colors/Accent | `--_primitives---colors--accent` | #29310C | `variable-0e074b1e-1a30-44cc-29cb-a5babd8773c3` |
| (brand red) | Colors/Red | `--_primitives---colors--red` | #CB3629 | `variable-9ddf91d3-9e9b-7f95-55c8-721835775df8` |
| (brand burgundy) | Colors/Burgundy | `--_primitives---colors--burgundy` | #4A1217 | `variable-c75988d0-38f7-9a2f-b9d7-c4fb2dfa0e81` |
| (pure black) | Colors/Black | `--_primitives---colors--black` | #000000 | `variable-b1861b32-0580-b9de-f26e-6cfa435590cd` |
| `color-neutral-0` | Colors/White | `--_primitives---colors--white` | #fff | `relume-variable--neutral-white` |
| `color-neutral-100` | Colors/Neutral Lightest | `--_primitives---colors--neutral-lightest` | #F4EFDF | `relume-variable--neutral-shade-1` |
| `color-neutral-300` | Colors/Neutral Lighter | `--_primitives---colors--neutral-lighter` | #D1D1D1 | `relume-variable--neutral-shade-2` |
| (Relume only) | Colors/Neutral Light | `--_primitives---colors--neutral-light` | #aaa | `relume-variable--neutral-shade-3` |
| `color-neutral-500` | Colors/Neutral | `--_primitives---colors--neutral` | #949494 | `relume-variable--neutral-shade-4` |
| `color-neutral-700` | Colors/Neutral Dark | `--_primitives---colors--neutral-dark` | #484848 | `relume-variable--neutral-shade-5` |
| (Relume only) | Colors/Neutral Darker | `--_primitives---colors--neutral-darker` | #222 | `relume-variable--neutral-shade-6` |
| `color-neutral-900` | Colors/Neutral Darkest | `--_primitives---colors--neutral-darkest` | #262118 | `relume-variable--neutral-shade-7` |
| (brand blue, K02) | Colors/Blue | `--_primitives---colors--blue` | #489CCA | `variable-f1330699-c5fe-75bc-bcf8-630b5a4086eb` |
| (brand tan, K02) | Colors/Tan | `--_primitives---colors--tan` | #906E58 | `variable-cdc4b0e2-ec6d-8afb-20be-e56ed7d3047f` |
| (brand navy, K02) | Colors/Navy | `--_primitives---colors--navy` | #00263E | `variable-bbb7c022-7587-5697-05f4-9fa10672c409` |

Primitives also holds Relume's `Opacity/*` colours (White 5 to 60, Neutral Darkest 5 to 60, Transparent). The Neutral Darkest opacity steps are pure black at alpha, not #262118. Figma's many `#000000` alpha overlays have no variables; use these opacity steps where one is close, otherwise set the value on the class.

No variables exist for success, error, warning or info, or for the low-use Figma colours (#2B2927, #F26849 and others in `figma/tokens.json`). Create one only when a component needs it, in Primitives, with a descriptive name.

### Colour scheme (collection Color Schemes, `collection-139f4ef2-8521-8181-4a7f-fc90894e2d6f`)

| Variable | Points at | Resolves to |
|---|---|---|
| Color Scheme 1/Text | Neutral Darkest | #262118 |
| Color Scheme 1/Background | Neutral Lightest | #F4EFDF |
| Color Scheme 1/Foreground | Neutral Lightest | #F4EFDF |
| Color Scheme 1/Border | Neutral Darkest | #262118 |
| Color Scheme 1/Accent | Primary | #A48E59 |

The `body` tag uses Text and Background, so pages default to #262118 on #F4EFDF.

### Fonts (collection Typography, `collection-3c6a4911-12c4-e415-7fe0-514cefa2d46d`)

| Live variable | Value (uploaded family) | Figma name | Variable ID |
|---|---|---|---|
| Font Styles/Heading | Sackers Gothic (weight 900 only) | Sackers Heavy Gothic | `relume-variable--font-style-heading` |
| Font Styles/Body | Gatchtest (400, 500) | Gatch Test | `relume-variable--font-style-body` |
| Font Styles/Accent | Morello Pen (400) | Morello | `variable-db8c18ba-009e-dc41-30fa-01389dfb9716` |

Sackers Gothic is uploaded as weight 900 only, so every Sackers style sets `font-weight: 900`, even though Figma reports it as 400.

### UI Styles (collection `collection-08964abb-b13c-a798-071a-663d82b7f0a6`)

Radius/Large, Medium, Small all 0px; Stroke/Border Width and Divider Width 1px (Relume defaults, unchanged).

---

## Typography

Desktop values. Tablet is the `medium` breakpoint, mobile is `small`. Heading classes carry their own font family, so they work on any element (not only h1 to h6).

| Class | Font | Size / line height | Letter spacing | Case | Tablet / mobile size | Figma style |
|---|---|---|---|---|---|---|
| `heading-style-display` | Heading, 900 | 5rem / 1 | 0 | lowercase | 4 / 3.25 / 2.5rem (T / ML / MP) | Sackers 80/80 venue cards (K02) |
| `heading-style-h1` | Heading, 900 | 3.5rem / 1 | 0 | lowercase | 3.25 / 2.5rem | Display/Hero |
| `heading-style-h2` | Heading, 900 | 2.5rem / 1 | -0.05em | none | 2.25 / 1.875rem | H2-CAPS |
| `heading-style-h3` | Heading, 900 | 1.875rem / 1 | -0.05em | none | 1.75 / 1.5rem | H3-CAPS |
| `heading-style-h4` | Heading, 900 | 1.5rem / 1.2 | 0 | lowercase | 1.375 / 1.25rem | H4-CAPS |
| `heading-style-h5` | Heading, 900 | 1.25rem / 1.2 | 0 | lowercase | none / 1.125rem | H5-CAPS |
| `heading-style-h6` | inherits | 1.25rem / 1.4, 700 | | | none / 1.125rem | (Relume default, no Figma match) |
| `text-size-large` | inherits | 1.375rem / 1.6 | | | none / 1.125rem | Gatch 22/35.2 (K02 correction) |
| `text-size-medium` | inherits | 1.25rem / 1.3 | | | none / 1.125rem | Paragraph (321 uses) |
| `text-size-regular` | inherits | 1.125rem / 1.6 | | | | Gatch Test/Body/Regular |
| `text-size-small` | inherits | 0.875rem | | | | (Relume default) |
| `text-size-tiny` | inherits | 0.75rem | | | | (Relume default) |

Tablet and mobile heading sizes were derived by scaling Relume's ratios; the Figma snapshot is desktop only. Adjust per component if a mobile frame says otherwise.

### Standalone text styles (created by Q001)

Each sets its own family, weight, size and line height. Use alone on the element; no `text-size-*` needed.

| Class | Font | Size / line height | Letter spacing | Case | Figma style (uses) |
|---|---|---|---|---|---|
| `text-style-eyebrow-caps` | Heading, 900 | 1.125rem / 1.2 | -0.03em | lowercase | EYEBROW-CAPS (393) |
| `text-style-caps-caption-16` | Heading, 900 | 1rem / 1.2 | -0.03em | lowercase | CAPS-CAPTION-16 (182) |
| `text-style-button` | Heading, 900 | 1rem / 1 | 0 | lowercase | Label/Button (95) |
| `text-style-caption` | Heading, 900 | 0.875rem / 1.071 | 0 | lowercase | Label/Caption (43) |
| `text-style-eyebrow` | Heading, 900 | 1.125rem / 1.45 | 0 | none | Label/Eyebrow (6) |
| `text-style-script` | Accent, 400 | 3.75rem / 1.2 (T 3.25, MP 2.5rem) | | | Morello 60/72 (53) |
| `text-style-script.is-large` | combo | 5rem (T 4, ML 3.25, MP 2.75rem) | | | Morello 80/96 (16) |
| `text-style-caption-tracked` | Heading, 900 | 0.875rem / 1 | 0.05em | lowercase | Sackers 14/14 tracked caption (K02) |

Figma variants with no class yet (add as `is-` modifiers inside the component that uses them): Display/Card (h2 at line height 0.95, lowercase, 9 uses), Display/Section (h1 at 3rem, 6 uses), Label/Large (h5 at 1.3125rem / 0.948, 4 uses) and Morello 80/80 (5 uses; use `text-style-script is-large`).

### Relume text utilities (unchanged)

`text-weight-{xbold,bold,semibold,medium,normal,light}`, `text-align-{left,center,right}`, `text-style-{allcaps,italic,link,muted,nowrap,quote,strikethrough,2lines,3lines,tagline}`, `text-color-white`, `text-rich-text`.

### Tag styles

`h1` to `h6` use the heading font variable at weight 900 with Relume's sizes (3.5, 3, 2.5, 2, 1.5, 1.25rem). Always add a `heading-style-*` class to set the project size. `body` uses the body font at 1rem / 1.5. Other tag styles: `a`, `blockquote`, `figcaption`, `figure`, `img`, `label`, `li`, `ol`, `p`, `ul`.

---

## Layout and Utility Families (Relume, with K02 corrections)

| Family | Classes |
|---|---|
| Page structure | `page-wrapper`, `main-wrapper`, `padding-global` (2rem left and right), `padding-section-{large,medium,small}` (global classes carry the values: large 7 / 5 / 3.5 / 2.5rem, medium 5 / 3.5 / 2.5 / 2rem, small 3 / 2 / 1.5 / 1rem at D / T / ML / MP; the `padding-global.padding-section-*` combos are empty), `padding-global.padding-section-xlarge` (combo, 14 / 10 / 6 / 5rem, K02), `container-{large,medium,small}`, `container-full` (K02) |
| Spacing | `margin-*` and `padding-*` directional bases (`-top`, `-bottom`, `-left`, `-right`, `-horizontal`, `-vertical`) with size combos (`-0`, `-tiny`, `-xxsmall` to `-xxhuge`, `-custom1` to `-custom3`); `spacer-{xxsmall..xxhuge}`; `spacing-clean` |
| Sizing | `max-width-{xxsmall..xxlarge,full}`, `max-width-full-{tablet,mobile-landscape,mobile-portrait}`, `align-center` |
| Visibility | `hide`, `hide-tablet`, `hide-mobile-landscape`, `hide-mobile-portrait`, `overflow-{auto,hidden,scroll,visible}`, `pointer-events-{auto,none}`, `z-index-{1,2}`, `layer` |
| Media | `u-image` (block, 100% by 100%, cover; K02; since W02 p8 also replaces the six family `_image` classes), `u-logo` (block, 100% wide, auto height; shared logo image, replaces `cta-booking-newsletter_logo`, `footer-links_logo-image`, `hero-fullbleed-centered_logo`, `venue-card-fullbleed_logo`), `aspect-ratio-{landscape,portrait,square,widescreen}`, `icon-1x1-*`, `icon-embed-*`, `icon-height-*` |
| Effects | `shadow-{xxsmall..xxlarge}`, `divider-horizontal`, `background-color-black`, `inherit-color`, `display-inlineflex` |
| Buttons | `button` with combos `is-secondary`, `is-alternate`, `is-small`, `is-icon`, `is-link`; `button-group` (`is-center`). Site button (K02): `button.is-chamfer` (chamfered cream, Label/Button type) with combos `is-wide`, `is-text-burgundy`, `is-dark`, `is-burgundy`, `is-blue`, `is-outline`, `is-outline-light`. The outline combos use the SVG assets `6ad712867471777f5f7e40b1` (dark) and `6ad7128647118d6eef7696f1` (light). |
| UI bits | `tag` (`is-text`, `is-alternate`), `tab-link`, `tabs-menu`, `dropdown-chevron`, `slider-arrow` (`is-bottom-next`, `is-bottom-previous`, `is-centre-next`, `is-centre-previous`), `slider-arrow-icon`, `category-filter-menu`, `category-filter-link`, `menu-icon` |
| Forms | `form_*` (component, form, field-wrapper, field-label, input with `is-select-input` and `is-text-area`, checkbox, radio, message-success, message-error), `error-text`, `success-text` |
| Relume starter blocks | `navbar_*`, `footer_*`, `section_faq` / `faq_*`, `section_contact` / `contact_*`, `utility_*` (password and 404 pages) |
| Style guide page only | `rl-styleguide_*`, `rl-styleguide-accent`, `stylesystem_*`, `color-scheme-1`, `color-schemes`, `class-label-*`, `hidden-ui-elements`, `global-styles`, `style-overrides` |

## Project Component Families

Created by K02 on 2026-10-20 from the wave 2 plans (`docs/figma/build-plans/Q0xx/plan.json`); the write list is `docs/figma/build-plans/k02-write-plan.md`. Each parallel build session uses only its own family and the shared classes; none creates a class.

**Shared accordion contract** (`src/utils/accordion.ts`): `accordion_item`, `accordion_header`, `accordion_question`, `accordion_icon`, `accordion_content-wrapper`, `accordion_content`. The icon's open state (`.accordion_header.is-active .accordion_icon`, rotate 0deg) is not a class style; the Q015 build adds it as CSS.

| Entry | Family | Base classes | Combos | Modifiers |
|---|---|---|---|---|
| Q012 | `section_cta-booking-newsletter` / `cta-booking-newsletter_*` | 17 | 0 | none |
| Q013 | `section_footer-links` / `footer-links_*` | 19 | 1 | `footer-links_padding` |
| Q014 | `section_hero-fullbleed-centered` / `hero-fullbleed-centered_*` | 10 | 2 | `is-left`, `is-text-dark`. `hero-fullbleed-centered_overlay` (2026-10-20): black at 40% (`rgba(0, 0, 0, 0.4)`), absolute inset 0, `pointer-events: none`, inside `_figure` after the image so Show Image hides it; `display: none` in the Text Dark variant. |
| Q015 | `section_faq-accordion` / `faq-accordion_*` | 4 | 0 | none |
| Q016 | `section_script-intro-centered` / `script-intro-centered_*` | 11 | 3 | `is-bottom`, `is-tall`, `is-wide` |
| Q017 | `section_split-image-text-light` / `split-image-text-light_*` | 12 | 18 | `is-below`, `is-blue`, `is-bottom`, `is-chamfer`, `is-end`, `is-end-half`, `is-olive`, `is-outdent`, `is-overlap`, `is-secondary`, `is-start-1`, `is-start-2`, `is-start-4`, `is-start-7`, `is-start-9`, `is-tan`, `is-wide`, `is-wide-text` |
| Q018 | `section_gallery-mosaic-captioned` / `gallery-mosaic-captioned_*` | 10 | 1 | `is-wide` |
| Q019 | `section_map-feature` / `map-feature_*` | 15 | 15 | `is-centered`, `is-image-bg`, `is-pin-1`, `is-pin-2`, `is-pin-3`, `is-pin-4` |
| Q020 | `section_image-trio-text` / `image-trio-text_*` | 15 | 5 | `is-left`, `is-offset` |
| Q021 | `section_venue-card-fullbleed` / `venue-card-fullbleed_*` | 17 | 11 | `is-active`, `is-left`, `is-media-center`, `is-tall` |
| Q022 | `section_form-split-script-contact` / `form-split-script-contact_*` | 22 | 8 | `is-centered`, `is-full`, `is-offset`, `is-rotated`, `is-tall`, `is-textarea`, `is-labelled` (Q043: `_input.is-labelled` and `_input.is-textarea.is-labelled` make the default placeholder transparent where a visible label is used). Q043 also set `white-space: pre-line` on `_detail-value` and added the Contact variant. |
| Q023 | `section_tab-pills-intro` / `tab-pills-intro_*` | 9 | 6 | `is-active`, `is-media` |
| Q005 | `site-nav_*` (root `site-nav_component`, no `section_`) | 21 | 2 | `is-active` (mode), `is-end` (menu detail) |
| Q024 | `section_image-inset-single` / `image-inset-single_*` | 3 | 1 | `is-small` |
| Q025 | `section_article-card-staggered` / `article-card-staggered_*` | 9 | 7 | `is-right`, `is-tall`; Q029 adds `is-cms-item` (on `_component`, `:nth-child(even)` flush right like the Right variant) and `is-link` (on `_item`, colour inherit, no underline) for the Post Categories collection list W02 p8: `_logo-wrapper` (cream plate centred on the figure, Show Logo prop) and `_logo` (max-height 8rem, contain); `_figure` is position relative. |
| Q026 | `section_timeline-scatter-images` / `timeline-scatter-images_*` | 9 | 19 | `is-center`, `is-end`, `is-inset`, `is-large`, `is-lift`, `is-medium`, `is-small`, `is-tall`, `is-xlarge`, `is-xsmall` |

**Page one-off section families (wave 3).** A page session creates one family per one-off section, named `section_<page>-<section>` (HANDOVER-wave3 rule 3). Where the Figma section slug is a number (rooms-collection 03-01), the family takes the component name instead, and repeated sections share one family.

`section_placeholder` (shared, created by a parallel page session on 2026-10-20) marks Q005 to Q011 slots; each placeholder carries `data-placeholder="Q0xx"` and a note paragraph.

| Entry | Family | Base classes | Combos | Notes |
|---|---|---|---|---|
| Q042 | `section_static-template-privacy-policy` / `static-template-privacy-policy_*` | 9 | 0 | Legal copy on `/static-template` (component `rich-text-legal`). Classes: `_component` (two-column grid, one column from medium), `_header`, `_content`, `_block` (article), `_block-header`, `_body` (1.25rem / 1.3, 1.625rem gap), `_text` (paragraph, `white-space: pre-line`), `_list`. Headings use `heading-style-h2` (h1) and `heading-style-h5` (h2) alone. Reuse this family for the legal and corporate pages if they stay static. |
| Q043 | `section_form-contact-fields` / `form-contact-fields_*` | 9 | 0 | contact/02 (component `form-contact-fields`): `_component` (Q022 two-column grid, one column from medium), `_form-block` (column 2), `_form` (3rem gap), `_footer` (consent left, button right), `_consent`, `_checkbox`, `_checkbox-input`, `_link` (caption-size underlined link). Fields reuse the Q022 `form-split-script-contact_field*`, `_input` and `_fieldset*` classes; labels use `text-style-eyebrow-caps`. |
| Q043 | `section_cta-script-centered-dark` / `cta-script-centered-dark_*` | 6 | 0 | contact/05: olive band, `_component` (centred column, 40rem), `_header` (rotate -7.5deg), `_heading` (Morello 5rem / 1.2, pre-line; 3.75rem medium, 2.75rem tiny), `_text`, `_footer`. Button `button is-chamfer is-wide`. |
| Q036 | `section_history-oasis` / `history-oasis_*` | 6 | 0 | history/03 (component `image-text-centered-stack`): `_component` (centred column, 2.5rem gap), `_figure` (46.375rem portrait, #d9d9d9 placeholder fill), `_content` (30.5rem), `_header`, `_text` (1.25rem / 1.3, `white-space: pre-line`). Heading `heading-style-h4 text-weight-normal`. |
| Q036 | `section_history-timeline` / `history-timeline_*` | 15 | 10 | history/05 (component `timeline-sticky-year-scroll`, A04 sticky year): `_top` (start year, header, end year grid), `_range` (`is-end`), `_header`, `_subtitle`, `_label-wrap` (sticky at 50vh, zero height), `_label` (olive chamfered badge via `clip-path`, 3.125rem Sackers), `_label-text`, `_list`, `_item` (article per year), `_row` (`is-center`, `is-end`; stacks from small), `_figure` (24% square; `is-full`, `is-wide`, `is-large`, `is-portrait`, `is-small`; #d9d9d9 placeholder fill), `_content` (three-column grid; `is-stacked`), `_item-header`, `_text` (`is-end` puts it in column 3). |
| Q036 | `section_history-landmark` / `history-landmark_*` | 6 | 0 | history/06 (component `gallery-row-dark-titled`, A04 collapse gallery): black 100vh section with `overflow: clip` (auto height from small), `_component`, `_header`, `_list` (four columns, two from small), `_figure` (356 / 466, #d9d9d9 placeholder fill), `_text`. |

| Q027 | `section_text-columns-info` / `text-columns-info_*` | 9 | 0 | Dinings template, dress code (component `text-columns-info`, 4 instances, one template). `_component` (2 columns, 9rem gap, 8.125rem side inset; no inset from medium; 1 column from small), `_list`, `_item` (article), `_header`, `_text` (1.25rem / 1.3, pre-line, 22.5rem), `_aside` (21.5rem, 3.5rem left inset on desktop), `_footer`, `_link` (EYEBROW-CAPS values plus underline on the class). Headings use `text-style-eyebrow-caps` alone. |
| Q027 | `section_image-pair-text` / `image-pair-text_*` | 5 | 1 | Dinings template section 05. `_component` (grid 873fr 485fr, 10rem gap; 1 column from small), `_figure` (square, #d9d9d9 fill; combo `is-portrait` 485 / 574), `_content`, `_text`. Figures carry `data-image-placeholder`. |
| Q027 | `section_quote-band-dark` / `quote-band-dark_*` | 4 | 0 | Dinings template press quote (Zuma). Navy section with blue text (variables), `_component` (centred column), `_quote` (blockquote, Sackers 1.75rem / 1.7, pre-line, tag styles reset), `_figure` (press logo slot, 13.25rem). Visibility bound to the `show-press-quote` switch. |
| Q027 | `section_card-stagger-header-left` / `card-stagger-header-left_*` | 8 | 1 | Dinings template "other dining options" (static stand-in for a card carousel, `data-placeholder="Q009"`). `_component` (30.5rem header column plus list; 1 column from medium), `_header` (17rem top offset on desktop), `_text`, `_list` (flex, overflow-x auto), `_card` (article, 22.25rem; combo `is-offset` 6rem drop), `_figure` (356 / 474, #d9d9d9), `_label` (EYEBROW-CAPS values on the class). Heading uses `heading-style-h2` alone. |
| Q030 | `section_article-body` / `article-body_*` | 5 | 0 | Post template body (happenings-indiv/02, blog-indiv/02; left out of Q016). `_component` (article, centred 46.5rem column, 2.5rem gap), `_header`, `_eyebrow` (H5 caps values on the class, bound to the post date), `_rich-text` (RichText bound to `body`; 1.25rem / 1.3, flex column with a 1.3rem gap so the CMS paragraphs are spaced without styling child tags; 1.125rem from small). Wrapper `padding-global padding-section-large` > `container-large`. |
| Q030 | `section_split-card-pair-captioned` / `split-card-pair-captioned_*` | 9 | 0 | More posts (happenings-indiv/05, blog-indiv/05): `_header` (centred, heading uses `heading-style-h2` alone), `_list-wrapper` (Collection List), `_list` (two columns, one from small), `_card` (link block, 8 / 9, cream text), `_figure` (absolute fill, #d9d9d9 under the photo), `_image` (cover), `_overlay` (bottom gradient), `_title` (h3, H3 caps values, bottom left 2.5rem; 1.25rem and 1.5rem from small). |
| Q008 | `section_offers-slider-split` / `offers-slider-split_*` | 19 | 6 | Offers Slider Split (component `96c19058`). `_slider`, `_slides` (flex), `_slide` (100% wide), `_item` (two-column grid, 56.25rem; one column from medium), `_content` (centred column, 8rem padding; 40rem min from medium, 34rem from small), `_header` (33.75rem), `_heading` (Sackers 2.5rem / 1, -0.05em), `_text` (1.25rem / 1.3), `_footer`, `_button` (copy of `button is-chamfer`, cream with burgundy label, so variants can recolour it), `_figure` (#d9d9d9 fill; 25rem from medium), `_image` (cover), `_overlay` (absolute over the left half, eyebrow top, controls bottom), `_eyebrow` (eyebrow caps values), `_controls`, `_arrow` (+ `is-prev` 0.4 opacity), `_counter` (caption type), `_total` (0.5 opacity). Empty functional combos: `.section_offers-slider-split.swiper_slider`, `.offers-slider-split_slider.swiper(.offers)`, `.offers-slider-split_slides.swiper-wrapper`, `.offers-slider-split_slide.swiper-slide`. |
| Q006 | `overlay-detail-panel-modal_*` (root `overlay-detail-panel-modal_component`, no `section_`) | 36 | 1 | Overlay Detail Panel Modal (component `44cccc51`), a fixed full-viewport dialog. `_component` (hidden until the combo `.is-open`), `_backdrop`, `_panel` (cream chamfered), `_bar`, `_back`, `_close`, `_layout`, `_figure`, `_content`, `_header`, `_heading` (2.5rem), `_body` (two columns), `_list` and `_item-*` (spec rows, image cards or menu links by variant), `_footer`, `_button` (dark chamfer copy). Looks per variant, not combos: see `docs/figma/build-plans/Q006/plan.md` |
| Q007 | `room-list-hover-preview_*` (root `room-list-hover-preview_component`, no `section_`) | 26 | 4 | Room List Hover Preview (component `a9d40053`), a fixed full-viewport burgundy dialog. `_component` (hidden until `.is-open`), `_layout` (two equal columns; one from medium), `_content` (centred column), `_bar`, `_close` and `_back` (CAPS-CAPTION-16 values), `_main`, `_tabs`, `_tab` (H4-CAPS values, 0.5 opacity; `.is-active` and hover 1), `_list`, `_item` (no `display`, so the template `hide` wins), `_link` (as `_tab`, + `.is-active`), `_footer`, `_media` (sticky 100vh; 50vh first from medium), `_preview` (absolute, faded; `.is-active` shows it), `_figure`, `_image` (cover), `_details` (bottom gradient bar), `_header`, `_heading` (H3-CAPS values), `_specs`, `_spec` (EYEBROW-CAPS values), `_preview-footer` (holds `button is-chamfer`). |
| Q009 | `section_card-carousel-header-left` / `card-carousel-header-left_*` | 15 | 8 | Card Carousel Header Left (component `f5403de4`). Section (cream, 13.4375rem / 2.5rem left padding, overflow hidden; Compact variant 8.5rem), `_component` (flex row; column from medium), `_content` (40.4375rem column, space-between; full width from medium), `_header` (32.5rem, 2rem gap), `_heading` (Sackers 2.5rem / 1, -0.05em; 2rem small), `_text` (1.25rem / 1.3, Colors/Accent), `_controls`, `_arrow` (+ `is-disabled` 0.4), `_slider` (flex-grow, clipped), `_slides` (flex, top aligned), `_slide` (22.25rem + 2rem right margin; 16rem + 1rem small), `_link`, `_figure` (22rem, #d9d9d9; `is-tall` 31.375rem, `is-mid` 28.9375rem), `_image` (cover), `_label` (EYEBROW-CAPS values, Colors/Accent). Functional combos: `.section_card-carousel-header-left.swiper_slider` (empty), `.card-carousel-header-left_slider.swiper` (side margins 0), `.card-carousel-header-left_slider.swiper.cards` (empty), `.card-carousel-header-left_slides.swiper-wrapper` (empty), `.card-carousel-header-left_slide.swiper-slide` (width, height auto). |

| Q037 | `section_guidelines-process` / `guidelines-process_*` | 10 | 0 | guidelines/03 (component `split-text-list-dark`): dark section (Neutral Darkest, cream text), `_component` (grid `1fr 40.5rem`, one column from medium), `_header` (20.5rem), `_heading` (Sackers 1.5rem, weight 400), `_intro`, `_list` (`ol`, no markers), `_item` (2rem padding, 30% cream bottom rule; `:first-child` no top padding, `:last-child` no rule), `_number` (`sup`), `_text` (inline paragraph), `_link` (underlined). |
| Q037 | `section_guidelines-feature` / `guidelines-feature_*` | 4 | 0 | guidelines/05 (component `image-fullwidth-captioned`): `_component` (6rem / 2.5rem padding), `_figure` (1520 / 838, 4 / 5 from small, #d9d9d9 placeholder fill), `_caption` (`figcaption`, caps caption 16 values in olive, bottom left). |

**Shared placeholder.** `section_placeholder` (Q036, 2026-10-20): dashed box with a text note for Q005 to Q011 slots that are not built yet. Pages mark each one with `data-placeholder="Q0xx"`.
| Q040 | `section_gallery-all` / `gallery-all_*` | 4 | 2 | Filterable photo grid on `/gallery` (A05 `galleryFilter` root). Classes: `section_gallery-all` (relative, 0.75rem / 2rem padding), `gallery-all_grid` (flex wrap, centred, 1.5rem gap; 0.75rem on mobile), `gallery-all_item` (figure, 22.25rem x 25.875rem, #D9D9D9 fill; 20rem tall on tablet; half width x 14rem on mobile) with `is-narrow` (14.25rem) and `is-wide` (30.3125rem, full width on mobile), `gallery-all_tags-wrapper` (sticky, bottom 2rem, centred). The tag pill reuses `tab-pills-intro_tabs` and `tab-pills-intro_tab text-style-eyebrow-caps` (+ `is-active`); images use `u-image`. Also creates the shared `section_placeholder` (5rem padding, #D9D9D9, centred text) that page sessions use for unbuilt Q006 to Q011 sections. |
| Q041 | `section_gallery-all` (extended) | 1 | 1 | Arts gallery (arts/06, gallery-mosaic-captioned `is-dark` + `is-compact`) reuses the Q040 family. Adds combo `section_gallery-all.is-dark` (#262118 fill, 1.5rem top and bottom padding) and `gallery-all_link` (block, 100% x 100%, pointer): a LinkBlock inside each `gallery-all_item` figure that carries `data-modal-open` so tiles open their detail dialog by mouse and keyboard. |
| Q033 | `section_rooms-collection-quiz` / `rooms-collection-quiz_*` | 11 | 3 | Quiz steps rooms-collection/03 to 05 (component `quiz-step-split-image`), one family for all three. `_component` (two-column grid, 56.25rem tall; one column from medium), `_content` (burgundy panel, cream text, flex column), `_header`, `_counter`, `_options` (role list, 20.375rem column), `_option` (role listitem, stretches the button), `_footer`, `_link` (underlined), `_figure`, `_image` (cover). Combos: `.section_rooms-collection-quiz.is-first` (6.75rem top gap), empty `.rooms-collection-quiz_counter.text-style-caption`, empty `.rooms-collection-quiz_link.text-style-caps-caption-16`. Options are `button is-chamfer is-outline-light`; the selected one is `button is-chamfer is-text-burgundy`. |
| Q033 | `section_rooms-collection-recommendations` / `rooms-collection-recommendations_*` | 8 | 3 | rooms-collection/06 (component `heading-centered-links`). `_component`, `_header` (36rem), `_heading` (pre-line), `_text`, `_links`, `_link`, `_divider` (1px rule). Empty combos `.rooms-collection-recommendations_heading.heading-style-h2`, `_text.text-size-medium`, `_link.text-style-eyebrow-caps`. |
| Q033 | `section_rooms-collection-room-grid` / `rooms-collection-room-grid_*` | 11 | 3 | rooms-collection/07 (component `room-card-grid`). `_list` (2 columns, 1 from small), `_card` (link block, 8 / 9), `_figure`, `_image`, `_overlay` (bottom gradient), `_content`, `_header`, `_heading`, `_details`, `_detail`. Empty combos `_heading.heading-style-h3`, `_detail.text-style-eyebrow`; the view more pill is `button is-chamfer` on a paragraph. |
| Q031 | `section_home-art-stories` / `home-art-stories_*` | 10 | 0 | Home section 14 (art and stories, Figma heading-wide-image-cta, 1 instance). Classes: `_component` (centred column, 2.5rem gap), `_header` (max 50.375rem, 1.5rem gap), `_footer`, `_media` (A03 `data-image-trail-hover` zone, 1520 / 1568, chamfer clip-path; 3 / 4 from small), `_figure` (absolute fill), `_image`, `_trail-item` (Link, A03 item, 20.5rem, 11rem from small), `_trail-figure` (328 / 467, 0.75rem radius), `_trail-image`. Heading `heading-style-h1` (h2), eyebrow `text-style-eyebrow`, CTA `button is-chamfer is-outline`. |
| Q035 | `meetings-collection-venues_*` | 2 | 0 | Intro inside the meetings venue snap section (meetings-collection/02, root `section_venue-card-fullbleed`). `_heading` (script font variable, 5rem, 3.75rem medium, 2.75rem small, pre-line), `_text` (37.5rem, 1.25rem, 1rem small). |
| Q035 | `section_meetings-collection-features` / `meetings-collection-features_*` | 14 | 0 | meetings-collection/08 key features (unique item moved out of Q017). `_component` (grid, 30.25rem card column, one column from medium), `_intro` (sticky 8rem, static from medium), `_header`, `_heading` (Sackers 1.5rem), `_text`, `_footer`, `_list` (6.875rem gap), `_card`, `_figure` (484 / 596, #d9d9d9 placeholder), `_card-header`, `_card-heading` (Sackers 1rem), `_items` (no bullets), `_item` (1px rule, none on last-child). |
| Q044 | `section_neighborhood-corporate` / `neighborhood-corporate_*` | 12 | 0 | neighborhood/08 (component `image-grid-text-dark`, 1 instance). Burgundy section with cream text; `_component` (column, 2.5rem gap, 0.5rem side inset), `_header` (centred), `_heading` (H3-CAPS values), `_list` (2 columns, 2rem / 3.5rem gaps; 1 column from small), `_item` (article), `_figure` (744 / 456, #d9d9d9 fill, `data-image-placeholder`), `_content` (30.5rem), `_title` (EYEBROW-CAPS values), `_text` (1.25rem / 1.3), `_footer` (1px cream 30% top rule, space-between; stacked from small), `_caption` (CAPS-CAPTION-16 values, 50rem). CTA `button is-chamfer is-text-burgundy`. |
| Q038 | `section_rooms-individual-description` / `rooms-individual-description_*` | 10 | 0 | rooms-individual/03 room description (component `text-spec-list-split`, 1 instance). `_component` (grid 24.5rem and 38.5rem, space-between; one column from medium), `_content`, `_header`, `_heading` (H4-CAPS values, Sackers 1.5rem), `_text` (1.25rem / 1.3), `_footer` (holds `button is-link text-style-caps-caption-16`), `_list` (`ul`, no bullets), `_item` (1px rule, none on last-child), `_number` (`sup`, 0.625rem). |
| Q038 | `section_rooms-individual-amenities` / `rooms-individual-amenities_*` | 8 | 0 | rooms-individual/07 in room amenities (component `amenities-grid-centered`, 1 instance). `_component` (centred column), `_header` (31.5rem), `_heading` (H3-CAPS values, 1.875rem), `_text`, `_grid` (4 columns, 2 from medium, 1 from small), `_column` (`ul`, 1px left rule except first-child), `_item` (CAPS-CAPTION-16 values, 1px bottom rule except last-child, pre-line). |
| Q028 | `section_feature-grid-dark-eyebrow` / `feature-grid-dark-eyebrow_*` | 13 | 0 | legal/04 and corporate/04 (Legal Corporates template). Dark #262118 section, cream text. `_component` (centred column, 5rem gap), `_header`, `_heading` (Sackers 2rem / 1.2), `_list` (`ul`, 4 columns, 2 from medium, 1 from small), `_column` (`li`, 1px cream 30% left rule, none on first-child and from medium), `_item` (3rem vertical padding, 1px top rule on last-child; every item from medium), `_eyebrow` (EYEBROW-CAPS values), `_text` (1.25rem / 1.3), `_footer` (centred), `_logo` (8rem figure), `_logo-image`, `_caption` (caption tracked values, pre-line). |
| Q028 | `section_split-sticky-text-stacked-images` / `split-sticky-text-stacked-images_*` | 13 | 0 | legal/05 and corporate/05. Cream section, olive text. `_component` (2-column grid; 1 from medium), `_content` (sticky, top 8rem; static from medium), `_header`, `_heading` (H4-CAPS values, pre-line), `_text`, `_footer` (holds `button is-chamfer is-dark`), `_list` (`ul`, column, 28.5rem, right; 2-column grid from medium, 1 from small), `_item`, `_figure` (360 / 442), `_image` (cover), `_title` (EYEBROW-CAPS values), `_item-text`. |

Q020 `is-left` also sits on `image-trio-text_header`, `_list` and `_figure`; apply it to all three with the section. Empty chain paths (no CSS) exist for stacked combos the plans use, for example `split-image-text-light_content.is-start-7.is-bottom.is-wide-text` and `<heading>.text-style-script.is-large`; see section 6 of the write plan.

Q019 (2026-10-20): `map-feature_pin` background-color now uses `--_primitives---colors--tan` (Colors/Tan) instead of `#906E58`. New empty combos: `.map-feature_text.text-size-medium`, `.map-feature_text.text-style-eyebrow-caps`, `.map-feature_link.text-size-medium`, `.heading-style-h4.text-weight-normal`.

Not project classes: `(delete this)` is a Relume leftover.

---

## How to Use This Inventory

1. **Before every build session**, query `style_tool > get_styles(query: "all")` and cross-reference with this doc
2. **Match Figma text styles** with the tables above; don't default to heading-style-h1 through h6 by size alone
3. **Check components first**: if a section pattern exists as a component, insert an instance instead of building
4. **Reuse layout utilities**: aspect ratios, overlays, shadows, z-index helpers
5. **Use generic names** for new shared patterns (describe the layout, not the content)
6. **Update this doc** after each build with any new styles/components created

Q020 (2026-10-20): `image-trio-text_item-heading` now carries the EYEBROW-CAPS values (heading font variable, 1.125rem, line-height 1.2, weight 900, letter-spacing -0.03em, lowercase); card titles no longer stack `text-style-eyebrow-caps`. The empty combo `.image-trio-text_item-heading.text-style-eyebrow-caps` is unused.

W02 (2026-10-20, fix batches; details in `docs/figma/build-plans/W02/`):
- New: `form-split-script-contact_fieldset-header.is-spaced` (gap above the second field group), `article-body_footer` (CTA wrapper in the Happenings & Stories article body).
- Changed: `gallery-mosaic-captioned_caption` and `timeline-scatter-images_caption` now cream with a soft text-shadow; `history-timeline_label-wrap` align-items flex-start and `history-timeline_label` flex 0 0 auto (pills no longer collapse); `tab-pills-intro_tabs` and `venue-card-fullbleed_tabs` wrap and centre at small/tiny; `section_text-columns-info` padding-top 16rem on desktop only (Dinings template overlap).

## Wave 5 changes (2026-10-21)

- New: `card-stagger-header-left_link` (link wrapper around each other-dining card on the Dinings template); stagger moved to `card-stagger-header-left_card:nth-child(odd)` (6rem, 3rem at small) so hidden cards do not break it; `is-offset` unused.
- New: combo `tab-pills-intro_tabs.is-scroll` (Gallery and Arts tag bars only): one line, horizontal scroll at small and tiny, so the sticky `gallery-all_tags-wrapper` no longer grows to three lines over the photos.
- Changed: `map-feature_figure` aspect ratio 1/1 at small and 4/5 at tiny; `map-feature_image` object-position 25% 50% from small; `.map-feature_image.is-image-bg` keeps 50% 50% at small (Home, Rooms, Dining and Rooms Detail maps read larger on phones; Centered and Image Bg unchanged).
- New: `feature-grid-dark-eyebrow_hover-figure` (23.5625rem, aspect 377/486, hidden at small and tiny; positioned by `hoverFollowImage`); combo `site-nav_component.is-on-light` (neutral darkest text, toggled by `navContrast`).
