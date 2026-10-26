---
module: navigation
tags: [webflow, cms, footer, menu, collection-list]
problem_type: convention
---

# Nav and footer links to CMS items use a Collection List

## Rule

When a footer column or menu group lists CMS items (for example the Dining column: Zuma, The Lobby Bar, Pool Lounge), build it as a Collection List bound to that collection, not as hand-typed links. Each item's link and text bind to the item's page and `name`. Set the Collection List's empty state to hidden.

## Why

Hand-typed links break when a slug changes, and they miss items that get added or removed. A bound list stays in sync with the CMS without anyone touching it. Stephen asked for this on 2026-10-26.

## How

- Keep the existing link classes (`footer-links_link` and its utilities) on the Collection Item link, so it looks the same.
- Use a filter or sort if the column shows only some items (for example, featured items only).
- Hide the empty state so a collection with no items leaves no "No items found" text behind.
- Static pages (Rooms, History, Contact) stay as normal links.
