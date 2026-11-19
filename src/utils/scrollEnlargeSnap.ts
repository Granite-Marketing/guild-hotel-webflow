/**
 * Scroll Enlarge Snap
 *
 * A framed image is revealed to fill its stage on scroll by a growing clip
 * mask (the media itself never scales). Once it is fully open the section
 * locks and behaves like a vertical slider (#257, Stephen 2026-11-17): each
 * scroll gesture (wheel flick, trackpad swipe, touch swipe, arrow and Page
 * keys) plays exactly one timed transition to the next or previous
 * panel, with an image wipe and a line-mask copy reveal. Scrolling up on the
 * first panel or down on the last releases the page at once. Used by the
 * Guild home, dining, meetings and wellness venue sections and Arts.
 *
 * DOM contract (attributes, so Designer classes stay free):
 *
 *   [data-scroll-enlarge-snap]            section root (the guard selector)
 *     [data-scroll-enlarge-snap-stage]    optional; the box that pins. Must
 *                                         have a fixed height (100vh).
 *                                         Defaults to the root.
 *       [data-scroll-enlarge-snap-media]  the frame. Designer styles it at
 *                                         its small START size (with its
 *                                         chamfer clip-path); the module
 *                                         sizes it to the stage content box
 *                                         and opens a chamfered clip mask
 *                                         from the start size to full.
 *         [data-scroll-enlarge-snap-item]       one panel per venue, stacked
 *           [data-scroll-enlarge-snap-image]    optional; else first <img>
 *           [data-scroll-enlarge-snap-content]  optional; each panel's content
 *                                               masks in line by line once
 *                                               its panel is fully in, and
 *                                               snaps hidden (no outro) when the next copy starts
 *         [data-scroll-enlarge-snap-tab]        optional; nth tab = nth item
 *
 *   data-scroll-enlarge-snap-step="100"   on the root: scroll distance of
 *                                         the open step, in % of the stage.
 *
 * Pinned length: the open step plus HOLD. While locked the scroll is held at
 * the lock point (Lenis stopped, wheel and touch default prevented) and
 * panels move on a separate timed timeline, never on scroll, so a panel can
 * never sit half-wiped. The hold is a buffer for iOS momentum: the stage is
 * pinned, so any drift inside it is invisible and is set back.
 *
 * The active item and tab get `is-active`; the active tab also gets
 * `aria-current="true"`. A gesture highlights the tab once its image is in,
 * and its copy reveals as the wipe looks done (Trello "Subnav"). A tab click
 * highlights at once and plays one eased move across every panel between.
 * Hidden panels are `visibility: hidden`, so keyboard and screen reader users
 * reach panels through the tabs (links) or the arrow keys.
 *
 * prefers-reduced-motion: the frame is full size from the start, the section
 * still locks, and panels swap instantly.
 */

import { lenis } from '$utils/lenisGsap'
import { createLineMaskTimeline } from '$utils/lineMaskReveal'

const ROOT_SELECTOR = '[data-scroll-enlarge-snap]'
const ACTIVE_CLASS = 'is-active'
const DEFAULT_STEP_PERCENT = 100
/** Pinned distance after the open step, in steps: the lock zone and iOS momentum buffer. */
const HOLD = 0.5
/** Share of a move after which the new copy starts: the eased wipe looks complete here (about 97% in), Stephen 19 Nov. */
const COPY_HANDOFF = 0.85
/** Timeline tolerance for "fully open" on the scrubbed open step. */
const FULL_EPSILON = 0.02
/** Move duration: one panel over, each extra panel a tab click crosses (Stephen 2026-11-12: far jumps a little slower), and the cap (seconds). */
const HOP = { first: 1, extra: 0.55, max: 3 }
/** A gap this long (ms) between wheel or touch events starts a new gesture, so trackpad inertia counts as one. */
const GESTURE_GAP = 200
/** A wheel delta this many times the previous one starts a new gesture, even inside a trackpad inertia stream. */
const WHEEL_RISE = 1.5
/** A swipe's own deltas rise for this long (ms) at its start; a rise inside it is not a new swipe. */
const SWIPE_RAMP = 300
/** Share of the stage the page travels on release. */
const RELEASE_NUDGE = 0.25
const NEXT_KEYS = ['ArrowDown', 'PageDown']
const PREVIOUS_KEYS = ['ArrowUp', 'PageUp']

