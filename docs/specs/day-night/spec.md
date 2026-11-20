## Problem Statement

The Guild's design treats the hotel as two moods, day and night, and the nav has Day and Night buttons, but they do nothing. Figma tags 21 blocks across Home, Dining, Rooms, Room pages, Meetings and Neighbourhood as "Day / Night content switch". Editors have no way to enter night content, and visitors cannot see it.

## Solution

Pressing Night in the nav swaps the content of every tagged block to its night version: image or video, heading and text, button text and link. Colours and layout stay the same. The swap is a quick crossfade. The choice is saved in a cookie, so every page and every later visit shows the same mode until the visitor switches back. First-time visitors always start on Day. A block whose night version is empty keeps its day content, so editors fill in night content only where it really differs.

Editors enter night content in "Night - <Field>" fields and props beside the day ones, on components and on CMS collections.

Stephen's words and decisions: `docs/specs/day-night/notes.md` (DN1 to DN6) and the tagged block list there.

## Stephen's later words (override older rules)

- DN1: the switch changes content only, not colours or theme. It is unrelated to the nav colour switching over light and dark sections, which stays as it is.
- This spec builds on spec #317 (component and CMS cleanup). Its Designer tickets wait for the matching #317 tickets, so night fields go onto the cleaned-up components and collections.

## User Stories

1. As a visitor, I want to press Night and see the tagged blocks change to their night content, so that the site feels like the hotel after dark (DN1).
2. As a visitor, I want my choice remembered on every page and on my next visit (DN1).
3. As a first-time visitor, I want to land on Day (DN2).
4. As a visitor, I want the change to fade quickly rather than jump (DN4).
5. As a visitor, I want the Day and Night buttons to show which mode is on, and to work by keyboard and screen reader.
6. As a visitor on night mode, I do not want to see day content flash before the night content appears on page load.
7. As an editor, I want "Night - Image", "Night - Video", "Night - Heading", "Night - Text", "Night - Button Text" and "Night - Button Link" beside the day fields on each tagged block (DN5, DN6).
8. As an editor, I want an empty night field to show the day content, so that I only fill in what changes (DN3).
9. As an editor, I want the same night fields on CMS-driven tagged blocks (dining venues, rooms, meeting venues, neighbourhood places), so that each item can have its own night version.
10. As Stephen, I want one block per page filled with sample night content, so that I can see the switch working on staging.

## Implementation Decisions

- **Day and night runtime module (code).** It owns the mode. It reads the cookie (a one-year cookie on the site's domain), defaults to day, wires the nav Day and Night buttons (pressed state, keyboard, `aria-pressed`), sets a mode class on the root element, and swaps every switchable element on the page.
- **Switch contract.** A switchable element carries its night value in an attribute bound to the night prop or field: night text for headings, paragraphs and button labels; night image (including responsive `srcset`, which must swap or be cleared so the browser does not keep the day picture); night video link (through the media module from spec #317); night link for buttons. The module remembers each day value so switching back restores it exactly. An empty or missing night value leaves that element on day.
- **Crossfade.** About half a second. Opacity on the changing elements only, through GSAP `autoAlpha` per the repo conventions. Reduced motion swaps instantly. Taste item: the duration.
- **No day flash on load.** When the cookie says night, night content is in place before the first paint of tagged blocks. A tiny inline head snippet sets the mode class early, and tagged elements stay hidden under that class until swapped. It must stay within Webflow's inline script limits.
- **Works with existing animations.** Text that SplitText animates (hero text reveal, line masks) is swapped before splitting on load. On a later switch, the swap re-splits cleanly with no duplicated or broken lines. Hero image scale and the scroll reveals still run.
- **Designer and CMS.** Each tagged block gets night props (on components) or "Night - <Field>" fields (on collections), bound to the switch attributes. Only the parts DN6 allows: image or video, heading, text, button text and link.
- **Sample content.** One tagged block per page gets a stand-in night image and heading from the asset library, so the switch can be seen. All other night fields stay empty until the client supplies night content.

## Testing Decisions

- A good test drives the real page the way a visitor does (press Night, reload, change page) and checks what shows, not module internals.
- Add a Playwright spec for the module against a fixture page: press Night swaps text, image, video and link; empty night values keep day; reload keeps night through the cookie; a first visit with no cookie is day; reduced motion swaps instantly; no day content is visible on a night load.
- Designer tickets are proven on staging at 390 and 1440 with the capture, compare and iterate loop, toggling Day and Night on each tagged block.

## Out of Scope

- Changing colours, themes or layout by mode (DN1).
- Writing real night copy or choosing real night photos: the client supplies these. Only one sample block per page is filled.
- Automatic switching by time of day (DN2: first visit is always day).
- Blocks without a Figma tag.

## Further Notes

- The tagged block list is in `docs/specs/day-night/notes.md`. It comes from the Figma snapshot (26 Sep amends), and Stephen confirmed it on 20 Nov.
- Waits on spec #317's Designer tickets for the same blocks, as listed in each ticket.
