# Changelog

## 1.2.19

### Patch Changes

- Script headings show nothing before they draw in; the left swash of a line (the i of "in") no longer peeks out early.

## 1.2.18

### Patch Changes

- 350ba63: Dining venue pages: the sticky "Reserve a table" button now stays above every section (the groups images no longer cover it) and leaves at "Other dining options".

## 1.2.17

### Patch Changes

- Script headings always draw in left to right and are never line-masked. Fixes the tab-pills-intro heading (happenings, press, blog, wellness) that v1.2.12 started splitting into rising words.

## 1.2.16

### Patch Changes

- Subnav (Trello, review 2026-11-12): the venue tab highlight follows the image (image fully in, then highlight, then copy); tab clicks highlight at once, start the wipe on the click and scale with the tabs crossed; page anchor jumps run 0.9s to 2.8s by distance. Also carries the v1.2.15 button system onto main.

## 1.2.15

### Patch Changes

- Button system: every chamfer button is filled or outlined at rest and wipes to the inverse on hover. Old button hover CSS removed from the site stylesheet; the button script only adds the label roll.

## 1.2.14

### Patch Changes

- 33d806d: Offers slider: the leaving offer's heading, text and button fade out in the first 150ms of a change, so two headings never overlap on mobile. The leaving image stays fully visible until the new image has opened.

## 1.2.13

### Patch Changes

- Subnav (Trello): anchor and subnav jumps scale from 1.6s to 3s with distance and use a softer sine ease; scroll-enlarge venue tab clicks ease instead of jumping; the venue tab bar appears on desktop only once the first image is fully open.

## 1.2.12

### Patch Changes

- Scroll reveals start earlier (top 90%), run about 20% shorter and ease out, so copy settles before mid-screen. Shared components (heroes, section headers, paragraphs, CTAs, card and feature images) now reveal on every page and CMS template through a class map in scrollReveal, with a bundled first-screen pre-hide so nothing flashes. Script Reveal is slower (2s, power2.out) and reverses when scrolled back above.

## 1.2.11

### Patch Changes

- Offers Slider Split: the incoming image masks in through a still clip-path window (next from the right, prev from the left) over the outgoing image, timed with the copy mask.

## 1.2.10

### Patch Changes

- Gallery canvas CSS moved out of the bundled stylesheet into the "Gallery Canvas Styles" embed component on /gallery and /arts, so the Webflow Designer shows the same layout as the live site. Board and photo positioning now only applies once the script has run.

## 1.2.9

### Patch Changes

- Gallery canvas: zoom out and zoom in use magnifier icons with a minus and a plus, the zoom pill is tighter, and it sits 0.75rem above the filter pill at every breakpoint.

## 1.2.8

### Patch Changes

- Gallery canvas: the zoom pill sits centred directly above the filter pill on desktop too, not in the bottom right corner.

## 1.2.7

### Patch Changes

- Gallery canvas on phones: the zoom pill fades out while the filter menu is open, so the menu no longer opens over it.

## 1.2.6

### Patch Changes

- Gallery canvas zoom controls: zoom out and zoom in are now minus and plus icons that step one level and dim at the ends. The middle label names the current level (overview, normal, close up) and resets to normal. No zoom button shows as active any more.

## 1.2.5

### Patch Changes

- f965fdb: Gallery canvas: stronger edge fade (deeper on every screen size).

## 1.2.4

### Patch Changes

- db4f4f8: Gallery canvas: zoom is the three buttons only. Cmd or ctrl plus the wheel and trackpad pinch no longer zoom the board.

## 1.2.3

### Patch Changes

- fcd6d61: Gallery canvas: the zoom link for the current level shows as active (zoom out, normal or zoom in), instead of only normal.

## 1.2.2

### Patch Changes