interface SnapParts {
  root: HTMLElement
  stage: HTMLElement
  media: HTMLElement
  items: HTMLElement[]
  tabs: HTMLElement[]
  stepPercent: number
}

export const scrollEnlargeSnap = () => {
  const roots = document.querySelectorAll<HTMLElement>(ROOT_SELECTOR)
  if (!roots.length) return

  roots.forEach((root) => {
    const parts = readParts(root)
    if (!parts) return

    const mm = gsap.matchMedia()
    mm.add(
      {
        animate: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => initSlider(parts, Boolean(context.conditions.reduce)),
    )
  })
}

const readParts = (root: HTMLElement): SnapParts | null => {
  const media = root.querySelector<HTMLElement>('[data-scroll-enlarge-snap-media]')
  const items = Array.from(
    root.querySelectorAll<HTMLElement>('[data-scroll-enlarge-snap-item]'),
  )
  if (!media || !items.length) {
    console.warn('[scrollEnlargeSnap] needs a -media element and at least one -item', root)
    return null
  }

  const stepAttribute = Number(root.getAttribute('data-scroll-enlarge-snap-step'))

  return {
    root,
    stage: root.querySelector<HTMLElement>('[data-scroll-enlarge-snap-stage]') ?? root,
    media,
    items,
    tabs: Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-enlarge-snap-tab]')),
    stepPercent: stepAttribute > 0 ? stepAttribute : DEFAULT_STEP_PERCENT,
  }
}

