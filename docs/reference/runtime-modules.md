# Runtime Modules

Reference for every module in `src/utils/` of the native lane bundle: what it
does, the DOM contract the Designer build must follow, where it sits in the
init order, and how it behaves under each scroll engine.

All modules follow the starter module pattern: one named export, a
selector-presence guard as the only guard, CDN globals (`gsap`,
`ScrollTrigger`, `SplitText`, `Swiper`, `Lenis`, `ScrollSmoother`) used as
ambient types, descriptive identifiers, no helpers on `window`, no polling. (One exception: `backgroundVideo` sends the YouTube `listening` handshake every 500ms for at most 4s, because the iframe API offers no ready event.)
Every module is called once from `src/index.ts` inside `Webflow.push`.

## Wired by default vs opt-in

| Module | File | Default | Slot in `src/index.ts` |
|---|---|---|---|
| eagerImages | `eagerImages.ts` | wired | first |
| smoothScroll (engine) | `smoothScroll.ts` + `lenisGsap.ts` | wired | after eagerImages |
| swiperSliders | `swiperSliders.ts` | wired | C |
| accordion | `accordion.ts` | wired | D |
| modals | `modals.ts` | wired | D |
| currentYear | `currentYear.ts` | wired | E |
| gsapBasicAnimations | `gsapBasicAnimations.ts` | wired | G |
| debugOverlay | `debugOverlay.ts` | opt-in | A |
| scrollPin | `scrollPin.ts` | opt-in | B |
| scrollEnlargeSnap | `scrollEnlargeSnap.ts` | wired (R00) | B |
| backgroundVideo | `backgroundVideo.ts` | opt-in | C |
| heroTextReveal | `heroTextReveal.ts` | opt-in | C |
| navToggle | `navToggle.ts` | wired (R00) | D |
| imageHoverScale | `imageHoverScale.ts` | wired (R00) | D |
| imageTrailHover | `imageTrailHover.ts` | wired (R00) | D |
| viewSwitcher | `viewSwitcher.ts` | opt-in | E |
| cmsFilterLinks | `cmsFilterLinks.ts` | opt-in | E |
| cmsItemLinks | `cmsItemLinks.ts` | wired (F30, next release) | E, before galleryFilter |
| filterPanels | `filterPanels.ts` | opt-in | F (1st) |
| scrollHint | `scrollHint.ts` | opt-in | F (2nd) |
| finsweetRefresh | `finsweetRefresh.ts` | opt-in | F (3rd) |
| filterActiveState | `filterActiveState.ts` | opt-in | F (4th) |
| scrollTextReveal | `scrollTextReveal.ts` | opt-in | G |
| galleryFilter | `galleryFilter.ts` | opt-in | E |
| historyStickyYear | `historyStickyYear.ts` | opt-in | G |
| offersSliderSplit | `offersSliderSplit.ts` | opt-in (Q008, not wired yet) | C, after swiperSliders |
| cardCarouselHeaderLeft | `cardCarouselHeaderLeft.ts` | wired (v1.1.2) | C, after swiperSliders |
| imageStackCollapse | `imageStackCollapse.ts` | opt-in | G |
| galleryFilter | `galleryFilter.ts` | wired (R00) | E |
| historyStickyYear | `historyStickyYear.ts` | wired (R00) | G |
| offersSliderSplit | `offersSliderSplit.ts` | wired (R00) | C, after swiperSliders |
| imageStackCollapse | `imageStackCollapse.ts` | wired (R00) | G |
| roomListHoverPreview | `roomListHoverPreview.ts` | wired (v1.1.2) | D, after modals |
| navContrast | `navContrast.ts` | unwired (replaced by navTheme, F01) | n/a |
| navTheme | `navTheme.ts` | wired (next release) | D, after navToggle |
| mediaTabs | `mediaTabs.ts` | wired (next release) | D, after roomListHoverPreview |
| stickyCta | `stickyCta.ts` | wired (next release) | G, last |
| roomGridHoverReveal | `roomGridHoverReveal.ts` | wired (v1.1.4) | D, after imageHoverScale |
| hoverFollowImage | `hoverFollowImage.ts` | wired (v1.1.4) | D, after imageTrailHover |
| map | `map.ts` (+ `mapNeeds.ts`) | wired (unreleased) | D, after roomListHoverPreview |
| gsapSmoothScroll (ScrollSmoother engine) | `gsapSmoothScroll.ts` | opt-in | swap in `smoothScroll.ts` |

To enable an opt-in module, uncomment its import and its call in
`src/index.ts`, keeping the call in the slot shown. Unused modules are
tree-shaken out of `dist/index.js`.

## Init-order rules

1. **`eagerImages()` runs first**, before anything creates a ScrollTrigger.
   Lazy images must be promoted before triggers are measured so
   `window.load` waits for them.
2. **`debugOverlay()` runs before the engine** so its `refreshInit` /
   `refresh` listeners catch the first refresh.
3. **The scroll engine initialises before every ScrollTrigger consumer.**
   `scrollPin()` comes straight after it (under ScrollSmoother the
   `#smooth-wrapper` must exist before pins are measured).
4. **Hero and slider modules run early** (backgroundVideo, heroTextReveal,
   swiperSliders), before nav and interaction modules.
5. **Modules that set inline GSAP state run before modules that clone or
   measure it.** If a project adds, for example, a logo animation and a nav
   theme clone, the one calling `gsap.set` goes first.
6. **Finsweet group order:** `filterPanels` then `scrollHint` then
   `finsweetRefresh` then `filterActiveState`, then any project filter module
   (range sliders, sort) that pushes its own `cmsfilter` callback.
   `finsweetRefresh` registers the shared refresh debounce first.
7. **ScrollTrigger-creating reveals run last** (gsapBasicAnimations,
   scrollTextReveal, pinned or scrubbed sections), after fonts, images and
   DOM-mutating modules have settled. `scrollTextReveal` additionally waits
   for `document.fonts.ready` and refreshes in a rAF.
8. `modals()` only needs the engine at open time, not at init time, so its
   position relative to other interaction modules does not matter.

## Scroll engine and refresh layers

### smoothScroll (facade)

