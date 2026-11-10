---
title: Gallery Canvas - Plan
type: feat
date: 2026-11-10
topic: gallery-canvas
artifact_readiness: implementation-ready
execution: code + Webflow Designer (approval first)
---

# Gallery Canvas - Plan

## Goal Capsule

- **Objective:** turn the `/gallery` and `/arts` photo grids (`section_gallery-all`, both `[data-gallery-filter]`) into a 100vh window onto a larger draggable, zoomable board of photos (CONCEPTS.md "Gallery canvas"). The filter pill floats bottom centre over the window (Figma gallery/02, arts/06); a second pill bottom right holds Zoom out / Normal / Zoom in and, on touch screens, a joystick.
- **Product authority:** Stephen. Decisions below were settled in the 2026-11-10 grilling session; do not reopen.
- **Stop conditions:** present the Designer change list (Section 2) and the footer change and wait for a yes before any Webflow write. Venue and template galleries untouched.
- **Out of scope:** CMS field changes (the `tile-size` field stays, just unused), infinite wrap, pinch zoom on touch, repeated photos to fill the board, any new library beyond GSAP Draggable + InertiaPlugin.

## Key decisions (settled)

- **Update 2026-11-10 (after staging review):** cmd/ctrl+wheel and pinch zoom removed as too fiddly; zoom is the three buttons only. Board width now follows the photo count (window-shaped, min 1.5 window widths, 2.5 on phones; `data-gallery-canvas-width` overrides). Edges fade into the section colour. Active class follows the current zoom step.

- Two pages only: `/gallery` (static grid, cream) and `/arts` (CMS "Art Collection", `is-dark`).
- Brick rows, fixed row height per breakpoint; each photo's width = natural aspect x row height. `tile-size`, `is-narrow`, `is-wide` stop driving layout. Board ~2x window width, no duplicates ever (the client fills it with content); an axis whose content is smaller than the window is centred and locked.
- Filter change: board re-lays out from the remaining photos, camera glides to centre at Normal, incoming photos fade in through `galleryFilter`'s existing transition.
- Mouse: click-drag pans with inertia, soft bounce at edges. Plain wheel always scrolls the page. Cmd+wheel, Ctrl+wheel, trackpad pinch = one zoom step per gesture at the cursor.
- Zoom steps: **0.5 / 1 / 1.6** (see 3.4).
- Touch: the board never captures a gesture, so visitors can always scroll past; movement by joystick (arrow buttons are the fallback); zoom by buttons only. The `gallery-all_scroller` sideways scroller goes.
- Arts tile click opens the existing Art Detail Modal through `modals()`; a release after a drag is never a click. Gallery photos open nothing.
- vh/vw only. Keyboard reaches every tile and control; `prefers-reduced-motion` respected.

---

## 1. DOM contract

One class family (`section_gallery-all` / `gallery-all_*`), Client-First. Behaviour hooks are data attributes; the two pill bars reuse `tab-pills-intro_tabs` as the filter pill already does.

```
section.section_gallery-all[.is-dark]        [data-gallery-filter] [data-gallery-canvas] [data-eager]
  div.gallery-all_window                     (was gallery-all_scroller) 100vh, relative, overflow hidden
    div.gallery-all_board                    (was gallery-all_grid) absolute 0/0, transform-origin 0 0; JS sets width/height, x/y/scale
      .gallery-all_item[data-gallery-filter-item]   absolute; JS sets left/top/width/height
        /arts:    a.gallery-all_link[data-modal-open=slug] > img.u-image
        /gallery: img.u-image
  p[data-gallery-filter-empty]               unchanged
  div.gallery-all_tags-wrapper               absolute (was sticky), bottom 2rem, left 50%, translateX(-50%)
    nav.tab-pills-intro_tabs.is-scroll > a.tab-pills-intro_tab.text-style-eyebrow-caps[data-gallery-filter-tag]   unchanged
  div.gallery-all_controls                   NEW. absolute, right 2rem, bottom 2rem, z-index 2
    div.tab-pills-intro_tabs.is-canvas-controls      NEW combo: the chamfered burgundy pill, flex row, gap 1.5rem
      div.gallery-all_joystick                       NEW. display none; `.is-active` (set by JS on touch) shows it. 3.5rem circle, 1px cream 50% ring
        div.gallery-all_joystick-knob                NEW. 1.25rem cream circle, centred
      div.gallery-all_zoom                           NEW. flex row, gap 1.5rem
        a.tab-pills-intro_tab.text-style-eyebrow-caps[data-gallery-canvas-zoom="out"]   href="#" role="button" aria-pressed  "zoom out"
        a.tab-pills-intro_tab.text-style-eyebrow-caps[data-gallery-canvas-zoom="reset"]                                       "normal"   (is-active at load)
        a.tab-pills-intro_tab.text-style-eyebrow-caps[data-gallery-canvas-zoom="in"]                                          "zoom in"
```

