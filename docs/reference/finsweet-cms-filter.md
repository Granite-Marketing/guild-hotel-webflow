# Finsweet CMS Filter v1 (Legacy) — Setup Reference

## CDN Script

```html
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js"></script>
```

No companion scripts needed. Add CMS Load separately if >100 items:
```html
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsload@1/cmsload.js"></script>
```

## Core Attributes

| Attribute | Value | Applied To |
|---|---|---|
| `fs-cmsfilter-element` | `list` | Collection List Wrapper |
| `fs-cmsfilter-element` | `filters` | Form Block wrapping all filter UI |
| `fs-cmsfilter-field` | `"IDENTIFIER"` | Filter UI labels AND CMS-bound text inside items |
| `fs-cmsfilter-element` | `clear` | Reset all filters button (inside form) |
| `fs-cmsfilter-element` | `empty` | Empty state element (hidden by default) |
| `fs-cmsfilter-element` | `results-count` | Text showing filtered count |
| `fs-cmsfilter-element` | `items-count` | Text showing total count |

## Multi-Reference Field Setup

1. Inside CMS item, add **nested Collection List** bound to multi-ref field
2. Inside nested item, add Text Block bound to referenced item's Name
3. Apply `fs-cmsfilter-field="Category"` to that Text Block
4. Can hide nested list with `display: none` — filter still reads DOM text
5. **Limit:** Webflow caps nested lists at 5 items

## Single-Select / Dropdown Field Setup

1. Inside CMS item, add Text Block bound to the option field
2. Apply `fs-cmsfilter-field="Category"` to the Text Block
3. Can hide with `display: none`

## Filter UI (Buttons/Labels)

- **Checkboxes:** `fs-cmsfilter-field="Category"` on the **label** (not input). Label text must exactly match CMS values.
- **Radio buttons:** Same as checkboxes. Add `checked="checked"` for pre-selected. See the single-select setup below, and give each group its own published `name` (see the radio name caveat).
- **Select dropdown:** `fs-cmsfilter-field="Category"` on the `<select>` element. Option text = filter values.
- **"All" button:** Static radio/checkbox with label "All" + same `fs-cmsfilter-field`. Place in same radio group.

### Single-select category filters (radios)

For "one category at a time" filters, use radios inside the category Collection List item rather than checkboxes:

```
Radio Button (FormRadioWrapper, class filter_link)   <- Finsweet puts fs-cmsfilter_active here
  ├── indicator (e.g. button-square)
  ├── Radio input (class hide, Group Name "category", same on every item)
  └── Radio label (text bound to Category Name, fs-cmsfilter-field="Category")
```

- "All" stays a `fs-cmsfilter-element="clear"` link, not a radio.
- Finsweet puts the active class on the wrapper; a small module syncs any extra highlight for checkbox and radio inputs (see [finsweet-cms-filter-webflow-setup.md](../solutions/integration-issues/finsweet-cms-filter-webflow-setup.md)).
- Query params (`?category=Press`) use the real-case CMS value, not lowercased display text.
- The Webflow MCP can build this: `data_element_builder` type `FormRadioInput`, then `set_settings` for `groupName` and for the label's `text` CMS binding.

**Radio name caveat.** Webflow publishes every radio with `name="radio"` (the input's Name field); the Designer Group Name only lands in `data-name`. With more than one radio group on the page (category, location, sort), the browser treats them as one group and picking one unchecks the other while Finsweet keeps filtering by both. Restore the group at runtime with `radio.name = radio.dataset.name` before anything reads the form, or set each input's Name field in the Designer. See [webflow-radio-group-name-published-as-data-name.md](../solutions/integration-issues/webflow-radio-group-name-published-as-data-name.md).

### IDENTIFIER Rules

- Arbitrary string (e.g. `"Category"`, `"Type"`)
- Must match exactly between filter UI and CMS item elements (case-sensitive)
- For multi-ref: matches against the text content of the nested collection list items

## Behavioral Attributes

| Attribute | Values | Purpose |
|---|---|---|
| `fs-cmsfilter-active` | CSS class name | Active state class (default: `fs-cmsfilter_active`) |
| `fs-cmsfilter-match` | `all` / `any` | AND vs OR logic (default: `any`) |
| `fs-cmsfilter-showquery` | `true` | Persist filter in URL params |
| `fs-cmsfilter-duration` | ms (e.g. `200`) | Animation speed. Use `0` plus your own single fade-in when the list sits under an overlay or sticky filter UI: the default fade-out/fade-in reads as a double flash (see below) |
| `fs-cmsfilter-easing` | `ease`, `linear`, etc. | Animation easing |
| `fs-cmsfilter-hideempty` | `true` | Hide filter options with zero results |
| `fs-cmsfilter-debounce` | ms (e.g. `200`) | Delay before filter triggers on text input |

## Avoiding Flashes and Phantom Clicks

- **Double flash on "all":** set `fs-cmsfilter-duration="0"` on every list wrapper and run one fade-in yourself after the leading tile images decode. Bind tiles to a small thumbnail field, never the full-size hero: API-imported CMS images have no `srcset`, and Finsweet removes filtered items from the DOM, so their full-size bitmaps decode again on every re-add. See [finsweet-cmsfilter-double-flash-back-to-all.md](../solutions/integration-issues/finsweet-cmsfilter-double-flash-back-to-all.md) and [cms-listing-thumbnail-field-webp.md](../solutions/design-patterns/cms-listing-thumbnail-field-webp.md).
- **`renderitems` timing:** the list is still `display: none` when the event fires, so measure later. Hidden browser tabs pause Web Animations and Finsweet's render queue never resolves; test in a visible tab.
- **Swipe opens a toggle (mobile):** filter toggles in a horizontally scrolling row can receive a `click` at the end of a swipe, especially under ScrollSmoother's normalizeScroll. Use `<button>` toggles, not Webflow's Dropdown element, and ignore clicks after more than 10px of touch travel. See [mobile-swipe-opens-filter-dropdowns-normalizescroll.md](../solutions/ui-bugs/mobile-swipe-opens-filter-dropdowns-normalizescroll.md).
- **Item limit:** Webflow renders at most 100 items per Collection List; add CMS Load above that.

## Multiple Instances

Append a number suffix: `fs-cmsfilter-element="list-2"`, `fs-cmsfilter-element="filters-2"`, etc.

## JavaScript API

```javascript
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    const [filterInstance] = filterInstances;
    // Custom code after filter initializes
  },
]);
```

## Documentation

- v1 docs: https://finsweet.com/attributes/v1/cms-filter
- v1 API: https://finsweet.com/attributes/v1/api/cms-filter
- Multi-ref setup: https://forum.finsweet.com/t/multi-reference-field-cms-filter/985
- npm CDN: https://www.jsdelivr.com/package/npm/@finsweet/attributes-cmsfilter

## v2 Note

v2 uses `fs-list-*` prefix instead of `fs-cmsfilter-*`. Single universal script with `type="module"`. Both versions are free. v1 and v2 CANNOT coexist on same page.