`src/utils/smoothScroll.ts` is the one place that picks the engine. It
exports `smoothScroll`, an object with `name`, `init()`, `stop()`, `start()`,
`scrollTo(element)`, `scrollTop()` and `describe()`. `src/index.ts` calls
`smoothScroll.init()`; `modals.ts` and `navToggle.ts` call
`smoothScroll.stop()` / `start()`; `modals.ts` calls `scrollTo()` for its
close-and-scroll links (Lenis `scrollTo`, ScrollSmoother `scrollTo(el, true)`,
native `scrollIntoView` when no engine is running);
`debugOverlay.ts` reads `describe()` and `scrollTop()`. Swapping engines is
the single export line in that file (see the checklist below).

### lenisGsap (default engine)

- Creates Lenis, feeds `ScrollTrigger.update` from `lenis.on('scroll')`,
  drives Lenis from `gsap.ticker`, disables lag smoothing.
- Calls `scrollTriggerRefresh(document.body)`.
- The legacy `lenis` export (`lenis.raw`, `lenis.stop()`, `lenis.start()`)
  stays for projects that import it directly; new code uses `smoothScroll`.
- Native `position: sticky` and `position: fixed` work.
- Never combine Lenis with `ScrollTrigger.normalizeScroll`: they fight over
  touch input.

### scrollTriggerRefresh (engine-neutral, called by the engine)

Called once by whichever engine is active, with the element whose height
tracks the scrollable content:

| Layer | Why |
|---|---|
| `ScrollTrigger.config({ ignoreMobileResize: true })` | The mobile URL bar showing/hiding is not a layout change. |
| `load` then `refresh(true)` | Measures once every eager image has landed. |
| `pageshow` with `event.persisted` then `refresh(true)` | bfcache restores fire neither DOMContentLoaded nor load. |
| `ResizeObserver` on the content element, height-only, rAF-collapsed, then `refresh(true)` | Catches DOM-driven height changes (CMS hydration, late images, accordions, SplitText resplits) that autoRefreshEvents miss. |

Rules: always `refresh(true)` (the safe form defers until momentum scroll
settles). Never call a bare `refresh()` from a scroll handler,
`gsap.ticker` callback or `lenis.on('scroll')`; that locks scroll. After
dynamic DOM insertion, call `ScrollTrigger.sort()` before refreshing.

Under Lenis the observed element is `document.body`. Under ScrollSmoother
the body is height-locked to the viewport, so the observer watches
`#smooth-content` instead (a body observer would never fire).

### gsapSmoothScroll (opt-in ScrollSmoother engine)

`ScrollSmoother.create({ smooth: 1.2, effects: true, smoothTouch: false,
normalizeScroll: { allowNestedScroll: true } })`, then
`scrollTriggerRefresh(#smooth-content)`. `stop()` / `start()` call
`paused(true|false)`, which halts scroll processing and releases a modal's
own `overflow-y: auto`. Exported as `scrollSmootherEngine`, plus
`getSmoother()` for project code that needs the raw instance. Requires the
ScrollSmoother CDN tag after ScrollTrigger.

## ScrollSmoother swap checklist

Work through this before changing the facade export. Each item is a real
regression seen on a production build.

1. **Wrapper structure.** Give the page's main wrapper `id="smooth-content"`
   on every page (put it in the page template or a shared component).
   ScrollSmoother wraps it in `#smooth-wrapper` at runtime.
2. **Fixed UI lives outside `#smooth-content`.** The nav, every
   `[role="dialog"]` modal and the `[data-modal-overlay]`, the Webflow badge
   and any other viewport-fixed element must be siblings of the main wrapper,
   not descendants. A transformed ancestor re-bases `position: fixed`.
   `modals.ts` does not reparent at runtime. For CMS dialogs, render them
   from a second Collection List placed outside the main wrapper.
3. **`[data-pin]` replaces CSS fixed/sticky inside `#smooth-content`.**
   Audit the Designer for `position: sticky` and `position: fixed` inside the
   main wrapper and convert each to `data-pin="sticky"` or `data-pin="fixed"`,
   then enable `scrollPin()` in slot B. See `scroll-pin.md`.
4. **Swap the engine.** In `src/utils/smoothScroll.ts` change the export to
   `export { scrollSmootherEngine as smoothScroll } from '$utils/gsapSmoothScroll'`
   and add the ScrollSmoother CDN tag in Site Settings.
5. **iOS fallback.** If touch jitter is reported, gate creation in
   `gsapSmoothScroll()` behind `ScrollTrigger.isTouch !== 1` and call
   `scrollTriggerRefresh(document.body)` on touch devices instead. Touch then
   scrolls natively; modals, `[data-pin]` and `[data-eager]` keep working.
6. **normalizeScroll swipe-click guard.** normalizeScroll can turn a blocked
   horizontal swipe on a nested row into a tap that fires `click`. Any custom
   toggle inside a horizontally scrolling row needs the travel-distance guard
   from `filterPanels.ts` (ignore clicks that end a touch which moved more
   than 10px). Do not use the Webflow Dropdown in such rows.
7. **Focus deferral.** Under normalizeScroll, focusing an element inside a
   modal that is still transitioning scrolls the page even with
   `preventScroll: true`. `modals.ts` already defers focus until the open
   transition ends; keep that pattern in any new overlay.
8. **No body scroll lock.** Do not add `body.style.top`, a `no-scroll` class
   or `scrollTo` on top of `paused(true)`: under normalizeScroll
   `window.scrollY` returns the smoother value and the page double-shifts.
9. **Verify with `?debug=1`.** The overlay shows the engine state,
   `smoothWrapper` / `smoothContent` presence, pin-spacer count and the
   refresh log.

## Module reference

### eagerImages

Promotes `loading="lazy"` images to eager so `window.load` waits for them.
Use where images lack width/height (API-imported CMS images reserve no
aspect ratio), which otherwise shifts layout after triggers are measured and
fires animations early, most visibly on iOS.

- `[data-eager]` on an `img`: that image.
- `[data-eager]` on any ancestor (section, card, Collection List): every lazy
  image inside.
- Order: first in `Webflow.push`. Engine notes: none; works with both.

