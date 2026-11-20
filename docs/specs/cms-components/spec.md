## Problem Statement

The Guild's editors cannot run the site from the Webflow CMS and the Designer without help. Stephen walked every page on 20 Nov 2026 and found:

- Components carry far too many toggles and fixed "Item 1 to 4" props. Some toggles do nothing, and several components try to be three components at once. They are confusing to use in Webflow.
- Repeating content (gallery photos, cards, slides, FAQs, venue pop-ups, offers) is built as fixed slots or hand-made copies, so adding or removing one item needs Designer work.
- Dining and Room pages are only partly connected to the CMS. They hold switches that should be automatic, multi-line fields for one-line values, and fields for copy that is the same on every page.
- Links to pages on the site are typed as `/path` instead of pointing at the page.
- Legal pages are built from dozens of separate paragraphs, so a new policy cannot be pasted in.
- Images cannot be swapped for video where the design will want it (heroes, galleries, the History image).

## Solution

A component and CMS cleanup across the whole site, after which an editor can:

- Fill a component that has only the props it needs, with repeating content held in a component slot (any number of items).
- Add, remove or reorder FAQs, offers, retail slides, meeting venues and their pop-ups, gallery media, room amenities and blog, happenings or packages categories from the CMS alone.
- Open a Dining or Room CMS item and find every unique part of that page there, with fields named "Section - Field" and the right field type. Copy that is the same on every page stays on the template.
- Paste a whole legal document into one rich text field and get the right formatting.
- Use a video or an image in heroes, galleries and the History image, with the same crop either way.
- Pick links that point at real pages.

Every item, in Stephen's words with our reading, is in `docs/specs/cms-components/notes.md`. That file is the source of truth for each acceptance criterion.

Refs: docs/specs/cms-components/refs/refs.json

## Stephen's later words (override older rules and earlier builds)

- X1: components are split and trimmed for clarity. This overrides the earlier lean toward a few highly configurable components ("I think you've taken my 'try and make the utility' to the extreme"). The CLAUDE.md "one class family per component" rule still holds for classes. The split concerns Webflow components and their props.
- M3 follow-up: nested CMS lists are allowed. This replaces the note that "Webflow refuses a component holding a Collection List inside a Collection List". Check it in the Designer; where a nested list hits its item limit, use Finsweet CMS Nest. On a collection template page, a list filtered by the current item's multi-reference is not nested, so the normal limit applies (R2 follow-up).
- Y3 follow-up: the gallery repeats two side by side and then one big item, for any count, and gallery items can be videos.
- X2: on CMS templates, content clearly unique to an item becomes a field, content clearly shared stays static, and anything unsure is left as it is and listed under Questions for Omar. No field is created for an unsure item.

## User Stories

1. As an editor, I want link props and link settings to point at a site page instead of a typed path, so that links survive slug changes (H1).
2. As an editor, I want each component to show only the props that change what I see, so that I am not guessing which toggle does what (X1, H2, H3, H4, H5).
3. As an editor, I want Split image text, Image Trio Text, Venue Card Fullbleed and Map Feature split or trimmed so that each does one job (H2 to H5).
4. As an editor, I want FAQs in a CMS collection, so that I can edit questions in one place and they show wherever the FAQ section sits (H6).
5. As an editor, I want to drop a video or an image into the History timeline frame, keeping its crop (Y1).
6. As an editor, I want every hero to accept a video as well as an image (Y2).
7. As an editor, I want Gallery Mosaic Captioned to take any number of items, laid out two side by side then one big, repeating, with images or videos (Y3).
8. As an editor, I want More of the Guild (Card Carousel Header Left) to take any number of cards from a slot, on every page that uses it (Y4).
9. As an editor, I want to change the images in timeline-scatter-images, not only their captions, on Guidelines and Neighbourhood (G1, N1).
10. As an editor, I want Corporate & Services on Neighbourhood to be a component whose cards I can add or remove (N2).
11. As an editor, I want Article Card Staggered Tall to take any number of cards (N3).
12. As an editor, I want Blog, Happenings, Packages and every other category listing to build their category sections from the CMS, like Press, so that a new category needs no Designer work (B1).
13. As an editor, I want the Accessibility, Privacy Policy and other legal pages to be one rich text field that formats itself when I paste a document (L1, L2).
14. As a developer, I want no empty elements left as jump targets on Meetings (M1).
15. As an editor, I want Key Features of Our Spaces on Meetings to be a component with a slot (M2).
16. As an editor, I want meeting venues, their cards and their pop-ups to come from the CMS on Meetings, Legal and Corporate, with the Neighbourhood pop-up from the CMS too (M3).
17. As an editor, I want Offers & Packages, Retail and Arts & Culture slides to come from the CMS, so that every page shows the same set and I can add or remove slides (O1).
18. As an editor, I want every part of a Dining page bound to the Dining item, and Other dining options to list every other venue automatically (D1).
19. As an editor, I want CMS fields named "Section - Field" (D2).
20. As an editor, I want one-line values in single-line fields and no pointless label fields (D3).
21. As an editor, I want each Dining venue and each Room to have its own gallery of any number of photos or videos (D4, R3).
22. As an editor, I want no CMS fields for copy that is the same on every item (D5, R5, X2).
23. As an editor, I want Room details typed as a bulleted rich text list that renders as today's numbered rows (R1).
24. As an editor, I want to tick a room's amenities from a shared Amenities list (R2).
25. As an editor, I want Discover Other Rooms to list every other room automatically (R4).
26. As a guest, I want Reserve a table to list every dining venue with its own image, text and booking link from the Dinings collection (K1).
27. As Stephen, I want a list of fields we are unsure about, to ask Omar before anything is built for them (C1, X2).

