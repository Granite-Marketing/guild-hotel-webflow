# Day and night content: Stephen's notes (2026-11-20)

Running tab, Stephen's words first, our reading underneath.

## Philosophy

- **DN1** Stephen: "Exactly. Figma already has the day and night switches, and it's going to change the content, not necessarily the colours or anything like that. Just so you know. And we're going to have to store it as well. If someone's on night, we need to store it in cookies so all the blocks use that."
  - Reading: the Day and Night buttons in the nav switch content (text, images, video) on marked blocks, not colours or theme. The visitor's choice is saved in a cookie and every marked block on every page reads it, so the choice holds across pages and visits.
- Earlier, Stephen: "I can show images so you can see - that's the easiest." He sent Figma overviews of every page with the orange "Day / Night content switch" tags.

## Blocks marked in Figma ("Day / Night content switch" tags)

All 21 tags in the Figma snapshot (`figma/raw/file.json.gz`), mapped to the section beside each tag (Figma section names in brackets):

- Home (7): hero (the bold, handsome heart of San Diego); West Coast Hospitality split; Lobby Bar card (cocktail classics); Pool Lounge card (our new pool); Lobby Terrace card; Solana Coffee card; Rooms & Suites.
- Dining collection (4): A Taste of the Guild; Lobby Bar (cocktail classics); Pool Lounge; Garden Terrace.
- Rooms collection (2): hero (rooms & suites); the deluxe king suite block.
- Room individual (3): hero; the full-width image and video block; the text and image block below it.
- Meetings (1): the venue cards block (tag beside Lobby Terrace).
- Neighbourhood (4): hero (a city at your fingertips); Downtown San Diego; Little Italy; Dining Around the Guild. Stephen's live screenshot also shows the tag on the Neighborhood overlay (Coronado Beach pop-up, N4 in spec #317).
- No tags on History, Guidelines, Legal, Corporate, Press, Contact, Gallery, Arts, Happenings, Blog or the Dining and Room individual pages beyond those listed.
- The snapshot dates from the 26 Sep design amends; Stephen confirms the list is current.

## Decisions (Stephen, 2026-11-20, question card)

- **DN2** First visit with no saved choice: "Always day". Night only when the visitor presses Night; the choice is then saved in the cookie (DN1).
- **DN3** A block with no night version filled in: "Show the day content". Editors fill night content only where it really differs; nothing shows blank.
- **DN4** Switching: "Quick crossfade". Text and images fade from one version to the other in about half a second. Taste item: the duration.
- **DN5** How editors enter night content: "Night twin fields". Each marked block gets night fields or props beside the day ones, named "Night - <Field>" (for example "Night - Heading", "Night - Image"). Empty means the day value shows (DN3).
  - **Superseded 2026-11-25 (Stephen: "It should be `Card - Intro (Night)` just so it's similar", then "Yes to all your other suggestions, proximity and folders are essential for making it easy to change"):** a night field or prop is named after its day twin plus "(Night)" and sits directly under it in the same folder. Empty still means the day value shows. See `docs/specs/cms-components/final-review-2026-11-25.md`. Not yet applied in Webflow.
- **DN6** What can change at night: "Image or video", "Heading and text", "Button text and link".