### currentYear

Sets the text of every `[data-current-year]` element (and the legacy
`#current-year` id) to the current year. No order constraint.

### accordion

Toggles `.accordion_header` items; the content wrapper is the header's next
sibling and the measured element inside it is `.accordion_content`.

- On load the first header is open (`is-active`, `aria-expanded="true"`, its
  wrapper's `max-height` set to the content height plus 126px, the same value
  a click uses) and every other header gets `aria-expanded="false"` and
  `max-height: 0px`.
- Opening one header closes the others.
- A `ResizeObserver` on each `.accordion_content` re-applies the open height
  while that item is open (late images, font swap); closed items are ignored.
- Keys: Space toggles a Link Block header (prevented so the page does not
  scroll); Enter uses the link's native click. A header that is neither a
  link nor a button gets `tabindex="0"`, `role="button"` and Enter support.
  A native `<button>` header is left to the browser. Keys are handled only
  when the header itself has focus, so a nested input keeps its own keys.
- Ids: headers get `accordion-{n}`, wrappers `accordion-target-{n}`, wired
  with `aria-controls` / `aria-labelledby`.

F12 fix: every dialog gets `data-lenis-prevent` at init. A stopped Lenis
still cancels wheel and touch events, so without it a tall dialog's own
`overflow-y: auto` never scrolled.

Fixture and spec: `tests/visual/fixtures/runtime-keys-and-hash.{html,ts}`,
`tests/visual/runtime-keys-and-hash.spec.ts`.

### modals

Unchanged contract, see `modal-setup.md`. Pauses scroll through
`smoothScroll.stop()` / `start()`, so it follows an engine swap with no edit.
Under ScrollSmoother, dialogs and overlay must sit outside `#smooth-content`.

W02 additions (no new attributes):

- Enter and Space open a `[data-modal-open]` trigger that is not a native
  link or button (Neighborhood timeline items). Such triggers get
  `tabindex="0"` and `role="button"` at init when they have none.
- `a[href="#{dialog-id}"]` opens that dialog through the same path
  (`preventDefault`, no page jump, URL unchanged), also from inside another
  open dialog: the current one closes and focus later returns to the
  trigger that opened the first dialog.
- A `location.hash` naming a dialog id opens it on load, and a later
  `hashchange` to a dialog id (back/forward, typed URL) opens it too.
- A `[data-modal-close]` with `href="#{section-id}"` on a non-dialog element
  closes the dialog, scrolls to the section with `smoothScroll.scrollTo()`
  and focuses it (adds `tabindex="-1"` if needed). Used by the "back to the
  quiz" link in the /rooms all-rooms dialog. If the href names a dialog, it
  switches to that dialog instead.

Fixture and spec: `tests/visual/fixtures/runtime-keys-and-hash.{html,ts}`,
`tests/visual/runtime-keys-and-hash.spec.ts`.

### debugOverlay

Dev tool. Append `?debug=1` to any URL to mount a fixed panel with: the
`ScrollTrigger.getAll()` table (id, start, end, progress, active, pinned,
scrubbed), scroll engine state from `smoothScroll.describe()`, document
metrics (scrollHeight, max scroll, remaining, overflow, pin-spacer count),
images still loading, the refresh log (`refreshInit` / `refresh`, flagged
when fired mid-scroll) and a layout-shift log (Chromium). Also sets
`ScrollTrigger.defaults({ markers: true })`.

- No DOM contract. Without `?debug=1` it returns immediately.
- Order: slot A, before the engine.
- Uses documented `ScrollTrigger.addEventListener` hooks; never wrap or
  monkey-patch `ScrollTrigger.refresh`.

### scrollPin

Declarative ScrollTrigger pins: `data-pin="fixed"` (viewport pin for a scroll
range) and `data-pin="sticky"` (pinned while the parent is in view), with
`data-pin-top|left|right|bottom|z`, `data-pin-mobile-*` overrides,
`data-pin-disable-mobile`, `data-pin-parent`, `data-pin-start`,
`data-pin-end`. Full attribute table: `scroll-pin.md`.

- Order: slot B, after the engine.
- Engine notes: **required** under ScrollSmoother for anything that would use
  CSS fixed/sticky inside `#smooth-content`. **Optional** on Lenis, where
  native sticky works; use it when you want an offset scroll-range pin or a
  per-breakpoint switch.

### scrollEnlargeSnap

A framed image grows to fill its stage on scroll; the stage then stays
pinned and further scrolling snaps through a stack of panels, each with an
image wipe and a text transition. Guild Figma Home-Animation-1 (home 04 to
09, dining-collection 03, meetings-collection 02, wellness-collection 02).

| Attribute | On | Meaning |
|---|---|---|
| `data-scroll-enlarge-snap` | section root | Guard selector. One instance per root. |
| `data-scroll-enlarge-snap-step` | root (optional) | Scroll distance per step in % of viewport height. Default `100`. |
| `data-scroll-enlarge-snap-stage` | inside root (optional) | The box that pins. Give it a fixed height (`100svh`). Its padding is the gap around the full-size frame. Defaults to the root itself. |
| `data-scroll-enlarge-snap-media` | inside stage | The frame. Style it at its small start size (for example `width: 79%`, `aspect-ratio: 16 / 9`), `position: relative`, `overflow: hidden`. The module grows it to the stage content box. Chamfered corners belong on this element. Do not set `max-width` or `max-height` on it. |
| `data-scroll-enlarge-snap-item` | inside media, one per panel | Panels overlap (`position: absolute; inset: 0`). DOM order is panel order. |
| `data-scroll-enlarge-snap-image` | inside item (optional) | Image that settles from `scale: 1.2` as its panel wipes in. Defaults to the first `img`. |
| `data-scroll-enlarge-snap-content` | inside item (optional) | Its headings, paragraphs, logo figure and `.button` line-mask in, triggered after its mask/wipe completes, reverses on leave (`lineMaskReveal`). |
| `data-scroll-enlarge-snap-tab` | inside root (optional) | Nth tab maps to nth item. Click scrolls to that panel. Keep tabs outside the items so they stay visible. |

