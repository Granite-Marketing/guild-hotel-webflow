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
 * Collapse gallery (gallery-row-dark-titled):
 *
 *   [data-history-collapse]                 section root, pinned while the
 *                                           timeline scrubs
 *   [data-history-collapse-item]            each gallery image wrapper
 *   [data-history-collapse-fade]            optional heading or caption that
 *                                           fades out while the image fills
 *                                           the screen
 *   data-history-collapse-distance="3"      optional pin length in viewport
 *                                           heights (default 3)
 *
 * The collapse timeline runs gallery -> stacked into one image -> full
 * screen -> back to the gallery, so the natural layout is both the start
 * and the end state. Under prefers-reduced-motion the gallery stays as laid
 * out and the year label swaps text without a tween.
 */

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

  const fades = root.querySelectorAll<HTMLElement>('[data-history-collapse-fade]')
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

  const coverScale = (element: HTMLElement) =>
    Math.max(
      root.clientWidth / element.offsetWidth,
      visibleHeight() / element.offsetHeight,
    )

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
    .to(fades, { autoAlpha: 0, duration: 0.4, ease: 'none' }, 0.8)
    .to(
      items,
      { scale: (index: number) => coverScale(items[index]), duration: 1 },
      1,
    )
    .to(items, { x: 0, y: 0, scale: 1, duration: 1.2 }, 2.4)
    .to(fades, { autoAlpha: 1, duration: 0.4, ease: 'none' }, 3.2)
}
