# Q006 build plan: overlay-detail-panel-modal

One Webflow component, **Overlay Detail Panel Modal** (`44cccc51-37cb-2526-e426-133987071983`, group Modals), for all 8 Figma instances. Built through the Data API on `🧱 overlay-detail-panel-modal` (`/build-overlay-detail-panel-modal`, page `6ad7885b7f5d5d50523f997f`, un-drafted for staging) on 2026-10-20, with no Designer calls. Machine-readable record: `plan.json`. Generators: `build-schema.py` (styles, tree, variant styles), `props.py`, `bind.py`, `instances.py`.

## Runtime

No new code. The dialog follows the existing `src/utils/modals.ts` contract (`docs/reference/modal-setup.md`), which `src/index.ts` already calls, so there is nothing to enable.

- Root: `[role="dialog"]`, `aria-modal="true"`, `aria-hidden="true"`, `tabindex="-1"`, `data-modal-no-overlay`, DOM id bound to the **Dialog id** prop.
- Open state: `.overlay-detail-panel-modal_component.is-open` (opacity, visibility, pointer events; 400ms fade).
- Close controls: the backdrop div, the back link and the X link all carry `data-modal-close`.
- Each dialog has its own backdrop, so no global `[data-modal-overlay]` element is needed.

Fixture and spec: `tests/visual/fixtures/overlay-detail-panel-modal.{html,ts}` (the published staging markup and CSS, plus `modals()`), `tests/visual/overlay-detail-panel-modal.spec.ts`. 14 tests pass: every dialog is hidden until opened, each trigger opens its dialog with focus inside, back or X closes it and returns focus to the trigger, Escape and backdrop clicks close it, and the layout renders at 390. Screenshots: `fixture-<variant>-1440.png` and `-390.png` in this folder.

## Tree

- `div` `_component` (fixed full viewport, scrolls) `[role=dialog]`
  - `div` `_backdrop` `[data-modal-close]`
  - `div` `_panel`
    - `div` `_bar` (absolute) > `a` `_back` `[data-modal-close]` (embed arrow + span `_back-label` "back"), `a` `_close` `[data-modal-close]` (embed X)
    - `div` `_layout`
      - `figure` `_figure` > `img` `_image` (Show image, Image, Image alt)
      - `div` `_content`
        - `header` `_header` > `h2` `_heading`, `p` `_eyebrow`, `p` `_caption`
        - `div` `_body`
          - `div` `_column` > `h3` `_subheading`, `p` `_text`, `div` `_extras` (h3 `_subheading`, `p` `_options` in two columns, `a` `_link`, `p` `_note`)
          - `div` `_list` `[role=list]` > 5 x `div` `_item` `[role=listitem]` (`figure` `_item-figure` > `img`; `div` `_item-content` > `_item-heading` (span `_item-number`, `p` `_item-title`), `p` `_item-text`, `a` `_item-button`)
        - `footer` `_footer` > `a` `_button`

## Variants

| Variant | id | Figma modifier | Instances | Look |
|---|---|---|---|---|
| Base | `base` | base | meetings-collection/14, legal/17, corporate/17 | cream chamfered panel 7.5rem below the top, centred h2, button top right, details column and numbered spec list, image below |
| Dark | `569f778f-307a-cdc2-95c3-95b18a7c2c5c` | is-dark + is-media-left | arts/12, arts/13 | full-screen #262118, image left, "back" over the text column, h3 heading and text at the bottom |
| Image Bg | `72048989-461a-61a0-ac02-cfc3ae7b6e5c` | is-image-bg + is-media-left + is-multi-image | nav-elements/01-full-2 | full-screen, sticky image left half, burgundy right half with "back", X and image cards with reserve buttons |
| Burgundy | `0e56f707-a8b4-d396-c73a-900ce080b5db` | is-burgundy + is-media-right | nav-elements/03-window-1 | 48.75rem window top right, image left, X, menu links (item button labels) |
| Centered | `34ca996d-2f65-a59e-6eb0-09dd065e4534` | is-centered + is-no-image | neighborhood/16 | Base panel, centred text and button, image below |

