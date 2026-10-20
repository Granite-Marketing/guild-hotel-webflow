# Guild build follow-ups

Kept by the orchestrator; tick items as they are done. Sources: merged PRs #32, #33, #35, #36, #37, #38 and the Q012 to Q015 `plan.json` deviations on main.

## Stephen, in the Designer

- [ ] Q012: set the email input placeholder to `*Email` on the newsletter form (the Data API rejects `placeholder`).
- [ ] Q012: mark the background image decorative, so future library alt text does not apply to it.
- [ ] Q012: visual check of `/build-cta-booking-newsletter` against `docs/figma/build-plans/Q012/preview-base-1440.png` and the home/18 crop (nothing was compared yet).
- [ ] Q013: visual check of `/build-footer-links` in the Designer or on staging after a publish (no screenshots were taken).
- [ ] Q013: after a publish, check the live markup: the trailing span in the legal line, `role` on the `ul`, and decorative alt on the background image.
- [ ] Q014: upload the Zuma wordmark (`figma/vectors/group-270989670-416x101-250-1958.svg`) and set it on the dining-zuma reference hero logo slot.
- [ ] Q014: visual check of `/build-hero-fullbleed-centered` was done on 2026-10-20 and looked good; re-check once the Zuma logo and the blue and burgundy wide buttons are in.
- [ ] Q015: visual check of `/build-faq-accordion` in the Designer (fonts and the static chevron are the known differences).
- [ ] C02: review the 6 draft sample posts (3 per category) and their invented dates; nothing is published.
- [ ] K02: visual spot-check the 15 `🧱 <component>` draft pages for the new classes (padding, `text-size-large`, `text-style-script`, chamfer outline buttons).
- [ ] Q012, Q013, Q014, Q015: delete each build page (`/build-<component>`) once its component sits on the real pages, and delete the probe pages `x01-probe` and `x01-probe-b`.
- [ ] Q012, Q013, Q014, Q015: no rich text styling is needed for any of these four components.

## Decisions for Stephen

- [ ] Q014: per-instance variants (`is-text-dark`, `is-left`, button colours `is-blue`, `is-burgundy`) cannot switch on a component instance. Options: Webflow component variants, or a second component for the dark-text heroes (and separate ones for the button colours).
- [ ] Q012: the book now URL (`#` for now), the newsletter provider with success and error copy, and whether the Bonvoy logo should link.
- [ ] Q013: the 16 placeholder hrefs, the Studio circa URL, the responsive proposal, and `section role=contentinfo` versus `footer`.
- [ ] Q013: footer background image is shared with the book-your-escape section above it in Figma. Options: keep two separate crops, or one continuous image decided at page level.
- [ ] Q014: button links are a `#` placeholder because the plan has no booking URL. Supply the URL, or keep `#`.
- [ ] Q015: Link Block trigger (Enter works, Space does not) versus finding another way to get a native button. Options: accept the Link Block, or add Space handling in the accordion module.
- [ ] Q015: `accordion_*` classes are shared by the module contract. Confirm they stay shared rather than being renamed to `faq-accordion_*`.
- [ ] Q013: sections with an extra "other dining options" slider (Group 270990062) belong to the dining venue page entries, not the footer. Confirm.

## Agent follow-ups

- [ ] K02 (via Q014): create the missing combos `.button.is-chamfer.is-wide.is-blue` and `.button.is-chamfer.is-wide.is-burgundy` with the 12.125rem min-width, then update the dining reference buttons to use them.
- [ ] Q015: `.heading-style-h2.text-weight-normal` and the four accordion combos exist but are empty; decide whether they need styles or can stay empty, and promote `.heading-style-h2.text-weight-normal` to a shared combo if other families need it.
- [ ] Q015: add the chevron custom code `.accordion_header.is-active .accordion_icon { transform: rotate(0deg); }` to site custom code.
- [ ] Q015: change the accordion module so the first item is open on load.
- [ ] Q019 (from the K02 check): bind the `map-feature_pin` colour to the new Tan variable (Colors/Tan #906E58).
- [ ] K02 cleanup: replace six family image classes that duplicate `u-image` (`hero-fullbleed-centered_image`, `split-image-text-light_image`, `gallery-mosaic-captioned_image`, `image-trio-text_image`, `venue-card-fullbleed_image`, `image-inset-single_image`) with `u-image` on the components.
- [ ] K02 cleanup: merge the four identical logo classes (`cta-booking-newsletter_logo`, `footer-links_logo-image`, `hero-fullbleed-centered_logo`, `venue-card-fullbleed_logo`) into one shared logo class.
- [ ] K02: `accordion_item` border-bottom colour is a literal `rgba(38, 33, 24, 0.3)` and not bound to Neutral Darkest; rebind if Webflow allows an alpha variable.
- [ ] Q020: apply `is-left` to `image-trio-text_header`, `_list` and `_figure` as well as the section.
- [ ] Q014: add the per-instance variant mechanism once the decision above is made (component variants or a second component), and set the missing wide button combos on it.
- [ ] Q012: upload and record any remaining assets in `figma/assets.json` and `webflow-ids.md` (Bonvoy `6ad744318e4b52f5c4d49ec6` and Tribute Portfolio `6ad744312406f6ae5126bc5f` are already recorded).
- [ ] Q015: fix `validate-plan.mjs` failing on main with "proposedShared needs why" (K01 removed the `why` fields).
- [ ] Q013: place the Footer Links component on the 24 pages (left for a later step), then remove the build page.
