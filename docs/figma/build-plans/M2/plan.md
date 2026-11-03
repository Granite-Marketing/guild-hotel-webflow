# M2 build plan: booking menu and mobile site nav

Workstream M2 of `docs/plans/2026-11-03-001-feat-mobile-figma-parity-plan.md`. Status: approved by Stephen and built on 2026-11-03; staging verified (see Result).

## Finding: both views already exist

Q006 built the two booking views as variants of **Overlay Detail Panel Modal** (`44cccc51-37cb-2526-e426-133987071983`) and never placed them:

- **Burgundy** (`0e56f707-a8b4-d396-c73a-900ce080b5db`) = Figma window-1, the Book Now panel with four links.
- **Image Bg** (`72048989-461a-61a0-ac02-cfc3ae7b6e5c`) = Figma full-2, the venue list with Back and X.

So M2 reuses them. No new class family for the dialogs.

## Script

`src/utils/modals.ts` already covers the flow; the only change is that dialog hash links are now handled in its capture-phase listener so Webflow.js cannot scroll the page or push `#book` (see `docs/solutions/integration-issues/webflow-js-anchor-scroll-overrides-lenis.md`):

- Any `a[href="#book"]` opens the dialog whose DOM id is `book`. Every Book link on the site is `#book` today, so they all start working once the dialog exists.
- "Reserve a table" links to `#book-table`: opening a dialog from inside another closes the first and keeps focus return on the original Book button.
- Back is a `[data-modal-close]` with `href="#book"`: the script switches back to the four options instead of closing.
- X, Escape and each dialog's own backdrop (`[data-modal-close]`) close everything; focus trap and scroll lock are built in.

Placeholder links: the three other options keep `#book` (a no-op while that dialog is open). The venue Reserve buttons use `#`, because `#book` there would jump back to the four options.

## Webflow changes

### 1. Overlay Detail Panel Modal (shared with M7, additive only)

| Change | Default | Effect on existing instances |
|---|---|---|
| Link prop **Back link** bound to `_back` href | `#` | none (`#` still just closes) |
| Boolean prop **Show venues** + a Collection List in `_body`: Dinings, sorted by `sort-order`; item = `_item-figure` > img (`home-card-image`), `_item-title` (`name`), `_item-text` (`home-card-tagline`), `_item-button` "reserve" (`#`) | off | none |
| `_stamp` image (asset `guild-postmark-stamp.svg` `6ad74da46b56ff1d7223e4d7`) in `_content` | hidden | none |
| `_wordmark` embed (the Site Nav logo SVG) in `_bar` | hidden | none |

Classes reuse the existing `overlay-detail-panel-modal_*` family; only `_stamp` and `_wordmark` are new elements of it.

