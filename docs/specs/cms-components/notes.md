# CMS and components: Stephen's walk-through (2026-11-20)

Running tab of every item, in Stephen's words, with our reading underneath. The spec and its acceptance criteria are built from this file. Images and roles: `refs/refs.json`.

## General

- **X1** Stephen: "I think we need to do a deep review of the components and break some of them up because they're so damn confusing." And: "I think you've taken my 'try and make the utility' to the extreme. This isn't utility. This is just confusing in Webflow."
  - Reading: review every component's props; split multi-purpose components into simpler ones with only the props an editor needs. This overrides the earlier lean toward fewer, highly configurable components (CLAUDE.md "one class family per component" still holds for classes; the split is about Webflow components and their props).
- From the opening brief: some components need component slots (to say what content goes where); one or two elements need to support both video and image; general housekeeping so components are clearer to use.

## Home (/)

- **H1** Stephen: "this is a global issue. If the URL actually exists on the website, can we please try and link to that rather than just using a forward slash?"
  - Reading: every link prop whose target is a page on this site uses Webflow's Page link type (or a CMS item link), not a typed URL like `/rooms`. Typed URLs stay only for external links and anchors. Applies site-wide.
- **H2** Stephen: "this component has got way too much different functionality in it. How can I have a slider? There's just too much going on here. I think we need to break it up into different components. Just these settings alone, for visibility, is just too much."
  - Reading: Split image text light gets broken into separate components (for example a plain split, and a slider version), each with only its own props.
- **H3** Stephen: "this component's borderline as well: too much functionality going into it. For example, you can show or hide the paragraph below. There's a CTA version. Again, it's not linking to the wellness page in the way that it should. When you go down, you can actually show the items header as well and the items text, so it's borderline."
  - Reading: Image Trio Text gets its toggles cut back (or split into variants that need no toggles); its CTA links to the Wellness page per H1.
- **H4** Stephen: "this section again seems to have a huge amount going on. I don't know why we'd want to hide the image. I don't know what this show intro actually does. I've toggled it, and nothing happens. It just seems to be too much going on with these components."
  - Reading: Venue Card Fullbleed Tall loses Show Image and any toggle that does nothing (Show Intro); keep only props that change what an editor sees.
- **H5** Stephen: "for example, this map feature. Holy shit, man! It's literally title, description, button, and image, but there's so much going on. You need to really revise these components."
  - Reading: Map Feature props become title, description, button and image. The places list already comes from the Map Places CMS collection, so the leftover place name, walk and link props go.
- **H6** Stephen: "the FAQ section should be a CMS collection, so please set it up as such."
  - Reading: new FAQs collection; faq-accordion lists its items.
  - Follow-up, Stephen: "For FAQs, just make it general for now, but you could add some fields. If in future they want it to be scoped down, we can maybe do it that way, but for now, I think it's just general."
  - Reading: one general list shown wherever faq-accordion sits. Fields: question, answer, sort order. No per-page scoping now; a later scoping field can be added without rework.

## History (/history)

- **Y1** Stephen: "I think this image on the history page should also support video. I think what we need to do is think about a way to make certain sections support both image and video, and try and make it as reasonable as possible (because sometimes it's going to be inside of a component, and sometimes it's not going to be). We also need to know the aspect ratios and stuff like that as well. Just one for the future, but I think this needs to also support video if possible."
  - Reading: one reusable image-or-video pattern that works inside a component and on plain page elements, keeping the same aspect ratio and crop for either. First use: the History timeline image. Stephen calls it "one for the future" but wants it "if possible", so it is in this spec.
- **Y2** Stephen: "Oh, you also just reminded me: all the hero sections should also be able to support video as well. Completely forgot."
  - Reading: every hero component accepts a video as well as an image, using the Y1 pattern.
- **Y3** Stephen: "all gallery mosaic sections should use component slots and thus be extensible. When there are two, then it should be side by side. When there are three, then we have that big image at the bottom. Just bear that in mind whenever using this section on any page. It does need to be able to grow and shrink depending on how many items are added."
  - Reading: Gallery Mosaic Captioned holds its items in a slot (no Image 1 to 4 props, no Show Figure toggles). Layout follows item count: 2 side by side; 3 adds the big full-width image below. Every page that uses it is moved over.