Select a variant with `set_component_instance_prop_values`, prop `58627a5c-9ee5-3e05-ba7c-32f2cfa464f4`, `type: "string"`, value = variant id. Below 992px every variant stacks into one column (base `medium` rules win over the variants' desktop rules); the full-bleed variants repeat their panel reset at `medium` and `small`.

## Props (54 plus Variant)

Dialog id; Header (Show heading, Heading, Show eyebrow, Eyebrow, Show caption, Caption); Media (Show image, Image, Image alt); Body (Show subheading, Subheading, Show text, Text); Extras (Show extras, Extras heading, Options, Extras link label, Extras link, Note); List (Show list); Button (Show button, Button label, Button link); Item 1 to 5 (Show item N, Item N title, Item N text, Item N image, Item N button label, Item N link). Defaults are the meetings/legal/corporate content. Ids in `plan.json`.

**Every instance must set Dialog id** (empty by default, and `modals.ts` skips a dialog with no id) **and Image** (an empty image prop publishes `src=""`, a broken icon), or turn Show image off. Image Bg also needs Item 1 to 4 image.

## Pages, instances and triggers (for page sessions)

Place the instance anywhere in the page body (it is `position: fixed`); with Lenis no placement rule applies. Add `data-modal-open="<Dialog id>"`, `aria-haspopup="dialog"` and `aria-expanded="false"` to the trigger. Nothing on the live pages carries `data-placeholder="Q006"` yet.

| Figma instance | Variant | Page or template | Status | Suggested Dialog id | Trigger to wire |
|---|---|---|---|---|---|
| meetings-collection/14-meetings-overlay | Base (defaults) | Meetings `6ad66fd96684c3e22ea4d417` `/meetings` | Q035 not assembled | `council-boardroom` | "discover more" on meetings-collection/03-council-boardroom (Venue Card Fullbleed, Q021). 04-lobby-terrace and 05-1-america-plaza have the same button; one dialog per room once room content exists |
| legal/17-legal and corporate/17-corporate-overlay | Base (defaults) | `🧑‍⚖️ Legal Corporates Template` `6ad67d74943352af06e37850` `/legal-corporate/<slug>` | Q028 not assembled | `council-boardroom` | "discover more" on section 08-council-boardroom (Venue Card Fullbleed). One static dialog on the template serves both items; the Q028 brief does not list section 17 yet |
| arts/13-arts-modal | Dark, Show eyebrow and Show caption on | Arts `6ad66fd7ba96f2e53726a2eb` `/arts` | Q041 not assembled | `artwork-oceano` (one per artwork) | an artwork tile in arts/06 (Gallery Mosaic Captioned, dark compact, Q010). `figma/animations/arts.md`: clicking a piece opens its description |
| arts/12-arts-artist | Dark | Arts | Q041 not assembled | `artist-eva-struble` | no artist card exists in the Figma; likely a link from the artwork dialog's "by eva struble" line, or an artist list to be designed |
| nav-elements/01-full-2 | Image Bg | global (every page, or inside Site Nav) | Site Nav (Q005) has no trigger | `dining-menu` | a "dining" entry in the Site Nav menu (Q005 change) |
| nav-elements/03-window-1 | Burgundy | global | Site Nav has no trigger | `book-menu` | the Site Nav "book" button (its Book link prop is a URL today; needs `data-modal-open` instead) |
| neighborhood/16-neighborhood-overlay | Centered | Neighborhood `6ad66fdb02cc199b55b926ba` `/neighborhood` | Q044 not assembled | `coronado-beach` | the "Coronado Beach" item in neighborhood/07-beyond-downtown-san-diego (Timeline Scatter Images, Q026, fixed items with no link) |

The build page holds one configured instance per distinct content version (ids `meetings-overlay`, `arts-artist`, `arts-artwork`, `dining-menu`, `book-menu`, `neighborhood-overlay`) and a trigger section; copy their prop values from `plan.json` `buildPageInstances` or read them back.

## Deviations

See `plan.json` `deviations`. In short: variants are component variants, not `is-` combos; content differences are Show booleans; one five-item list covers spec rows, image cards and menu links; a per-dialog backdrop replaces the global overlay; heading size follows the variant; arts/13's two-column caption is stacked; Image Bg and Burgundy have no visible heading, so no `aria-labelledby`.

## Not covered

- Real photos: every image is the retail placeholder asset `6ad67011134731ad1b928045`.
- No Designer check; the canvas may render the hidden dialogs as invisible (they are `opacity: 0` until `.is-open`). To edit one in the Designer, add `is-open` temporarily or select it in the Navigator.
- Staging has no bundle script yet (R00), so the dialogs open only in the fixture until the footer tag ships.