Notes:
- Pills are positioned against the section, not the window. With section padding 0 its box equals the window. On `/arts` this lets the CMS Collection List Wrapper itself be the window (Webflow allows no non-CMS sibling inside a Collection List Wrapper).
- On `/arts` the board is the Collection List (`w-dyn-items`); items are the Collection Items. On `/gallery` the board is the static grid div; items are figures. The module queries `.gallery-all_item` under the board, so both shapes work.
- `tab-pills-intro_tabs.is-canvas-controls` has no direct `<a>` children (links sit inside `gallery-all_zoom`), so `tabDropdown` (`:scope > a`) leaves the control pill alone on phones. Note this on the combo in `style-inventory.md`.
- JS adds `tabindex="0" role="region" aria-label="Photo board. Arrow keys move, plus and minus zoom."` to the window, `aria-hidden="true"` to the joystick, and `is-active` + `aria-pressed` to the current zoom link. No Designer attribute work for those.
- Filtered-out items carry the `hide` class from `galleryFilter` and are skipped by the layout.

### Row height and gap constants (module, mirroring today's `gallery-all_item` values)

| Width | Row height | Gap |
|---|---|---|
| >= 992 | 414px (25.875rem) | 24px |
| 768 to 991 | 320px (20rem) | 24px |
| < 768 | 224px (14rem) | 12px |

---

## 2. Webflow Designer changes (present to Stephen, then build)

Style renames apply to both pages at once because both pages share the classes.

### Shared styles
1. Rename `gallery-all_scroller` (`905de9f4-435c-b977-9471-955e27bed58d`) to `gallery-all_window`. Main: position relative, height 100vh, width 100%, overflow hidden. Small: remove `overflow-x: auto` / `overflow-y: hidden`.
2. Rename `gallery-all_grid` (`8038febe-99b0-d824-f8b3-4583200cc6e2`) to `gallery-all_board`. Main: position absolute, top 0, left 0, display block, transform-origin top left, remove flex / wrap / gap / centring at every breakpoint; width and height auto (JS sets them).
3. `gallery-all_item`: add position absolute, top 0, left 0; keep the #D9D9D9 fill and `overflow: hidden`. Leave the fixed sizes and `is-narrow` / `is-wide` combos for now (inline JS geometry overrides them; delete in a later cleanup).
4. `gallery-all_tags-wrapper`: sticky to absolute, bottom 2rem, left 50%, translateX(-50%), width auto, z-index 2. Remove any negative top margin.
5. `section_gallery-all` and `section_gallery-all.is-dark`: padding 0 at every breakpoint.
6. New: `gallery-all_controls` (absolute, right 2rem, bottom 2rem, z-index 2; small: right 1.25rem, bottom 5rem so it sits above the bottom-menu pill), `tab-pills-intro_tabs.is-canvas-controls` (flex row, align centre, gap 1.5rem, same padding and chamfer as the base pill, no mobile scroll rules), `gallery-all_zoom` (flex, gap 1.5rem), `gallery-all_joystick` (display none, 3.5rem square, radius 50%, 1px solid cream at 50% opacity, position relative) with combo `is-active` (display block), `gallery-all_joystick-knob` (1.25rem, radius 50%, cream, absolute, centred).

### /gallery (page `6ad66fd65794075272b95584`)
- Section `491dcc4a-ded6-d478-3c57-c03ccedf4070`: add `data-gallery-canvas` and `data-eager`.
- Wrapper `03a5c029-e4e1-f9b6-6249-7e27b2fc1cd5` and grid `e51108a2-f6cb-cedd-a0df-94e6133b040c`: covered by the renames.
- Tags wrapper `5a4779c9-a0cb-a059-d322-4d1a1af43be8` / nav `1387fa6c-e0ed-7c6a-c5c5-d0d3b650c5ea`: covered by style change 4.
- Add the `gallery-all_controls` block as the last child of the section. Build it here first.
- Check each static `img` has width and height attributes; the module still works without them (3.2).

