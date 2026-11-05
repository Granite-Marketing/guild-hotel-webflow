# Mobile review feedback, 2026-11-05

Source: Todoist subtasks of "Finish final plan for feedback in Guild hotel" (id 6hw43VGQx9wHCpQJ). Read only extraction.

Conventions used in every screenshot description:
- Every attachment is a 3840x2160 desktop screenshot, split in two halves.
- LEFT half = live staging site (the-guild-hotel-c34e71.webflow.io) in Chrome device emulation, iPhone, 393 x 852, with DevTools open to its right.
- RIGHT half = Figma ("THE GUILD - HANDOFF (Internal)") mobile frame, the design reference.
- No circles, arrows or drawn annotations are visible in any screenshot; the reviewer's note is only in the comment text. Where a screenshot has no visible marker, "target element" is inferred from the comment text and marked as such.
- Local copies of the images: `review-feedback-2026-11-05-images/<fileId>.png` (fileId = the number in the attachment URL after `user_upload/v2/`). Attachment URLs are on files.todoist.com and need a Todoist login.
- All 24 subtasks are not completed (checked: false). 22 have the "Review ... (mobile)" naming; "Happenings invidual (mobile)" and "Corporate individual (mobile)" are extra subtasks without the description line.

Totals: 24 subtasks, 47 comments (46 with a screenshot, 1 text only).

---

## Home (https://the-guild-hotel-c34e71.webflow.io/) [task 6hwFvgJWHwgQH3FJ, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "Button width needs min width"
   - Attachment: https://files.todoist.com/user_upload/v2/2248285149/file.png (local: 2248285149.png)
   - Screenshot: Home hero, top of page. Live (left): hero photo of the building facade with heading "THE BOLD, HANDSOME HEART OF SAN DIEGO", centred paragraph "The Guild is quintessential San Diego, a storied landmark reimagined...", and a cream pill "BOOK" button below it, centred. The BOOK pill is narrow, hugging the word (about 95 px wide in the 393 px viewport). Figma (right, frame "HOME - MOBILE", "Mobile 391"): hero with large pineapple illustration, same heading and paragraph, and a BOOK button that is wider with more horizontal padding (about 110 px in the scaled frame, noticeably wider relative to its label). Target = the BOOK button (inferred from comment).

## History (https://the-guild-hotel-c34e71.webflow.io/history) [task 6hwFvgVgHRr6rfjJ, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "Add a little bit more spacing between the text and the image, maybe double it."
   - Attachment: https://files.todoist.com/user_upload/v2/2248285333/file.png (local: 2248285333.png)
   - Screenshot: History page, block with the handwritten script heading "A century of stories meets a new hospitality" (two lines, right-leaning italic script), followed by a painting image (abstract red/orange/green artwork, portrait, slightly inset from the gutters) and below it the heading "SAN DIEGO'S GREAT ESCAPE & OASIS IS AS WELCOMING AS EVER" with body "500 W. Broadway, built when San Diego's identity was...". Live (left): the script heading ends at about y=460 and the image starts at about y=490, i.e. a small gap (roughly 30 px) between heading and image. Figma (right): same script heading, then a larger gap (roughly 50 px at the scaled frame) before a grey image placeholder. Target = gap between script heading and image (inferred).

2. Comment: "Instead of the text fading on scroll, let's make it have a mask animation that plays once it hits a certain point and then plays out. Not scroll-based for the text"
   - Attachment: https://files.todoist.com/user_upload/v2/2248285395/file.png (local: 2248285395.png)
   - Screenshot: History page at a scroll position where the hero image (facade photo of the YMCA building) fills the live viewport, the header logo "THE GUILD HOTEL" is faded out at the top, and the caption "ETIAM IMPERDIET SODALES DUI A VESTIBULUM. DUIS NEQUE METUS, VULPUTATE SIT AMET LIBERO AT, ALIQUET VEHICULA LACUS." (uppercase, small, with superscript "1") overlaps the lower part of the image on the left. Figma (right): frames "I2" and "I3" grey image placeholders and a black section "A LANDMARK REIMAGINED" with four grey squares in a 2x2 grid and a small caption "Discover the materials, colors and details..." Target = caption text that fades on scroll (inferred from comment; no marker). Static screenshot cannot show the animation.

3. Comment: "We still need quite a bit more top and bottom spacing. I'm happy for you to use a combo class here between the discover the property section."
   - Attachment: https://files.todoist.com/user_upload/v2/2248285416/file.png (local: 2248285416.png)
   - Screenshot: History page, "DISCOVER THE PROPERTY" section. Live (left): dark teal water photo at the top with caption "4 DUIS POSUERE LOREM LACINIA JUSTO COMMODO, ID LOBORTIS AUGUE ELEIFEND. NUNC MOLESTIE ARCU VEL TEMPOR MAXIMUS." then cream section with centred heading "DISCOVER THE PROPERTY" (two lines), centred paragraph, and an illustrated property map image (full width of the gutters). The heading starts about 100 px below the section top and the cream section ends only about 190 px below the map (map bottom around y=890, section ends y=1085). Figma (right): the same section with a visibly larger gap above "DISCOVER THE PROPERTY" (about 120 px scaled) and a much larger gap (about 150 px scaled, leading to "MORE OF THE GUILD") below the map. Target = vertical padding above the heading and below the map (inferred).

