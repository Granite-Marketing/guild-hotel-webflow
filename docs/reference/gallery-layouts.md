# Gallery Layout System

Dynamic image gallery for a CMS template page (e.g. a project detail page). Each image's size, alignment and position are set per slot in the CMS and applied by CSS attribute selectors (no JavaScript for layout).

## CMS Fields (per image slot, 1-12)

| Field | Type | Purpose |
|---|---|---|
| Image N | Image | The gallery image |
| Image N - Settings | Option | Width, aspect ratio and alignment in one value |
| Image N - Order | Number (integer) | Display position, 1 shows first |

Two fields per slot, not three: separate `Layout` and `Alignment` Option fields cost 12 extra fields and push a collection toward Webflow's 60-field limit. If a project still has the older three-field shape, merge it with the process in [webflow-cms-field-limit-migration.md](../solutions/workflow-issues/webflow-cms-field-limit-migration.md). Cache the field IDs in `webflow-ids.md`.

### Settings values (16)

A value is space-separated tokens: one width, plus optional `full-height`, `extended` and `right`.

| Value | flex-basis | aspect-ratio | Right version |
|---|---|---|---|
| `w-full` | 100% | 16/9 | none |
| `w-full full-height` | 100% | 3/2 | none |
| `w-3/4 extended` | calc(75% - 0.5rem) | 3/4 | `w-3/4 extended right` |
| `w-2/3` | calc((100% - 2rem) / 3 * 2 + 1rem) | 4/3 | `w-2/3 right` |
| `w-2/3 full-height` | calc((100% - 2rem) / 3 * 2 + 1rem) | 3/4 | `w-2/3 full-height right` |
| `w-1/2` | calc(50% - 0.5rem) | 4/3 | `w-1/2 right` |
| `w-1/2 full-height` | calc(50% - 0.5rem) | 3/4 | `w-1/2 full-height right` |
| `w-1/3` | calc((100% - 2rem) / 3) | 4/3 | `w-1/3 right` |
| `w-1/3 full-height` | calc((100% - 2rem) / 3) | 3/4 | `w-1/3 full-height right` |

Full-width values have no right version: `margin-left: auto` on a 100% item has no visible effect.

`right` adds `margin-left: auto`, so it only shows when an image is alone in its row. Paired images fill the row.

### Order

- `data-order="1"` to `"12"` maps to CSS `order: 1` to `12`, at all breakpoints (keep the container flex on mobile too).
- Images with no order get `order: 13`, so they go last, in slot order. Equal orders also keep slot order.
- `order` is visual only: screen readers and the Webflow lightbox's next/previous follow slot (DOM) order.

## Row Pairing Rules

The container uses `display: flex; flex-wrap: wrap; gap: 1rem`. Any images whose widths total about 100% form a row:

- `w-1/3` + `w-2/3` = 100%
- Two `w-1/3` side by side line up exactly with one `w-2/3` above or below, because the widths are true thirds with the gap included. With 34% / 66% approximations, two thirds overshoot a two-thirds image by about 37px at 1440px.
- `w-1/2` + `w-1/2` = 100%
- `w-full` = solo row
- `w-2/3` or `w-3/4 extended` alone = solo row with whitespace (use a `right` value to push it right)

Pairing follows display order, so changing Order can change which images share a row. Audit galleries for pairings that leave large row gaps: a right-aligned second image leaves a gap in the middle; pair `w-1/3` with `w-2/3` instead.

## CSS Implementation

Put the CSS in a component (an HTML Embed, e.g. `Custom Layout`) placed on the template page and on any settings guide page, so it is versioned in one place. Match tokens with `~=`, so `[data-layout~='w-1/2']` covers `w-1/2`, `w-1/2 full-height` and `w-1/2 right`.

```css
.dynamic-image_item { order: 13; }
.dynamic-image_item[data-order='1'] { order: 1; }
/* ... through 12 */

@media (min-width: 768px) {
  .dynamic-image_component { display: flex; flex-wrap: wrap; gap: 1rem; }
  .dynamic-image_item { overflow: hidden; }
  .dynamic-image_image { width: 100%; height: 100%; object-fit: cover; }

  [data-layout~='w-full'] { flex-basis: 100%; aspect-ratio: 16/9; max-height: calc(100vh - 2rem); }
  [data-layout~='w-2/3'] { flex-basis: calc((100% - 2rem) / 3 * 2 + 1rem); aspect-ratio: 4/3; max-height: calc(100vh - 2rem); }
  [data-layout~='w-1/2'] { flex-basis: calc(50% - 0.5rem); aspect-ratio: 4/3; max-height: calc(100vh - 2rem); }
  [data-layout~='w-1/3'] { flex-basis: calc((100% - 2rem) / 3); aspect-ratio: 4/3; max-height: calc(100vh - 2rem); }

  [data-layout~='full-height'] { aspect-ratio: 3/4; }
  [data-layout~='w-full'][data-layout~='full-height'] { aspect-ratio: 3/2; }
  [data-layout~='extended'] { flex-basis: calc(75% - 0.5rem); aspect-ratio: 3/4; }

  [data-layout~='right'] { margin-left: auto; }

  .dynamic-image_item:not([data-layout]),
  .dynamic-image_item[data-layout=''] { display: none; }
}
```

`max-height: calc(100vh - 2rem)` keeps any single image within one screen. Items with an empty Settings value are hidden, so unused slots never render as blank boxes. Attribute values are case-sensitive: keep option values lowercase and match them exactly (see [css-attribute-selector-case-sensitivity-data-alignment.md](../solutions/ui-bugs/css-attribute-selector-case-sensitivity-data-alignment.md)).

## Webflow Template Wiring

Each of the 12 `dynamic-image_item` figures on the template has:

- `data-layout` bound to `Image N - Settings`
- `data-order` bound to `Image N - Order`

Bind them with the Webflow MCP (`data_element_settings_tool` > `set_settings`, `key: "attributes"`). That write replaces the whole attribute list, so read first and re-include any static attributes on the figure. Modules that need to know an image's shape (for example whether it covers the right edge) read the `data-layout` tokens rather than a separate attribute.

## Adding or Changing Settings Options

The Webflow Data API cannot edit an existing Option field's option list. To add a value:

1. Add the option to all 12 Settings fields in the CMS settings (Designer), in the same position, or
2. Recreate the fields via API: unbind `data-layout` on the figures, delete the fields, recreate with the new option list, rebind, then refill from a fresh snapshot.
3. Add CSS for any new token.

Webflow refuses to delete a field that is still bound to an element (409 "currently being used in bindings"), so always unbind first. Never send image fields in the refill writes: an image-field write re-imports the file (see [webflow-cms-image-alt-reimport-srcset-loss.md](../solutions/integration-issues/webflow-cms-image-alt-reimport-srcset-loss.md)).