const initSlider = (parts: SnapParts, reduce: boolean) => {
  const { stage, media, items, stepPercent } = parts
  // Reduced motion skips the open step: the frame is full size at once.
  const openSteps = reduce ? 0 : 1
  const lastIndex = items.length - 1

  stackItems(items, 0)
  const reveals = items.map((item) => {
    const content = item.querySelector<HTMLElement>('[data-scroll-enlarge-snap-content]')
    return content ? createLineMaskTimeline(content) : null
  })
  const mask = createChamferMask(stage, media)
  if (reduce) {
    mask.state.progress = 1
    mask.apply()
  }

  let targetIndex = -1
  // Shows panel `next`'s copy (-1: none). Every other panel's copy snaps back
  // to hidden at once, with no outro (Stephen 19 Nov, replacing the 17 Nov
  // mask-out): an outro still running when the next panel wiped in jumped.
  // The copy starts the moment its image is fully in, no gap (Stephen 19 Nov: one continuous motion).
  const syncContent = (next: number) => {
    if (next === targetIndex) return
    targetIndex = next
    reveals.forEach((reveal, index) => {
      if (index !== next) reveal?.reset()
    })
    if (next === -1) return
    reveals[next]?.play()
  }

  // Trello "Subnav": the tab bar fades in only once the frame is fully open
  // (desktop and phones, Stephen 17 Nov) and out again above it.
  const tabBar = parts.tabs[0]?.closest<HTMLElement>('nav')
  let tabBarShown: boolean | null = null
  const syncTabBar = (open: boolean) => {
    if (!tabBar || open === tabBarShown) return
    const first = tabBarShown === null
    tabBarShown = open
    gsap.to(tabBar, { autoAlpha: open ? 1 : 0, duration: first ? 0 : 0.4, ease: 'power1.out', overwrite: true })
  }

  let activeIndex = -1
  const setActive = (index: number) => {
    if (index === activeIndex) return
    activeIndex = index
    markActive(parts, index)
  }
  setActive(0)

  // Panels: panel i is fully in at time i; each wipe is linear here and the
  // move's own ease shapes it, so a multi-panel tab move is one smooth curve.
  const panels = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
  items.slice(1).forEach((item, offset) => {
    const image = itemImage(item)
    // Just after the previous panel's rest time, so a panel at rest never leaves the next one visible (and focusable).
    panels.set(item, { autoAlpha: 1 }, offset + 0.001)
    panels.fromTo(item, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, offset)
    if (image) panels.fromTo(image, { scale: 1.2 }, { scale: 1, duration: 1, ease: 'power2.out' }, offset)
    panels.set(items[offset], { autoAlpha: 0 }, offset + 1)
  })

  let currentIndex = 0
  let moving: GsapTimeline | null = null
  let handoff: GsapDelayedCall | null = null
  let open = reduce

  const moveTo = (index: number, fromTab = false) => {
    if (index === currentIndex && !moving) return
    const hops = Math.max(1, Math.abs(index - panels.time()))
    const from = currentIndex
    currentIndex = index
    if (fromTab) setActive(index)
    // The outgoing copy stays put under the wipe; the handoff hides it as the new copy starts.
    targetIndex = -2
    // Every other copy must be hidden before its panel wipes in (unsplit text showed, then jumped).
    reveals.forEach((reveal, i) => {
      if (i !== from) reveal?.reset()
    })
    moving?.kill()
    handoff?.kill()
    const finish = () => {
      moving = null
      setActive(index)
      if (open) syncContent(index)
    }
    if (reduce) {
      panels.time(index)
      return finish()
    }
    const duration = Math.min(HOP.first + HOP.extra * (hops - 1), HOP.max)
    moving = panels.tweenTo(index, { duration, ease: 'power2.inOut', onComplete: finish })
    handoff = gsap.delayedCall(duration * COPY_HANDOFF, () => {
      if (open) syncContent(index)
    })
  }

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate: () => {
      open = reduce || timeline.time() >= openSteps - FULL_EPSILON
      if (!moving) syncContent(open ? currentIndex : -1)
      syncTabBar(open)
    },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      // The stage (100vh) is stable on iOS; innerHeight changes with the toolbar (M6 footer jump).
      end: () => `+=${(stage.offsetHeight * stepPercent * (openSteps + HOLD)) / 100}`,
      pin: true,
      // Only the open step scrubs; Lenis already smooths it.
      scrub: reduce ? true : 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self: ScrollTriggerInstance) => maybeLock(self.scroll()),
      onRefresh: () => {
        mask.measure()
        if (reduce) {
          mask.state.progress = 1
          mask.apply()
        }
        if (locked) inZone(window.scrollY) ? holdScroll() : unlockInPlace()
      },
    },
  })
  if (!reduce) timeline.to(mask.state, { progress: 1, duration: 1, ease: 'power1.inOut', onUpdate: mask.apply })
  timeline.to({}, { duration: HOLD }, openSteps)

  const trigger = timeline.scrollTrigger as ScrollTriggerInstance
  const lockPoint = () => trigger.start + (trigger.end - trigger.start) * (openSteps / (openSteps + HOLD))
  // Venue selector hidden from first paint until the frame is fully open (M18); onUpdate only runs once scrolling starts.
  syncTabBar(reduce || trigger.progress >= openSteps / (openSteps + HOLD) - 0.001)

  // Lock state: scroll held at the lock point while gestures drive panels.
  let locked = false
  const setScroll = (top: number) => {
    if (lenis.raw) lenis.raw.scrollTo(top, { immediate: true, force: true })
    else window.scrollTo(0, top)
  }
  const holdScroll = () => {
    lenis.stop() // again, in case a modal closing restarted Lenis
    if (Math.abs(window.scrollY - lockPoint()) > 1) setScroll(lockPoint())
  }

  const lock = () => {
    locked = true
    // The scroll that brought the section in must not also move a panel.
    gestureUsed = true
    lastGesture = gestureStart = performance.now()
    lastDirection = trigger.direction
    holdScroll()
    observer.enable()
    window.addEventListener('keydown', onKey)
  }
  const release = (direction: 1 | -1) => {
    locked = false
    observer.disable()
    window.removeEventListener('keydown', onKey)
    // Jump just outside the zone (visually the same, the stage is pinned) and hand the scroll back.
    const outside = direction === 1 ? trigger.end + 1 : lockPoint() - 3
    setScroll(outside)
    lenis.start()
    // The releasing swipe's own scroll was prevented (iOS cancels a touch whose
    // first move is prevented), so carry the page on a little: never feels stuck.
    const nudge = outside + direction * stage.offsetHeight * RELEASE_NUDGE
    if (lenis.raw) lenis.raw.scrollTo(nudge, { duration: 0.6 })
    else window.scrollTo({ top: nudge, behavior: 'smooth' })
  }

  // iOS momentum that escaped the zone: let go where the page is, never yank it back (Stephen 18 Nov).
  const unlockInPlace = () => {
    locked = false
    observer.disable()
    window.removeEventListener('keydown', onKey)
    lenis.start()
  }
  const inZone = (scroll: number) => scroll >= trigger.start - 1 && scroll <= trigger.end + 1

  function maybeLock(scroll: number) {
    if (locked) return inZone(scroll) ? holdScroll() : unlockInPlace()
    // Anchor and tab-bar scrolls pass through without locking.
    if (lenis.raw?.userData?.anchor) return
    if (scroll >= lockPoint() - 1 && scroll <= trigger.end) lock()
  }

  // Moves one panel, or releases the page at either end.
  const step = (direction: 1 | -1) => {
    const next = currentIndex + direction
    if (next < 0 || next > lastIndex) return release(direction)
    moveTo(next)
  }

  let lastGesture = 0
  let lastDirection = 0
  let gestureUsed = false
  let gestureStart = 0
  // A trackpad's inertia tail never pauses for GESTURE_GAP while the user keeps swiping, so the
  // page stuck until a click made a pause (Stephen 19 Nov). Inertia only decays; a jump in the
  // wheel delta is a fresh swipe.
  let lastWheelSize = 0
  let freshSwipe = false
  window.addEventListener(
    'wheel',
    (event) => {
      const size = Math.abs(event.deltaY)
      if (size > lastWheelSize * WHEEL_RISE + 4) freshSwipe = true
      lastWheelSize = size
    },
    { passive: true, capture: true },
  )
  const onGesture = (direction: 1 | -1) => {
    const now = performance.now()
    if (now - lastGesture > GESTURE_GAP || direction !== lastDirection || (freshSwipe && !moving && now - gestureStart > SWIPE_RAMP)) gestureUsed = false
    freshSwipe = false
    lastGesture = now
    lastDirection = direction
    if (gestureUsed || moving) return
    gestureUsed = true
    gestureStart = now
    step(direction)
  }

  // wheelSpeed -1: wheel down and a finger swiping up both read as onUp.
  const observer = ScrollTrigger.observe({
    target: window,
    type: 'wheel,touch',
    wheelSpeed: -1,
    tolerance: 10,
    preventDefault: true,
    ignore: '[role="dialog"]',
    onUp: () => onGesture(1),
    onDown: () => onGesture(-1),
  })
  observer.disable()

  function onKey(event: KeyboardEvent) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    if ((event.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable], [role="dialog"]')) return
    const direction = NEXT_KEYS.includes(event.key) ? 1 : PREVIOUS_KEYS.includes(event.key) ? -1 : 0
    // Home and End leave the slider and scroll as normal.
    if (!direction) return void (['Home', 'End'].includes(event.key) && release(event.key === 'End' ? 1 : -1))
    const index = currentIndex + direction
    // At either end the key's own scroll carries on past the released section.
    if (index < 0 || index > lastIndex) return release(direction)
    event.preventDefault()
    if (!moving) moveTo(index)
  }

  const unbindTabs = bindTabs(parts, (index) => moveTo(index, true))
  // A load that restores a scroll inside the zone locks at once.
  maybeLock(trigger.scroll())
  return () => {
    if (locked) release(1)
    observer.kill()
    moving?.kill()
    handoff?.kill()
    unbindTabs?.()
  }
}