- **Y4** Stephen: "more of the Guild section should use component slots, not static slots."
  - Reading: Card Carousel Header Left (More of the Guild) takes its cards from a slot instead of fixed Card 1 to 4 props; card links follow H1.
- Follow-up on Y2 to Y4, Stephen: "Repeat the pattern, two side by side then a big one. Video in every hero and gallery that grows and shrinks, and that more of the guild section is filled from a slot that is global as well. It's not just the history page. These blocks appear in multiple pages. I just want that to be clear."
  - Reading: Y3 gallery repeats for 4+ items (pair, then one big, then pair, then big). Y2, Y3 and Y4 apply to every page that uses those blocks, not only /history. Ambiguous: "Video in every hero and gallery" may mean gallery items also accept video; treated as yes (gallery items use the Y1 image-or-video pattern) unless Stephen says otherwise.

## Guidelines (/guidelines)

- **G1** Stephen: "these images need to be editable inside of the component. Right now, you could only see the caption."
  - Reading: timeline-scatter-images lets an editor change each image (and its alt), not only the captions. Given G-wide direction toward slots, likely a slot of image items; the spec decides between an image prop per item and a slot.
- Follow-up, Stephen: "Yes, gallery items can be videos too" (confirms the Y3 reading).

## Blog (/blog), and every category listing

