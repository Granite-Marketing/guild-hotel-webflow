# Q012 build plan: cta-booking-newsletter

Shared full-bleed CTA band: "Book your escape" (book now button) and "Stay in the loop" (newsletter email form) either side of a vertical divider, with the Marriott Bonvoy logo and caption below. One variant (base), 24 identical instances, no props. Build once on `home` (`home/18-book-your-escape`, page `6ad64060ae8eac6d7b7c4241`), convert to a Webflow component named "CTA Booking Newsletter", then insert instances on the other 23 pages.

Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html), regenerate with `node docs/figma/build-plans/Q012/build-preview.mjs` (CSS is generated from plan.json; needs the `assets` symlink for the background image).

## Tree

- `section` `section_cta-booking-newsletter`
  - `figure` `cta-booking-newsletter_background`
    - `img` `cta-booking-newsletter_background-image` (asset `6ad66fef6684c3e22ea4dc76`, alt empty)
  - `div` `cta-booking-newsletter_overlay` (aria-hidden)
  - `div` `padding-global padding-section-large`
    - `article` `cta-booking-newsletter_component`
      - `div` `cta-booking-newsletter_columns`
        - `div` `cta-booking-newsletter_column`
          - `header` `cta-booking-newsletter_header` > `h2` `heading-style-h1 text-weight-normal` "Book your escape"
          - `footer` `cta-booking-newsletter_actions` > `a` `button is-chamfer is-wide` "book now"
        - `div` `cta-booking-newsletter_divider` (aria-hidden)
        - `div` `cta-booking-newsletter_column`
          - `header` `cta-booking-newsletter_header` > `h2` `heading-style-h1 text-weight-normal` "Stay in the loop"
          - `footer` `cta-booking-newsletter_actions`
            - Form block `cta-booking-newsletter_form-block`
              - `form` `cta-booking-newsletter_form` (name `newsletter`)
                - email input `cta-booking-newsletter_input` (placeholder "*Email", required)
                - submit `button is-chamfer` "join us"
              - `w-form-done cta-booking-newsletter_form-message`
              - `w-form-fail cta-booking-newsletter_form-message`
      - `div` `cta-booking-newsletter_brand`
        - `figure` `cta-booking-newsletter_logo-wrapper` > `img` `cta-booking-newsletter_logo` (Bonvoy SVG, not uploaded yet)
        - `div` `text-style-caption` > `p` "Earn Marriott Bonvoy® Points on Every Stay"

## Classes

- Family: `section_cta-booking-newsletter` and 16 `cta-booking-newsletter_*` element classes.
- Reused: `padding-global`, `padding-section-large`, `heading-style-h1`, `text-weight-normal`, `button`, Webflow's `w-form-done` and `w-form-fail`.
- Proposed shared (K01 to reconcile): `is-chamfer` (cream chamfered button on `button`), `is-wide` (min-width 13.375rem), `text-style-caption` (Sackers 14/14/0.7 lowercase).
- Variables: `color-neutral-100`, `color-neutral-900`, `color-brand-4a1217`, `font-style-heading`.

Key desktop values (1600 frame): component padding 6.75rem top and 6.0625rem bottom inside `padding-section-large`, giving the 978px band; columns grid `1fr 1px 1fr`, min-height 26.625rem; column gap between heading and action 5.0625rem; form block 34.4375rem; logo 10.4375rem wide. Background image `object-position: 50% 25%` reproduces Figma's FILL crop of the 1667x2500 photo; overlay is black 20% plus a 0 to 56% bottom gradient (the Figma fills).

## Variants

Base only. The brief's optional `eyebrow-caps` and `gatch-20` elements and the alternate heading sizes are not built (see open questions).

Responsive (no mobile design exists, so these are proposals): tablet tightens padding and gaps; below 768px the columns stack and the divider becomes a 6rem horizontal rule; below 480px the logo shrinks to 8.5rem.

## Open questions

1. Optional texts ("A Landmark Reimagined" on rooms-individual/14; "other dining options", a Gatch paragraph and venue labels on dining-zuma/10) are in spec.json but not visible in either crop. Not built; all instances identical.
2. Book now URL unknown; plan uses `#`.
3. Newsletter provider and success or error copy unknown; plan uses a native Webflow form with default copy.
4. Bonvoy logo is not uploaded (`figma/brand/bonvoy.svg`); unknown whether it links to Marriott Bonvoy.
5. No mobile frame; responsive styles are proposals.
6. Shared names `is-chamfer`, `is-wide`, `text-style-caption` need K01 reconciliation.
7. Image placement is a manual Designer step (KTD10) unless MCP placement is proven.

## Deviations

- No `container-large`: columns are centred on the quarter lines of the full frame, as in Figma.
- Button type (CAPS-CAPTION-16) sits on `is-chamfer` rather than a separate text class.
- Headings are `h2` styled with `heading-style-h1`.

## Compare notes (Sonnet subagent, preview-base-1440 against each crop)

Fonts in the preview are fallbacks (Snell Roundhand for Morello, Copperplate for Sackers Heavy Gothic), so glyph widths differ everywhere.

**home/18-book-your-escape**
- Matches: two-column layout and copy; divider at y 220 to 645 (spec 220 to 646); headings at y about 375 (spec 374); book now pill 214 wide at y 491 to 527 (spec 492 to 528); logo 168 wide at y 681 to 729; caption at y 763 (spec 764); cream pills with maroon text; same photo framing.
- Differs: column centres sit about 21px inward because the preview is 1440 wide, not 1600; join us pill 128 wide against 144 and email underline 403 against 387 (fallback font is narrower, padding is right); "*Email" sits about 7px higher above its line; chamfer reads slightly deeper; caption 342 wide against 414 (font); preview background slightly lighter on the left curtains.

**rooms-individual/14-a-landmark-reimagined**
- Matches: same as home. No extra text visible ("A Landmark Reimagined" does not show).
- Differs: same as home.

**dining-zuma/10-other-dining-options** (and the 21 other instances, which share the same crop content)
- Matches: same as home. No extra text visible ("other dining options" does not show).
- Differs: same as home; Figma image a little darker.

**preview-base-390** (no reference)
- Coherent stacked order, 32px side margins, email field and join us fit on one row, no overflow or clipping, contrast fine.
- Minor: caption wraps with one word on the second line; "*Email" close to its underline; chamfered ends read slightly arrow-like at this size. Revisit once real fonts are loaded.
