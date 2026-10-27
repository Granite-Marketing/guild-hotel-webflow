---
title: "Finsweet CMS Nest v1 — two modes, and the #-link trap that silently empties every nest"
date: "2026-07-13"
last_updated: "2026-10-27"
category: "integration-issues"
component: "Webflow, Finsweet Attributes CMS Nest v1"
tags: [finsweet, cms-nest, webflow, multi-reference, nest-target, slugs, collection-page-link, modal, cms-nesting]
severity: "high"
root_cause: "CMS Nest v1 matches items across two Collection Lists by their collection-page link URLs. Any item whose link is set to `#` (or `url:#`) instead of `collectionPage` produces an href that can never match, so the nest silently renders empty with zero console errors. The mechanism was obscured for hours because summarized Finsweet docs hallucinated a `nest-source`/`template-reference` architecture that does not exist in the library."
problem_type: "integration_issue"
status: "resolved"
resolution_type: "config_fix"
verified_from: "raw library source (@finsweet/attributes-cmsnest@1, v1.12.1) + live published DOM"
symptoms:
  - "Nested CMS modal/target renders empty — no console errors"
  - "Nested list shows only the first child item regardless of which parent is opened"
  - "Nested list shows ALL children in every parent (no per-parent filtering)"
  - "Setup 'looks right' in Designer but nothing (or the wrong thing) injects at runtime"
  - "Works with a slugs text field, fails without it (or vice-versa)"
---

# Finsweet CMS Nest v1 — two modes, and the `#`-link trap

## TL;DR (read this first)

CMS Nest v1 injects **local** Collection List items into a per-parent target. It decides
*which* local items belong to a parent by comparing **collection-page link URLs**. If any
of the lists it compares has items linking to `#` instead of the real collection page,
the URLs never match and the target renders **empty with no error**.

**The whole class of "it renders nothing / wrong thing" bugs is almost always: a link that
should be `collectionPage` is set to `#` (or `url`).** Check the item links first, before
anything else.

## The REAL attribute vocabulary (source-verified)

Pulled directly from the minified library, not from docs:

```bash
curl -sL "https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsnest@1/cmsnest.js" \
  | grep -oE '"[a-z-]{2,20}"' | sort | uniq -c
```

The **only** recognised `fs-cmsnest-element` values are:

| Attribute | Where | Meaning |
|---|---|---|
| `fs-cmsnest-element="list"` | parent Collection List | the loop of parent items |
| `fs-cmsnest-element="nest-target"` | empty element **inside** each parent item | where matched children get injected |
| `fs-cmsnest-element="slugs"` | text element inside each parent item (slugs mode only) | comma-separated child slugs |
| `fs-cmsnest-collection="<id>"` | the **source** list + every `nest-target`/`slugs` | groups a nest by an arbitrary id |
| `fs-cmsnest-empty="<id>"` | optional | empty-state element |
| `fs-cmsnest-cache="false"` | optional | disable IndexedDB caching of fetched pages |

There is **NO `nest-source` and NO `template-reference`.** Those two were fabricated by
WebFetch summaries of the Finsweet docs and sent this investigation in circles for hours.
The "source" list is identified **purely** by carrying `fs-cmsnest-collection="<id>"` and
being a real Collection List — its `fs-cmsnest-element` value is ignored (we happened to
label ours `nest-source`; the library never reads it).

## How it actually works

You always need a **source list**: a Collection List bound to the **whole child
collection**, carrying `fs-cmsnest-collection="<id>"`. The library hides its wrapper at
runtime and treats it as the pool of item markup. **Every source item must have a
collection-page link** (its href's last path segment is its slug). This list supplies the
markup for BOTH modes.

Then each parent card carries a `nest-target` (+ `fs-cmsnest-collection="<id>"`), and CMS
Nest picks one of two modes **automatically per card**:

### Mode A — Slugs (card has a `slugs` element)
- Reads the `slugs` element's text, splits on commas → `["slug-a", "slug-b", …]`.
- Filters the source list: keep items where `slugs.includes(lastPathSegment(item.href))`.
- Injects the matches into `nest-target`.
- **Cost:** needs a plain-text CMS field holding the slugs, kept in sync with the
  multi-reference field. Webflow cannot compute that field from a multi-ref natively, so
  syncing requires external automation (webhook → n8n / serverless). This is why we
  avoided it as the final solution.

### Mode B — Fetch (card has a `nest-target` but NO `slugs`) ← preferred
- Fetches the parent card's **own** collection page (the card's first `<a>` href, e.g.
  `/guest-portal/<slug>`).
- On that page there must be a nested Collection List bound to the **multi-reference
  field**, tagged `fs-cmsnest-collection="<id>"`. Webflow allows binding a nested list to
  a multi-ref **on the collection's template page**.
- Reads that fetched list's item **hrefs**, then matches them by **exact href equality**
  against the **local source list** items, and injects the matched **local** items.
- **Payoff:** no slugs field, no automation — the client only ever edits the multi-ref
  field. This is the correct end state for client-maintained sites.

Decoded matching logic (fetch mode), verbatim intent from `cmsnest.js`:
```
fetchedList.items.forEach(fetchedItem =>
  localSource.items.find(localItem => localItem.href === fetchedItem.href)  // EXACT string match
) → inject matched local items into nest-target
```

