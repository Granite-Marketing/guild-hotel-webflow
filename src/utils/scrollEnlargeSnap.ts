/**
 * Scroll Enlarge Snap
 *
 * A framed image is revealed to fill its stage on scroll by a growing clip
 * mask (the media itself never scales), then the stage stays pinned while
 * further scrolling snaps through a stack of panels, each with an image
 * wipe and a text transition. Used by the Guild home, dining,
 * meetings and wellness venue sections (Figma Home-Animation-1).
 *
 * DOM contract (attributes, so Designer classes stay free):
 *
 *   [data-scroll-enlarge-snap]            section root (the guard selector)
 *     [data-scroll-enlarge-snap-stage]    optional; the box that pins. Must
 *                                         have a fixed height (100svh).
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
 *                                               masks in line by line as one
 *                                               triggered (not scrubbed)
 *                                               timeline once its mask/wipe
 *                                               completes, reversing on leave
 *         [data-scroll-enlarge-snap-tab]        optional; nth tab = nth item
 *
 *   data-scroll-enlarge-snap-step="100"   on the root: scroll distance per
 *                                         step, in % of viewport height.
 *
 * Timeline schedule (F33): panel 0 is fully shown at t=1 (enlarge done).
 * Each later panel wipes in over WIPE_DURATION and is then fully shown for
 * DWELL steps before the next wipe starts, so every panel has a real dwell
 * window (PITCH = WIPE_DURATION + DWELL per panel). Content is driven by
 * the scrubbed timeline time (the timeline's own onUpdate), never raw scroll
 * progress, so it follows what the user sees. A short SETTLE delay gates
 * each reveal so a pass-through never starts a reveal that is reversed
 * half-way.
 *
 * After the last panel the stage stays pinned for half a step more (F15),
 * so the last panel's content has room to settle before the pin releases.
 * A single-item section (F28, arts) is just the enlarge plus that hold.
 *
 * The active item and tab get `is-active`; the active tab also gets
 * `aria-current="true"`. Clicking a tab scrolls to its panel.
 *
 * prefers-reduced-motion: the frame is set straight to its full size and
 * panels swap instantly as the pinned stage scrolls, with no tweens or snap.
 */

import { createLineMaskTimeline } from '$utils/lineMaskReveal'

const ROOT_SELECTOR = '[data-scroll-enlarge-snap]'
const ACTIVE_CLASS = 'is-active'
const DEFAULT_STEP_PERCENT = 100
/** Timeline length of a panel's wipe; its content reveals once it is done. */
const WIPE_DURATION = 0.5
/** Steps a panel stays fully shown before the next wipe starts. */
const DWELL = 0.7
/** Timeline distance between consecutive fully-shown panels. */
const PITCH = WIPE_DURATION + DWELL
/** Seconds a panel must stay current before its content reveal plays. */
const SETTLE = 0.3
/** Extra pinned distance after the last panel, in steps. */
const END_HOLD = 0.5

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
      (context) =>
        context.conditions.reduce ? initReduced(parts) : initAnimated(parts),
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

