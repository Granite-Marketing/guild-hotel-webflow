# Spec: Hexagon panel video from Dropbox, footer links (26 Nov)

Issue: https://github.com/Granite-Marketing/guild-hotel-webflow/issues/427
Snapshot: 2026-11-26 18:09

### Intent

Every hexagon scroll mask panel gets a video link, in the same place editors already paste one for the hero and gallery items. Any Dropbox link the client pastes (copied from the Share button, with or without `dl=0`, `dl=1` or `raw=1`, old `/s/` links, or a direct `dl.dropboxusercontent.com` link) plays as a muted looping video covering the panel, with the image underneath as the poster and fallback. YouTube, Vimeo and direct file links keep working as now.

The footer loses Services, Amenities and In-room Dining, and gains Legal directly below Corporate.

Stephen's words: `docs/specs/adhoc-2026-11-26/notes.md`.

Cap: $20
Refs: docs/specs/adhoc-2026-11-26/refs/refs.json

### Done-when

- #428: V1: the shared video link reader turns each of these into a direct `https://dl.dropboxusercontent.com/...` file link that keeps `rlkey` and drops `dl`, `raw` and `st`: a `www.dropbox.com/scl/fi/...?...&dl=0` share link, the same with `dl=1` and with `raw=1`, an old `www.dropbox.com/s/<id>/<name>?dl=0` link, and a link already on `dl.dropboxusercontent.com` (unchanged apart from dropping `dl`/`st`).
- #428: V1: YouTube, Vimeo and plain file links produce exactly what they produce today.
- #428: V1: a factory test covers every link shape above (the sample link in the spec's Further Notes is one case).
- #428: V1: in a hexagon scroll mask panel whose image frame carries `data-video-link`, the video covers the frame and scales from the same start size to normal size with the image when the panel moves in; image-only panels behave exactly as today.
- #428: V1: a panel whose video link is empty or blank shows its image, unchanged.
- #428: `pnpm check`, `pnpm test:factory` and `pnpm build:check` pass.

### Constraints