### /arts (page `6ad66fd7ba96f2e53726a2eb`)
- Section `24baf9eb-aff0-c360-f1f8-f888bded5884`: add `data-gallery-canvas` and `data-eager`.
- Collection List Wrapper `d709e584-55e2-e281-c915-c0c5b0cc9fbd` (window) and List `...9fbe` (board): covered by the renames. Item `...9fbf` keeps `data-gallery-filter-item` = Category; the `data-tile-size` binding may stay (unused).
- Delete the tile-size CSS embed `d1cc5f31-965c-8ffa-4861-f440a909d6a1` (its rules would fight the JS geometry).
- Tags wrapper `c9148ee2-276e-9ad7-0b99-b0450cb6335a` / nav `6dd7c4ec-52e2-1812-8f32-19a3645bc3ce`: covered by style change 4.
- Paste the `gallery-all_controls` block from `/gallery` as the last child of the section.
- Optional cleanup, separate approval: delete the hidden old static grid `e9601f7e-0e0b-a08f-c519-ed9e04531c85` and the ten static Q041 dialogs.

### Site footer (Data API, location `footer`)
Add before the Lenis tag. GSAP core is Webflow's own 3.15.0 (`cdn.prod.website-files.com/gsap/3.15.0/`), so plugins must match that version exactly.

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Draggable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/InertiaPlugin.min.js"></script>
```

The module calls `gsap.registerPlugin(Draggable, InertiaPlugin)` itself (same pattern as `lenisGsap.ts`); the footer adds no GSAP core tag.

---

## 3. Module design: `src/utils/galleryCanvas.ts`

One named export, selector-presence guard on `[data-gallery-canvas]`, descriptive identifiers, no helpers on `window`.

### 3.1 Init order (`src/index.ts`)
Call `galleryCanvas()` directly after `galleryFilter()` in slot E: `eagerImages()` has already promoted the `[data-eager]` section's images; `galleryFilter` has applied the initial `hide` classes; `modals()` binds by document delegation so order does not matter. Add the row to `docs/reference/runtime-modules.md` ("E, after galleryFilter").

### 3.2 Layout
- `visibleItems` = items without `hide`, in DOM order.
- Aspect per item: `naturalWidth / naturalHeight` when loaded, else `width`/`height` attributes, else 4/3. An unresolved image attaches one `load` listener that schedules a rAF-collapsed relayout; the item shows its #D9D9D9 fill until then.
- Row packing: `targetWidth = 2 * windowWidth`; `itemWidth = round(aspect * rowHeight)`; new row when `rowWidth + gap + itemWidth > targetWidth` and the row is non-empty. Rows left-aligned; board width = widest row, board height = rows x rowHeight + gaps. No stretching, no repeats.
- First layout: `gsap.set(item, { left, top, width, height })`. Filter relayout: `gsap.to(remaining, { left, top, width, height, duration: 0.5, ease: 'power2.out' })`. Positions use left/top on purpose: `galleryFilter` tweens `y` and `autoAlpha` on the same items.
- Board gets `gsap.set(board, { width, height })`.

### 3.3 Camera state and bounds
- State = Draggable `x`, `y` plus `scale`. Transform origin 0 0 on the board.
- `bounds(scale)`: per axis, if `boardSize * scale <= windowSize` then `min = max = (windowSize - boardSize * scale) / 2` (centred, locked); else `min = windowSize - boardSize * scale`, `max = 0`. Applied with `draggable.applyBounds`.
- `centre(scale)` = midpoint of each axis's range, or the locked value.
- `glideTo({ x, y, scale }, duration)`: kill board tweens and the inertia tween, apply bounds, `gsap.to(board, { x, y, scale, duration, ease: 'power3.out', onComplete: () => draggable.update(true) })`. Reduced motion: `gsap.set` + `update(true)`.

### 3.4 Zoom
- `ZOOM_STEPS = [0.5, 1, 1.6]`. 0.5 shows the whole board (board is 2x window width); 1.6 keeps a 414px row at 662px, within Webflow's responsive `srcset`.
- `zoomTo(stepIndex, anchor)`: anchor is the cursor (wheel) or window centre (buttons, keys). `x = anchorX - (anchorX - x) * (newScale / scale)`, same for y, clamped to `bounds(newScale)`, then `glideTo(..., 0.45)`. Update `is-active` and `aria-pressed` on the zoom links.
- Wheel: `{ passive: false }` listener on the window. Without `ctrlKey`/`metaKey`: return (Lenis scrolls the page). Otherwise `preventDefault()` and `stopPropagation()` (Lenis listens on `window`), then one step by the sign of `deltaY`. Gesture lock: ignore further wheel events until 300ms of silence (`gsap.delayedCall` restarted each event), turning a pinch burst into one step.
- Safari trackpad pinch: `gesturestart` preventDefault, `gestureend` one step by `event.scale > 1`. Verify in slice 3; drop if Safari sends ctrl+wheel.

### 3.5 Pan (mouse)
- Create Draggable only when `matchMedia('(hover: hover) and (pointer: fine)')` matches at load. Touch-only devices skip it, so touch never captures.
- `Draggable.create(board, { type: 'x,y', inertia: true, bounds, edgeResistance: 0.8, overshootTolerance: 0.5, throwResistance: 2500, maxDuration: 1.2, minimumMovement: 4, zIndexBoost: false, cursor: 'grab', activeCursor: 'grabbing', allowContextMenu: true })`.
- Hybrid devices: `onPress` ends the drag when `pointerType === 'touch'` so a finger still scrolls the page.
- Reduced motion: `inertia: false`.
- Drag vs click: capture-phase click listener on the board; if the last drag moved >= 4px and ended < 300ms ago, `preventDefault()` + `stopPropagation()`. Drop it if Draggable's own suppression proves enough in slice 2.

### 3.6 Touch mode (joystick)
- When `(hover: none)` or `(pointer: coarse)`: add `is-active` to `.gallery-all_joystick`. The knob gets its own Draggable clamped to the ring radius; release springs back (`elastic.out(1, 0.6)`, 0.6s). While pressed, a `gsap.ticker` callback moves the camera by `knobVector * 800px/s * dt`, clamped to bounds. Only the knob gets `touch-action: none`; the page scrolls everywhere else.
- Fallback if the knob is fiddly at 390: four press-and-hold arrow links driving the same ticker move.

### 3.7 Keyboard and focus
- Window `tabindex="0"`, `role="region"`, `aria-label`. Arrows pan 40% of the window (0.35s); `+`/`=` and `-` zoom; `0` resets.
- `focusin` on a `.gallery-all_item` (Arts links, and modal return focus): reset window `scrollLeft`/`scrollTop` to 0, then pan the tile fully into view.

### 3.8 Filter integration
- One line in `galleryFilter.ts` `showMatches`: `root.dispatchEvent(new CustomEvent('gallery-filter:change'))` after `applyVisibility`, before `ScrollTrigger.refresh(true)`. Document it in the module header and `runtime-modules.md`.
- The canvas listens on its root: relayout (3.2 tween), then `glideTo(centre(1), 0.7)`. Incoming items are positioned before `galleryFilter` fades them in. No duplicated fade code.
- The window is a fixed 100vh, so page height never changes; no extra ScrollTrigger refresh.

### 3.9 Resize
- `ResizeObserver` on the window, rAF-collapsed: breakpoint constants, relayout (no tween), keep zoom step, apply bounds, clamp. Touch vs mouse mode decided at load (`shortcut:` comment).

### 3.10 Types (`src/types/gsap.d.ts`)
Add `DraggableInstance` (`x`, `y`, `isDragging`, `isPressed`, `isThrowing`, `pointerEvent`, `tween?`, `update`, `applyBounds`, `endDrag`, `kill`), `DraggableStatic.create`, `declare const Draggable`, `declare const InertiaPlugin: unknown`; make `registerPlugin` variadic.

---

## 4. Edge cases

| Case | Handling |
|---|---|
| Few photos (Arts: 10; a filter leaving 1 or 2) | That axis centres and locks. At Zoom out both lock. Never repeated. |
| Images still loading | Aspect fallbacks, then one rAF-collapsed relayout per late image. `data-eager` makes this rare. |
| Filter mid-glide or mid-throw | `glideTo` kills tweens first; `galleryFilter`'s `transitionId` settles rapid clicks; last relayout wins. |
| Modal open/close | `modals()` restores focus to the tile; `focusin` zeroes container scroll and pans the tile into view. |
| Resize across a breakpoint | Row height and gap change, relayout, zoom kept, camera clamped. |
| Lenis vs wheel | Plain wheel untouched; only ctrl/cmd wheel stopped. No `data-lenis-prevent`. |
| Hybrid touch + mouse | Board Draggable ends a touch press; joystick shown when `(pointer: coarse)` matches. |
| Drag ending on an Arts tile | Capture click guard plus Draggable's suppression. |

---

## 5. Build order (vertical slices, each verified before the next)

Fixture: `tests/visual/fixtures/gallery-canvas.html` + `.ts` cloned from `gallery-filter.{html,ts}` with the Section 1 structure (cream and dark variants), served by `pnpm dev`; spec `tests/visual/gallery-canvas.spec.ts` cloned from `gallery-filter.spec.ts`, loading GSAP 3.15.0 core, Draggable and InertiaPlugin from jsDelivr. Screenshot widths 1440, 991, 768, 390 against `figma/pages/gallery/sections/02-all/section.webp` and `figma/pages/arts/sections/06-section/section.webp`.

0. **Approval.** Present Section 2 and the footer block to Stephen. No Webflow write until yes. Slices 1 to 6 run on the fixture meanwhile.
1. **Static board.** Types, layout, bounds, centred camera, `index.ts` wiring. Verify screenshots; board 2x window, rows at 414/320/224, centred when small.
2. **Mouse pan.** Draggable, inertia, bounds, click guard. Verify glide and soft bounce; wheel scrolls the page; a 20px drag on an Arts tile does not open the dialog; a click does.
3. **Zoom.** Buttons, ctrl/cmd wheel, pinch, gesture lock, `is-active`. Verify one step per pinch, zoom under cursor, clamped, Zoom out shows the whole board, Safari pinch does not zoom the page.
4. **Filter integration.** Event, relayout tween, glide to centre, reduced motion. Verify `gallery-filter.spec.ts` still passes; quick clicks settle on the last tag.
5. **Touch mode.** Joystick, no board Draggable. Verify on phone and iPad: swipes scroll the page; joystick pans and springs back; zoom buttons work; 390 controls sit above the bottom-menu pill. Swap to arrows here if the knob is fiddly.
6. **Keyboard and resize.** Verify Tab reaches controls and tiles, tiles come into view, resize 1440 to 390 stays sane.
7. **Designer build + staging.** After the yes: Section 2 on both pages, publish to staging, update `webflow-ids.md`, `style-inventory.md`, `runtime-modules.md`, `site-scripts.md`. Verify live at 1440, 991, 768, 390 against the crops; manual drag, zoom, filter and Arts modal checks; page scrolls past the section with wheel and touch.
8. **Release.** `pnpm check`, `pnpm build`, changeset (minor), `changeset version`, commit, tag, push, curl the jsDelivr URL, then one footer write adding the two plugin tags and bumping the bundle URL. Confirm on staging.

Release ordering: the rooms quiz fix (branch `claude/unruffled-goldberg-62ba42`) has unpublished Designer class swaps on `/rooms` that need its bundle live first. Do not publish the site for this work until that release has shipped.

---

## 6. Risks and open questions

- **Draggable click suppression vs modal delegation.** Guard planned; slice 2 proves it.
- **GSAP version coupling.** Plugins pinned to Webflow's core 3.15.0; re-pin if Webflow bumps it. Note in `site-scripts.md`.
- **Image sharpness at 1.6.** If tiles look soft, set `sizes="(min-width: 992px) 50vw, 100vw"` on the images (same approval).
- **Mobile 100vh and the Safari toolbar.** Controls may sit under the toolbar until it collapses, like today's filter pill. Check at 390.
- **Open: joystick vs arrows.** Build the joystick first; decide at slice 5 on a real phone.

### Critical files
- `src/utils/galleryCanvas.ts` (new)
- `src/utils/galleryFilter.ts` (one-line event dispatch)
- `src/index.ts` (call after galleryFilter, slot E)
- `src/types/gsap.d.ts` (Draggable, InertiaPlugin, variadic registerPlugin)
- `docs/reference/site-scripts.md`, `runtime-modules.md`, `webflow-ids.md`