## Dining (https://the-guild-hotel-c34e71.webflow.io/dining) [task 6hwFvgR4CfPCfv3J, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "Where is the bottom sticky navigation thing? I think it's meant to be there from the start of the page."
   - Attachment: https://files.todoist.com/user_upload/v2/2248285529/file.png (local: 2248285529.png)
   - Screenshot: Dining page top (hero). Live (left): hero photo (blurred bartender), heading "A TASTE OF THE GUILD", paragraph "A world of invention, craft and sophisticated pleasures". At the bottom of the hero there is only cream space; no sticky bottom pill is visible. Figma (right, frames "DINING-COLLECTION - Mobile 390" and "Mobile - selector open"): hero with pineapple illustration, same heading, and a dark maroon pill at the bottom with label "SOLANA COFFEE" underlined and a hamburger/menu icon on the right, sitting at the hero's bottom edge. The second frame shows it opened as a maroon list (ZUMA, THE LOBBY BAR, POOL LOUNGE, GARDEN TERRACE, SOLANA COFFEE) with a close X. Target = the missing maroon sticky selector pill at the bottom (named in comment).

2. Comment: "The gap here is quite big. I know we're using consistent sizing in different places, but we're going to have to add some kind of combo class override for this special case."
   - Attachment: https://files.todoist.com/user_upload/v2/2248285553/file.png (local: 2248285553.png)
   - Screenshot: Dining page, intro text block under the hero. Live (left): the paragraph "For visitors and locals, Guild dining is a journey, an invitation to savor our worlds. The Lobby Bar knows its classics..." (centred, 8 lines) sits at the top of the viewport (overlapping the fixed header), followed by a large empty cream gap of roughly 500 px (y=370 to y=880) before the rounded octagon-cornered "ZUMA" sign image (dark red wood panels, around 275 px wide). Figma (right): script heading "First sips, small bites & big nights out." then the paragraph, then a gap of roughly 130 px scaled before the same ZUMA image (framed with chamfered corners) followed immediately by a full-width Zuma image. Target = the gap between the paragraph and the ZUMA image (inferred).

## Zuma (https://the-guild-hotel-c34e71.webflow.io/dining/dining-zuma) [task 6hwFvgRJgPcmhrxJ, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "Some z-index fighting here - fixes after slight scroll"
   - Attachment: https://files.todoist.com/user_upload/v2/2248285696/file.png (local: 2248285696.png)
   - Screenshot: Zuma page top. Live (left): hero with dark background, large cream "ZUMA" wordmark, sashimi photo, heading "ZUMA SAN DIEGO", paragraph "Dress up for the rich, worldly sophistication of California's first Zuma." At the bottom edge of the hero a blue "RESERVE A TABLE" pill is cut off by the hero's bottom edge (only its top half shows, clipped at y~1030), over a dark navy strip. Figma (right): Zuma frames at zoomed-out scale (DINING-ZUMA - MOBILE frame with pineapple, ZUMA wordmark, blue reserve button, red wood image and navy section; also a desktop frame and a "WELLNESS-COLLECTION" frame). Target = the clipped RESERVE A TABLE button (inferred).

2. Comment: "" (empty, no text; second screenshot of the same issue)
   - Attachment: https://files.todoist.com/user_upload/v2/2248285706/file.png (local: 2248285706.png)
   - Screenshot: Same Zuma page, scrolled slightly. Live (left): hero is now shorter/higher (ZUMA wordmark at y~485), "ZUMA SAN DIEGO" heading at y~862, the blue "RESERVE A TABLE" pill is fully visible below the hero on the navy strip, and the top of the red wood "ZUMA" image starts underneath it. Figma (right): same zoomed-out frames as item 1. Shows the post-scroll state where the button sits correctly (consistent with the comment "fixes after slight scroll").

3. Comment: "Where is the second paragraph?"
   - Attachment: https://files.todoist.com/user_upload/v2/2248285723/file.png (local: 2248285723.png)
   - Screenshot: Zuma page, navy section "CONTEMPORARY JAPANESE DINING AT THE GUILD HOTEL". Live (left): red "ZUMA" sign image at the top (header logo overlaps it), heading in two lines, one paragraph "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum quam eu est facilisis gravida...", then a large empty navy gap and the cream section starting at y~910 with the text "Nam in massa ut enim cursus sagittis ut vel ex. Aenean tincidunt..." partly hidden behind a blue "RESERVE A TABLE" pill. Figma (right): same heading, a first paragraph (Lorem ipsum...) AND a second paragraph "Nam in massa ut enim cursus sagittis ut vel ex..." in the navy section before the cream section. So live is missing the second paragraph in the navy block (the text appears instead in the cream section below).

4. Comment: "There's an additional \"Discover Zuma\" link here. Don't know what the hell that's going to do. Only on Zoomer, not other links."
   - Attachment: https://files.todoist.com/user_upload/v2/2248285741/file.png (local: 2248285741.png)
   - Screenshot: Zuma page, cream section with "DRESS CODE" ("Upscale. Flip-flops/sandals, active wear and sweat-attire are not permitted."), "HOURS OF OPERATION" (Monday-Thursday 5:00 PM - 10:00 PM, Friday-Saturday 5:00 PM - 11:00 PM, Sunday 5:00 PM - 10:00 PM) and one underlined link "BROWSE THE MENU", then an image of the garden terrace with a blue "RESERVE A TABLE" pill over it. Live (left): only the "BROWSE THE MENU" link is present. Figma (right): "BROWSE THE MENU" and a second underlined link "DISCOVER ZUMA" beneath it (y~753), then a grey image placeholder labelled "01". Reviewer's wording: the extra "Discover Zuma" link is in the Figma side (note: "Only on Zoomer" is as written, likely meaning only on this page). Whether the link should exist is not decided in the screenshot.

5. Comment: "Shouldn't this not be a swiper slider so we get the nice scroll snapping? I know we can do it with CSS, but I'm not sure if that property is fully supported. It's also showing a bottom scroll bar when we move it, which I don't think we're meant to be showing."
   - Attachment: https://files.todoist.com/user_upload/v2/2248285829/file.png (local: 2248285829.png)
   - Screenshot: Zuma page "OTHER DINING OPTIONS" block with paragraph "Duis posuere lorem lacinia justo commodo, id lobortis augue eleifend...". Live (left): horizontal carousel of cards: first card is a tall portrait photo (garden terrace with umbrella, 323 px wide) with title "GARDEN TERRACE" below, and a sliver of the next card at the right edge (a dark red image, label "TH..." cut off). Below it a blue "RESERVE A TABLE" pill. Figma (right): same heading and paragraph, first card is a grey placeholder with label "THE LOBBY BAR" below and a sliver of the next card ("POO...") at the right edge, followed by "FAQS / YOUR QUESTIONS, ANSWERED". No scroll bar visible in the screenshot itself; the comment refers to behaviour on interaction.

