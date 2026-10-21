/**
 * History Sticky Year + Collapse Gallery
 *
 * Two scroll animations for the history page (Figma History-Animation-1 and
 * History-Animation-2). Each half has its own selector-presence guard, so a
 * page can use either one. Full DOM contract: docs/reference/runtime-modules.md
 * (historyStickyYear).
 *
 * Sticky year (timeline-sticky-year-scroll):
 *
 *   [data-history-sticky-year]              section root
 *   [data-history-sticky-year-label]        the sticky badge (CSS sticky is
 *                                           set in the Designer, not here)
 *   [data-history-sticky-year-text]         optional text node inside the
 *                                           label; defaults to the label
 *   [data-history-sticky-year-item="1924"]  milestone block; the value is
 *                                           the year shown while the block
 *                                           crosses the viewport centre
 *   [data-history-sticky-year-avoid]        optional text block the label
 *                                           must not cover; defaults to the
 *                                           timeline text and item headers.
 *                                           The label fades out while one
 *                                           that overlaps it horizontally
 *                                           crosses the label band.
 *
 * Collapse gallery (gallery-row-dark-titled):
 *
 *   [data-history-collapse]                 section root, pinned while the
 *                                           timeline scrubs
 *   [data-history-collapse-item]            each gallery image wrapper; the
 *                                           first (or the one set to
 *                                           ="bleed") becomes full bleed
 *   [data-history-collapse-fade]            optional heading or caption; masks
 *                                           in line by line once as the
 *                                           section arrives, then fades out
 *                                           while the image fills the screen
 *   data-history-collapse-distance="3"      optional pin length in viewport
 *                                           heights (default 3)
 *
 * The collapse timeline runs gallery -> stacked into one image (bleed card
 * on top) -> a clip mask opens on a full-bleed copy of the bleed image
 * until it fills the screen (feedback F09: a mask, never a scale, and no
 * return to the gallery). The natural layout is the start state. Under prefers-reduced-motion the gallery stays as laid
 * out and the year label swaps text without a tween.
 */

import { prepareLineMaskReveal } from '$utils/lineMaskReveal'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const DEFAULT_COLLAPSE_DISTANCE = 3
const AVOID_SELECTOR =
  '[data-history-sticky-year-avoid], .history-timeline_text, .history-timeline_item-header'
const AVOID_GAP = 16

export const historyStickyYear = () => {
  const reducedMotion = window.matchMedia(REDUCED_MOTION).matches

  document
    .querySelectorAll<HTMLElement>('[data-history-sticky-year]')
    .forEach((root) => setupStickyYear(root, reducedMotion))

  if (reducedMotion) return

  document
    .querySelectorAll<HTMLElement>('[data-history-collapse]')
    .forEach((root) => setupCollapseGallery(root))
}

const setupStickyYear = (root: HTMLElement, reducedMotion: boolean) => {
  const label = root.querySelector<HTMLElement>('[data-history-sticky-year-label]')
  const items = Array.from(
    root.querySelectorAll<HTMLElement>('[data-history-sticky-year-item]'),
  )
  if (!label || !items.length) return

  const labelText =
    label.querySelector<HTMLElement>('[data-history-sticky-year-text]') ?? label
  const years = items.map(
    (item) =>
      item.getAttribute('data-history-sticky-year-item')?.trim() ||
      item.textContent?.trim() ||
      '',
  )

  let activeIndex = -1

  const showYear = (index: number) => {
    if (index === activeIndex) return
    const previousItem = items[activeIndex]
    previousItem?.classList.remove('is-active')
    items[index].classList.add('is-active')
    activeIndex = index

    const year = years[index]
    if (labelText.textContent === year) return

    if (reducedMotion) {
      labelText.textContent = year
      return
    }

    gsap.killTweensOf(labelText)
    gsap.to(labelText, {
      yPercent: -40,
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        labelText.textContent = years[activeIndex]
        gsap.fromTo(
          labelText,
          { yPercent: 40, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
        )
      },
    })
  }

  items.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self: ScrollTriggerInstance) => {
        if (self.isActive) showYear(index)
      },
    })
  })

  setupLabelAvoidance(root, label, reducedMotion)
}

/** Fade the sticky label out while a text block passes under it. */
const setupLabelAvoidance = (root: HTMLElement, label: HTMLElement, reducedMotion: boolean) => {
  const blocks = Array.from(root.querySelectorAll<HTMLElement>(AVOID_SELECTOR)).filter(
    (block) => !label.contains(block),
  )
  if (!blocks.length) return

  const activeBlocks = new Set<HTMLElement>()

  const overlapsLabel = (block: HTMLElement) => {
    const blockRect = block.getBoundingClientRect()
    const labelRect = label.getBoundingClientRect()
    return blockRect.left < labelRect.right && blockRect.right > labelRect.left
  }

  const update = () => {
    const isCovered = Array.from(activeBlocks).some(overlapsLabel)
    const vars = { autoAlpha: isCovered ? 0 : 1 }
    if (reducedMotion) gsap.set(label, vars)
    else gsap.to(label, { ...vars, duration: 0.2, ease: 'power1.out', overwrite: 'auto' })
  }

  const bandOffset = () => label.offsetHeight / 2 + AVOID_GAP

  blocks.forEach((block) => {
    ScrollTrigger.create({
      trigger: block,
      start: () => `top center+=${bandOffset()}`,
      end: () => `bottom center-=${bandOffset()}`,
      onToggle: (self: ScrollTriggerInstance) => {
        if (self.isActive) activeBlocks.add(block)
        else activeBlocks.delete(block)
        update()
      },
    })
  })
}