## The bug that ate the session

Fetch mode renders **empty** unless the item links on **both** lists are real
collection-page links. In our case:

- Local source items: `/guest-portal-items/check-out-information` ✓ (already fixed)
- Fetched template-page list items: **`#`** ✗ (never fixed)

`"#" === "/guest-portal-items/…"` is never true → zero matches → every modal empty, **no
console error**. The fix was one Designer change: set the template-page nested list's item
link to **Current <Item>** (`collectionPage`), so its href became
`/guest-portal-items/<slug>` and matched the local source exactly.

The earlier "always shows the first item" symptom was the same root cause upstream: when
match URLs are all `#`/unresolvable, the library falls back to the first source item.

## The nest target is replaced, not filled (F26 rooms quiz, 2026-10-27)

In fetch mode CMS Nest **swaps the `nest-target` element out** for the fetched nested
list (a `.w-dyn-list` carrying `fs-cmsnest-collection`, no `fs-cmsnest-element`). Any
attribute or class you put on the nest target (`data-rooms-quiz-tags` here) is gone at
runtime, so code that finds cards by querying the target matches nothing and the feature
silently treats every card as empty. The fixture hid this because it pre-filled the
target in place.

- Read each card as a whole: query the parent list's items
  (`[fs-cmsnest-element="list"] > .w-dyn-items > .w-dyn-item`) and look for the injected
  items' own markers inside it (`[data-rooms-quiz-tag]` on the template's item link).
  See `src/utils/roomsQuiz.ts`.
- Make fixtures mimic the swap: replace each nest target with a
  `div.w-dyn-list[fs-cmsnest-collection]` holding its children before firing the
  `cmsnest` callbacks (`tests/visual/fixtures/rooms-quiz.ts`).
- Changing the parent collection's URL slug breaks fetch mode too: every card fetch
  404s and the nests stay empty. If the card hrefs are written by JS (a static
  `data-cms-link-path`), update that path with the slug.
- The card and item links have to be "Current item" collection-page links set in the
  Designer; the MCP cannot set them (see
  [`webflow-data-api-builders-without-designer.md`](./webflow-data-api-builders-without-designer.md),
  "Link to current item").

## Solution checklist (fetch mode — the client-simple one)

1. **Source list** on the primary page: Collection List bound to the whole child
   collection, `fs-cmsnest-collection="<id>"`. Each item's link → **collectionPage**
   (NOT `#`). Hide its wrapper if the pre-removal flash is undesirable.
2. **Parent card**: has a `nest-target` (+ `fs-cmsnest-collection="<id>"`) and **no
   `slugs` element**. The card's own link → its collection page (**collectionPage**).
3. **Template page** of the parent collection: a nested Collection List bound to the
   **multi-reference field**, `fs-cmsnest-collection="<id>"`. **Each item's link →
   collectionPage** (this is the step everyone forgets — it defaults to `#`).
4. **Publish.** Fetch mode fetches the *published* page over HTTP; Designer edits don't
   count until republished. It caches fetched pages in IndexedDB (`fs-cmsnest-cache="false"`
   to disable during debugging).
5. Script in page `<head>`:
   ```html
   <script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsnest@1/cmsnest.js"></script>
   ```

## Debugging method that actually worked (use this, not doc summaries)

- **`curl` the raw library** and `grep` the quoted string literals to get the true
  attribute vocabulary. Summarized docs (WebFetch) hallucinated non-existent attributes
  repeatedly — never trust a paraphrase of an attributes API.
- **`curl` the published page(s)** and inspect the actual `href` values on both lists.
  The `#`-vs-collectionPage mismatch is invisible in the Designer but obvious in the DOM:
  ```bash
  curl -sL https://SITE/portal            | grep -oE 'href="[^"]*guest-portal-items[^"]*"'
  curl -sL https://SITE/guest-portal/SLUG | grep -oE 'href="[^"]*"'   # look for "#"
  ```
- **Webflow MCP churn:** the MCP dropped/relabelled elements repeatedly this session
  (links reverting to `#`, attributes not reflecting in the canvas). For single, visible
  element edits (set a link to collectionPage, delete one element), have the user do it in
  the Designer — it's faster and verifiable than re-firing MCP calls at IDs that may have
  shifted.

## Prevention

- **Item links are the first suspect** when a nest renders empty or wrong. `#` links can
  never match. Every item in every list CMS Nest compares must be `collectionPage`.
- **Prefer fetch mode** for client-maintained nests: it reads the multi-ref via the
  template page, so the client only edits the multi-reference field — no synced text
  field, no automation, no self-hosted webhook. (A CMS-field-syncing webhook cannot live
  in Webflow's client-side custom-code section anyway — it needs an external endpoint with
  the API token.)
- **Publish before testing** — fetch mode reads the published DOM.
- **Never trust a summarized attributes reference.** Read the library source and the live
  DOM.

## Related

- [`swiper-init-inside-cmsnest-injected-content.md`](./swiper-init-inside-cmsnest-injected-content.md) — Swiper (or any JS) inside the injected markup won't auto-init; re-run it in the `cmsnest` callback
- `docs/solutions/integration-issues/finsweet-cms-filter-webflow-setup.md` — sibling Finsweet v1 attribute-wiring reference
- `docs/reference/modal-setup.md` — the modal contract the nested content renders into