## Garden Terrace (https://the-guild-hotel-c34e71.webflow.io/dining/dining-gardenterrace) [task 6hwFvgXqG5hxrVxr, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "Feedback for this and the other restaurant pages already provided."
   - Attachment: none (text only).

## Lobby Bar (https://the-guild-hotel-c34e71.webflow.io/dining/dining-lobbybar) [task 6hwFvgWff29qjh4J, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

No comments

## Pool Lounge (https://the-guild-hotel-c34e71.webflow.io/dining/dining-poollounge) [task 6hwFvgchJ5chG7Vr, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

No comments

## Rooms (https://the-guild-hotel-c34e71.webflow.io/rooms) [task 6hwFvgf62PCfQ3MJ, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "Maybe add a little bit more spacing between the paragraph text and the handwritten title."
   - Attachment: https://files.todoist.com/user_upload/v2/2248285947/file.png (local: 2248285947.png)
   - Screenshot: Rooms page intro. Live (left): handwritten script heading "A room for every stay" (two lines, large), then paragraph "From intimate rooms to expansive loft suites, each space brings together The Guild's historic character, thoughtful design and modern comfort." (centred, 3 lines) directly under the script, then a circular stamp "THE GUILD HOTEL, NOV 3 1230PM 1924, SAN DIEGO, CALIF." and a maroon band with "01 / 03" at the bottom. The script's descender ("for every stay" at y~630) is about 20 px above the paragraph's first line (y~650). Figma (right): same elements, but the gap between the script heading (ends y~540) and the paragraph (starts y~590) is larger, about 50 px.

2. Comment: "Clicking \"Open All Rooms\" is somehow showing one of the room options as well. That shouldn't be the case, and it's pushing the content down."
   - Attachment: https://files.todoist.com/user_upload/v2/2248285984/file.png (local: 2248285984.png)
   - Screenshot: Rooms page with the all-rooms overlay open. Live (left): a room card at the top (photo of the "COZY COURTYARD QUEEN" room, "4 GUESTS", "52 M2 SIZE", cream "VIEW MORE" button) occupies about 440 px above the maroon overlay; below it a "CLOSE" button (focused, blue outline) and the list "ALL ROOMS SUITES" tabs then room names (COZY QUEEN, COZY KING, COZY COURTYARD QUEEN highlighted, COZY COURTYARD KING, CITY LEVEL BELOW GROUND...). Figma (right): the "WHO'S CHECKING IN?" quiz panel (maroon, options JUST ME, TWO GUESTS (selected), 3-4 GUESTS, 5+ GUESTS, link "SEE ALL THE ROOMS") and next to it the "All Rooms" overlay (tabs ALL / ROOMS / SUITES and the list of room names, link "BACK TO THE QUIZ") with no room card above it. So live shows an extra room card above the overlay.

3. Comment: "There should be some text underlined for the links here."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286015/file.png (local: 2248286015.png)
   - Screenshot: Rooms page, recommendations block "OUR RECOMMENDATIONS FOR YOUR STAY" (centred, three lines) with paragraph and two centred links "BACK TO THE QUIZ" and "SEE ALL ROOMS", then a room image below. Live (left): the two links are plain uppercase small text with no underline. Figma (right): same links are underlined. Also in Figma the first room card starts with "DELUXE KING SUITE" over the image.

4. Comment: "The aspect ratio of the images here is wrong, and we're missing the icons as well. Let me know if you need those grabbed."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286039/file.png (local: 2248286039.png)
   - Screenshot: Rooms page, recommended room card. Live (left): tall portrait photo card (about 410 px wide, 740 px tall, crop of the "COZY COURTYARD KING" room), title "Cozy Courtyard King" in mixed case, "2 GUESTS" and "26 M2 SIZE" as plain text with no icons, cream "VIEW MORE" button, cream bands above and below the image. Figma (right): card with a shorter, wider image (about 370 x 510, roughly 3:4 landscape-leaning crop), title "DELUXE KING SUITE" in uppercase, and small icons next to "4 GUESTS" (people icon) and "52 M2 SIZE" (square icon). A purple selection outline is visible around the Figma card (Figma selection, not an annotation).

## a room page (https://the-guild-hotel-c34e71.webflow.io/rooms/guild-city-level-loft) [task 6hwFvgg6rQJXc42r, completed: no]
Description link text: "Guild City Level Loft | The Guild Hotel". Screenshots show the Cozy Courtyard King page (/rooms/cozy-courtyard-king).

1. Comment: "The shape of the image here is incorrect."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286087/file.png (local: 2248286087.png)
   - Screenshot: Room page, image under the header. Live (left): a portrait image of the room (white walls, window, TV, striped sofa) about 360 x 480 with chamfered corners, centred in a cream area below a small "VIEW FLOORPLAN" link at the very top. Figma (right): list items 4, 5, 6 ("Mauris congue nibh diam...", "Morbi suscipit est elit...", "Donec elementum risus enim...") each with a rule line, the underlined link "VIEW FLOORPLAN", then a landscape image (about 430 x 290, hand writing "Welcome to the Guild" photo) followed by a full-bleed image. So Figma image is landscape rectangle, live is a taller portrait shape with cut corners.

