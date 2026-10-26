# F27 build record: Rooms collection

Built 2026-10-26 through the Data API (no Designer, no site publish). Ids are in `docs/reference/webflow-ids.md` under "F27 Rooms collection, template and grid".

- Static Room Detail page re-slugged `room-detail-static` and set to draft so `/rooms-individual` is free.
- Collection "🛏️ Rooms" (slug `rooms-individual`) with 8 custom fields in Card and Room page groups, and 10 items taken from the all-rooms dialog data. Items are staged (not draft) and go live with the next site publish.
- Template page rebuilt in the Q038 order with Hero Heading, Text and Image bound to name, hero-intro and card-and-hero-image. Hero intro is placeholder copy for every item.
- /rooms grid is a Collection List (filter recommended, sort by sort order, limit 4) with the existing `rooms-collection-room-grid_*` classes; the static card list is hidden with `hide`.
- All-rooms dialog links point to the room pages.

## Left for the Designer

- Optional: the /rooms card Link can still be set to Collection page > Current Room as a no-JS fallback. It already carries the cmsItemLinks attributes (data-cms-link-path, data-cms-link-slug), so it links once the release is live.
- Delete the hidden static list `7626f7b9-d6d1-6195-4802-49d0d8ca3959` and the superseded static page `room-detail-static` once the live site is checked.
- Template gallery heading "deluxe king suite gallery", the description, amenities, gallery and carousel are still static placeholder copy; give each room its own fields later.
