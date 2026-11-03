---
title: Mobile Figma Parity - Plan
date: 2026-11-03
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
---

# Mobile Figma Parity - Plan

## Goal Capsule

- **Objective:** make the live site at 390px match the client's mobile Figma (THE GUILD - HANDOFF (Internal), file `J39OO1f7mLYOYZqVc8Mghw`), and build the booking menu on desktop and mobile.
- **Product authority:** Stephen. The mobile Figma is the source of truth below 768px; desktop stays as built.
- **Open blockers:** footer link list content (see Decisions). Nothing else blocks.

## Sources

- Mobile snapshot: `figma/mobile/` (`index.json` lists every frame; `renders/<page>/` holds 2x JPGs; `nodes.json.gz` holds full Figma specs). Refresh with `node scripts/api/figma/snapshot-mobile.mjs` (6 Figma calls). Build sessions never call Figma.
- Live captures at 390px: `figma/mobile/.live/` (gitignored, regenerate with Playwright at 390x844, 2x).
- Per-page diffs: `docs/figma/mobile/compare/*.md`. Each workstream below lists the files that cover it.
- UI kit renders: `figma/mobile/renders/ui-kit/` (foundations, controls, navigation, forms, cards, media, sections, icons).

## Findings in one line each

Most mismatches come from a handful of shared causes, so fixing components fixes every page:

1. Mobile gutter is 20px in Figma, 32px (`padding-global`) live. This causes most of the extra text wrapping.
2. Mobile body type is 16/20 in Figma, about 18/23 live; script headings are about 30% too large live.
3. The booking menu is not built anywhere; every Book link is `#book`.
4. Offers slider: the image belongs inside the maroon card on mobile; live drops it below the card.
5. Footer and newsletter: Figma stacks full-width Book Now, email and Join Us, centres the brand block, uses a 44px link pitch and hairlines; live is denser and left-aligned.
6. Collection selectors (tab pills, gallery filter, dining venue selector) are compact dropdown pills in Figma; live shows full pill rows.
7. Several image sections are staggered square images with indented text in Figma; live is full-width.

## Workstreams

M1 runs first and alone because it changes the base that every other comparison depends on. M2 to M7 then run in parallel: each owns separate class families, so no two sessions edit the same styles.

| ID | Workstream | Owns (class families / files) | Diff files |
|---|---|---|---|
| M1 | Mobile foundations | `padding-global` mobile gutter to 1.25rem; base body text size and line height below 768px; `text-style-script` and script heading mobile sizes; hero height (800px on mobile) | all |
| M2 | Site nav and booking menu | `site-nav_*`, new booking menu component and its script; day and night toggle visible on mobile | a, b, c, d, e, f + `renders/nav-mobile/`, `renders/nav-desktop/` |
| M3 | Footer and newsletter CTA | `section_cta-booking-newsletter`, `footer-links_*` / `site-nav_menu-footer` | a, b, c, d, f |
| M4 | Sliders and carousels | `section_offers-slider-split` (image inside card, pager, type), `section_card-carousel-header-left` (no arrows on mobile, card 310x436), `section_card-stagger-header-left` ("Other dining options" visible on venue pages) | a, b, c, d, f |
| M5 | FAQ, hero and script intro | `section_faq-accordion` (chevron up when open, row padding, type), `section_hero-fullbleed-centered` (type, Figma mobile CTA), `section_script-intro-centered` | all |
| M6 | Collection selectors and listings | `section_tab-pills-intro` (compact dropdown pill), `section_article-card-staggered` (staggered cards), gallery filter and tile gutters, `section_venue-card-fullbleed` selector, `section_text-columns-info` | b, d, e, f |
| M7 | Feature, form and image sections | `section_map-feature` mobile variant (full-bleed map, overlapping card, no extra photo), `overlay-detail-panel-modal` mobile (back arrow only, CTA, numbered specs, 2-column options), `section_form-split-script-contact`, staggered image sections (`split-image-text-light`, `image-pair-text`, `image-trio-text`, `timeline-scatter-images`), alignment fixes | a, b, c, e |

## Booking menu (M2) behaviour

- **Desktop:** Book Now opens a small panel in the top right: image left, maroon list right with Book a stay, Reserve a table (with arrow), Host an event, Book an appointment, and a close X (`renders/nav-desktop/`, frame window-1).
- **Desktop, Reserve a table:** replaces the panel with a full-height split: image left, maroon list right of venues (image, name, one-line blurb, Reserve button), Back at top left, close X (frame full-2).
- **Mobile:** Book opens a maroon bottom sheet with rounded top, the round date stamp, close X and the four options (frames `3 · Sun Menu / Booking sheet`).
- **Mobile, Reserve a table:** the sheet becomes a near full-height sheet with back arrow, wordmark, close X and a scrolling list of venue cards with Reserve buttons (frames `4 · Sun Menu / Table sheet`). Back returns to the four options.
- Venue list comes from the Dining CMS collection. Destination URLs for each option and each Reserve button stay `#book` placeholders until the client supplies them.
- Built on the existing modal contract (`docs/reference/modal-setup.md`): focus trap, Escape and click-outside close, return focus to the Book button.

## Success criteria

- Each page at 390px matches its Figma mobile frame section by section, judged by a side-by-side check like the one in `docs/figma/mobile/compare/`; remaining differences are only copy or CMS images.
- Desktop at 1440px is unchanged except for the new booking menu.
- Booking menu opens, steps into Reserve a table, goes Back and closes by keyboard and pointer on both sizes.

## Decisions

- **Footer link list (open, client):** Figma lists Hotel, Experience, Dining, Social with "The Lobby Terrace" and no Blog or Happenings; live adds Blog, Happenings, Solana Coffee and Garden Terrace. M3 matches layout only and leaves the links as they are until the client confirms.
- **Day and night toggle:** shown on mobile as in Figma, visual only. Its real job is to swap content in certain areas between a day and a night version; that behaviour is a separate later task and is not built here.
- **Top bar Book Now on mobile:** Figma has no Book Now in the mobile bar; the Book button lives in the menu overlay and the hero. M2 follows Figma.

## Out of scope

- The Trello feedback board (later pass).
- Copy and image content differences.
- Desktop layout changes beyond the booking menu.