2. Comment: "There's too much spacing between the text and the bottom of the image. Reduce by about 50%."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286098/file.png (local: 2248286098.png)
   - Screenshot: Room page hero. Live (left): a full-height photo (room, bed and orange chair) with the caption "ETIAM IMPERDIET SODALES DUI A VESTIBULUM. DUIS NEQUE METUS, VULPUTATE SIT AMET LIBERO AT, ALIQUET VEHICULA LACUS." in small uppercase at y~895-935, then about 50 px of dark gradient before the image ends at y~985, then cream. Figma (right): hand-writing photo with the same caption in larger uppercase at y~700-750 and only about 30 px of space below the caption before the image ends at y~780, then cream with a grey placeholder "01" offset to the right. So the caption-to-image-bottom gap is larger on live.

3. Comment: "This image is right-aligned when it should be left-aligned, and I think it needs to be just slightly bigger. The next image down needs to be full width but still keep that square shape."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286117/file.png (local: 2248286117.png)
   - Screenshot: Room page feature list ("MUSIC PLAYER (VIA BLUETOOTH TV)", "HIGH SPEED WIFI") followed by a small portrait image. Live (left): the image (woman in bathrobe reading in bed, about 183 x 235) is placed at the right gutter (x 315 to 497); further down the paragraph "Morbi gravida augue at ipsum ultricies aliquet..." and the top of another image at the left (x 129 to 407, about 280 wide, not full width). Figma (right): grey placeholder "03" is left-aligned (x 1269 to 1487, about 218 wide in the scaled frame), paragraph below, then placeholder "04" spans the full content width (x 1269 to 1555) and is squarer. Live image is smaller and right-aligned; the next image is not full width.

4. Comment: "Remove the slight gap between the image and the next section. It should just be side by side."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286155/file.png (local: 2248286155.png)
   - Screenshot: Room page, location map block and offers. Live (left): top shows heading text "We've lived here for a century; let us show you around." with a "DISCOVER MORE" outlined button, then the illustrated hotel map image (full-width, white background) from y~367 to y~950, then a thin cream strip (about 10 px) between the map's bottom and the maroon "OFFERS & PACKAGES" section starting at y~960. Figma (right): hand-drawn neighbourhood map ("HOTEL CLERMONT") ends and the maroon "OFFERS & PACKAGES / WELLNESS STAYCATION" section begins directly beneath with no cream gap. Target = cream strip between map image and maroon section (inferred).

## Wellness (https://the-guild-hotel-c34e71.webflow.io/wellness) [task 6hwG4qrwwMcF8v8r, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "Same gap issue here that I've mentioned in a previous ticket."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286247/file.png (local: 2248286247.png)
   - Screenshot: Wellness page, script heading block. Live (left): script heading tail "and produce to deep rest." at the top (overlapping header), paragraph "Suspendisse viverra interdum elit, vitae vestibulum lectus iaculis non. Proin tortor felis, fringilla eu tincidunt a, facilisis ultrices massa." (centred, 3 lines, y~307-350), then a large empty gap (about 500 px, y~370 to 868) before a chamfered-corner image (face massage, about 275 x 200). Figma (right, "WELLNESS AT THE GUILD" hero with pineapple, then "From movement and produce to deep rest." script and the paragraph at y~725-755): gap to the image (massage photo, chamfered corners, 190 x 140, at y~877) is about 120 px scaled. Same kind of paragraph-to-image gap as the Dining ticket (comment 2 there).

## Guidelines (https://the-guild-hotel-c34e71.webflow.io/guidelines) [task 6hwG4qxHQXCrGjGJ, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "The section is missing an image from here. I think we just need to pick one."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286404/file.png (local: 2248286404.png)
   - Screenshot: Guidelines page, top. Live (left): cream header area (logo "THE GUILD HOTEL"), then immediately a dark brown section "OUR PROCESS" with intro paragraph and numbered list items 1 to 4 ("Upon receiving the requirements of your shoot...", etc.). There is no image between the header and "OUR PROCESS". Figma (right): top has a cream text block ending with "Thank you for choosing the Guild Hotel for your shoot!" script, then a grey image placeholder (about 215 x 195) at y~345-540, then the dark "OUR PROCESS" section. So Figma has an image above OUR PROCESS that live lacks.

2. Comment: "Text to be centre-aligned, same comment as previous ticket."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286431/file.png (local: 2248286431.png)
   - Screenshot: Guidelines page form area. Live (left): "@USERNAME" caption on a small photo at the top, then the script heading "Photoshoot Request" (left aligned, starts at the left gutter x~125, y~410-480), then "CONTACT INFORMATION", fields FIRST NAME, LAST NAME, EMAIL ADDRESS, PHONE NUMBER, COMPANY OR ORGANIZATION, then "SHOOT DETAILS". Figma (right): the script heading "Photoshoot Request" is centred within the frame (x~1287 to 1600 across a 365 wide content area, with a balanced margin), same form fields below. Target = the script heading "Photoshoot Request" (inferred; live is left aligned and Figma centred).

3. Comment: "Reduce the gap between the submit button and the bottom additional details, probably by about 50%."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286443/file.png (local: 2248286443.png)
   - Screenshot: Guidelines page, end of form. Live (left): last field "ADDITIONAL DETAILS" at y~545, then a gap of about 105 px to the dark "SUBMIT YOUR REQUEST" pill (y~650-690), then a gap of about 200 px to "FAQS / YOUR QUESTIONS, ANSWERED". Figma (right): "ADDITIONAL DETAILS" at y~683, "SUBMIT YOUR REQUEST" at y~750-785 (about 65 px gap), and FAQS heading about 190 px below the button. Target = gap between the last field and the submit button (comment says "between the submit button and the bottom additional details").

## Happenings (https://the-guild-hotel-c34e71.webflow.io/happenings) [task 6hwG4r3r63H8Rr2r, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

No comments

## Blog (https://the-guild-hotel-c34e71.webflow.io/blog) [task 6hwG4r7JWWmw9RCr, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

No comments

