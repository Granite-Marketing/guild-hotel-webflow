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
| Media | `u-image` (block, 100% by 100%, cover; K02), `aspect-ratio-{landscape,portrait,square,widescreen}`, `icon-1x1-*`, `icon-embed-*`, `icon-height-*` |
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
| Q014 | `section_hero-fullbleed-centered` / `hero-fullbleed-centered_*` | 9 | 2 | `is-left`, `is-text-dark` |
| Q015 | `section_faq-accordion` / `faq-accordion_*` | 4 | 0 | none |
| Q016 | `section_script-intro-centered` / `script-intro-centered_*` | 11 | 3 | `is-bottom`, `is-tall`, `is-wide` |
| Q017 | `section_split-image-text-light` / `split-image-text-light_*` | 12 | 18 | `is-below`, `is-blue`, `is-bottom`, `is-chamfer`, `is-end`, `is-end-half`, `is-olive`, `is-outdent`, `is-overlap`, `is-secondary`, `is-start-1`, `is-start-2`, `is-start-4`, `is-start-7`, `is-start-9`, `is-tan`, `is-wide`, `is-wide-text` |
| Q018 | `section_gallery-mosaic-captioned` / `gallery-mosaic-captioned_*` | 10 | 1 | `is-wide` |
| Q019 | `section_map-feature` / `map-feature_*` | 15 | 15 | `is-centered`, `is-image-bg`, `is-pin-1`, `is-pin-2`, `is-pin-3`, `is-pin-4` |
| Q020 | `section_image-trio-text` / `image-trio-text_*` | 15 | 5 | `is-left`, `is-offset` |
| Q021 | `section_venue-card-fullbleed` / `venue-card-fullbleed_*` | 17 | 11 | `is-active`, `is-left`, `is-media-center`, `is-tall` |
| Q022 | `section_form-split-script-contact` / `form-split-script-contact_*` | 22 | 6 | `is-centered`, `is-full`, `is-offset`, `is-rotated`, `is-tall`, `is-textarea` |
| Q023 | `section_tab-pills-intro` / `tab-pills-intro_*` | 9 | 6 | `is-active`, `is-media` |
| Q005 | `site-nav_*` (root `site-nav_component`, no `section_`) | 21 | 2 | `is-active` (mode), `is-end` (menu detail) |
| Q024 | `section_image-inset-single` / `image-inset-single_*` | 3 | 1 | `is-small` |
| Q025 | `section_article-card-staggered` / `article-card-staggered_*` | 9 | 7 | `is-right`, `is-tall` |
| Q026 | `section_timeline-scatter-images` / `timeline-scatter-images_*` | 9 | 19 | `is-center`, `is-end`, `is-inset`, `is-large`, `is-lift`, `is-medium`, `is-small`, `is-tall`, `is-xlarge`, `is-xsmall` |

**Page one-off section families (wave 3).** A page session creates one family per one-off section, named `section_<page>-<section>` (HANDOVER-wave3 rule 3).

| Entry | Family | Base classes | Combos | Notes |
|---|---|---|---|---|
| Q042 | `section_static-template-privacy-policy` / `static-template-privacy-policy_*` | 9 | 0 | Legal copy on `/static-template` (component `rich-text-legal`). Classes: `_component` (two-column grid, one column from medium), `_header`, `_content`, `_block` (article), `_block-header`, `_body` (1.25rem / 1.3, 1.625rem gap), `_text` (paragraph, `white-space: pre-line`), `_list`. Headings use `heading-style-h2` (h1) and `heading-style-h5` (h2) alone. Reuse this family for the legal and corporate pages if they stay static. |
| Q040 | `section_gallery-all` / `gallery-all_*` | 4 | 2 | Filterable photo grid on `/gallery` (A05 `galleryFilter` root). Classes: `section_gallery-all` (relative, 0.75rem / 2rem padding), `gallery-all_grid` (flex wrap, centred, 1.5rem gap; 0.75rem on mobile), `gallery-all_item` (figure, 22.25rem x 25.875rem, #D9D9D9 fill; 20rem tall on tablet; half width x 14rem on mobile) with `is-narrow` (14.25rem) and `is-wide` (30.3125rem, full width on mobile), `gallery-all_tags-wrapper` (sticky, bottom 2rem, centred). The tag pill reuses `tab-pills-intro_tabs` and `tab-pills-intro_tab text-style-eyebrow-caps` (+ `is-active`); images use `u-image`. Also creates the shared `section_placeholder` (5rem padding, #D9D9D9, centred text) that page sessions use for unbuilt Q006 to Q011 sections. |

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
