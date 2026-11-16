# Overnight, 16 November: what is live on staging

Staging: https://the-guild-hotel-c34e71.webflow.io (now on release v1.2.30). Everything below was checked on the live staging site with screenshots on each ticket.

## Ready for you to check

**Arts and Gallery (card 2).** Back in a chained modal now works: on [Arts](https://the-guild-hotel-c34e71.webflow.io/arts), open "Oceano", tap "by Eva Struble", then Back returns you to the artwork, not the grid. Escape does the same. Only Oceano has an artwork modal at the moment. [#178](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/178)

**Press (card 5).** [Press](https://the-guild-hotel-c34e71.webflow.io/press) is one list alternating left and right without breaks, with one heading each for Press, Design and Community, and tabs built from the CMS. The first tab click after loading used to stop short; it now lands on its heading every time. [#181](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/181)

**Buttons (card 6).** The new hexagon buttons are live on every page. All 116 visible buttons were checked at normal and retina sharpness, at rest and on hover, and every one switches correctly. The check found that some outlined buttons drew their top or bottom line at half thickness; that is fixed and now every edge is the same thickness. Try "Discover more" on [Home](https://the-guild-hotel-c34e71.webflow.io/) or [Dining](https://the-guild-hotel-c34e71.webflow.io/dining), and "Book your space" on [Meetings](https://the-guild-hotel-c34e71.webflow.io/meetings). [#190](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/190)

**History (card 7).** On [History](https://the-guild-hotel-c34e71.webflow.io/history) the George Marston stamp now appears the moment it enters the screen, "Once opened, never closed" waits until it is just above the middle of the screen, and the timeline photos open upward with the mask reveal. [#189](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/189)

**Corporate, Meetings and Neighborhood maps, and page loading (cards 8 and 9).** Pages scroll from your first touch while still loading, never jump back up, the hero text plays once, and scrolling over the map no longer pauses. Try [Corporate](https://the-guild-hotel-c34e71.webflow.io/legal-corporate/corporate), [Neighborhood](https://the-guild-hotel-c34e71.webflow.io/neighborhood) and [Meetings](https://the-guild-hotel-c34e71.webflow.io/meetings). [#176](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/176)

**Neighborhood and Happenings hover (cards 10 and 11).** The "Beyond Downtown" images on [Neighborhood](https://the-guild-hotel-c34e71.webflow.io/neighborhood) and the "More around town" cards on a [Happenings story](https://the-guild-hotel-c34e71.webflow.io/happenings-stories/locals-night-at-rodeo-bar) zoom very slightly (1.04) on hover. [#185](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/185)

## Assumptions I made

1. **History photo mosaic.** The photo grid lower on History ("Discover the Property" area) no longer animates; it is simply there. You said it did not need an animation. The same block is on Meetings, Corporate, Neighborhood and the Dining pages, so it is static there too.

## Left alone, as agreed

- Filter menu shape: still waiting on the client's SVG ([#191](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/191)).
- Reveal audit: parked ([#192](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/192)).
- Meetings form questions: waiting on Omar.
- Review leftovers from the code build ([#206](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/206)), not started: going back to an earlier modal does not restore its dim background setting or its scroll position; the map loader uses a timing check the house rules discourage; the button outline formula only holds at a 1px thickness; one table row in the button notes is out of date; one accessibility flag is not updated after a back link; some modal back-link paths have no automated test; late text splitting has no check that it leaves page height unchanged.

## Also done

- The modal test now matches the new Back behaviour and runs offline without errors ([#198](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/198)).
- Release ticket closed ([#187](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/187)).