## an article page (https://the-guild-hotel-c34e71.webflow.io/happenings-stories/locals-night-at-rodeo-bar) [task 6hwG4r73fcQ5wQFJ, completed: no]
Description link text: "Locals night at Rodeo Bar | The Guild Hotel". The screenshots show the page /happenings-stories/whats-on-in-san-diego-t... ("What's on in San Diego this autumn").

1. Comment: "learn more should be sticky"
   - Attachment: https://files.todoist.com/user_upload/v2/2248287433/file.png (local: 2248287433.png)
   - Screenshot: Article page. Live (left): hero (dark photo) with heading "WHAT'S ON IN SAN DIEGO THIS AUTUMN" and paragraph, then cream section "THE GUILD, A TRIBUTE PORTFOLIO HOTEL" with two paragraphs (Nullam euismod finibus suscipit..., Curabitur accumsan vehicula...), then a maroon "LEARN MORE" pill centred at y~800 placed in normal flow below the text, then a garden-terrace photo (left aligned, about 255 wide) at y~920. Figma (right, frame titled "LOCALS NIGHT AT RODEO BAR" with pineapple hero): the maroon "LEARN MORE" pill overlaps the bottom of a longer paragraph (at y~905-930, centred, covering text "Phasellus in dia... ...atis quis vel elit. Integer sod... ...mollis"), i.e. the button floats over the text as a sticky element. Live has it in flow, not overlapping.

2. Comment: "left align text"
   - Attachment: https://files.todoist.com/user_upload/v2/2248287451/file.png (local: 2248287451.png)
   - Screenshot: Article page, "MORE AROUND TOWN" block. Live (left): heading "MORE AROUND TOWN" centred (x 160 to 468 in a 410 wide viewport, centred), above a stacked list of image cards (HISTORICAL TOURS photo of the building with white label). A photo (dark bar interior) sits top right (x 243-497). Figma (right): "MORE AROUND TOWN" is left aligned at x~1165 (left gutter), larger, above a full-width grey card labelled "HISTORICAL TOURS" (label bottom left). A grey placeholder aligned right also appears at the top (x 1282-1559). Target = the "MORE AROUND TOWN" heading (inferred).

## Meetings (https://the-guild-hotel-c34e71.webflow.io/meetings) [task 6hwG4r9wmGc4H85r, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "Same gap issue mentioned in two previous tickets"
   - Attachment: https://files.todoist.com/user_upload/v2/2248286286/file.png (local: 2248286286.png)
   - Screenshot: Meetings page. Live (left): end of script heading ("...for celebration & collaboration", overlapping header), paragraph "Suspendisse viverra interdum elit, vitae vestibulum lectus iaculis non..." (centred, 5 lines at y~307-391), then a large empty cream gap (about 515 px, y~400 to 910) before the chamfered-corner image of a bookshelf (about 275 wide). Figma (right): zoomed-out frames "MEETINGS-COLLECTION - MOBILE" (pineapple hero, "Intimate spaces for celebration & collaboration" script, paragraph, grey rounded image placeholder with a much smaller gap, then grey "COUNCIL BOARDROOM" card) and a council boardroom detail panel ("DETAILS", "LAYOUT OPTIONS", "FLOORPLAN") plus a boardroom image panel. Gap between the paragraph and the image is much smaller in Figma.

2. Comment: "I've actually just realised that this top image is actually meant to be a slider on both mobile and desktop when the modal's open."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286304/file.png (local: 2248286304.png)
   - Screenshot: Meetings council boardroom modal open on mobile. Live (left): modal in cream with back arrow (blue focus outline) top left and "SUBMIT YOUR REQUEST" dark pill top right, a single boardroom photo (orange chairs around a long table, 368 x 460) at y~340-800, then heading "COUNCIL BOARDROOM", "DETAILS" and the paragraph. The photo has no slider indicator. Figma (right): same modal frame, with the boardroom image at the top (398 x 500) and a thin two-tone line under it (dark segment then light, a slider progress indicator) at y~838 before the heading "COUNCIL BOARDROOM". Behind it a pineapple hero is visible. The slider indicator (progress line under the image) is the visible hint of a slider in Figma.

3. Comment: "" (empty, no text; second screenshot for the modal slider)
   - Attachment: https://files.todoist.com/user_upload/v2/2248286309/file.png (local: 2248286309.png)
   - Screenshot: Same live modal as item 2 (left: boardroom image with back arrow and "SUBMIT YOUR REQUEST"; heading "COUNCIL BOARDROOM", "DETAILS", paragraph). Figma (right, frame "Meetings-Overlay", desktop layout): a wide modal with a back arrow, centred "COUNCIL BOARDROOM" title and "SUBMIT YOUR REQUEST" pill at the top, left column "DETAILS" paragraph and "LAYOUT OPTIONS" (Classroom 21*, Theater 21, U-shape 21, Conference 21*, Rounds 21, Reception 21) with "FLOORPLAN" link and note "*REQUIRES FURNITURE REMOVAL, CHARGES MAY APPLY", right column numbered features (510 SQ FT, Modern executive seating for 12, Premium conference table with ultra connectivity, Oversized built-in hi-res TV, Capacity 50+), and a wide boardroom image below with three small slider dashes at the bottom (the middle one active). Shows the desktop slider.

4. Comment: "Looks like the title text here is meant to be centre-aligned."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286335/file.png (local: 2248286335.png)
   - Screenshot: Meetings page form. Live (left): hero strip at the top with an "I AMERICA PLAZA" maroon selector pill, then script heading "Request for Proposal" left aligned (starts at the left gutter x~130, two overlapping lines of script at y~465-545), then "CONTACT INFORMATION", FIRST NAME, LAST NAME, EMAIL ADDRESS, PHONE NUMBER, COMPANY OR ORGANIZATION fields, "EVENT DETAILS". Figma (right): the script heading "Request for Proposal" is centred across the content column (x~1228 to 1540), same fields below ("EVENT DATE", "NUMBER OF PEOPLE").

