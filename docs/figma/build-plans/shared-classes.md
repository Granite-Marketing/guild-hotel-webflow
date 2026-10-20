# Shared classes (K01)

The one list of classes that sit outside every component family. The Designer session creates these once, before the first wave 2 component (Q012), then each Q entry applies its plan. Source of truth: `shared-classes.json` (same content, machine-readable); this page is generated from it.

Live read: 2026-10-20, Data API `style_tool` and `variable_tool` on site `6ad6405eae8eac6d7b7c41a3` (589 styles, names in `live-style-names.json`). Values use the live variable CSS names; variable IDs are in `docs/reference/style-inventory.md`.

## Before creating anything

1. Create the three new colour variables (Primitives collection).
2. Apply the live corrections (they change existing classes site-wide; Stephen approves them with this PR).
3. Upload the two outline SVGs in `shared-assets/` and swap their URLs into `is-outline` and `is-outline-light`.
4. Create the shared classes below, in table order (parents before combos).

## New variables

| Variable | CSS name | Value | Used by | Replaces |
|---|---|---|---|---|
| Colors/Blue | `--_primitives---colors--blue` | #489CCA | Q014 | `color-brand-489cca` |
| Colors/Tan | `--_primitives---colors--tan` | #906E58 | Q017 | `color-brand-906e58` |
| Colors/Navy | `--_primitives---colors--navy` | #00263E | Q017 | `color-brand-00263e` |

## Variable renames in the plans

Every plan now uses live CSS names. The convention names in `CLAUDE.md` map as follows.

| Was | Now |
|---|---|
| `--color-neutral-900` | `--_primitives---colors--neutral-darkest` |
| `--color-neutral-100` | `--_primitives---colors--neutral-lightest` |
| `--color-neutral-300` | `--_primitives---colors--neutral-lighter` |
| `--color-accent` | `--_primitives---colors--accent` |
| `--color-secondary` | `--_primitives---colors--secondary` |
| `--color-primary` | `--_primitives---colors--primary` |
| `--color-brand-4a1217` | `--_primitives---colors--burgundy` |
| `--color-brand-489cca` | `--_primitives---colors--blue` |
| `--color-brand-906e58` | `--_primitives---colors--tan` |
| `--color-brand-00263e` | `--_primitives---colors--navy` |
| `--font-style-heading` | `--_typography---font-styles--heading` |
| `--font-style-body` | `--_typography---font-styles--body` |

## Live corrections (existing classes)

These classes exist live but differ from the documented scale that every preview assumes. Update them in the Designer; do not create new classes.

| Class | Live now | Change to | Why |
|---|---|---|---|
| `padding-global` | desktop: padding-left 5%, padding-right 5% | desktop: padding-left 2rem, padding-right 2rem | CLAUDE.md and docs/reference/breakpoints.md fix it at 2rem; every preview assumes 2rem. |
| `padding-section-large` | desktop: 7rem; tablet: 6rem; mobileLandscape: 4rem; mobilePortrait: 4rem | desktop: 7rem; tablet: 5rem; mobileLandscape: 3.5rem; mobilePortrait: 2.5rem | docs/reference/breakpoints.md scale; previews use it. Values are padding-top and padding-bottom. |
| `padding-section-medium` | desktop: 5rem; tablet: 4rem; mobileLandscape: 3rem; mobilePortrait: 3rem | desktop: 5rem; tablet: 3.5rem; mobileLandscape: 2.5rem; mobilePortrait: 2rem | docs/reference/breakpoints.md scale. |
| `padding-section-small` | desktop: 3rem; tablet: 3rem; mobileLandscape: 2rem; mobilePortrait: 2rem | desktop: 3rem; tablet: 2rem; mobileLandscape: 1.5rem; mobilePortrait: 1rem | docs/reference/breakpoints.md scale. |
| `text-style-script` | desktop: font-size 3.75rem | tablet: font-size 3.25rem; mobilePortrait: font-size 2.5rem | Q001 set desktop only; Q022 needs the responsive steps for Morello 60. |
| `text-size-large` | desktop: font-size 1.25rem; mobileLandscape: font-size 1.125rem | desktop: font-size 1.375rem, line-height 1.6; mobileLandscape: font-size 1.125rem | Live text-size-large equals text-size-medium. Q014 and Q021 both use it for Gatch 22/35.2 and assume 1.375rem. |

