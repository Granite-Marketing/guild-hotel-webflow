# Concepts

> Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as ce-compound and ce-compound-refresh process learnings; direct edits are fine. Glossary only, not a spec or catch-all.

## Scroll effects

### Mask reveal

A scroll effect where a photo or video is already at its final, full size and only a clipping window over it animates, so more of the same picture comes into view without the media ever scaling, moving inside its window, or being swapped for a copy.

The window may travel (for example a card sliding to the centre) as long as the media travels with it; zooming or cross-fading the media to fake the reveal is not a mask reveal.

### Line mask

A text entrance where each line of a heading or paragraph slides up from behind its own hidden edge, played as one timeline after the related mask reveal completes and reversed when the reader scrolls back.

### Hexagon scroll mask

A mask reveal whose window starts as the brand's chamfered hexagon frame inset on the page background and opens as the reader scrolls; on phones it ends full screen, edge to edge with no frame, while on larger screens it keeps the chamfered inset frame.

Every hexagon scroll mask on the site behaves the same way, so a change to one is a change to all of them.

## Navigation

### Bottom menu

The floating section menu pinned to the bottom of the screen on phones while its section is in view, shown closed as a chamfered pill with the active option's label and a burger icon, and opened to list every option.

It is the one standard for section, category and venue menus on phones; a full row of option links is the larger-screen form only.
*Avoid: tab pills, selector pill, sticky menu*

## Feedback

### Feedback item

One numbered point of client or reviewer feedback on the staging site, identified as F followed by a sequence number that never restarts across batches, and tracked from open to verified on staging; a later item that reopens an earlier one gets a new number and names the one it reopens.
