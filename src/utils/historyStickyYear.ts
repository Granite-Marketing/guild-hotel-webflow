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
 *
 * The label always stays visible; it paints over timeline text (label-wrap
 * z-index 2), never fades (F19 reverts #105).
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
 *   [data-history-collapse-caption]         optional text overlay (Designer
 *                                           element, direct child of the
 *                                           root); hidden by its class, fades
 *                                           in once the image is full bleed
 *
 * The collapse timeline runs gallery -> stacked into one image (bleed card
 * on top) -> the same card opens to full bleed and stays there, with no
 * return to the gallery. One image, mask only (F48, supersedes the F45 scale
 * lockstep): the img is laid out at full-bleed size from the start, centred
 * on its card and overflowing it, so the card is a window onto the full-size
 * photo. Only the figure's clip-path opens; the img never scales, so its
 * quality and framing never change. One property per element per tween
 * (clipPath on the figure, x/y on the items) prevents the F20 scrub-reverse
 * flash. The
 * natural layout is the start state. Under prefers-reduced-motion the gallery
 * stays
 * as laid out and the year label swaps text without a tween.
 */

import { prepareLineMaskReveal } from '$utils/lineMaskReveal'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const DEFAULT_COLLAPSE_DISTANCE = 3

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

  // One image, mask only (F48): the img is sized to the full-bleed frame and
  // centred on its card, which clips it. Opening the clip reveals the rest.
  const openInset = () => {
    const x = Math.max(0, (root.clientWidth - bleedItem.offsetWidth) / 2)
    const y = Math.max(0, (visibleHeight() - bleedItem.offsetHeight) / 2)
    return `inset(${-y}px ${-x}px ${-y}px ${-x}px)`
  }

  const layoutBleedImage = () => {
    const frameWidth = root.clientWidth
    const frameHeight = visibleHeight()
    Object.assign(bleedImage.style, {
      position: 'absolute',
      width: `${frameWidth}px`,
      height: `${frameHeight}px`,
      maxWidth: 'none',
      left: `${(bleedItem.offsetWidth - frameWidth) / 2}px`,
      top: `${(bleedItem.offsetHeight - frameHeight) / 2}px`,
      objectFit: 'cover',
    })
  }

  // Full-bleed size needs the full-width source, not the card's.
  bleedImage.sizes = '100vw'
  bleedImage.loading = 'eager'
  if (getComputedStyle(bleedItem).position === 'static') bleedItem.style.position = 'relative'
  bleedItem.style.overflow = 'visible'
  layoutBleedImage()
  ScrollTrigger.addEventListener('refreshInit', layoutBleedImage)

  // Start state, set before the timeline so a reverse lands on the card.
  gsap.set(bleedItem, { clipPath: 'inset(0px 0px 0px 0px)' })

  // Optional text overlay on the pinned image; hidden until the clip is full.
  const caption = root.querySelector<HTMLElement>('[data-history-collapse-caption]')
  if (caption) {
    caption.style.zIndex = '4'
    caption.style.pointerEvents = 'none'
    gsap.set(caption, { autoAlpha: 0 })
  }

  // gallery -> stack of one (bleed card on top) -> the same card opens to
  // full bleed and stays there; the gallery does not come back while pinned.
  const timeline = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${distance * window.innerHeight}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  // Each GSAP property is tweened once, on its own element (F20). See docs/solutions.
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
    // Only the mask opens (F48); the card is centred by position 1.
    .to(bleedItem, { clipPath: openInset, duration: 1.2 }, 1)
    // Hold the full-bleed image for the rest of the pin.
    .to({}, { duration: 0.4 }, 2.4)

  if (caption) {
    timeline.to(caption, { autoAlpha: 1, duration: 0.4, ease: 'none' }, 2.2)
  }
}
