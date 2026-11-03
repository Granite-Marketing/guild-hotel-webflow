# Art CMS collection: plan

Stephen's ask (2026-11-03): the Arts grid becomes CMS items, each item opens its own modal, and the homepage art hover links to each item's modal on `/arts`.

## Collection

`🖼️ Art Collection` (singular `🖼️ Art Piece`, slug `art`). No template page: items live only on `/arts` as dialogs.

| Field | Type | Notes |
|---|---|---|
| Name | PlainText (built in) | Dialog heading, for example `‘oceano’` or `eva struble` |
| Slug | built in | Dialog id and URL hash: `/arts#oceano` |
| Category | Option: Painting, Photography, Sculpture, Artists | Filter tabs; bound to `data-gallery-filter-item` |
| Image | Image | Tile, dialog and homepage trail image; filled from the existing library asset URL (fresh field, so the re-import caveat does not apply) |
| Image alt | PlainText | Tile, dialog and trail alt text |
| Artist | Reference to this collection | Artwork only: points at the artist item; drives the "by eva struble" link |
| Caption | PlainText, multiline | Artwork only: `2024 \| 48 x 60 in` line break `Oil and acrylic on canvas` |
| Description | PlainText, multiline | Dialog body text |
| Tile size | Option: Standard, Narrow, Wide | Keeps the mosaic rhythm (`is-narrow`, `is-wide` today) |
| Sort order | Number | Grid, dialog and homepage order |

## Items (real data only)

Only two dialogs on `/arts` carry real copy today; the other eight are Figma lorem ("artwork title", "by artist name").

| # | Slug | Name | Category | Tile | Image asset | Copy |
|---|---|---|---|---|---|---|
| 1 | `oceano` | ‘oceano’ | Painting | Standard | `6ad66ffb8d039779ba7cb0a7` | real (artist: eva-struble) |
| 2 | `eva-struble` | eva struble | Artists | Narrow | `6ad67002c159d4564be772e7` | real |
| 3 to 10 | `artwork-03` to `artwork-10` | to confirm | photography, painting, photography, sculpture, painting, photography, sculpture, painting | Wide, Standard, Narrow, Narrow, Wide, Wide, Narrow, Standard | the current tile photos | none: name, caption and description left empty |

## Page changes

Arts (`6ad66fd7ba96f2e53726a2eb`):
- `gallery-all_grid` static figures replaced by a Collection List (list class `gallery-all_grid`, item class `gallery-all_item`, sorted by Sort order). Item holds `a.gallery-all_link` (`data-modal-open` = Slug, `aria-haspopup`, `aria-expanded`, `href="#"`) > `img.u-image` (Image, alt). Item carries `data-gallery-filter-item` = Category and `data-tile-size` = Tile size. Filter tabs and `galleryFilter` unchanged.
- Tile widths: a small page-level style block maps `[data-tile-size="Narrow"]` and `[data-tile-size="Wide"]` to the current `is-narrow` and `is-wide` widths at desktop and 991px.
- Dialogs: two Collection Lists at the end of `.page-wrapper` (where the static dialogs sit now), each item holding one Overlay Detail Panel Modal, Dark: one list filtered to Category = Artists (artist layout: heading, image, text), one to the rest (artwork layout: heading, "by" link to the artist dialog, caption, image, text). Dialog id, Heading, Caption, Image, Image alt and Text props bound to the fields. The ten static dialogs and ten static figures are deleted after the CMS version checks out on staging.

Home (`6ad64060ae8eac6d7b7c4241`), `section_home-art-stories`:
- The four static `home-art-stories_trail-item` links become a Collection List inside `[data-image-trail-hover]`, one link per art item: image + alt bound, `href="/arts"` fallback, `data-cms-link-path="arts"`, `data-cms-link-slug` = Slug, `data-cms-link-anchor`. The four current trail photos (lounge, bronze sculpture, shelf, copper texture) drop out.

## Code

- `modals.ts` already opens a dialog named by the page-load hash, so `/arts#oceano` opens Oceano.
- `cmsItemLinks.ts`: new optional `data-cms-link-anchor` builds `/arts#slug` instead of `/arts/slug`. One release (changeset, tag), footer bump by Stephen.

## Likely Designer clicks

The Data API cannot bind link props or reference sub-fields in every case. Expected manual steps, with click paths written after the build: the "by artist" link and text on the artwork dialogs, and any prop binding the API refuses.