/** Overlays the items in DOM order and shows only `visibleIndex`. */
const stackItems = (items: HTMLElement[], visibleIndex: number) => {
  items.forEach((item, index) => {
    gsap.set(item, { zIndex: index + 1, autoAlpha: index === visibleIndex ? 1 : 0 })
  })
}

const markActive = (parts: SnapParts, index: number) => {
  parts.items.forEach((item, itemIndex) =>
    item.classList.toggle(ACTIVE_CLASS, itemIndex === index),
  )
  parts.tabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === index
    tab.classList.toggle(ACTIVE_CLASS, isActive)
    if (isActive) tab.setAttribute('aria-current', 'true')
    else tab.removeAttribute('aria-current')
  })
}

/** Binds each tab's click to `select(index)`. */
const bindTabs = (parts: SnapParts, select: (index: number) => void) => {
  if (!parts.tabs.length) return

  const handlers = parts.tabs.map((tab, index) => {
    const handler = (event: Event) => {
      event.preventDefault()
      select(index)
    }
    tab.addEventListener('click', handler)
    return handler
  })

  return () =>
    parts.tabs.forEach((tab, index) => tab.removeEventListener('click', handlers[index]))
}

const itemImage = (item: HTMLElement): HTMLElement | null =>
  item.querySelector<HTMLElement>('[data-scroll-enlarge-snap-image]') ??
  item.querySelector<HTMLElement>('img')