## Implementation Decisions

- **Shared category listing module (code).** Generalise the Press categories module into one module that groups any single Collection List by category and builds the headings and tab pills from the items. Press keeps working unchanged. Blog, Happenings and Packages adopt it by attributes only.
- **Image-or-video media module (code).** Generalise the Dinings section-video behaviour so that any media frame can carry a video link (a CMS link field or a component text prop). With a link, a muted looping video covers the frame and the image stays underneath as poster and fallback, keeping the frame's aspect ratio and crop. Without one, the image shows. It must work inside components, inside Collection List items and on plain page elements. Reduced motion keeps the image. Reuse the existing embed-video URL handling (file, YouTube, Vimeo). The current Dinings section-video markup keeps working.
- **Offers slider counts slides from the page (code).** The Offers Slider Split runtime works with any number of slides coming from a Collection List, and the counter reads the real total.
- **Media collection.** A new collection, one item per photo or video (image, video link, alt, caption), referenced from Dinings and Rooms through a multi-reference "Gallery - Media" field. A multi-image field cannot hold video.
- **Amenities collection.** Holds a name only, with a multi-reference from Rooms. The room template shows a Collection List filtered by the current room.
- **FAQs collection.** Holds question, answer and sort order, general for now (no page scoping). A scoping field can be added later without rework.
- **Meeting venues collection.** Drives the venue cards with their tab pills and the detail pop-ups on Meetings and on the Legal and Corporate template. Neighbourhood's Coronado Beach pop-up moves to the CMS (Map Places or its own collection, decided in its ticket). The Rooms "all rooms" pop-up is checked against the Rooms collection. Arts pop-ups already come from the CMS. The Book a stay menu stays static; Reserve a table lists Dinings (K1).
- **Offers and Retail slides.** CMS-driven (one collection with a type field, or one per slider, decided in its ticket). The slider becomes its own component with a Collection List, not toggles. Arts & Culture on Neighbourhood (tan) is assumed to be the "one more like this".
- **Component slots** replace fixed numbered props on Gallery Mosaic Captioned, Card Carousel Header Left, timeline-scatter-images, Article Card Staggered Tall, Corporate & Services (new component) and Key Features (new component).
- **Gallery layout.** Items pair two side by side, then every third item spans full width. The pattern repeats for any count and is set with Webflow classes or a style embed the Designer can show.
- **Legal rich text.** One Rich Text element per legal page. Child styles (H2 caps with top and bottom margin, paragraphs, lists) use Webflow classes where the Designer allows and otherwise a style embed component on those pages, never head or bundle CSS.
- **Room details.** One rich text bulleted list, styled with a CSS counter for the superscript numbers and a divider under each row (style embed on the Rooms template).
- **CMS audit, every collection.** Field display names follow "Section - Field". One-line values use single-line Plain Text. Unused and pointless fields are removed (unbind first, since Webflow refuses to delete a bound field; a type change needs a new field and a content copy). Every template element is bound or deliberately static under X2.
- **Links.** Every link to a site page uses the Page link type (or the current CMS item). Typed URLs remain only for external links and in-page anchors.
- **Designer lane.** Every ticket labelled `designer` runs in one session on Stephen's Mac, in ticket order. Stephen's "yes, build it" approves every designer ticket's written plan.

## Testing Decisions

- A good test checks what a visitor sees on staging (DOM and layout), never module internals.
- Code tickets add Playwright specs beside the existing ones: extend the Press categories spec to cover a second listing, add a media-frame spec (video covers image, empty link keeps image, reduced motion keeps image), and extend the Offers Slider Split spec for a non-five slide count.
- Designer tickets are proven by capture, compare and iterate on the live page at 390 and 1440 (plus 991, 800 and 650 where desktop layout changes), against the item's notes and images.
- The round report's independent check covers every item id.

## Out of Scope

- C1, the Legal and Corporate template's per-item fields: waiting on Omar (see Questions for Omar). Venue pop-ups on that template are in scope under M3.
- Day and night content (a separate spec).
- Writing real copy. Placeholder text stays until the client supplies copy.

## Questions for Omar

1. On the Legal and Corporate pages, which sections differ between the two and which stay the same on both? For example, is Key Features the same on both? (C1)
2. On Dining pages, does the paragraph under "Explore the Space" change per venue, or is it the same on all? (D5)
3. Any further fields the audit marks as unsure are added here by the audit ticket.

## Further Notes

- Notes, Stephen's words and readings: `docs/specs/cms-components/notes.md`. Screenshots: `docs/specs/cms-components/refs/`.
- Webflow IDs: cache every new collection, field and component ID in `docs/reference/webflow-ids.md`.