const initAnimated = (parts: SnapParts) => {
  const { stage, media, items, stepPercent } = parts
  // One step to enlarge, then one pitch per panel change, then the end hold.
  const shownAt = items.map((_, index) => 1 + index * PITCH)
  const wipeAt = (index: number) => shownAt[index] - WIPE_DURATION
  const totalSteps = shownAt[shownAt.length - 1] + END_HOLD
  const snapPoints = shownAt.map((time) => time / totalSteps)

  stackItems(items, 0)
  const reveals = items.map((item) => {
    const content = item.querySelector<HTMLElement>('[data-scroll-enlarge-snap-content]')
    return content ? createLineMaskTimeline(content) : null
  })
  const mask = createChamferMask(stage, media)

  // Which panel's content is shown at timeline time `time`: from the moment
  // the panel is fully shown until exactly when the next wipe begins.
  const contentIndexAt = (time: number) => {
    for (let index = items.length - 1; index >= 0; index--) {
      const leaveAt = index === items.length - 1 ? Infinity : wipeAt(index + 1)
      if (time >= shownAt[index] - 0.001 && time < leaveAt) return index
    }
    return -1
  }

  let shownIndex = -1
  let targetIndex = -1
  let pending: GsapDelayedCall | null = null
  const syncContent = (time: number, immediate = false) => {
    const next = contentIndexAt(time)
    if (next === targetIndex) return
    targetIndex = next
    pending?.kill()
    pending = null
    // F33: leaving always plays the reverse mask-out. Every other panel with
    // any copy still revealed is reversed too, not only the one tracked as
    // shown, so a refresh or re-split mid-scroll can never strand copy that
    // later vanishes without masking out.
    reveals.forEach((reveal, index) => {
      if (index !== next && reveal?.isRevealed()) reveal.reverse()
    })
    if (shownIndex !== next) shownIndex = -1
    if (next === -1) return
    const start = () => {
      reveals[next]?.play()
      shownIndex = next
    }
    if (immediate) start()
    else pending = gsap.delayedCall(SETTLE, start)
  }

  let activeIndex = -1
  const nearestIndex = (time: number) =>
    shownAt.reduce(
      (best, at, index) => (Math.abs(at - time) < Math.abs(shownAt[best] - time) ? index : best),
      0,
    )
  const setActive = (index: number) => {
    if (index === activeIndex) return
    activeIndex = index
    markActive(parts, index)
  }
  setActive(0)

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    // Content follows the scrubbed timeline, which lags scroll position.
    onUpdate: () => syncContent(timeline.time()),
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: () => `+=${(window.innerHeight * stepPercent * totalSteps) / 100}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      snap: {
        snapTo: (value: number) => snapToPanel(value, snapPoints),
        duration: { min: 0.2, max: 0.6 },
        delay: 0.1,
        ease: 'power1.inOut',
        // Without this a tab jump reads as a fling and overshoots to the end.
        inertia: false,
      },
      onRefresh: (self: ScrollTriggerInstance) => {
        mask.measure()
        syncContent(self.progress * totalSteps, true)
      },
      onUpdate: (self: ScrollTriggerInstance) => {
        setActive(nearestIndex(self.progress * totalSteps))
      },
    },
  })

  timeline.to(mask.state, {
    progress: 1,
    duration: 1,
    ease: 'power1.inOut',
    onUpdate: mask.apply,
  })

  items.slice(1).forEach((item, offset) => {
    const previous = items[offset]
    const at = wipeAt(offset + 1)
    const image = itemImage(item)

    timeline.set(item, { autoAlpha: 1 }, at)
    timeline.fromTo(
      item,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: WIPE_DURATION, ease: 'power2.inOut' },
      at,
    )
    if (image) {
      timeline.fromTo(image, { scale: 1.2 }, { scale: 1, duration: WIPE_DURATION, ease: 'power2.out' }, at)
    }
    timeline.set(previous, { autoAlpha: 0 }, at + WIPE_DURATION)
  })

  // F15: hold the last panel pinned so the timeline spans totalSteps.
  timeline.to({}, { duration: END_HOLD }, shownAt[shownAt.length - 1])

  // A load that restores a mid-section scroll shows the right content.
  syncContent((timeline.scrollTrigger?.progress ?? 0) * totalSteps, true)

  const unbindTabs = bindTabs(parts, timeline.scrollTrigger, snapPoints)
  return () => {
    pending?.kill()
    unbindTabs?.()
  }
}

const initReduced = (parts: SnapParts) => {
  const { stage, media, items, stepPercent } = parts

  gsap.set(media, { width: '100%', height: '100%' })
  stackItems(items, 0)
  markActive(parts, 0)
  if (items.length < 2) return

  const changeCount = items.length - 1
  const snapPoints = items.map((_, index) => index / changeCount)
  let activeIndex = 0

  const trigger = ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: () => `+=${(window.innerHeight * stepPercent * changeCount) / 100}`,
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: (self: ScrollTriggerInstance) => {
      const index = clampIndex(Math.round(self.progress * changeCount), items.length)
      if (index === activeIndex) return
      gsap.set(items[activeIndex], { autoAlpha: 0 })
      gsap.set(items[index], { autoAlpha: 1 })
      activeIndex = index
      markActive(parts, index)
    },
  })

  return bindTabs(parts, trigger, snapPoints)
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

/** Tab clicks jump to the panel's snap point; scrub then plays the transition. */
const bindTabs = (
  parts: SnapParts,
  trigger: ScrollTriggerInstance | undefined,
  snapPoints: number[],
) => {
  if (!trigger || !parts.tabs.length) return

  const handlers = parts.tabs.map((tab, index) => {
    const handler = (event: Event) => {
      const point = snapPoints[index]
      if (point === undefined) return
      event.preventDefault()
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * point })
    }
    tab.addEventListener('click', handler)
    return handler
  })

  return () =>
    parts.tabs.forEach((tab, index) => tab.removeEventListener('click', handlers[index]))
}

/**
 * Free scroll through the first half of the enlarge and through the end
 * hold (so the pin can release), else the nearest panel.
 */
const snapToPanel = (value: number, snapPoints: number[]) => {
  if (value < snapPoints[0] / 2) return value
  if (value > snapPoints[snapPoints.length - 1]) return value
  return snapPoints.reduce((nearest, point) =>
    Math.abs(point - value) < Math.abs(nearest - value) ? point : nearest,
  )
}

const clampIndex = (index: number, length: number) => Math.min(Math.max(index, 0), length - 1)

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
 * (progress 1). The mask keeps the Designer's chamfered corners, read from
 * the media's own clip-path, so the corners never scale with the frame.
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
    const { x, y } = chamfer
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
