# Style & Component Inventory

This document is the **live reference** for what already exists in The Guild Hotel Webflow project. Before creating ANY new style or element, check here first. If a match exists, reuse it.

**Last updated:** 2026-10-20 by Q001 (token sync), regenerated from `style_tool > get_styles(query: "all")` on the live site: 600 styles (328 global, 245 combo, 27 tag).

---

## Existing Components (Reusable)

| Component | ID | Instances | Use For |
|---|---|---|---|
| Global Styles | `ab488b17-f25a-fbf8-5f54-4a3955eb57e5` | | Relume global styles embed (do not edit) |

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

Primitives also holds Relume's `Opacity/*` colours (White 5 to 60, Neutral Darkest 5 to 60, Transparent). The Neutral Darkest opacity steps are pure black at alpha, not #262118. Figma's many `#000000` alpha overlays have no variables; use these opacity steps where one is close, otherwise set the value on the class.

No variables exist for success, error, warning or info, or for the low-use Figma colours (#2B2927, #906E58, #F26849, #489CCA and others in `figma/tokens.json`). Create one only when a component needs it, in Primitives, with a descriptive name.

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
| `heading-style-h1` | Heading, 900 | 3.5rem / 1 | 0 | lowercase | 3.25 / 2.5rem | Display/Hero |
| `heading-style-h2` | Heading, 900 | 2.5rem / 1 | -0.05em | none | 2.25 / 1.875rem | H2-CAPS |
| `heading-style-h3` | Heading, 900 | 1.875rem / 1 | -0.05em | none | 1.75 / 1.5rem | H3-CAPS |
| `heading-style-h4` | Heading, 900 | 1.5rem / 1.2 | 0 | lowercase | 1.375 / 1.25rem | H4-CAPS |
| `heading-style-h5` | Heading, 900 | 1.25rem / 1.2 | 0 | lowercase | none / 1.125rem | H5-CAPS |
| `heading-style-h6` | inherits | 1.25rem / 1.4, 700 | | | none / 1.125rem | (Relume default, no Figma match) |
| `text-size-large` | inherits | 1.25rem | | | none / 1.125rem | (Relume default; same size as medium) |
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
| `text-style-script` | Accent, 400 | 3.75rem / 1.2 | | | Morello 60/72 (53) |

Figma variants with no class yet (add as `is-` modifiers inside the component that uses them): Display/Card (h2 at line height 0.95, lowercase, 9 uses), Display/Section (h1 at 3rem, 6 uses), Label/Large (h5 at 1.3125rem / 0.948, 4 uses), Morello 80/96 (16 uses) and 80/80 (5 uses).

### Relume text utilities (unchanged)

`text-weight-{xbold,bold,semibold,medium,normal,light}`, `text-align-{left,center,right}`, `text-style-{allcaps,italic,link,muted,nowrap,quote,strikethrough,2lines,3lines,tagline}`, `text-color-white`, `text-rich-text`.

### Tag styles

`h1` to `h6` use the heading font variable at weight 900 with Relume's sizes (3.5, 3, 2.5, 2, 1.5, 1.25rem). Always add a `heading-style-*` class to set the project size. `body` uses the body font at 1rem / 1.5. Other tag styles: `a`, `blockquote`, `figcaption`, `figure`, `img`, `label`, `li`, `ol`, `p`, `ul`.

---

## Layout and Utility Families (Relume, unchanged)

| Family | Classes |
|---|---|
| Page structure | `page-wrapper`, `main-wrapper`, `padding-global`, `padding-section-{large,medium,small}` (combo on `padding-global`), `container-{large,medium,small}` |
| Spacing | `margin-*` and `padding-*` directional bases (`-top`, `-bottom`, `-left`, `-right`, `-horizontal`, `-vertical`) with size combos (`-0`, `-tiny`, `-xxsmall` to `-xxhuge`, `-custom1` to `-custom3`); `spacer-{xxsmall..xxhuge}`; `spacing-clean` |
| Sizing | `max-width-{xxsmall..xxlarge,full}`, `max-width-full-{tablet,mobile-landscape,mobile-portrait}`, `align-center` |
| Visibility | `hide`, `hide-tablet`, `hide-mobile-landscape`, `hide-mobile-portrait`, `overflow-{auto,hidden,scroll,visible}`, `pointer-events-{auto,none}`, `z-index-{1,2}`, `layer` |
| Media | `aspect-ratio-{landscape,portrait,square,widescreen}`, `icon-1x1-*`, `icon-embed-*`, `icon-height-*` |
| Effects | `shadow-{xxsmall..xxlarge}`, `divider-horizontal`, `background-color-black`, `inherit-color`, `display-inlineflex` |
| Buttons | `button` with combos `is-secondary`, `is-alternate`, `is-small`, `is-icon`, `is-link`; `button-group` (`is-center`) |
| UI bits | `tag` (`is-text`, `is-alternate`), `tab-link`, `tabs-menu`, `dropdown-chevron`, `slider-arrow` (`is-bottom-next`, `is-bottom-previous`, `is-centre-next`, `is-centre-previous`), `slider-arrow-icon`, `category-filter-menu`, `category-filter-link`, `menu-icon` |
| Forms | `form_*` (component, form, field-wrapper, field-label, input with `is-select-input` and `is-text-area`, checkbox, radio, message-success, message-error), `error-text`, `success-text` |
| Relume starter blocks | `navbar_*`, `footer_*`, `section_faq` / `faq_*`, `section_contact` / `contact_*`, `utility_*` (password and 404 pages) |
| Style guide page only | `rl-styleguide_*`, `rl-styleguide-accent`, `stylesystem_*`, `color-scheme-1`, `color-schemes`, `class-label-*`, `hidden-ui-elements`, `global-styles`, `style-overrides` |

## Project Component Families

None yet. Record each shared class family here as build sessions create it (name, purpose, where used).

Planned, not yet created: the wave 2 shared classes, new colour variables and corrections to existing utilities are listed in `docs/figma/build-plans/shared-classes.md` (K01). Move each row here once the Designer session creates it.

Not project classes: `x01-probe_*` (9 classes and 2 combos) belong to the X01 probe and are deleted after it; `(delete this)` is a Relume leftover.

---

## How to Use This Inventory

1. **Before every build session**, query `style_tool > get_styles(query: "all")` and cross-reference with this doc
2. **Match Figma text styles** with the tables above; don't default to heading-style-h1 through h6 by size alone
3. **Check components first**: if a section pattern exists as a component, insert an instance instead of building
4. **Reuse layout utilities**: aspect ratios, overlays, shadows, z-index helpers
5. **Use generic names** for new shared patterns (describe the layout, not the content)
6. **Update this doc** after each build with any new styles/components created