- Scroll timeline: step 1 opens the frame's mask; each later step wipes the
  next panel up from the bottom (`clip-path`). Then a half-step end hold
  keeps the last panel pinned. Snap points sit at the end of each step; the
  first half of the enlarge and the end hold scroll freely.
- Content (F15): never scrubbed. Each panel's content plays one line-mask
  timeline once its mask (panel 0) or wipe (later panels) is 100% done, and
  reverses (1.6x speed) as soon as the scroll moves past that panel's snap
  point or back above its reveal point.
- State: the active item and tab get `is-active`; the active tab also gets
  `aria-current="true"`. Style the tab underline from `is-active`.
- The module sets inline `z-index` and `autoAlpha` on items (DOM order
  stacking, only the active panel visible) and inline `width`/`height` on
  the media. Without JS the Designer view shows the frame at its start size
  with the last item on top.
- `prefers-reduced-motion: reduce`: the frame is set straight to full size,
  the stage still pins, and panels swap instantly at each step with no
  tweens and no snap. Tabs jump to their panel.
- Lenis: snap uses ScrollTrigger snap with `inertia: false`, so a tab jump
  is not read as a fling.
- Local preview: `pnpm dev`, then
  `http://localhost:3001/scroll-enlarge-snap.html`. Check:
  `npx playwright test scroll-enlarge-snap`.
- Order: slot B, after `smoothScroll.init()`, so the pin exists before
  later triggers measure.

### backgroundVideo

Background-style YouTube or Vimeo embed from a URL, with a poster that stays
until playback actually starts.

```html
<div class="bg-video" data-bg-video="{{ CMS video URL }}">
  <img class="bg-video_poster" src="..." alt="" />
  <iframe src="" title="..."></iframe>
</div>
```

- Builds autoplay, muted, looped, controls-off embeds (`youtube-nocookie.com`
  for YouTube, `background=1` for Vimeo, private Vimeo hashes supported).
- Adds `is-video-ready` to the wrapper once the player reports playing
  (YouTube via postMessage `playerState === 1` plus a 1.5s settle for its
  control flash; Vimeo `play`). Safety net adds it after 4s regardless.
- CSS owns the fade: `.is-video-ready .bg-video_poster { opacity: 0 }` with a
  transition. Order: slot C. Engine notes: none.

### heroTextReveal

On-load word reveal for the hero heading.

- `[data-hero-title]` on the heading (first match is used).
- `[data-hero-reveal]` on any follower elements (CTA, badge) that should rise
  in on the same timeline, 0.6s before the words finish.
- Lines get `overflow: hidden`, words rise from `y: 110%`. Pre-hide both in
  CSS (`js-loading-flash-prevention.md`). Order: slot C.

### navToggle

Mobile nav open/close with a11y state and scroll pause.

```
[data-nav="header"]        gets is-nav-open
  [data-nav="open"]        toggle (button preferred; a div gets role, tabindex, Enter/Space)
  [data-nav="menu"]        menu panel (id assigned if missing, wired to aria-controls)
    [data-nav="list"]      children fade in on open, out on close
    a[data-nav="link"]     clicking closes the menu
```

- `aria-expanded` and `aria-label` (open / close) stay in sync on the toggle.
- Below 991px the engine is paused on open and resumed in the close
  timeline's `onComplete`, after the fade. Add `data-nav-lock="always"` to
  `[data-nav="header"]` to pause it at every width, for a menu that is full
  screen on desktop too (the Guild Site Nav uses this).
- A link toggle (`a[href="#"]`) does not jump the page; Enter on it toggles
  once.
- Escape closes. `is-nav-open` is removed after the item fade, so style the
  header background, blur and menu visibility in CSS on `.is-nav-open`. No
  colours live in the script. Order: slot D.

### imageHoverScale

Scales `[data-hover-scale]` while its parent is hovered; the parent gets
`overflow: hidden`.

- `data-hover-scale` (empty or `"true"` scales to 1.1) or a number such as
  `data-hover-scale="1.05"`.
- Optional `data-hover-scale-duration="0.8"` (default 0.5s).
- Skipped when `(hover: hover)` does not match, so touch taps never stick.
- Put the image inside its figure wrapper (the parent is the hover target and
  clip box). Order: slot D.

### imageTrailHover

Image trail on hover: linked images spawn under the mouse as it moves across a
zone, and the newest one always sits under the pointer so a click follows its
link. Built for home section 14 (`heading-wide-image-cta`), where each image is
an Arts CMS item linking to its anchor on the Arts page.

- Zone: `[data-image-trail-hover]` on the media wrapper. The Designer class
  sets `position: relative`, the size, and `overflow: hidden` (with the
  clipped corner shape) so images clip at the edge.
- Items: `[data-image-trail-hover-item]` on each link, typically the Collection
  Item or an `<a>` inside it, `href="/arts#{{slug}}"`, wrapping the figure and
  image. Set the item width in its class (about 20.5rem; the design ratio is
  328 x 467). The module sets `position: absolute`, centring and `autoAlpha`
  on items; do not hide them with `display: none` in the Designer.
- Optional on the zone: `data-image-trail-hover-threshold` (px of pointer
  travel between spawns, default 100), `data-image-trail-hover-max` (images
  visible at once, default 3), `data-image-trail-hover-duration` (fade-in
  seconds, default 0.6; fade-out is 75% of it).
- Items cycle in DOM order. Visible items get `is-active`; when more than
  `max` show, the oldest fades out; leaving the zone fades them all.
- Touch devices (`hover: none`) and `prefers-reduced-motion: reduce` get the
  end state with no animation: the first `max` items stacked around the zone
  centre, so they stay tappable. `gsap.matchMedia` swaps modes live.
- Hidden items are `visibility: hidden`, so keyboard users cannot tab to them;
  keep the section CTA as the keyboard path.
- Arts page dependency: each Arts item on `/arts` needs `id` bound to its slug
  so the anchor resolves.
- Local preview: `pnpm dev`, then
  `http://localhost:3001/image-trail-hover.html` (fixture in
  `tests/visual/fixtures/`); check with
  `npx playwright test tests/visual/image-trail-hover.spec.ts`. Order: slot D.