- The shared video link reader (used by the hero, gallery, history and now the hexagon panels) learns Dropbox: a link on `dropbox.com` becomes a direct file link on `dl.dropboxusercontent.com`, keeping the `rlkey` and dropping `dl`, `raw` and `st`. Everything that already uses video links gets Dropbox for free.
- The hexagon panels use the existing media video contract (`data-video-link` on the panel's image frame), not a new module.
- When a panel moves in, its image settles from slightly larger to normal size; a video in that panel must make the same move, so a video panel does not look different from an image panel.
- CMS-driven panels bind the link to a CMS link field on that collection ("Media - Video Link", like the gallery lists); panels inside components get a "Video Link" text prop (single-line), like the hero.
- Footer links are edited in the Footer Links component, once, so every page changes.

- Test the link reader from the outside: given each Dropbox link shape, it returns the direct file link; given YouTube, Vimeo and file links, nothing changes. Prior art: the factory tests in `tests/`.
- Panels and footer are checked on staging at 390 and 1440 against the reference images.

### Entry points

_No response_

### Non-goals

- Trial Teams footer link: waits on the client's answer to where it points (Stephen, 26 Nov).
- The font: already swapped in planning (purchased Gatch files behind the existing Gatchtest fonts); it goes live with this round's staging publish.
- Other Gatch weights from the purchase (Light, Bold and so on): not asked for.

### Tickets

- #428 Dropbox links play as video, and panel videos move with their image (open)

### Spec (as filed)

## Problem Statement

The hexagon scroll mask panels (home, dining, meetings, wellness, arts, and the venue snap on the Legal & Corporate pages) can only show an image, while the hero and the gallery and arts scroller items can already show a looping video when a link is pasted. The client hosts video on Dropbox, and a Dropbox share link opens a web page, not the file, so today a pasted Dropbox link would play nothing. The footer also lists links the client no longer wants and is missing Legal.

## Solution

Every hexagon scroll mask panel gets a video link, in the same place editors already paste one for the hero and gallery items. Any Dropbox link the client pastes (copied from the Share button, with or without `dl=0`, `dl=1` or `raw=1`, old `/s/` links, or a direct `dl.dropboxusercontent.com` link) plays as a muted looping video covering the panel, with the image underneath as the poster and fallback. YouTube, Vimeo and direct file links keep working as now.

The footer loses Services, Amenities and In-room Dining, and gains Legal directly below Corporate.

Stephen's words: `docs/specs/adhoc-2026-11-26/notes.md`.

Cap: $20
Refs: docs/specs/adhoc-2026-11-26/refs/refs.json

## User Stories

1. As an editor, I want to paste a Dropbox share link exactly as Dropbox gives it to me, so that I never have to edit the link (V1).
2. As an editor, I want older Dropbox links and direct Dropbox file links to work too, so that whatever I have saved works (V1).
3. As an editor, I want a video link on every hexagon scroll mask panel, in the same place as the hero and gallery video links, so that I learn it once (V1).
4. As an editor, I want an empty video link to leave the image as it is (V1).
5. As a visitor, I want the panel video to cover the hexagon frame and open with it exactly as the image does, so that video panels feel the same as image panels (V1).
6. As a visitor with reduced motion on, I want to see the image, not the video.
7. As a visitor, I want the footer to list only the pages the hotel wants, with Legal under Corporate (F1, F2).

## Implementation Decisions

- The shared video link reader (used by the hero, gallery, history and now the hexagon panels) learns Dropbox: a link on `dropbox.com` becomes a direct file link on `dl.dropboxusercontent.com`, keeping the `rlkey` and dropping `dl`, `raw` and `st`. Everything that already uses video links gets Dropbox for free.
- The hexagon panels use the existing media video contract (`data-video-link` on the panel's image frame), not a new module.
- When a panel moves in, its image settles from slightly larger to normal size; a video in that panel must make the same move, so a video panel does not look different from an image panel.
- CMS-driven panels bind the link to a CMS link field on that collection ("Media - Video Link", like the gallery lists); panels inside components get a "Video Link" text prop (single-line), like the hero.
- Footer links are edited in the Footer Links component, once, so every page changes.

## Testing Decisions

- Test the link reader from the outside: given each Dropbox link shape, it returns the direct file link; given YouTube, Vimeo and file links, nothing changes. Prior art: the factory tests in `tests/`.
- Panels and footer are checked on staging at 390 and 1440 against the reference images.

## Out of Scope

- Trial Teams footer link: waits on the client's answer to where it points (Stephen, 26 Nov).
- The font: already swapped in planning (purchased Gatch files behind the existing Gatchtest fonts); it goes live with this round's staging publish.
- Other Gatch weights from the purchase (Light, Bold and so on): not asked for.

## Further Notes

- Sample video for proving the panels: https://www.dropbox.com/scl/fi/z504c8xp3us619nullzpt/sora-video-comp.mp4?rlkey=1g6iykbanj51s8nie06wzsev2&st=lznctb23&dl=0
- Designer tickets wait for the Designer session of #419 if it is still running: one Designer session at a time.

#### Ticket #428: Dropbox links play as video, and panel videos move with their image

## Parent

#427

## What to build

Any Dropbox link pasted as a video link plays as a video, everywhere the site already takes video links (hero, gallery and arts items, history, and the hexagon panels once they carry a link). Read V1's notes in `docs/specs/adhoc-2026-11-26/notes.md` first. Also make a video inside a hexagon scroll mask panel follow the same settle-in move as that panel's image.

## Acceptance criteria

- [ ] V1: the shared video link reader turns each of these into a direct `https://dl.dropboxusercontent.com/...` file link that keeps `rlkey` and drops `dl`, `raw` and `st`: a `www.dropbox.com/scl/fi/...?...&dl=0` share link, the same with `dl=1` and with `raw=1`, an old `www.dropbox.com/s/<id>/<name>?dl=0` link, and a link already on `dl.dropboxusercontent.com` (unchanged apart from dropping `dl`/`st`).
- [ ] V1: YouTube, Vimeo and plain file links produce exactly what they produce today.
- [ ] V1: a factory test covers every link shape above (the sample link in the spec's Further Notes is one case).
- [ ] V1: in a hexagon scroll mask panel whose image frame carries `data-video-link`, the video covers the frame and scales from the same start size to normal size with the image when the panel moves in; image-only panels behave exactly as today.
- [ ] V1: a panel whose video link is empty or blank shows its image, unchanged.
- [ ] `pnpm check`, `pnpm test:factory` and `pnpm build:check` pass.

## Blocked by

None (can start immediately).