interface Insets {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * Sizes the media to the stage content box and returns a clip mask that
 * opens from the Designer start rect (progress 0) to the full box
 * (progress 1). It keeps the Designer's chamfered corners, read from the
 * media's own clip-path and closes them to square as it opens (F64).
 */
const createChamferMask = (stage: HTMLElement, media: HTMLElement) => {
  const state = { progress: 0 }
  let start: Insets = { top: 0, right: 0, bottom: 0, left: 0 }
  let chamfer = { x: 0, y: 0 }

  const apply = () => {
    const remaining = 1 - state.progress
    const top = start.top * remaining
    const right = start.right * remaining
    const bottom = start.bottom * remaining
    const left = start.left * remaining
    // F64: the corner cut closes with the frame on every breakpoint, so the
    // section ends as a plain full-screen rectangle (client overrides Figma).
    const x = chamfer.x * remaining
    const y = chamfer.y * remaining
    media.style.clipPath = `polygon(${[
      `${left + x}px ${top}px`,
      `calc(100% - ${right + x}px) ${top}px`,
      `calc(100% - ${right}px) ${top + y}px`,
      `calc(100% - ${right}px) calc(100% - ${bottom + y}px)`,
      `calc(100% - ${right + x}px) calc(100% - ${bottom}px)`,
      `${left + x}px calc(100% - ${bottom}px)`,
      `${left}px calc(100% - ${bottom + y}px)`,
      `${left}px ${top + y}px`,
    ].join(', ')})`
  }

  const measure = () => {
    gsap.set(media, { clearProps: 'width,height,clipPath' })
    chamfer = readChamfer(media)
    const natural = media.getBoundingClientRect()
    const full = contentBox(stage)
    gsap.set(media, { width: full.width, height: full.height })
    const sized = media.getBoundingClientRect()
    start = {
      top: Math.max(0, natural.top - sized.top),
      left: Math.max(0, natural.left - sized.left),
      bottom: Math.max(0, sized.bottom - natural.bottom),
      right: Math.max(0, sized.right - natural.right),
    }
    apply()
  }

  measure()
  return { state, apply, measure }
}

/** Reads the corner cut from a chamfer polygon such as `polygon(36px 0px, ...)`. */
const readChamfer = (element: HTMLElement) => {
  const clipPath = getComputedStyle(element).clipPath
  const inner = clipPath.match(/^polygon\((.*)\)$/)?.[1]
  if (!inner) return { x: 0, y: 0 }
  // Point 1 is (x, 0); point 3 is (100%, y). No commas occur inside calc().
  const points = inner.split(',').map((point) => point.trim().split(/\s+(?![^(]*\))/))
  const pixels = (value: string | undefined) => parseFloat(value ?? '') || 0
  return { x: pixels(points[0]?.[0]), y: pixels(points[2]?.[1]) }
}

const contentBox = (element: HTMLElement) => {
  const style = getComputedStyle(element)
  return {
    width:
      element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
    height:
      element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
  }
}