### viewSwitcher

Grid / list (or any named views) switch persisted in localStorage.

- Toggles: `[data-view="grid"]`, `[data-view="list"]`. Optional
  `data-view-default` on one toggle; optional `data-view-key="works-view"` on
  any toggle (default key `view-switcher`).
- Panels: `[data-view-panel="grid"]`, `[data-view-panel="list"]` (at least
  two).
- Active toggle and panel get `is-active`; toggles get `aria-pressed`. Hide
  inactive panels in CSS. Storage reads and writes are wrapped in try/catch
  (private mode). Order: slot E.

### cmsFilterLinks

Deep links into a Finsweet CMS Filter listing.

- `a[data-filter-path="works"][data-title="{{ Category }}"]` becomes
  `/works?category=Category+name`.
- Optional `data-filter-param` changes the query key (default `category`); it
  must match the field the listing page filters by. Order: slot E.

### cmsItemLinks

Builds CMS item URLs for links Webflow cannot bind headlessly: the
Collection List "Current item" link and links to a referenced item (both are
Designer-only settings). Used by the /happenings and /blog listings and the
Happenings & Stories template (F30).

| Attribute | Element | Required | Value |
| --- | --- | --- | --- |
| `data-cms-link-slug` | `a` (Link or Link Block) | yes | bound to a CMS Slug field (the item's own Slug, or Reference > Slug) |
| `data-cms-link-path` | same `a` | no | static collection path, e.g. `happenings-stories` |

- `a[data-cms-link-path="happenings-stories"][data-cms-link-slug="{{ Slug }}"]`
  becomes `/happenings-stories/{slug}`.
- With no `data-cms-link-path`, the result is `/{slug}`. The post template's
  "learn more" button binds the slug to Category > Slug, so the Post
  Categories slugs `happenings` and `blog` resolve to the static
  `/happenings` and `/blog` listing pages.
- Leading and trailing slashes in either value are ignored. An empty slug
  leaves the Designer href untouched, so keep a sensible static link (`#` on
  cards, `/happenings` on the back link) as the no-JS fallback.
- Once a native Designer "Current item" link is set, the module writes the
  same URL, so the two coexist harmlessly. Order: slot E, before
  `galleryFilter()`; it only rewrites `href`, so nothing depends on it.

### filterPanels

Accessible disclosure dropdowns for a filter bar, replacing the Webflow
Dropdown (which opens after a swipe ends on it).

```
[data-filter-panel="topic"]
  button[data-filter-panel-toggle]
  [data-filter-panel-content]
```

- One panel open at a time; toggle click toggles. Choosing a radio or
  checkbox, or clicking a `[fs-cmsfilter-element="clear"]` inside, closes
  it. Range sliders and search keep it open. Outside click and Escape close;
  Escape returns focus to the toggle.
- `is-open` on toggle and content; `aria-expanded` / `aria-controls` wired.
- Clicks ending a touch that travelled more than 10px are ignored (swipe
  guard; essential under ScrollSmoother normalizeScroll, harmless on Lenis).
- Webflow publishes radio groups as `name="radio"` unless the group name is
  set; set the radio group name in the Designer. Order: slot F, first.

### scrollHint

State classes for horizontally scrolling rows, since iOS ignores custom
scrollbars.

- `[data-scroll-hint]` on the scrolling element.
- Sets `is-overflowing`, `is-at-end`, and `--scroll-thumb-size` /
  `--scroll-thumb-offset` (percentages) for a custom indicator. Order: slot F.

### finsweetRefresh

Single ScrollTrigger refresh point for Finsweet CMS Filter v1 rehydration.

- Activates when any `[fs-cmsfilter-element="list"]` exists.
- Pushes a `cmsfilter` callback onto `window.fsAttributes ??= []` and hooks
  each list's `renderitems`.
- Not-yet-loaded images in rendered items share a 100ms trailing debounce;
  all requests in a frame collapse into one `ScrollTrigger.sort()` then
  `ScrollTrigger.refresh(true)` on the next frame.
- MutationObserver (childList, no subtree) on each list as a fallback.
- Order: slot F, before `filterActiveState` and any project filter module.
  Engine notes: engine-neutral.

### filterActiveState

Mirrors Finsweet filter state onto styleable classes.

- Inside `[fs-cmsfilter-element="filters"]`:
  - `[data-filter-option]` around each radio/checkbox gets
    `fs-cmsfilter_active` while checked.
  - The parent of each `[fs-cmsfilter-element="clear"]` ("All") gets
    `fs-cmsfilter_active` while nothing in its group (closest
    `[data-filter-panel]`, else the form) is set.
  - `[data-filter-clear-all]` gets the template `hide` class until any filter
    in the form is set.
- Opt-in `data-filter-panels` on the form: each `[data-filter-panel-toggle]`
  gets `fs-cmsfilter_active` while its panel has a value, and a
  `[data-filter-label]` inside the panel shows the checked option's label
  text (restored when cleared).
- Order: slot F, last of the group.

### scrollTextReveal

Scroll-triggered line reveal.

- `[data-scroll-text-reveal]` on a text element: lines rise in, staggered.
- On a wrapper with children: each child is split and revealed, delayed by
  its index.
- Lines get `overflow: hidden`; words rise from `y: 110%`. SplitText
  `mask: 'lines'` is not used because its extra inline-block layer rewraps
  short phrases.
- Waits for `document.fonts.ready`, then `ScrollTrigger.refresh(true)` in a
  rAF. Pre-hide targets in CSS. Do not apply to elements whose spans a hover
  script owns (text-roll buttons). Order: slot G.

### galleryFilter

Category filter for a gallery grid, driven by the sticky subnav tag pill
(Gallery page section 02). Arts page detail modals reuse `modals()`.

| Attribute | On | Value |
|---|---|---|
| `data-gallery-filter` | section root | none; one per gallery, several per page are independent |
| `data-gallery-filter-tag` | each tag button or link | category slug; `all` or empty shows every item |
| `data-gallery-filter-item` | each grid item | one or more categories, comma-separated (`Dining, Amenities`) |
| `data-gallery-filter-empty` | optional message | none; gets `is-active` when nothing matches |

- Matching is case-insensitive and treats spaces as hyphens, so a CMS-bound
  category name (`Private Dining`) matches a tag slug (`private-dining`).
- Hidden items get the template `hide` class. The active tag gets
  `is-active` and `aria-pressed="true"`; style `is-active` on the tag class.
  The root gets `data-gallery-filter-active="{category}"` for CSS hooks.
- Initial tag: the one carrying `is-active` in the Designer, else `all`.
- Transition: non-matching items fade out (`autoAlpha`), the grid reflows,
  newly matching items rise in with a stagger. Rapid clicks settle on the
  last tag. After each change it calls `ScrollTrigger.refresh(true)` and, if
  the grid top has scrolled above the viewport, scrolls the root back into
  view.
- `prefers-reduced-motion: reduce`: classes switch instantly, no tweens.
- Sticky tag bar is CSS only: `position: sticky; bottom: 2rem` on the tag
  wrapper, placed after the grid inside the root.
- Arts detail modal: give each piece `data-modal-open="{slug}"` and build one
  dialog per piece with the CMS pattern in `modal-setup.md`. No extra code.
- Local preview: `pnpm dev`, then
  `http://localhost:3000/fixtures/gallery-filter.html`; check:
  `npx playwright test tests/visual/gallery-filter.spec.ts`.
- Order: slot E. It mutates layout, so it runs before slot G reveals.
- Live use: `/gallery` `section_gallery-all` (Q040), tags are links with
  `role="button"`; the tag pill reuses `tab-pills-intro_tabs`.

### roomListHoverPreview

Hover preview for the all-rooms dialog (Q007, component Room List Hover
Preview on `/rooms`). Hovering or focusing a room name shows that room's
photo, name, specs and "view more" in the media column.

| Attribute | On | Value |
|---|---|---|
| `data-room-preview` | dialog root | none; one per page |
| `data-room-preview-trigger` | each room link | room key, e.g. `cozy-king` |
| `data-room-preview-panel` | each preview `article` | the same room key |

- The active link and panel get `is-active`; inactive panels get
  `aria-hidden="true"`. Webflow carries `is-active` on the reference room, so
  the dialog shows a photo before the module runs.
- The All / Rooms / Suites tabs are the `galleryFilter` contract on the same
  root (`data-gallery-filter`, `-tag`, `-item`). When a filter hides the
  active room, the first visible room becomes active.
- Open and close are `modals()` (`id="all-rooms"`, triggers carry
  `data-modal-open="all-rooms"`).
- Gotcha: a family class that sets `display` on the filtered items beats the
  template `.hide` (same specificity, later in the CSS), so `_item` sets no
  `display`.

Fixture and spec: `tests/visual/fixtures/room-list-hover-preview.{html,ts}`,
`tests/visual/room-list-hover-preview.spec.ts`.

### map

Styled Google map with list-linked markers (F13, Map Feature Image Bg on
the legal and corporate template), ported from Editoria. Google Maps JS API,
loaded on demand when the map nears the viewport. No key in source: the
referrer-restricted browser key is an attribute set in Webflow.

| Attribute | On | Value |
|---|---|---|
| `data-map` | element the map fills (the map figure) | none |
| `data-map-key` | same element | Google Maps browser key |
| `data-map-zoom` | same element, optional | starting zoom, default `15`; the map fits all markers but never zooms closer than this |
| `data-map-home` | same element, optional | `lat,lng` of the hotel (non-interactive marker) |
| `data-map-home-title` | same element, optional | marker tooltip, e.g. `The Guild Hotel` |
| `data-map-item` | each address row, same section | none (title = first child's text) or a title |
| `data-map-coordinates` | each row (bound to the 📍 Map Places Coordinates field) | `lat, lng`, as Google Maps copies it |
| `data-map-directions` | the Directions link in a CMS row | none; its href is set to Google Maps directions |

- Rows come from the 📍 Map Places collection (name, walk time, coordinates,
  order). Without `data-map-coordinates`, coordinates come from the row's
  directions link:
  `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`. A row
  without one gets no marker; with no markers, or no key, nothing loads.
- Hover or focus on a row highlights its marker; hover or click on a marker
  highlights its row. Both get `is-active`; style `.map-feature_item.is-active`
  in Webflow. Clicking a row (outside its link) also pans to the marker.
- The static image stays underneath as the fallback. On a key or referrer
  error Google calls `gm_authFailure` and the map canvas is removed.
- Styling is a legacy `styles` array (no Map ID), so markers are custom
  `OverlayView` buttons, not Advanced Markers.

### navContrast

Unwired since F01: `navTheme` replaces it (one nav colour module only). Kept for reference.

Switches the fixed Site Nav to dark text while its bar sits over a light
background (the cream bands below photo heroes, first seen on Wellness).

- Adds `is-on-light` to `[data-nav="header"]`; the Webflow combo class
  `site-nav_component.is-on-light` sets the dark text colour (every nav
  child uses `color: inherit`).
- Detection samples the bar's midline with `elementsFromPoint` at 25, 50 and
  75 percent of the width and needs a majority that includes the centre
  point (the logo). At each point the first
  element under the header with an opaque background colour decides
  (luminance above 0.5 is light); elements under 24px in either dimension
  (dividers) are skipped. Images, video and background images
  count as photos and keep the cream text.
- Skipped when the header text is already dark (the Dark variant), and the
  class is removed while the menu is open (`is-nav-open`).
- Updates on scroll (one read per animation frame), resize and header class
  changes.

### roomGridHoverReveal

Hover reveal on the `/rooms` room grid (Q033): the guests and size line
(`.rooms-collection-room-grid_details`) and the "view more" pill (`footer`)
inside each `.rooms-collection-room-grid_card` stay hidden until the card is
hovered or focused.

- Class contract only; no attributes. Webflow shows the details, so touch
  devices and a failed bundle keep them visible.
- Skipped unless `(hover: hover) and (pointer: fine)` matches.

### hoverFollowImage

One photo that follows the pointer while an item in a grid is hovered
(legal/04 "why teams choose the guild" on the Legal Corporates template).

| Attribute | On | Value |
|---|---|---|
| `data-hover-image` | zone (list or grid wrapper) | none |
| `data-hover-image-item` | each hover target | none |
| `data-hover-image-src` | item, optional | photo URL to swap in for that item |
| `data-hover-image-media` | figure holding one `img`, inside the zone | none |

- The module makes the zone `position: relative` (if static), positions the
  media absolutely, centres it on the pointer with `gsap.quickTo`, and fades
  it with `autoAlpha`. Set the media width in its class (Figma 377 x 486).
- The hovered item and the visible media get `is-active`.
- Touch devices and `prefers-reduced-motion: reduce`: the media stays hidden.

### historyStickyYear

History page scroll animations (Figma History-Animation-1 and
History-Animation-2). Two independent halves in one module; each runs only
when its root attribute is present. Order: slot G.

Sticky year label (component `timeline-sticky-year-scroll`, `history/05`):

| Attribute | On | Purpose |
|---|---|---|
| `data-history-sticky-year` | section | Root. |
| `data-history-sticky-year-label` | the year badge | Element that stays in view. Make it sticky in the Designer (`position: sticky` on it or its wrapper); the module does not pin it. |
| `data-history-sticky-year-text` | text inside the badge (optional) | The node whose text is swapped and tweened. Defaults to the label. Set its initial text to the first year. |
| `data-history-sticky-year-item="1924"` | each milestone block | The value is the year shown while the block crosses the viewport centre. Falls back to the block's text when empty. |

- The active item gets `is-active`; the label rolls out and in (`yPercent`
  plus `autoAlpha`, 0.5s). Between items the last year stays.
- Reduced motion: the text swaps instantly, no tween.

Collapse gallery (component `gallery-row-dark-titled`, `history/06`):

| Attribute | On | Purpose |
|---|---|---|
| `data-history-collapse` | section | Root, pinned for the scrub. Give it `overflow: clip` (the full-screen image overshoots) and a height of about `100vh`. The module sets `position: relative` inline if the root is static. |
| `data-history-collapse-item` | each image wrapper (`figure`) | Slides into the stack. The first item (or `="bleed"`) rides on top and is the one seen full bleed: a copy of its image at full size opens with a clip mask (F09), never a scale. |
| `data-history-collapse-fade` | heading and caption wrappers (optional) | Mask in line by line once on arrival, then fade out while the stack forms. |
| `data-history-collapse-distance="3"` | section (optional) | Pin length in viewport heights. Default 3. |

- Timeline: items slide to the centre into one stack, the bleed copy
  crossfades over the stacked card and its clip opens to full bleed, then
  holds until the pin ends. It does not return to the grid (F09).
- Offsets are measured through the `offsetParent` chain, so refreshes
  mid-scroll stay correct.
- Reduced motion: nothing is created; the gallery shows as laid out.
- Local check: `pnpm exec playwright test history-sticky-year` (fixture in
  `tests/visual/fixtures/history-sticky-year.html`; add `--headed` to watch).

- Label avoidance (v1.1.5): the sticky label fades out (autoAlpha) while a
  text block that overlaps it horizontally crosses the label band (label
  height plus 16px around the viewport centre). Text blocks are
  `[data-history-sticky-year-avoid]`, `.history-timeline_text` and
  `.history-timeline_item-header`. Fixes the 1924 pill covering the body
  copy at 1440 and 390.

### imageStackCollapse

A row of images slides together on scroll into a stack of one: every image
ends exactly behind an anchor image, with no rotation. Scrubbed, so scrolling
back up fans them out again.

| Attribute | On | Value |
|---|---|---|
| `data-image-stack-collapse` | the row wrapper | required; also the scroll trigger |
| `data-image-stack-collapse-item` | each image wrapper (figure) | required, at least two |
| `data-image-stack-collapse-item="anchor"` | the image that stays put | optional; defaults to the middle item |
| `data-image-stack-collapse-start` | the row wrapper | optional ScrollTrigger start, default `top 55%` (F04: starts once the row is well in view) |
| `data-image-stack-collapse-end` | the row wrapper | optional ScrollTrigger end, default `center 40%` |

- Offsets are measured centre to centre from subpixel rects (with each
  item's own translate removed) and recomputed on every refresh
  (`invalidateOnRefresh`), so the stack stays aligned across resizes and
  breakpoints. Do not transform the anchor or the row from another script. Works for rows, grids and stacked
  mobile layouts alike, because it moves on both axes.
- The script raises the anchor (`z-index: 2`, others `1`) and gives static
  items `position: relative`. Equal-size items hide fully behind the anchor;
  set `overflow: hidden` (or `clip`) on the section when the outer images
  bleed past the viewport edge, as in the Guild designs.
- `prefers-reduced-motion: reduce` shows the end state (the stack) with no
  animation, re-applied on refresh. Both branches live in a keyed
  `gsap.matchMedia()`, so switching the preference reverts cleanly.
- Local preview: `pnpm preview:fixtures`, then open
  `http://localhost:3001/tests/visual/fixtures/image-stack-collapse.html`.
  Playwright check: `npx playwright test image-stack-collapse`. Order: slot G.

### navTheme

Feedback F01, ported from NGA. The fixed Site Nav (`[data-nav="header"]`,
bar `.site-nav_bar`) turns dark over light backgrounds and stays cream over
photos and dark sections, splitting exactly at section edges. A fixed,
aria-hidden, inert clone of the bar in the dark colour sits over the real
bar; a `mask-image` gradient, recomputed every frame, shows it only where
the bar overlaps a light area.

- Light and dark come from each `section`'s background colour (transparent
  sections inherit the nearest opaque ancestor's). Figures and videos at
  least 60% of the viewport wide count as photos (cream nav), clipped to
  their visible clip-path area; map art (`[class*="map"]`) is not a photo.
- Overrides: `data-header-theme="dark"` forces the dark nav over an
  element, `data-header-theme="white"` forces cream.
- Skipped when the header already has dark text (Dark variant). The clone
  hides while `is-nav-open` is set and snaps back with a fresh mask.
- Order: slot D, after `navToggle()`.

### scrollEnlargeSnap: F03 mask reveal

Since F03 the frame no longer resizes: the media is sized to the stage
content box once (on every refresh) and a chamfered `clip-path: polygon()`
opens from the Designer start rect to full. The chamfer size is read from
the media's own Designer clip-path (no clip-path on the media gives a
rectangular mask). The first panel's content masks in line by line once the
mask reaches full height, via `lineMaskReveal`.

### scrollEnlargeSnap: F15 triggered content and end hold

Since F15 every panel's content (Zuma included, replacing F03's play-once)
is a triggered `createLineMaskTimeline` reveal, not scrubbed tweens: heading,
body and button mask in as one timeline after the mask or wipe completes,
and reverse when the panel is left in either direction. The pin is
`items + 0.5` steps long: the final half step is a free-scrolling hold so
the last panel settles before the pin releases. Home uses
`data-scroll-enlarge-snap-step="110"` for more distance per panel.

Single-item use (F28, arts): one `-item` with no tabs. The inset image's
mask grows to full bleed, the content masks in at full, then the end hold.
The arts section is a native `section_venue-card-fullbleed` with `is-bleed`
combos on stage (no padding), media (no chamfer, 1253/753 start size) and
content (bottom-left, transparent).

### lineMaskReveal (helper)

`createLineMaskTimeline(container)` hides a container's headings,
paragraphs, figures, `.button`s and `[data-line-mask]` elements and returns
`play()` and `reverse()` on one paused timeline (reverse runs at 1.6x).
The timeline is rebuilt on every SplitText re-split, keeping its progress
and direction. `prepareLineMaskReveal(container)` wraps it as a one-shot
`play()` (historyStickyYear, F09). Text is split with SplitText
(`lines,words`, overflow hidden on lines, never `mask: 'lines'`); other
targets rise from behind a clip wrapper. Reduced motion: nothing is hidden.

### mediaTabs

Feedback F06 and F16. Rows act as ARIA tabs that switch stacked media and
content panels. Switching is click and keyboard only (F16); hover never
switches.

| Attribute | On | Purpose |
|---|---|---|
| `data-media-tabs` | root | Guard selector. |
| `data-media-tabs-list` | rows' wrapper (optional) | Gets `role="tablist"`. |
| `data-media-tabs-tab` | each row (link or button) | Nth tab drives nth panel and media. Clicks never navigate. |
| `data-media-tabs-media` | each background figure (optional) | Stacked; crossfades with the tab. |
| `data-media-tabs-panel` | each content block | Stacked (same grid cell); copy masks out, then in. |
| `data-media-tabs-content` | inside a panel (optional) | Scopes the masked targets; defaults to the panel. |

- First tab active on load; `is-active` on the active tab, panel and media;
  roving tabindex; arrows, Home and End move between tabs.
- Text swap (F16): each panel's headings, paragraphs, `.button`s and
  `[data-line-mask]` elements are mask targets. Text is split with SplitText
  (`lines,words`, `autoSplit`, overflow hidden on the lines, never
  `mask: 'lines'`); buttons move inside a `[data-media-tabs-clip]` wrapper.
  On a switch the outgoing copy masks out upwards, the panels swap with
  `gsap.set` (only the active panel has `autoAlpha: 1`, `zIndex: 1`), then
  the incoming copy masks in from below. Panels are never tweened, so there
  is no cross-fade and no overlap. Media still crossfades, starting at the
  click. A rapid second click completes the running switch first.
- Reduced motion: nothing is split; panels and media swap instantly.
- Guild home Meetings & Events: panels use `venue-card-fullbleed_panel`
  (grid row 1 across all columns, so they overlap). Order: slot D.

### stickyCta

Feedback F10. `stickyCta(selector)` docks a button at the bottom centre of
the viewport once its own spot rises to the dock line, keeping its parent's
height so nothing jumps, and fades it out while
`.section_cta-booking-newsletter` or `.section_footer-links` is on screen.
Default selector `[data-sticky-cta]`; the Guild Dinings template passes a
selector scoped to its page id because the button lives in the shared Hero
component. Re-docks after every ScrollTrigger refresh.

## Not ported (project-specific)

Recipes from earlier builds that stay as patterns rather than modules: nav
colour inversion by clone and mask, range sliders derived from CMS values and
sort by mutating Finsweet `listInstance.items`, text-roll button hover,
pinned scrubbed sections (use an `end` function plus
`invalidateOnRefresh: true`, never a frozen `window.innerHeight`), and
`gsap.matchMedia()` wrappers so breakpoint crossings revert inline
transforms.


## offersSliderSplit (Q008)

Crossfading split slider for the Offers Slider Split component. Needs the Swiper 12 CDN CSS and JS. DOM contract: `.swiper_slider[data-offers-slider]` wraps `.swiper.offers` > `.swiper-wrapper` > `.swiper-slide`; `[data-offers-slider-controls]` holds `[data-offers-slider-prev]`, `[data-offers-slider-current]`, `[data-offers-slider-total]` and `[data-offers-slider-next]` (link blocks and spans, anywhere inside the root). The module writes the zero-padded total, updates the current number on every slide change, loops with a fade, and adds `hide` plus `aria-hidden` to the controls when there is one slide. The `offers` type class keeps `swiperSliders()` from also initialising the container. Fixture: `tests/visual/fixtures/offers-slider-split.html`.

## cardCarouselHeaderLeft (Q009)

Free-width card slider for the Card Carousel Header Left component. Needs the Swiper 12 CDN CSS and JS. DOM contract: `.swiper_slider[data-card-carousel]` wraps `.swiper.cards` > `.swiper-wrapper` > `.swiper-slide`; `[data-card-carousel-prev]` and `[data-card-carousel-next]` (link blocks) sit anywhere inside the root. Card widths and gaps come from the CSS (slide width plus `margin-right`), so the module runs Swiper with `slidesPerView: 'auto'` and `spaceBetween: 0`; Swiper measures the margin, and a non-zero `spaceBetween` would double the gap. The arrows get `is-disabled` at either end and `hide` when every card fits (Swiper lock). The `cards` type class keeps `swiperSliders()` from also initialising the container. Fixture: `tests/visual/fixtures/card-carousel-header-left.html`.