Variant styles, Burgundy and Image Bg only (Base, Dark, Centered untouched, so no overlap with M7's mobile work on Base):

- **Burgundy, medium and below:** bottom sheet: full width, pinned to the bottom, burgundy, chamfered top corners; image hidden; stamp centred at the top; X top right; the four links centred in larger caps (Figma `3 · Sun Menu / Booking sheet`).
- **Image Bg, medium and below:** near full-height sheet below the top bar, chamfered top corners; header row of back arrow, wordmark, X; venue cards stacked: full-width chamfered image, title, blurb, outline chamfered Reserve (Figma `4 · Sun Menu / Table sheet`).
- Desktop variant styles are checked against window-1 and full-2 and adjusted only where they differ.

### 2. New component **Booking Menu** (group Modals)

`div.booking-menu_component` (no styles beyond the class, the dialogs are fixed) holding two instances:

| Instance | Variant | Dialog id | Content |
|---|---|---|---|
| Book Now panel | Burgundy | `book` | Image: a dining photo (Figma uses a table spread); items 1 to 4 labels "book a stay", "reserve a table", "host an event", "book an appointment"; links `#book`, `#book-table`, `#book`, `#book`; Show stamp via variant |
| Reserve a table | Image Bg | `book-table` | Image: Zuma photo (the Zuma `home-card-image`); Show list off; Show venues on; Back link `#book` |

No props on Booking Menu; it renders the same on every page.

### 3. Place Booking Menu on every page

Insert one instance after Footer Links on each static page and CMS template (page shell rule: modals after the footer). Not inside Site Nav: `navTheme` clones the header (duplicate ids) and the open menu's backdrop blur would trap the fixed dialogs.

### 4. Site Nav (`site-nav_*`, M2 owned)

Medium and below (desktop unchanged):

- **Top bar:** hamburger left, wordmark centre, day and night toggle right; `site-nav_book` hidden (Figma has no Book Now in the mobile bar).
  - `site-nav_start` becomes `display: contents` so the toggle and the modes become bar items; the modes get `order` after the logo and `justify-content: flex-end`.
  - `site-nav_modes` shown (hidden at medium today), `flex-direction: row-reverse` (moon left, sun right), icons only.
  - New class `site-nav_mode-label` on the two "day" / "night" spans (hidden at medium and below).
  - New element `site-nav_modes-divider` between the two modes: thin vertical line, hidden on desktop.
  - Toggle stays visual only (content swap is a later task).
- **Menu overlay:** new `footer.site-nav_menu-cta` after the link list holding `a.button.is-chamfer` "book", href bound to the existing **Book link** prop (`#book`), hidden on desktop. `site-nav_menu-nav` gets `flex-direction: column`.

## Not in scope

- Booking destination URLs (D-booking-url): all stay placeholders.
- Day and night content swap.
- The small arrow after "reserve a table" on desktop (the Burgundy list has no icon slot); added only if Stephen wants it.

## Verification

Staging at 390px and 1440px, pointer and keyboard: open from top bar Book Now (desktop) and menu Book pill (mobile), step into Reserve a table, Back, close by X, Escape and backdrop, focus returns to the Book link. Results and ids go in this folder and `docs/reference/webflow-ids.md`.

## Result

- Built as planned, ids in `docs/reference/webflow-ids.md` (M2 section). Staging checks at 1440 and 390 on `/`, `/dining` and `/rooms`, pointer and keyboard: open, Reserve a table, Back, close by X, Escape and backdrop all pass; scroll position and URL hash unchanged; focus returns to the Book link or the menu pill; no console errors. Screenshots in `staging/` (taken with the local bundle routed in place of the live v1.1.17).
- Deviations: Booking Menu is not on 404 (the Data API cannot read that page); mobile menu link size reduced to the Figma size at small and tiny; venue Reserve placeholders are `#`.

## Still open

- **Designer step (Stephen):** in the Overlay Detail Panel Modal component, select the Dinings Collection List (inside `_body`, visible on the Image Bg variant with Show venues on) and set Sort: Sort order ascending; bind the item image to Home card image, the title to Name and the text to Home card tagline. The Data API refuses these inside a component definition. Until then the venue cards show placeholders.
- **Footer URL:** bump the Webflow footer script to the new tag to ship the `modals.ts` fix; until then `#book` clicks also trigger Webflow's anchor scroll.
- The desktop chevron after "reserve a table" (not built).

## Feedback round 1 (Stephen, 2026-11-03)

Style and prop changes only, no code (live bundle v1.1.19 unchanged). Checked on staging at 1440 and 390 with the live bundle: flow, keyboard, scroll and hash all pass.

1. **Desktop Book Now panel padding, centring, arrow:** the hidden header and column still took up space (header row-gap 6rem pushed the list down). Burgundy and Image Bg now hide `_header` and `_column`; Burgundy `_content` centres the list vertically (list top 139px against Figma 141px in the 434px panel) and centres each option; new **Item 2 arrow** prop shows an 18px chevron after "reserve a table" (desktop only, as in window-1).
2. **Desktop venue list background:** the dialog's flex row stretched the panel to the viewport height (900px) while the venues ran to 1447px. Image Bg `_component` now aligns items to the start, so the maroon panel grows with the list.
3. **Mobile stamp to options gap:** a base small rule added `margin-top: 1.75rem` to `_list` and `padding: 14px 0` to `_item`. Both booking variants reset them at medium and small; stamp to first option is now 40px and the option pitch 48px, as in Figma.
4. **Mobile venue list gap:** same list margin plus the hidden header; first venue now starts 40px below the back, wordmark and close bar, as in Figma.
5. **Mobile menu hairline:** `site-nav_menu-footer` at small gets a 1px top border in cream at 0.32 opacity, inset 20px each side with 16px above the address (Figma `2 · Menu`, node 1243:19241). Desktop unchanged.