5. Comment: "It looks like you have added the keys over the image, so you can't see the images correctly. I think we need to make sure the image fits in the top square."
   - Attachment: https://files.todoist.com/user_upload/v2/2248286362/file.png (local: 2248286362.png)
   - Screenshot: Meetings page, map section. Live (left): a full-height Google map (grey/beige street map of San Diego, rotated labels like "Hawk St", "Reynard Way", "CAMBRIDGE SQUARE", "BANKERS HILL", "LITTLE ITALY") from y~283 to y~965, with only one brown circular marker at the lower right (x~440, y~898), then a brown block "STEPS FROM KEY LEGAL ADDRESSES" below. The map is zoomed in and shows few markers. Figma (right): the same map more zoomed out with street names horizontal, three brown circular markers and a dark pin around "W Broadway", then the brown block "STEPS FROM KEY LEGAL ADDRESSES" with paragraph. Note: the comment text ("keys over the image", "top square") does not obviously match this map screenshot; it may refer to the map legend/markers over the image. Uncertain.

## Corporate (https://the-guild-hotel-c34e71.webflow.io/legal-corporate/corporate) [task 6hwG4rF97r4p8XFr, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

No comments

## Legal (https://the-guild-hotel-c34e71.webflow.io/legal-corporate/legal) [task 6hwG4r9vF3XFHCVJ, completed: no]
Description: "Add findings as comments with a screenshot and a short note."
Note: all screenshots in this task's comments show the Corporate page (/legal-corporate/corporate), not /legal-corporate/legal.

1. Comment: "Centre align title text"
   - Attachment: https://files.todoist.com/user_upload/v2/2248286532/file.png (local: 2248286532.png)
   - Screenshot: Corporate page intro. Live (left): end of script heading ("unmatched convenience", overlapping the header), paragraph "From board meetings to week-long offsites, The Guild gives corporate teams flexible meeting rooms..." (centred, 4 lines), then heading "KEY FEATURES" left aligned at x~130 (y~520), then a boardroom photo (368 wide) and "HIGH-SPEED, ENCRYPTED WI-FI" with paragraph. Figma (right): hero "RETREAT FOR CORPORATE TEAMS" with pineapple, script "Refined focus, unmatched convenience." centred, paragraph, then "KEY FEATURES" centred (x~1462) above a grey placeholder image. So "KEY FEATURES" is left aligned on live and centred in Figma. Target = the "KEY FEATURES" title (inferred).

2. Comment: "more spacing below"
   - Attachment: https://files.todoist.com/user_upload/v2/2248286557/file.png (local: 2248286557.png)
   - Screenshot: Corporate page, "QUIET, PROFESSIONAL WORKSPACES" block. Live (left): photo (hand writing "Welcome to the Guild", 368 x 368) at the top, title "QUIET, PROFESSIONAL WORKSPACES" (two lines) and paragraph "Comfortable, dedicated areas designed for quiet focus..." ending at y~790, then cream bottom padding of only about 45 px (ends y~835) before the dark "WHY TEAMS CHOOSE THE GUILD" section. Figma (right): same title/paragraph (ends y~680) with about 120 px of cream below before the dark section (starts y~800). Target = space below the paragraph (inferred).

3. Comment: "remove top line"
   - Attachment: https://files.todoist.com/user_upload/v2/2248286596/file.png (local: 2248286596.png)
   - Screenshot: Corporate page, dark "WHY TEAMS CHOOSE THE GUILD" section. Live (left): heading (two lines), then a horizontal rule at y~455 above the first row "LOCATION / Prime location within minutes of San Diego's courthouses", then rule lines between rows (SETTING, CONNECTIVITY, PRIVACY, OUTDOORS). Figma (right): the heading then rows with eyebrow "EYEBROW TEXT", with a rule below each row but no rule above the first row (first row at y~613 directly under the heading). So the first/top rule is the extra line on live.

4. Comment: "shape wrong and too much space"
   - Attachment: https://files.todoist.com/user_upload/v2/2248286684/file.png (local: 2248286684.png)
   - Screenshot: Corporate page, "SECURE STORAGE & SERVICES" block. Live (left): heading and paragraph "On-site private storage for sensitive materials, with 24/7 access to printing and scanning." (y~265-330), then a large empty gap (about 480 px) before a small chamfered-corner image (a podium in a conference room, 275 x 200, y~810-1010). Figma (right): the same text block (cream) at the bottom of a grey image and then dark full-width image cards "SMALL CONFERENCE CENTER" with "DISCOVER MORE" and "LARGE CONFERENCE CENTER" directly following, full width with no chamfered shape. So live image shape (small with chamfers) and gap differ from Figma.

5. Comment: "sizing's wrong here - needs to be larger. Annoying that it's a second layout but we need to make it look like the the design"
   - Attachment: https://files.todoist.com/user_upload/v2/2248286713/file.png (local: 2248286713.png)
   - Screenshot: Corporate page, legal addresses card over map. Live (left): brown card (x 129-497, about 368 wide, y 255-990) "STEPS FROM KEY LEGAL ADDRESSES" with paragraph "Four courthouses sit within a short walk of The Guild..." and four rows (SAN DIEGO SUPERIOR COURT 6-minute walk, SAN DIEGO CENTRAL COURTHOUSE 4-minute walk, U.S. DISTRICT COURT 3-minute walk, HALL OF JUSTICE 3-minute walk) each with an underlined "Directions" link, sitting on a zoomed map. The card's text is large (about 17-18 px, headings 20 px). Figma (right): brown card on the same map with heading, paragraph and four rows with "Directions" links, with much smaller text (about 9-10 px in the scaled frame), the card narrower in the frame and the map visible below it with markers. The reviewer says the sizing needs to be larger; the live card text looks larger than Figma in this screenshot, so this comment may refer to a different element (uncertain, no marker).