const setupCollapseGallery = (root: HTMLElement) => {
  const items = Array.from(
    root.querySelectorAll<HTMLElement>('[data-history-collapse-item]'),
  )
  if (items.length < 2) return

  const bleedItem =
    items.find((item) => item.dataset.historyCollapseItem === 'bleed') ?? items[0]
  const bleedImage = bleedItem.querySelector<HTMLImageElement>('img')
  if (!bleedImage) return

  const fades = Array.from(root.querySelectorAll<HTMLElement>('[data-history-collapse-fade]'))
  const distance =
    Number(root.getAttribute('data-history-collapse-distance')) ||
    DEFAULT_COLLAPSE_DISTANCE

  // Offsets are measured through the offsetParent chain so in-flight
  // transforms never skew the numbers on refresh; that needs a positioned root.
  if (getComputedStyle(root).position === 'static') {
    root.style.position = 'relative'
  }

  const visibleHeight = () => Math.min(root.offsetHeight, window.innerHeight)

  const offsetWithinRoot = (element: HTMLElement) => {
    let left = 0
    let top = 0
    let node: HTMLElement | null = element
    while (node && node !== root) {
      left += node.offsetLeft
      top += node.offsetTop
      node = node.offsetParent as HTMLElement | null
    }
    return { left, top }
  }

  const deltaToCentre = (element: HTMLElement) => {
    const { left, top } = offsetWithinRoot(element)
    return {
      x: root.clientWidth / 2 - (left + element.offsetWidth / 2),
      y: visibleHeight() / 2 - (top + element.offsetHeight / 2),
    }
  }

  /** clip-path insets that frame the stacked bleed card inside the layer. */
  const stackedCardInset = () => {
    const width = bleedItem.offsetWidth
    const height = bleedItem.offsetHeight
    const horizontal = Math.max(0, (root.clientWidth - width) / 2)
    const vertical = Math.max(0, (visibleHeight() - height) / 2)
    return `inset(${vertical}px ${horizontal}px ${vertical}px ${horizontal}px)`
  }

  const layer = createBleedLayer(root, bleedImage)
  const sizeLayer = () => {
    layer.style.height = `${visibleHeight()}px`
  }
  sizeLayer()

  // The bleed card rides on top of the stack.
  items.forEach((item) => {
    if (getComputedStyle(item).position === 'static') item.style.position = 'relative'
    item.style.zIndex = item === bleedItem ? '2' : '1'
  })

  // Heading and caption mask in once as the section arrives (F09).
  const reveals = fades.map((fade) => prepareLineMaskReveal(fade))
  ScrollTrigger.create({
    trigger: root,
    start: 'top 70%',
    once: true,
    onEnter: () => reveals.forEach((reveal) => reveal.play()),
  })

  // gallery -> stack of one (bleed card on top) -> the clip mask opens on
  // the bleed image until it fills the screen, and stays there: the image
  // never scales and the gallery does not come back while pinned.
  const timeline = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${distance * window.innerHeight}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: sizeLayer,
    },
  })

  timeline
    .to(
      items,
      {
        x: (index: number) => deltaToCentre(items[index]).x,
        y: (index: number) => deltaToCentre(items[index]).y,
        duration: 1,
      },
      0,
    )
    .to(fades, { autoAlpha: 0, duration: 0.4, ease: 'none' }, 0.6)
    // Swap the card for the same image at full-bleed size, framed to the
    // card, then open the frame.
    .fromTo(
      layer,
      { autoAlpha: 0, clipPath: stackedCardInset },
      { autoAlpha: 1, duration: 0.2, ease: 'none', immediateRender: false },
      1,
    )
    .fromTo(
      layer,
      { clipPath: stackedCardInset },
      { clipPath: 'inset(0px 0px 0px 0px)', duration: 1.2, immediateRender: false },
      1.2,
    )
    // Hold the full-bleed image for the rest of the pin.
    .to({}, { duration: 0.4 }, 2.4)
}

/**
 * A layer over the gallery holding a copy of the bleed image at full-bleed
 * size. Only its clip-path changes, so the photo keeps one size throughout.
 */
const createBleedLayer = (root: HTMLElement, image: HTMLImageElement) => {
  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.dataset.historyCollapseBleed = ''
  Object.assign(layer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    zIndex: '3',
    pointerEvents: 'none',
    overflow: 'hidden',
    visibility: 'hidden',
    opacity: '0',
  })

  const copy = image.cloneNode(true) as HTMLImageElement
  copy.alt = ''
  copy.loading = 'eager'
  copy.sizes = '100vw'
  copy.removeAttribute('data-history-collapse-item')
  Object.assign(copy.style, {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  })
  layer.appendChild(copy)
  root.appendChild(layer)
  return layer
}