## Shared classes to create

`On` is the parent chain for a combo class (empty for a standalone class). Breakpoints: Tablet 991px, Mobile L 767px, Mobile P 479px.

| Class | On | Role | Desktop | Tablet | Mobile L | Mobile P | Used by |
|---|---|---|---|---|---|---|---|
| `text-style-caption-tracked` |  | Sackers 14/14 caption tracked 0.05em (figma/tokens.json 648 uses): footer links, CTA captions | `font-family: var(--_typography---font-styles--heading)`; `font-weight: 900`; `font-size: 0.875rem`; `line-height: 1`; `letter-spacing: 0.05em`; `text-transform: lowercase` |  |  |  | Q012, Q013 |
| `is-large` | `text-style-script` | Morello 80/96 script display size (16 uses); base text-style-script is Morello 60/72 | `font-size: 5rem` | `font-size: 4rem` | `font-size: 3.25rem` | `font-size: 2.75rem` | Q016, Q017, Q019, Q023 |
| `heading-style-display` |  | Sackers 80/80 display heading (19 uses, venue cards) | `font-family: var(--_typography---font-styles--heading)`; `font-weight: 900`; `font-size: 5rem`; `line-height: 1`; `text-transform: lowercase` | `font-size: 4rem` | `font-size: 3.25rem` | `font-size: 2.5rem` | Q021 |
| `padding-section-xlarge` | `padding-global` | Section vertical padding for the 220 to 240px script intro gaps | `padding-top: 14rem`; `padding-bottom: 14rem` | `padding-top: 10rem`; `padding-bottom: 10rem` | `padding-top: 6rem`; `padding-bottom: 6rem` | `padding-top: 5rem`; `padding-bottom: 5rem` | Q016 |
| `container-full` |  | Full-width container aligned to the padding-global gutter | `width: 100%`; `max-width: none`; `margin-left: auto`; `margin-right: auto` |  |  |  | Q017 |
| `u-image` |  | Image fills its figure wrapper (CLAUDE.md utility, missing on the live site) | `display: block`; `width: 100%`; `height: 100%`; `object-fit: cover` |  |  |  | Q025, Q026 |
| `is-chamfer` | `button` | Site-wide Guild button: vector-25 chamfered shape (194x37, 54 uses), cream fill, dark text, Label/Button type | `display: inline-flex`; `justify-content: center`; `align-items: center`; `min-height: 2.3125rem`; `padding-top: 0.5625rem`; `padding-bottom: 0.5625rem`; `padding-left: 1.5rem`; `padding-right: 1.5rem`; `border-top-width: 0px`; `border-right-width: 0px`; `border-bottom-width: 0px`; `border-left-width: 0px`; `border-radius: 0px`; `background-color: var(--_primitives---colors--neutral-lightest)`; `color: var(--_primitives---colors--neutral-darkest)`; `font-family: var(--_typography---font-styles--heading)`; `font-weight: 900`; `font-size: 1rem`; `line-height: 1`; `letter-spacing: 0em`; `text-transform: lowercase`; `text-align: center`; `text-decoration: none`; `clip-path: polygon(0 0.75rem, 0.6875rem 0, calc(100% - 0.6875rem) 0, 100% 0.75rem, 100% calc(100% - 0.75rem), calc(100% - 0.6875rem) 100%, 0.6875rem 100%, 0 calc(100% - 0.75rem))` |  |  |  | Q012, Q014, Q019, Q021, Q022 |
| `is-wide` | `button is-chamfer` | Standard 194px minimum button width | `min-width: 12.125rem` |  |  |  | Q012, Q014 |
| `is-text-burgundy` | `button is-chamfer` | Cream button with burgundy label | `color: var(--_primitives---colors--burgundy)` |  |  |  | Q012 |
| `is-dark` | `button is-chamfer` | Dark fill, cream label | `background-color: var(--_primitives---colors--neutral-darkest)`; `color: var(--_primitives---colors--neutral-lightest)` |  |  |  | Q022 |
| `is-burgundy` | `button is-chamfer` | Burgundy fill, light label (dining venue heroes) | `background-color: var(--_primitives---colors--burgundy)`; `color: var(--_primitives---colors--secondary)` |  |  |  | Q014 |
| `is-blue` | `button is-chamfer` | Zuma blue fill, light label | `background-color: var(--_primitives---colors--blue)`; `color: var(--_primitives---colors--secondary)` |  |  |  | Q014 |
| `is-outline` | `button is-chamfer` | Outlined chamfer button, dark stroke and label, for cream backgrounds | `background-color: transparent`; `clip-path: none`; `background-image: url(shared-assets/button-outline-dark.svg)`; `background-size: 100% 100%`; `background-repeat: no-repeat`; `color: var(--_primitives---colors--neutral-darkest)` |  |  |  | Q019 |
| `is-outline-light` | `button is-chamfer` | Outlined chamfer button, cream stroke and label, for images and dark backgrounds | `background-color: transparent`; `clip-path: none`; `background-image: url(shared-assets/button-outline-light.svg)`; `background-size: 100% 100%`; `background-repeat: no-repeat`; `color: var(--_primitives---colors--neutral-lightest)` |  |  |  | Q021 |
| `accordion_item` |  | Runtime contract of src/utils/accordion.ts (docs/reference/component-patterns.md, Accordion contract); any future accordion reuses it | `border-bottom: 1px solid color-mix(in srgb, var(--_primitives---colors--neutral-darkest) 30%, transparent)` |  |  |  | Q015 |
| `accordion_header` |  | Click target the accordion module binds to (.accordion_header); module toggles is-active and aria-expanded on it | `display: flex`; `width: 100%`; `justify-content: space-between`; `align-items: center`; `column-gap: 2rem`; `padding-top: 2.625rem`; `padding-right: 0rem`; `padding-bottom: 0.625rem`; `padding-left: 0rem`; `border-top-width: 0px`; `border-right-width: 0px`; `border-bottom-width: 0px`; `border-left-width: 0px`; `background-color: transparent`; `color: inherit`; `text-align: left`; `cursor: pointer` |  | `column-gap: 1rem`; `padding-top: 1.75rem` |  | Q015 |
| `accordion_question` |  | Question text inside the trigger; carries heading-style-h4 so the trigger can stay a native button | `flex-grow: 1` |  |  |  | Q015 |
| `accordion_icon` |  | Chevron wrapper (figure-style wrapper for the inline SVG); rotates with the header state | `display: flex`; `width: 1.5rem`; `height: 1.5rem`; `flex-shrink: 0`; `transform: rotate(180deg)`; `transition: transform 300ms ease` |  |  |  | Q015 |
| `accordion_content-wrapper` |  | Next sibling of the header; the module animates its max-height | `overflow: hidden`; `transition: max-height 400ms ease` |  |  |  | Q015 |
| `accordion_content` |  | Inner content the module measures (offsetHeight) for the open height | `padding-top: 0.9375rem`; `padding-bottom: 2.75rem` |  | `padding-top: 0.75rem`; `padding-bottom: 1.75rem` |  | Q015 |