6. Comment: "More top spacing here"
   - Attachment: https://files.todoist.com/user_upload/v2/2248286844/file.png (local: 2248286844.png)
   - Screenshot: Corporate page, "TAILORED CORPORATE PACKAGES". Live (left): the bottom of the brown legal card ("HALL OF JUSTICE", "3-minute walk", "Directions") over the map's lower edge, then cream with heading "TAILORED CORPORATE PACKAGES" at y~455-490 only about 55 px below the map's bottom edge (map ends y~405), a garden-terrace photo (368 wide), "EXECUTIVE FLOOR BUYOUT" and four bullet points. Figma (right): the map ends at y~440 and the heading "TAILORED CORPORATE PACKAGES" sits at y~610-645, about 170 px below, then a large grey image placeholder. So more space above the heading in Figma.

7. Comment: "Centre align text and missing paragraph"
   - Attachment: https://files.todoist.com/user_upload/v2/2248286865/file.png (local: 2248286865.png)
   - Screenshot: Corporate page, "Request for Proposal" block. Live (left): bullets "Wellness options to support mental clarity and team morale", "Discounted dining packages and meal coordination" (top of image), then script heading "Request for Proposal" left aligned on two lines (y~405-520), then immediately "TRIAL TEAM CONCIERGE legalteams@theguildhotel.com", "24/7 EMERGENCY BOOKING +1 (619) 975-6000", "ADDRESS 500 W. Broadway, San Diego, CA 92101", then "CONTACT INFORMATION" and fields. Figma (right): "EXTENDED STAY LEGAL COMFORT PACKAGE" bullets, script "Request for Proposal" on one line, centred, then a paragraph "Proin sed nisl nisi. Quisque porttitor, nisl sed eleifend mattis, risus tellus pulvinar metus, a lacinia lacus neque sit amet purus. Donec efficitur leo sed urna tempus, eu congue ex convallis." before TRIAL TEAM CONCIERGE etc. Live is missing that paragraph and has the heading left aligned on two lines.

8. Comment: "same gap from form issue"
   - Attachment: https://files.todoist.com/user_upload/v2/2248286889/file.png (local: 2248286889.png)
   - Screenshot: Corporate page form. Live (left): fields FIRST NAME, LAST NAME, EMAIL ADDRESS, PHONE NUMBER at about 52 px pitch, then a larger gap (about 80 px extra, between PHONE NUMBER at y~361 and LAW FIRM / COMPANY at y~455), then TEAM SIZE, CHECK-IN DATE, CHECK-OUT DATE, SPECIAL REQUIREMENTS, then a gap of about 105 px to the dark "SUBMIT YOUR REQUEST" pill (y~767-803), then "CORPORATE GALLERY" section starting at y~878. Figma (right): all fields (FIRST NAME ... SPECIAL REQUIREMENTS) evenly spaced at about 59 px pitch with no extra gap, then about 80 px to the submit button, then the "CORPORATE GALLERY" grey section. Target = the extra gaps between PHONE NUMBER and LAW FIRM / COMPANY, and above the submit button (inferred).

## Neighborhood (https://the-guild-hotel-c34e71.webflow.io/neighborhood) [task 6hwG4rF3pcRwvjfr, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "spacing needs increased and image should be full width"
   - Attachment: https://files.todoist.com/user_upload/v2/2248287554/file.png (local: 2248287554.png)
   - Screenshot: Neighborhood page, "LITTLE ITALY" block. Live (left): top shows the bottom of an image (dark restaurant interior, x 129-386, partial width) overlapped by the header, then about 115 px of cream, heading "LITTLE ITALY", paragraph "Vivamus consequat tempus dolor...", then a bedroom photo (278 wide, left aligned, x 129-407, y 590-917) and cream below. Figma (right): grey placeholder at the top (x 1078-1330), heading "LITTLE ITALY" with ~115 px gap above, paragraph, then a much larger grey image placeholder that is full content width (x 1078-1440, 362 wide) and taller (y 530-953). So Figma image is full width; live image is narrower (278 vs 368) and spacing around it differs.

2. Comment: "need wide text variant"
   - Attachment: https://files.todoist.com/user_upload/v2/2248287568/file.png (local: 2248287568.png)
   - Screenshot: Neighborhood page, "THE MIDWAY MUSEUM" slide in brown section. Live (left): brown block with a framed photo (368 x 410), then a narrow centred paragraph "Vivamus consequat tempus dolor, sed ullamcorper quam scelerisque eget. In hac habitasse platea dictumst..." wrapping at about 190 px width (7 lines, x 220-407), "DISCOVER MORE" cream pill, slider arrows "01 / 05", then the maroon "ARTS" selector pill at the bottom. Figma (right): eyebrow "ARTS & CULTURE DOWNTOWN SAN DIEGO", title "THE MIDWAY MUSEUM", image placeholder, paragraph in smaller type wrapping wide (about 260 px, 5 lines), "DISCOVER MORE" pill and "02 / 05" arrows; then cream "BEYOND DOWNTOWN SAN DIEGO". So the paragraph on live is a narrow column; Figma uses a wider text measure.

3. Comment: "line is in the wrong place and button could be better positioned"
   - Attachment: https://files.todoist.com/user_upload/v2/2248287587/file.png (local: 2248287587.png)
   - Screenshot: Neighborhood page, "SAN DIEGO SUPERIOR COURT" card in maroon. Live (left): boardroom image at the top (over the header), title "SAN DIEGO SUPERIOR COURT", paragraph (5 lines), then a horizontal rule at y~622 about 85 px below the paragraph, then small uppercase text "PELLENTESQUE DUI METUS, TEMPUS VEL SODALES SIT AMET..." (4 lines), then the cream "CORPORATE & LEGAL PACKAGES" pill at y~775; the maroon section ends at y~918, then cream with the "SERVICES" maroon pill overlapping the heading "DINING AROUND THE GUILD". Figma (right): paragraph, then the small uppercase text first (y~725-795), then the rule (y~832) BELOW the uppercase text, then the "CORPORATE & LEGAL PACKAGES" pill (y~887) about 55 px below the rule, and maroon bottom padding. So the rule sits above the uppercase text on live, and below it in Figma; the button position differs.

