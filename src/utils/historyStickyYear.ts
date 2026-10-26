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
 *
 * The collapse timeline runs gallery -> stacked into one image (bleed card
 * on top) -> a clip mask opens on a copy of the bleed image until it fills
 * the screen, with no return to the gallery (F09). The mask opens on the
 * same image, card framing to full-bleed framing (F20), with uniform image
 * scale; one property per tween to prevent unmask flicker. The natural
 * layout is the start state. Under prefers-reduced-motion the gallery stays
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

  /** clip-path insets that frame the stacked bleed card inside the layer. */
  const stackedCardInset = () => {
    const width = bleedItem.offsetWidth
    const height = bleedItem.offsetHeight
    const horizontal = Math.max(0, (root.clientWidth - width) / 2)
    const vertical = Math.max(0, (visibleHeight() - height) / 2)
    return `inset(${vertical}px ${horizontal}px ${vertical}px ${horizontal}px)`
  }

  /** Width / height of the bleed photo; the figure's box until it loads. */
  const imageAspect = () =>
    bleedImage.naturalWidth && bleedImage.naturalHeight
      ? bleedImage.naturalWidth / bleedImage.naturalHeight
      : bleedItem.offsetWidth / Math.max(1, bleedItem.offsetHeight)

  /** Rendered size of the photo when it covers a box (object-fit: cover). */
  const coverSize = (boxWidth: number, boxHeight: number) => {
    const aspect = imageAspect()
    return boxWidth / boxHeight > aspect
      ? { width: boxWidth, height: boxWidth / aspect }
      : { width: boxHeight * aspect, height: boxHeight }
  }

  /**
   * Uniform scale at which the full-bleed copy renders the photo exactly as
   * the stacked card does (F20): card cover size over full-bleed cover size.
   * The card img fills its figure (object-fit cover, centred), so the figure
   * box stands in for it, as stackedCardInset does.
   */
  const cardMatchScale = () =>
    coverSize(bleedItem.offsetWidth, bleedItem.offsetHeight).width /
    coverSize(root.clientWidth, visibleHeight()).width

  const { layer, copy } = createBleedLayer(root, bleedImage)

  // The copy is sized to the full-bleed cover box of the photo itself (no
  // object-fit crop), centred in the layer, so scaling it never changes
  // which part of the photo shows, only its size.
  const sizeLayer = () => {
    layer.style.height = `${visibleHeight()}px`
    const { width, height } = coverSize(root.clientWidth, visibleHeight())
    copy.style.width = `${width}px`
    copy.style.height = `${height}px`
  }
  sizeLayer()

  // A lazy bleed image has no natural size yet: re-measure once it loads.
  if (!bleedImage.complete || !bleedImage.naturalWidth) {
    bleedImage.addEventListener('load', () => ScrollTrigger.refresh(true), { once: true })
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

  // Start state of the mask: framed to the card, photo at card scale. Set
  // before the timeline so any reverse past position 1 lands here, never on
  // clip-path "none".
  gsap.set(copy, { xPercent: -50, yPercent: -50, scale: cardMatchScale() })
  gsap.set(layer, { clipPath: stackedCardInset() })

  // gallery -> stack of one (bleed card on top) -> the same image, framed
  // and scaled to match the card, opens to full bleed and stays there; the
  // gallery does not come back while pinned.
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

  // One GSAP property per tween: two fromTo tweens sharing clipPath let a
  // scrub reverse restore the pre-state ("none") while autoAlpha stayed up,
  // which flashed the unmasked photo (F20). See docs/solutions.
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
    // The layer is pixel-identical to the card here, so the swap is instant.
    .fromTo(
      layer,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.05, ease: 'none', immediateRender: false },
      1,
    )
    .fromTo(
      layer,
      { clipPath: stackedCardInset },
      { clipPath: 'inset(0px 0px 0px 0px)', duration: 1.2, immediateRender: true },
      1,
    )
    .fromTo(
      copy,
      { scale: cardMatchScale },
      { scale: 1, duration: 1.2, immediateRender: true },
      1,
    )
    // Hold the full-bleed image for the rest of the pin.
    .to({}, { duration: 0.4 }, 2.4)
}

/**
 * A layer over the gallery holding a copy of the bleed image. The layer's
 * clip-path is the mask; the copy only ever scales uniformly, so the photo
 * keeps its aspect ratio throughout.
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
  copy.removeAttribute('data-eager')
  Object.assign(copy.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    maxWidth: 'none',
    objectFit: 'cover',
    display: 'block',
    transformOrigin: '50% 50%',
    willChange: 'transform',
  })
  layer.appendChild(copy)
  root.appendChild(layer)
  return { layer, copy }
}