States: `accordion_header.is-active .accordion_icon` sets `transform: rotate(0deg)` (the module toggles `is-active`).

### Notes per class

- `text-style-caption-tracked`: The live text-style-caption is Label/Caption 14/15 untracked, so the tracked caption needs its own name.
- `is-large`: Line height stays 1.2 from text-style-script. Q017 and Q019 measured 80/80 on one-line headings; only the box height changes (about 16px).
- `heading-style-display`: Q021 proposal kept; weight 900 because Sackers is uploaded at 900 only; lowercase matches the other heading-style-* classes.
- `padding-section-xlarge`: Same pattern as the live padding-section-* combos on padding-global.
- `u-image`: Q026 assumed display block, max-width 100%. Its image wrappers set the size, so the cover version renders the same; confirmed in the K01 re-render.
- `is-chamfer`: Typography is Label/Button (same values as the live text-style-button), so buttons need no extra text class. Q012 and Q022 measured CAPS-CAPTION-16 (line height 1.2, -0.03em); the 37px min-height keeps the box size.
- `is-wide`: Q012 book now measured 214px; the 194px vector is the site standard (54 uses).
- `is-blue`: Needs the new variable Colors/Blue (#489CCA).
- `is-outline`: Upload docs/figma/build-plans/shared-assets/button-outline-dark.svg as a site asset and use its URL. A chamfered outline cannot come from border plus clip-path.
- `is-outline-light`: Upload docs/figma/build-plans/shared-assets/button-outline-light.svg (same file as Q021/button-outline.svg).
- `accordion_item`: Runtime contract of src/utils/accordion.ts; generic name so any accordion reuses it.
- `accordion_header`: Runtime contract of src/utils/accordion.ts; generic name so any accordion reuses it.
- `accordion_question`: Runtime contract of src/utils/accordion.ts; generic name so any accordion reuses it.
- `accordion_icon`: Runtime contract of src/utils/accordion.ts; generic name so any accordion reuses it.
- `accordion_content-wrapper`: Runtime contract of src/utils/accordion.ts; generic name so any accordion reuses it.
- `accordion_content`: Runtime contract of src/utils/accordion.ts; generic name so any accordion reuses it.

## Live classes the plans reuse (no change)

`text-style-eyebrow-caps`, `text-style-caps-caption-16`, `text-style-button`, `text-style-caption`, `text-style-script` (Q001 standalone text styles; use alone, without `text-size-*` or `text-weight-*`), `heading-style-h1` to `h5`, `text-size-medium`, `text-size-regular`, `text-weight-normal`, `text-rich-text`, `container-large`, `button`, `button is-link`. Webflow built-ins: `w-form-done`, `w-form-fail`.

## Grouping decisions

| Job | Proposals merged | Canonical |
|---|---|---|
| Chamfered vector-25 button | Q012 `is-chamfer` (cream, burgundy text), Q014 `is-octagon`, Q019 `is-chamfer` (outline), Q021 `button` assumption, Q022 `is-clipped` | `button is-chamfer` plus colour combos `is-text-burgundy`, `is-dark`, `is-burgundy`, `is-blue`, `is-outline`, `is-outline-light`, and width combo `is-wide` |
| Morello script heading | Q016, Q017, Q019, Q022, Q023 `text-style-script` combos on `heading-style-h1` (60 and 80 sizes) | live `text-style-script` (60/72) alone; `text-style-script is-large` for 80/96 |
| Eyebrow, caps caption, button label | Q013 to Q026 `text-style-eyebrow-caps`, `text-style-caps-caption-16`, `text-style-button` (combo and standalone versions) | live standalone classes from Q001 |
| Sackers 14 untracked | Q013 `text-style-legal` | live `text-style-caption` (14/15, 0.14px taller line) |
| Sackers 14 tracked | Q012 and Q013 `text-style-caption` (14/14, 0.05em) | new `text-style-caption-tracked` (the live `text-style-caption` is the untracked style) |

Not merged, on purpose:

- Q021 `venue-card-fullbleed_stage`, `_media`, `_tabs`, `_tab` and Q023 `tab-pills-intro_stage`, `_frame`, `_tabs`, `_tab` do the same jobs (scroll-enlarge-snap stage, media frame, pill tab nav). Their start sizes and frame shapes differ, and both are family classes rather than proposals, so K01 kept them in their families. The pill tab nav is nearly identical in both (burgundy, same clip-path and gap; tab opacity 0.7 against 0.45); a follow-up can extract one shared pair if Stephen wants it.
- D02 (`docs/figma/decisions.md`) keeps all five near-identical component pairs separate. Of those, only split-image-text-light (Q017) and timeline-scatter-images (Q026) are wave 2 plans, and they already have separate families, so no plan merge was needed.

## Not shared classes

`x01-probe_*` and `(delete this)` are probe and Relume leftovers, not shared classes. The 2026-10-20 read found no `x01-probe_*` styles left; `(delete this)` is still there.

## Checking

`python3 docs/figma/build-plans/k01-check.py` confirms that every class in every plan tree, instance and variant is in `live-style-names.json`, `shared-classes.json` or that plan's own family, and that every `var()` uses a live name.
