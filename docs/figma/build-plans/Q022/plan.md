# Q022 build plan: form-split-script-contact

Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html) with [preview.css](preview.css), both generated from `plan.json` by `node docs/figma/build-plans/Q022/gen-preview.mjs` (it also fails if any class in the tree or preview is undeclared). Screenshots: `node docs/figma/build-plans/Q022/shoot.mjs`.

Build on `meetings-collection/06-request-for-proposal` (page `/meetings`, id `6ad66fd96684c3e22ea4d417`), variant `is-tall`. No images; the button shape is CSS, not an asset.

## Tree

- `section` .section_form-split-script-contact (+ `is-tall` on meetings)
  - div .padding-global .padding-section-large
    - div .container-large
      - `article` .form-split-script-contact_component (grid: 0.785fr / 1fr, one column at tablet)
        - div .form-split-script-contact_content (+ `is-centered` on contact)
          - `header` .form-split-script-contact_header (+ `is-rotated` with a script heading)
            - h2 .heading-style-h1 .text-style-script (script) or .heading-style-h2 (caps, h1 tag on contact)
          - div .form-split-script-contact_paragraph .text-size-medium (optional) > p
          - div .form-split-script-contact_details (optional)
            - div .form-split-script-contact_detail (repeat)
              - div .form-split-script-contact_detail-label .text-size-regular .text-style-caps-caption-16
              - div .form-split-script-contact_detail-value .text-size-medium > p
          - div .form-split-script-contact_links (optional, contact only)
            - a .form-split-script-contact_link .text-size-regular .text-style-caps-caption-16 (repeat)
        - FormWrapper .form-split-script-contact_form-block (optional; not on contact; + `is-offset` when the left column has a paragraph)
          - form .form-split-script-contact_form
            - div .form-split-script-contact_fieldsets
              - div .form-split-script-contact_fieldset, role=group, aria-labelledby (repeat)
                - `header` .form-split-script-contact_fieldset-header > h3 .heading-style-h4
                - div .form-split-script-contact_fields (2-column grid, 1 column at 767)
                  - div .form-split-script-contact_field (+ `is-full` for full-width rows) > input .form-split-script-contact_input (placeholder + aria-label, default label deleted)
                  - div .form-split-script-contact_field .is-full > textarea .form-split-script-contact_input .is-textarea
            - `footer` .form-split-script-contact_footer > submit .button .is-chamfer is-dark
          - success and error messages .form-split-script-contact_message
        - `figure` .form-split-script-contact_media (optional, contact only: #D9D9D9 placeholder)

## Class family

New family `form-split-script-contact_*`: 26 entries, including the element modifiers `is-centered`, `is-rotated`, `is-offset`, `is-full`, `is-textarea`). Reused: `padding-global`, `padding-section-large`, `container-large`, `heading-style-h1`, `heading-style-h2`, `heading-style-h4`, `text-size-medium`, `text-size-regular`, `button`.

Proposed shared (for K01 to reconcile with sibling plans):

- `text-style-script` on `heading-style-h1`: Morello 3.75rem / 1.2 (53 uses site-wide).
- `text-style-caps-caption-16` on `text-size-regular`: the tokens.json suggested combo (242 uses).
- `is-chamfer is-dark` on `button`: dark clipped-corner button from vector 25 (4 shared briefs use it).

Variables: `color-neutral-100`, `color-neutral-900`, `color-accent`, `font-style-heading`, `font-style-body`.

## Variants

- **base** (guidelines, press, contact, legal, corporate): padding-section-large only. Content differences are optional elements, not variants: paragraph and details (press, legal), links and media instead of a form (contact), caps heading (contact).
- **is-tall** (meetings): section padding-top 10.75rem and padding-bottom 8.25rem on desktop, added to padding-section-large (matches the 1283px reference), 2rem at tablet, 0 from mobile landscape down.

## Open questions

1. Webflow component shape: forms differ on every instance, so the plan proposes one component with slots (form, details, links) and component variants for script versus caps heading. Alternative: class family only, with the identical legal/corporate pair as a no-prop component.
2. Contact page: what fills the grey 905x726 placeholder (map embed, image)?
3. Contact page: instagram and facebook URLs.
4. Form handling: submit destination and notification address for the five forms; field names are proposals.
5. Date and time fields use type=text to keep the placeholder look; confirm or accept native pickers.
6. Container width: Figma content is about 1482px in a 1600 frame; container-large caps it at 1280.
8. Base top padding: the base crops place the heading 94px to 240px below the band top, so one value cannot match all; the plan uses padding-section-large (7rem). The build session should confirm against neighbouring sections once pages are assembled.
7. clip-path for `is-chamfer is-dark` may need a custom CSS embed if the Webflow style panel lacks it.