- 6bb337e: Gallery canvas: photos fade into the section colour at every edge of the window, and the board now sizes itself from the number of photos (roughly the screen's shape, at least 1.5 screen widths, 2.5 on phones). `data-gallery-canvas-width="3"` on the section fixes it at that many screen widths instead.

## 1.2.1

### Patch Changes

- 90955e4: Gallery canvas: the zoom pill sits above the filter pill so they no longer overlap on wide screens, and on phones the joystick sits beside the zoom links instead of above them.

## 1.2.0

### Minor Changes

- 977d755: Gallery canvas: the /gallery and /arts photo grids become a full-screen board you drag to move and zoom in three steps (zoom out, normal, zoom in). The page still scrolls past it with the wheel or a swipe; cmd or ctrl plus the wheel, or a trackpad pinch, zooms. On touch screens a joystick and the zoom buttons move the board. Photos keep their natural shape in brick rows, the filter re-lays out the board, and Arts pieces still open their detail pop-up (a drag never opens one). Needs the GSAP 3.15.0 Draggable and InertiaPlugin tags in the site footer.

### Patch Changes

- e9c2f02: Rooms quiz: hidden steps, results, lines and cards stay in the page for search engines (visibility hidden, out of the layout, inert) instead of display none. The quiz back and restart links work again (the global anchor scroll swallowed their clicks)

## 1.1.65

### Patch Changes

- Undo the enlarge-snap slow-downs and triggered mode (misread feedback).

## 1.1.64

### Patch Changes

- Home three-image collapse is a timed 1.6s animation that reverses on scroll up.

## 1.1.63

### Patch Changes

- Venue image stacks can be scroll-triggered (data-scroll-enlarge-snap-trigger): each panel change plays as a 1.6s timed wipe and reverses on the way up; on for home and wellness. Image fade reveal is quicker and subtler (0.9s fade, 1.04 settle).

## 1.1.62

### Patch Changes

- Venue image stacks settle more slowly (snap 1.6 to 2.6s, scrub 2); the wellness page stack gets 200vh per panel like home.

## 1.1.61

### Patch Changes

- Underlined links draw their line on an inline span round the text, so it sits just under the letters whatever padding, line height or flex the link has (rooms quiz links, mobile).

## 1.1.60

### Patch Changes

- e5ed47c: Animation feedback round 2: underlined links only redraw their line (no label roll) and the line spans the text only, so padded links on Safari no longer draw it past the letters; offers sliders mask their copy in line by line on each slide (data-slide-mask="off" opts out); new data-reveal="image-fade" (fade plus settle from zoom); slower home venue stack snapping; history years centred on the intro and year badge digits optically centred.

## 1.1.59

### Patch Changes

- History intro centred on phones too (drops the section top padding below 768px).

## 1.1.58

### Patch Changes

- Animation feedback: scroll reveals tagged, cream hexagon buttons turn to an outline on hover, underline redraw on hover, script headings write in, booking menu copy masks in with an aligned header, calmer home venue stack, Meetings rows link through, History badge starts mid-photo with softer year swaps and a centred intro, eased anchor scroll on every section link.

## 1.1.57

### Patch Changes

- Corporate hover text masks in line by line over the panel instead of fading.

## 1.1.56

### Patch Changes

- Corporate hover: the photo shows first, then the chamfered panel and the hovered text fade in on top; the divider line stays under the photo.

## 1.1.55

### Patch Changes

- New data-reveal attribute (fade, text-mask, image-mask, optional data-reveal-delay) for opt-in scroll reveals. Corporate hover panel and follow photo ease in more slowly and smoothly.

## 1.1.54

### Patch Changes

- Room hover videos and the Dinings section video accept YouTube and Vimeo links as well as direct video files. Corporate hover text sits on a chamfered panel that fades in. Meetings Book your space outline is even on the diagonal edges.

## 1.1.53

### Patch Changes

- Final desktop round: quiz result cards sit flush on phones (hidden tag list no longer takes space), Corporate hover text sits above the follow photo, Meetings Book your space hovers cream with an off-black outline, subnav and quiz anchor scrolls slowed and eased.

## 1.1.52

### Patch Changes

- Rooms quiz: steps crossfade with no flash, Back to the quiz re-lands on the quiz top.

## 1.1.51

### Patch Changes

- Meetings: tilted script headings get room for their tilt, detail panels slide up from the bottom, and the Guild map marker is a smaller burgundy hexagon.

## 1.1.50

### Patch Changes

- Beyond downtown arrow on a burgundy chip; venue modal top bar fits tablets.

## 1.1.49

### Patch Changes

- Contact: sticky details column only on desktop; tablets keep the stacked layout.

## 1.1.48

### Patch Changes

- More around town cards: image grows slightly on hover.

## 1.1.47

### Patch Changes

- Happenings cards: image grows slightly on hover.

## 1.1.46

### Patch Changes

- Room pages: Back to rooms keeps the desktop spacing on tablets and landscape phones.

## 1.1.45

### Patch Changes

- Rooms: quiz questions fade between steps, See all rooms gets a thin custom scrollbar, and the room card name sits optically lower at rest.

## 1.1.44

### Patch Changes

- Rooms quiz: no extra space above the next section on phones once the results show

## 1.1.43

### Patch Changes

- Neighborhood beyond downtown cards are placeholder links with a desktop hover arrow (F97).

## 1.1.42

### Patch Changes

- Dinings template other dining options: card stagger for the Collection List in the More of the Guild classes (F107).

## 1.1.41

### Patch Changes

- Press Offers instance deleted in the Designer, so its interim CSS hide is removed (F113).

## 1.1.40

### Patch Changes

- Email mailto links only on the Press form (F112); Corporate and Legal forms keep their signed-off plain text.

## 1.1.39

### Patch Changes

- Desktop Trello round two: mobile tab pill no longer flips to cream, story and dining sticky CTAs (F80, F105), offset image and list spacing (F79, F81, F100, F101, F111), history timeline and landmark (F85, F86), venue modal sticky bar (F90 to F92), map home marker (F88), contact sticky column (F103), dining section video (F106), corporate hover image in front (F109), press email link and offers hidden (F112, F113).

## 1.1.38

### Patch Changes

- Desktop Trello round: hexagon masks close to a full-screen rectangle on every breakpoint (F64), quiz Back lands flush (F69), room result name sits at the card inset and plays an optional hover video (F72, F73), flat script headings tilt on desktop (F76).

## 1.1.37

### Patch Changes

- Corporate and Legal: no rule above the first "Why teams" item on phones.

## 1.1.36

### Patch Changes

- Carries the live v1.1.34 nav fix (F59) together with the mobile review fixes.

## 1.1.35

### Patch Changes

- Selector pill turns cream over a section of its own colour; modal slider keeps the frame's aspect ratio; Contact checkbox styled at every width.

## 1.1.34

### Patch Changes

- 514a51a: Nav theme (F59): the real nav bar is now masked out wherever the dark clone shows, so the cream logo's antialiased edges no longer peek around the dark logo as a faint outline over photos.

## 1.1.33

### Patch Changes

- Site head overrides ship as dist/site.css next to the bundle.

## 1.1.32

### Patch Changes

- Venue modal image is a slider on every width, with a progress line on phones and dashes on desktop.

## 1.1.31

### Patch Changes

- Line mask reveal animates split words, not inline line children, so captions with inline spans stay hidden until revealed; History caption hidden until the image is full screen.

## 1.1.30

### Patch Changes

- Mobile review fixes: Dining venue selector shows from the first screen, Reserve a Table is docked from load (no clipping), story Learn more floats on phones, and the History full-bleed caption masks in on a trigger instead of a scroll fade.

## 1.1.29

### Patch Changes

- Category pill on Blog and Happenings returns to the first category when scrolling back above the first group.

## 1.1.28

### Patch Changes

- a8a5072: History George Marston portrait is a slider with a dash indicator; the default Swiper slider no longer initialises with a single slide.

## 1.1.27

### Patch Changes

- f117903: Meetings & Events tabs: only the background image animates; the copy no longer masks out and in on switch.

## 1.1.26

### Patch Changes

- 25def7b: Home Art & Stories: below 768px the art images sit in a static scattered collage (mobile Figma) instead of the hover trail end state.
- 330805a: Home Meetings & Events tabs preview on hover on desktop; a click commits the row and leaving the list returns to it.
- 2a663b9: Home Wellness images become a swipeable slider with a progress bar below 768px; the image stack collapse now runs at 768px and up only.

## 1.1.25

### Patch Changes

- 1289060: History collapse gallery: open image reaches the bottom of the section on iOS Safari.

## 1.1.24

### Patch Changes

- 372464c: History collapse gallery: full-height image and smoother pin on iOS Safari (size by 100vh, not innerHeight; anticipatePin; GPU layers for the clip).

## 1.1.23

### Patch Changes

- 7f0d7e5: Mobile bottom menu standard: Wellness uses the burger pill, and every in-page tab pill pins to the bottom on mobile (Neighborhood was not sticky).

## 1.1.22

### Patch Changes

- 43ce25b: Hexagon scroll masks keep their chamfered corners on desktop; they close to a full-screen rectangle only below 768px.

## 1.1.21

### Patch Changes

- 28fd577: Hexagon scroll masks close their chamfer as they open, so every section ends as a full-bleed 100vw x 100vh rectangle; the mobile tab dropdown label and rows centre on the capitals.

## 1.1.20

### Patch Changes

- cmsItemLinks: optional data-cms-link-anchor builds /path#slug links, so Home art trail items open their Arts dialog.

## 1.1.19

### Patch Changes

- f5cbd47: M6: below 768px the tab pill bars (press, happenings, blog, neighborhood, gallery, arts) and the dining and meetings venue selectors collapse into the Figma compact dropdown pill.

## 1.1.18

### Patch Changes

- 91dbfb3: modals: dialog hash links (`#book`, a back link to another dialog) are handled in the capture phase so Webflow.js no longer scrolls the page or pushes the hash when the booking menu opens.

## 1.1.17

### Patch Changes

- Modals: a close control linking to a page section stops Webflow's own anchor scroll, so the dialog's "back to the quiz" lands flush on the quiz; outline button hover fill follows the stretched SVG outline (F52).

## 1.1.16

### Patch Changes

- 46abb40: Rooms quiz: quiz and results scroll flush to the viewport top, and an odd last result card spans the row.
- fa89ab3: Rooms quiz: the restart link no longer triggers Webflow's own anchor scroll, which pulled the quiz 92px off the top.

## 1.1.15

### Patch Changes

- Sticky topic bar fades out before it releases (F49); the nav colour switch also works when the header uses the Dark variant, as on /contact (F51).

## 1.1.14

### Patch Changes

- History landmark (F48): the image no longer scales. It is laid out at full-bleed size behind its card and only the clip-path mask opens to reveal it.

## 1.1.13

### Patch Changes

- 723dad6: hoverFollowImage: per-item photo and alt via data attributes, photo behind text at 0.55 opacity, preload on first zone entry (F46, F47)
- af9a538: History landmark (F45): remove the cloned bleed image; one figure and img open from the framed card to full bleed with clip-path and scale in lockstep.
- 313f181: F42: scroll-enlarge-snap copy now starts as the image mask completes (reveal lead 0.1 steps, settle 0.1s) instead of 0.3 to 0.75 s later.
- 7d109b3: F44: stickyTabs pins the topic bar to the bottom of the viewport, 2rem above the edge, releasing at the last rendered card section.

## 1.1.12

### Patch Changes

- 4209031: F26 rooms quiz: new `roomsQuiz` module (one step at a time, back links, CMS-driven room matches through Finsweet CMS Nest, closest-match and empty fallbacks); `hoverImageSwap` resets a step's photo when the quiz hides that step.

## 1.1.11

### Patch Changes

- 67bba6f: F36: stickyTabs ends the pin at the last rendered card section, ignoring hidden or empty groups. F33: scrollEnlargeSnap reverses every panel still revealed when leaving, so copy always masks out.

## 1.1.10

### Patch Changes

- stickyTabs (F36): only bars with data-sticky-tabs="true" pin, so the attribute can be bound to a component prop that is empty by default.

## 1.1.9

### Patch Changes

- fa4c3f7: F34: button hover fill from the bottom with a label roll (needs the matching site head CSS).
- fa4c3f7: Panel mask text (F33): panel copy now follows the scrubbed timeline instead of raw scroll position, every panel has a real dwell window, and a short settle delay stops a pass-through from starting a reveal that is reversed half-way.
- fa4c3f7: History landmark: the pinned image keeps full size and only its clip-path animates (F37); optional `data-history-collapse-caption` overlay.
- fa4c3f7: Listings (F36): CMS article cards alternate left/right across category groups (`staggerCards`), and the topic tab bar pins under the nav on /happenings, /blog and /press with scrollspy and offset anchor clicks (`stickyTabs`).

## 1.1.8

### Patch Changes

- 81cc407: cmsItemLinks (F30): Happenings and Blog listing cards link to their post pages from bound slug attributes.
- 81cc407: F24: form labels become screen-reader only; the label text is shown as the placeholder on the line.
- 81cc407: hoverImageSwap for the rooms quiz (F25): hovering or focusing a "Who's checking in?" option swaps the right-hand photo.
- 81cc407: History: the sticky year label no longer fades over timeline text (F19, reverts the v1.1.5 avoidance). The landmark mask opens on the same image at the card's framing and scales uniformly to full bleed, with one GSAP property per tween so scrubbing back and forth never flashes the unmasked photo (F20).
- 81cc407: Panel mask reveals (F15, F28): panel copy masks in as one timeline after the media mask completes and reverses on the way back, with an end hold so the pin does not hand over too quickly; single-item sections supported.
- 81cc407: mediaTabs (F16): tabs switch on click and keyboard only, and panel copy masks out before the incoming copy masks in, with no cross-fade.
- 81cc407: navToggle (F23): the hamburger morphs to an X on open and back on close, with aria-expanded and Open menu / Close menu labels.
- 81cc407: Smooth scroll inside every modal (own Lenis per open dialog, destroyed on close), eager images in dialogs, and Lenis measures the body and resizes on every ScrollTrigger refresh so the footer is always reachable (F18, F22, F29).

## 1.1.7

### Patch Changes

- Map: rows come from the Map Places CMS collection (`data-map-coordinates`), and each row's Directions link is pointed at Google Maps directions. List rows show a pointer, and the map starts wider (zoom 15, override with `data-map-zoom`).

## 1.1.6

### Patch Changes

- Feedback batch 1 (2026-10-21): navTheme nav colour switching replaces navContrast (F01); scroll mask reveals with once-only line mask-in on the home Zuma section and the History landmark gallery (F03, F09); later start for the home Wellness trio (F04); hard-coded media tabs for home Meetings and Events (F06); sticky Reserve a Table on the Dinings template (F10); venue dialogs scroll inside themselves (F12); list-linked Google map for the legal courthouses, keyed from data-map-key (F13).

## 1.1.5

### Patch Changes

- 68b01ee: History sticky year label fades out while a timeline text block passes under it, so the 1924 pill never covers the body copy.

## 1.1.4

### Patch Changes

- b49211f: Add navContrast (scroll-aware nav text colour), roomGridHoverReveal (/rooms card details on hover) and hoverFollowImage (legal/04 hover photo).

## 1.1.3

### Patch Changes

- Runtime fixes from wave 4: the FAQ accordion opens its first item on load, keeps aria-expanded in sync, re-measures open panels when content grows (late images), and supports Space as well as Enter. Dialogs now open from `#id` links (including from inside another dialog), from the URL hash on load and on hashchange, and from Enter or Space on non-link triggers; a close control with an `href="#section"` closes and scrolls to that section.

## 1.1.2

### Patch Changes

- Enable cardCarouselHeaderLeft (Q009) and roomListHoverPreview (Q007) in the bundle entry.

## 1.1.1

### Patch Changes

- Wire offersSliderSplit (Q008) in slot C after swiperSliders, so the Offers Slider Split crossfades and counts on staging. Mark the R00 modules as wired in runtime-modules.md.

## 1.1.0

### Minor Changes

- fd919f5: Back-port NGA learnings: opt-in runtime modules behind a scroll-engine facade (Lenis default, ScrollSmoother swap), eagerImages and refresh layers, the context-aware alt-text pipeline with safe defaults, MCP 2.1 notes and new solution docs. Remove NGA content scripts.
- R00 early staging release: enable scrollEnlargeSnap (A01), imageStackCollapse (A02), imageTrailHover (A03), historyStickyYear (A04), galleryFilter (A05) and imageHoverScale alongside the navToggle and accordion modules already wired, so the built Home, History, Rooms and Gallery pages run their interactions on staging.

This file tracks releases of your project once you've used this template to bootstrap it.

The starter ships at `0.0.0`. When you cut your first changeset and tag a release, entries will be appended here automatically by `changesets/changelog-git`.