## Gallery (https://the-guild-hotel-c34e71.webflow.io/gallery) [task 6hwG4rGj6j4VfXXJ, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

No comments

## Arts (https://the-guild-hotel-c34e71.webflow.io/arts) [task 6hwG4rG6rrJHfPCJ, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "shape and spacing wrong"
   - Attachment: https://files.todoist.com/user_upload/v2/2248287660/file.png (local: 2248287660.png)
   - Screenshot: Arts page intro. Live (left): paragraph "From intimate rooms to expansive loft suites, each space brings together The Guild's historic character, thoughtful design and modern comfort." (centred, y~220-262, overlapping the header), then a huge gap (about 330 px) before a large portrait image of banana leaves with a hotel sign (about 360 x 480, chamfered corners, y~600-1080). Figma (right): ART COLLECTION hero (photo with sconce), script "An art collection through a curator's eyes", paragraph, then a smaller landscape image of the leaves (218 x 146, chamfered corners, y~798-945) about 90 px below the paragraph, then a full-width image below. Also shows the ARTS-MODAL frames ("EVA STRUBLE", "OCEAN..."). Live image is portrait and large; Figma is small and landscape, with smaller spacing.

2. Comment: "image alignment is wrong"
   - Attachment: https://files.todoist.com/user_upload/v2/2248287675/file.png (local: 2248287675.png)
   - Screenshot: Arts page, "THE GUILD COLLECTION" block. Live (left): heading and paragraph "Morbi gravida augue at ipsum ultricies aliquet..." then an image (interior with a bookshelf wall and sofa, portrait about 278 x 328) left aligned at x 129-407, then a dark band and a row of art thumbnails with a maroon "ALL" selector pill overlapping. Figma (right): a grey placeholder at the top left (x 1107-1373, 267 wide), heading and paragraph, then a grey placeholder (175 x 227) aligned to the right (x 1282-1457). So the image under the paragraph is right aligned in Figma and left aligned on live.

## Contact (https://the-guild-hotel-c34e71.webflow.io/contact) [task 6hwG4rFmVrXR3h4r, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

1. Comment: "checkbox alignment is fucked"
   - Attachment: https://files.todoist.com/user_upload/v2/2248287480/file.png (local: 2248287480.png)
   - Screenshot: Contact page form. Live (left): fields FIRST NAME ... SPECIAL REQUIREMENTS, then a checkbox (square, about 18 px, at x~130-148, y~622-640) with the label "I HAVE READ AND ACCEPT THE PRIVACY POLICY" (underlined "PRIVACY POLICY"), where the label's first line sits at y~634 (about 12 px lower than the checkbox centre) and the second line "POLICY" wraps at x~162 indented. Then "SEND YOUR MESSAGE" dark pill. Figma (right): "YOUR REQUEST" heading, same fields at larger scale, a checkbox (25 px) at x~1183-1208 with the label to its right "I HAVE READ AND ACCEPT THE PRIVACY POLICY" on two lines; the checkbox is vertically centred between the two label lines (checkbox y 680-705, label lines y 682 and 710). Target = vertical alignment of the checkbox relative to its label (inferred).

## Privacy policy (https://the-guild-hotel-c34e71.webflow.io/privacy-policy) [task 6hwG4rPpgcfpwX5J, completed: no]
Description: "Add findings as comments with a screenshot and a short note."

No comments

## Happenings invidual (mobile) (https://the-guild-hotel-c34e71.webflow.io/happenings-stories/historical-tours) [task 6hwG8wx3x2M4M46r, completed: no]
Description: "[Historical tours | The Guild Hotel](https://the-guild-hotel-c34e71.webflow.io/happenings-stories/historical-tours)" (no "Add findings" line).

1. Comment: "learn more should be sticky"
   - Attachment: https://files.todoist.com/user_upload/v2/2248287252/file.png (local: 2248287252.png)
   - Screenshot: Historical tours article. Live (left): hero (dark stairs photo) with heading "HISTORICAL TOURS" and paragraph, then cream section "THE GUILD, A TRIBUTE PORTFOLIO HOTEL" with two paragraphs, the maroon "LEARN MORE" pill centred at y~817 in normal flow below the paragraphs, then a garden-terrace photo. Figma (right, frame titled "LOCALS NIGHT AT RODEO BAR"): the paragraph is longer and the maroon "LEARN MORE" pill (y~1048) overlaps the last lines of text, centred over it (sticky/floating). Same comment and same Figma overlap as in the article page ticket.

## Corporate individual (mobile) (no URL in description) [task 6hwGFFwv5mpG9jxr, completed: no]
Description: "" (empty). Screenshot shows /legal-corporate/corporate.

1. Comment: "centre algin text"
   - Attachment: https://files.todoist.com/user_upload/v2/2248287867/file.png (local: 2248287867.png)
   - Screenshot: Corporate page. Live (left): end of script heading ("unmatched convenience", overlapping the header), paragraph "From board meetings to week-long offsites..." (centred), then "KEY FEATURES" left aligned at x~130 (y~545), boardroom photo (368 wide), "HIGH-SPEED, ENCRYPTED WI-FI" and its paragraph left aligned. Figma (right): the paragraph "Suspendisse viverra interdum elit..." left aligned at the top, "KEY FEATURES" centred (x~1290) above a grey placeholder, then "HIGH-SPEED, ENCRYPTED WI-FI" left aligned, paragraph, and a second grey placeholder. Target = "KEY FEATURES" heading (inferred); same finding as Legal comment 1.