## Deviations

See `deviations` in plan.json: #2B2927 mapped to color-neutral-900; contact labels at 16px instead of 18px and its heading in neutral-900 instead of accent; the cream "A Landmark Reimagined" heading in the legal/corporate specs and the contact nav are outside this component; labels are placeholders with aria-label.

## Compare notes per crop

A Sonnet subagent compared each 1440 screenshot with its crop and judged each 390 screenshot for stacking. Fonts are substituted locally (Morello as Snell Roundhand, Sackers as Copperplate, Gatch as Avenir Next), so letter widths and weights are not comparable. After the first pass the plan changed: `is-offset` on the form block, form block margin-top 1.25rem, is-tall top padding 10.75rem, lighter underline, textarea grip removed, detail label gap 0.625rem. The screenshots in this folder are from after those changes; the mismatches listed below are the ones still open.

**All crops.** Match: cream background, dark text, olive paragraph and detail text, two-column split with the form at about 44%, two-column field grid with full-width rows, 58px row pitch, 74px fieldset heading to first field, textarea height (129 vs 128px), clipped button right-aligned, 37px button height, heading tilt and size. Still different: the submit button is about 36px narrower because of font substitution (padding follows the vector); preview cream is a touch warmer than the crop's compression.

**is-tall** (`meetings-collection/06-request-for-proposal`). Match: layout, both fieldsets, gap between fieldsets, heading width and tilt, textarea, button. Fixed after the first pass: top padding was about 60px short and the form heading sat 21px too high. 390: stacks cleanly, no overflow.

**base** (`guidelines/06-photoshoot-request`). Match: layout, contact and shoot fieldsets, full-width "nature of the shoot", textarea, button, no paragraph. Fixed: form offset of about 20px. Still different: top padding is 15px to 35px shorter than the crop (see open question 8). 390: good.

**base, press** (`press/08-press-enquiries`). Match: paragraph then email detail, heading to paragraph gap (55 vs 57px), paragraph to detail gap (84 vs 78px), three field rows plus textarea, button. Fixed: the form now starts level with the paragraph (was about 105px high). Still different: top padding about 140px short in this crop (open question 8); paragraph wraps to 4 lines instead of 3 (font width). 390: good.

**base, contact** (`contact/01-contact-us`). Match: text column centred against the grey block, group pitch (89 vs 90px), line pitch, underlined social links with 40px gap, grey block colour and 905/726 ratio, caps heading. Still different: Figma labels are 18px EYEBROW-CAPS with wider tracking; the plan uses caps-caption-16 (recorded deviation). Fixed: label to value gap was 5px too large. 390: details first, then the grey block; no overflow.

**base, legal** (`legal/12-a-landmark-reimagined`; corporate is identical). Match: three detail groups with 89px pitch, label to value gap, four field rows plus textarea, button, olive paragraph. Fixed: the form now starts level with the paragraph (was about 130px high). Still different: top padding about 100px short in this crop (open question 8); paragraph wraps to 4 lines (font width). 390: good.

## K01 reconciliation (2026-10-20)

`plan.json` is authoritative where this page differs. Shared classes, new variables and live corrections: [shared-classes.md](../shared-classes.md).

- Class list `heading-style-h1 text-style-script` is now `text-style-script`.
- Class list `form-split-script-contact_detail-label text-size-regular text-style-caps-caption-16` is now `form-split-script-contact_detail-label text-style-caps-caption-16`.
- Class list `form-split-script-contact_link text-size-regular text-style-caps-caption-16` is now `form-split-script-contact_link text-style-caps-caption-16`.
- Class list `button is-clipped` is now `button is-chamfer is-dark`.
- Submit button is `button is-chamfer is-dark` (was `is-clipped`); type is Label/Button instead of CAPS-CAPTION-16.
- Script heading uses the live `text-style-script` (Morello 60/72); its tablet and mobile steps are a live correction.
- Variables use live CSS names (`--_primitives---colors--*`, `--_typography---font-styles--*`).