- **B1** Stephen: "I'm having a look at the blog page right now, and I can see that each category is its own section with its own CMS. What happens when the user adds another category? I thought we already built something that made this dynamic, so it could scale up and down. We only have one CMS collection for the top fill intro as well as the actual items below. Isn't that not how we did it? Why is it not like that anymore? Please check, because it was definitely a place where we've done this. This needs to be rolled out sitewide for blogs, packages, and so on and so forth."
  - Finding: /press already does this (#181, `pressCategories`): one Collection List of every item, category heading and tabs built from the CMS, so a new or empty category needs no Designer work. /blog and /happenings were duplicated from /press on 2026-10-26 (F30) before that change was carried over, so they still have one static section per category (dining, culture, conferences).
  - Reading: /blog, /happenings, packages and every other category listing move to the /press pattern: one list, headings and tab pills built from the category collection. Generalise `pressCategories` into one shared module rather than a copy per page. The spec lists every page that has category groups.

## Legal and accessibility pages (/accessibility, privacy policy, legal and other static-template pages)

- **L1** Stephen: "For these legal and accessibility pages, we can't use individual text fields. These need to be scalable. It needs to be a rich text field, and we just need to add our own custom CSS styling to it to make it look like this. For example, "measures we take" should have just a top margin to create that kind of spacing, and the bottom margin, if you get me. This all needs to be a rich text element so that we can copy and paste it, and it has the correct formatting."
  - Reading: the body of every legal-style page (accessibility, privacy policy, and any page on the static-template layout) becomes one Rich Text element, so the client can paste a whole document in. Its look matches today's page: H2 caps headings with top and bottom margin for the section spacing, body paragraphs, bullet lists. The rich text child styles (All H2, All Paragraphs, lists) are set with Webflow classes where the Designer allows, else in a style embed component on those pages (CLAUDE.md: the Designer must show what ships; the MCP cannot style rich text children, so this is Designer or embed work).
  - Open: the short contents list under the intro (Our Commitment, Measures We Take, Feedback and Contact) is hand-typed today. Spec decides whether it is built from the rich text headings or removed.

## Neighbourhood (/neighborhood)

- **N1** Stephen: "these images need to be editable."
  - Reading: same as G1. timeline-scatter-images (Tall variant here) lets the editor change each image, not only captions. One fix covers both pages.
- **N2** Stephen: "turn this into a component and use component slots so that the number of elements here can increase or decrease depending on the number."
  - Reading: Corporate & Services (today a plain section) becomes a component; its cards (image, heading, text) sit in a slot so any number can be added or removed.
- **N3** Stephen: "turn this to use component slots so that the number of cards can be increased or decreased as needed."
  - Reading: Article Card Staggered Tall (Dining Around the Guild) takes its cards from a slot, not fixed Card 1 to n props with Show Image toggles. Applies everywhere the component is used.

## Meetings (/meetings)

- **M1** Stephen: "is there an empty `div` here for a reason?"
  - Finding: it carries `id="request-for-proposal"` and one link on /meetings points at `#request-for-proposal`, so it is a jump target for the proposal form. Reading: move the id onto the form section itself and delete the empty div; the link keeps working.
- **M2** Stephen: "it should be a component with component slots."
  - Reading: Key Features of Our Spaces (today a plain div, `meetings-collection-features_component`) becomes a component; its feature list (and any repeatable items) sit in a slot.
- **M3** Stephen: "these should come from a CMS collection. Right now, you've created individual components, which is going to be an absolute hassle to manage if these figures increase or reduce, and there's no easy way to edit this as well. This should be a CMS collection, so should the overlay detail panel model. Please tell me the other pages where we have these modals as well, because I think almost all the modals should be coming from CMS collections (because that's going to be the easiest way to manage them). Otherwise, it's going to be an absolute bastard."
  - Reading: a Meeting Venues CMS collection drives both the venue cards with their tab pills and the detail modals, so adding a venue is one CMS item.
  - Finding, modals on staging today (2026-11-20 scan):
    - /meetings: council-boardroom, lobby-terrace, one-america-plaza. Static. Move to CMS.
    - Legal and Corporate template (/legal-corporate/legal and /corporate): council-boardroom, small-conference-center, large-conference-center, one-columbia-place. Static and identical on both items. Move to CMS (likely the same venues collection).
    - /neighborhood: coronado-beach. Static. Move to CMS (Map Places or a neighbourhood collection; spec decides).
    - /rooms: all-rooms (the full rooms list). Check whether its content already comes from the Rooms collection.
    - /arts: artist and artwork modals already come from the CMS. No change.
    - Every page: book and book-table (the Booking Menu). These are site menus, not content; stay static.
  - Constraint: Webflow refuses a component holding a Collection List inside a Collection List (why Art Detail Modal exists). A CMS-driven modal cannot also nest the venues list; the spec must design around this.
  - Follow-up, Stephen (overrides the constraint line above): "Yeah, I can. You can nest CMS items. The only thing is, CMS items only give you a maximum of, I think, 5 to 10 nested items, although we can use Finsweet CMS nest to get around this."
  - Reading: nested CMS lists are allowed (Webflow caps a nested list at a small number of items); where a modal needs more, use Finsweet CMS Nest, already used on this site for the rooms quiz (see `docs/solutions/integration-issues/finsweet-cms-nest-v1-two-modes-collection-page-links.md`). The older note in webflow-ids.md (Art Detail Modal) was about a component holding a list inside a list; the builder checks it in the Designer rather than designing around it.

## Privacy Policy (/privacy-policy)

- **L2** Stephen: "Same comment as the accessibility page. These page layouts need to have rich text fields that have the correct formatting."
  - Reading: same fix as L1 on the Privacy Policy page; one rich text style serves every page on the static-template layout.

## Offers Slider Split, sitewide

- **O1** Stephen: "This is more of a general comment, but for retail offers and packages, I think there's one more like this. I think those can just go into a CMS collection because they're going to be the same on every page. It's just going to make managing them significantly easier, because right now you set it to 5 static images, and maybe that number might increase or decrease. Let's just feature-proof that now."
  - Reading: the slides of Offers Slider Split come from the CMS instead of fixed Slide 1 to 5 props, so slides can be added or removed. Offers & Packages (about 15 pages, burgundy and cream variants) and Retail (Home, blue) each read their own collection, or one collection with a type field; spec decides. Every instance on every page shows the same slides.
  - "One more like this": taken to be the Neighbourhood "Arts & Culture Downtown San Diego" slider (tan variant), the only other Offers Slider Split use. Confirm with Stephen.
  - Interacts with H2 (split up multi-purpose components): the slider becomes its own component with a Collection List inside, not toggles.

## Dining individual pages (/dining/<slug>, Dinings collection and template)

- **D1** Stephen: "It seems that the majority of this page isn't actually even connected to the CMS. Don't know what's going on there. I don't know why you've added all of these toggles here to show these and other dining options. It should just show all the other dining options by default, excluding the current dining that you're looking at."
  - Reading: every visible piece of the Dining template is bound to a Dinings field (no placeholder props such as "Eyebrow", lorem body or `#` CTA left on the template). "Other dining options" is a Collection List of Dinings that excludes the current item, with no per-venue Show card switches. The Split navy / Split olive switches are replaced by one option field (look: navy or olive) or removed; spec decides.
- **D2** Stephen: "Split Section - Title, Split Section - Description, Split Section - Button Link, Split Section - Button Text; I think the way that you should be doing these deeper CMS collections is by using this kind of a format. Otherwise it's hard to navigate"
  - Reading: CMS field display names follow "<Section> - <Field>" (for example "Split Section - Title", "Split Section - Button Link"), so long collections read section by section. Applies to every collection, not only Dinings. Slugs stay kebab-case.
- **D3** Stephen: "also, make sure that if it's a single text field, you're not using the multi-text line for it. For example, like this here: that should be a single line of text. I don't know why we have other dining labels anyway, so you need to do some serious revisions of what the hell's going on here because the CMSs aren't done very well."
  - Reading: every CMS field holding a one-line value (titles, labels, button text, eyebrows) is a single-line Plain Text field; multi-line only for paragraphs. The Other dining label fields are deleted (D1 makes them pointless). This calls for a full audit of every collection (field types, names, unused fields, unbound fields), not only Dinings.
  - Constraint: changing a field from multi-line to single-line in Webflow may need a new field and a content copy, and Webflow refuses to delete a bound field (unbind first; see `docs/solutions/workflow-issues/webflow-cms-field-limit-migration.md`).
- **D4** Stephen: "I'm not entirely sure how you're going to make this section scalable on the dinings. You might have to use a multi-reference field for the CMS. Just remember that multi-reference field is going to have to support both video and image."
  - Reading: the Dining gallery shows a different number of items per venue. Likely a multi-reference from Dinings to a media collection (one item per photo or video, using the Y1 image-or-video pattern) feeding the Y3 grow-and-shrink layout; a multi-image field cannot hold video, so it does not fit. Nested list limits and CMS Nest per the M3 follow-up.
- **D5** Stephen: "And also, let's be intelligent as well with the fields that we create. For example, we don't need a field for "Explore the Space" here. We don't need a field for the actual text."
  - Reading: copy that is the same on every item of a collection (headings like "Explore the Space", fixed labels) stays as static text on the template, not a CMS field. Only content that differs between items gets a field. Applies to every collection in the audit (D3). Ambiguous: "the actual text" read as that section's heading text; if the paragraph under it differs per venue it keeps a field.

## Legal and Corporate template (/legal-corporate/<slug>): open question

- **C1** Stephen: "Let's add a question for Omar on the corporate and legal page. It's not very clear what needs to be connected to the CMS versus what is going to be consistent across them. For example, key features could be clear for both corporate and legal, so let's just leave that as an open question so I can ask him."
  - Status: waits on Omar. Out of scope for this spec's tickets; listed in the spec's Out of Scope. Question to send: "On the Legal and Corporate pages, which sections differ between the two (and should be editable per page in the CMS), and which stay the same on both? For example, is Key Features the same for both?"
  - Still in scope regardless of his answer: H1 links, the X1 component split, and the M3 venue modals, which are shared with this template.

## Room individual pages (/rooms/<slug>, Rooms collection and template)

- **R1** Stephen: "It seems that we need to connect a lot of the rooms' individual pages still. For example, this section here is going to be quite hard to reproduce because of how you've done it. We could try and make it like a multi-reference field, or we could just use a rich text field and then be intelligent with how we set this up. Maybe a rich text field in a list item or something like that. I'm usually quite intelligent with how I do these."
  - Reading: every section of the Rooms template is bound to the room's CMS item. Room Description: description text field, plus one rich text field "Room Description - Details" holding a bulleted list; the rich text list items are styled (CSS counter for the superscript number, divider line under each) to match today's rows. Bed, guests and size are just the first list items, so no extra fields. Stephen: "Agreed".
- **R2** Stephen: "We're going to have to be quite intelligent with how we do the room amenities as well. It'd be good to hear what your suggestions are."
  - Proposal A (recommended): an Amenities collection (name only) and a multi-reference "Amenities" on Rooms; the grid is a nested Collection List. Editors tick amenities per room, names stay identical across rooms, a new amenity is one item. If a room needs more than the nested-list limit, Finsweet CMS Nest (M3 follow-up).
  - Proposal B: one rich text bulleted list styled as the 4-column grid (same trick as R1). Simplest, no limits, but each room retypes its list.
  - Stephen: "Beautiful, agreed - we shouldn't have issues since we're already in a CMS page. It's not going to be nesting within another CMS collection. It's only when you're nesting within an actual Webflow CMS collection component that it limits you, but if you're adding a CMS page, you can display other CMS items normally with your 100-item limit, I think."
  - Decision: Proposal A. On a collection template page the amenities list is a top-level Collection List filtered by the current room's multi-reference, not a list nested inside another list, so the normal limit applies and CMS Nest is not needed.
- **R3** Stephen: "the gallery section here, again, is going to have to be flexible to grow and shrink."
  - Reading: same as D4 and Y3: room gallery from a multi-reference to the media collection (image or video), Y3 layout.
- **R4** Stephen: "this section should actually link to the CMS and should show other options, excluding the current one we're looking at."
  - Reading: Discover Other Rooms is a Collection List of Rooms excluding the current room (same rule as D1), cards linking to each room page.
- **R5** Stephen: "I don't think the neighbourhood map is actually going to be unique amongst the rooms, so you can probably keep that consistent, I think."
  - Reading: the map stays static on the template; no CMS fields. Its toggles still get the X1/H5 cleanup.

## Rule for every CMS field (applies to the whole audit)

- **X2** Stephen: "I think, if you can help me as well, if you spot any field inside of it, the CMS, that seems like it might be consistent across them, you can just flag that so we can ask Omar (because I'd rather do that than create fields and connect them and have to remove them). Anything that you're unsure about, just leave it, but anything that is obviously, clearly unique to that CMS item, we can turn it into that."
  - Reading: three buckets for every piece of content on a CMS template.
    1. Clearly unique to each item (name, hero image, description, gallery, details): becomes a field and is bound.
    2. Clearly the same on every item (fixed headings like "Explore the Space", the room map): stays static on the template, no field (D5, R5).
    3. Unsure: left as it is today, not turned into a field, and listed in the spec's Questions for Omar so Stephen can ask him (C1 is the first).
  - The spec carries the Questions for Omar list; the build does not create fields for bucket 3.

## Booking Menu, Reserve a table pop-up (every page)

- **K1** Stephen: "Ooh, also overlay booking a table. These fields, I believe, should actually be coming from the dining CMS collections."
  - Finding: the pop-up (dialog `book-table`, an Overlay Detail Panel Modal instance inside Booking Menu) already lists venues from a Dinings Collection List, but each venue's reserve link is `#`, and the instance still carries leftover props from other uses (heading "council boardroom", eyebrow "by eva struble", an artwork caption, Media, Body and Extras with lorem text).
  - Reading: every venue row in Reserve a table (image, name, text, reserve link) is bound to Dinings fields, adding a "Booking - Reserve Link" field if none exists. The pop-up keeps no hand-filled venue content; under X1 it becomes its own simple component (or a variant with only its props) instead of a 60-prop Overlay Detail Panel Modal. Overrides the earlier note that the booking menus stay static: Reserve a table is CMS-driven; Book a stay stays a static menu.

## Arts and Gallery filters (/arts, /gallery)

- **A1** Stephen: "Art and gallery categories need to be flexible as well. They need to come from the CMS. Use a reference field or something like that."
  - Finding: the filter tabs on /arts (Painting, Photography, Sculpture) and /gallery (Design, Wellness, Dining, Rooms, Amenities, Guests) are hand-built links with typed `data-gallery-filter-tag` values; each gallery item carries one category today (bound from an option field). The filter runtime already finds tabs anywhere inside its section and compares names lowercased, so CMS-rendered tabs need no code change.
  - Reading: a categories collection (one for Arts and one for Gallery, or one with a page field; ticket decides) with name, slug and sort order. Each gallery item gets a reference field "Category" replacing the option field, bound to `data-gallery-filter-item`. The tab bar keeps a static "All" tab followed by a Collection List of categories, each tab's `data-gallery-filter-tag` bound to the category slug. A new category is one CMS item.
