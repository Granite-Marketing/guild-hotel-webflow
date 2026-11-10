/**
 * Image Stack Collapse
 *
 * A row of images (typically three, side by side) slides together on scroll
 * until every image sits exactly behind one anchor image: a stack of one.
 * No rotation; every image stays aligned to the anchor's centre.
 *
 * DOM contract:
 *   <div data-image-stack-collapse>                 row wrapper and scroll trigger
 *     <figure data-image-stack-collapse-item>...</figure>
 *     <figure data-image-stack-collapse-item="anchor">...</figure>
 *     <figure data-image-stack-collapse-item>...</figure>
 *   </div>
 *
 * The anchor stays put and is raised above the others; without an explicit
 * `="anchor"` the middle item is the anchor. Optional
 * `data-image-stack-collapse-start` / `-end` override the ScrollTrigger
 * positions (defaults `top 55%` / `center 40%`, so the row is well in view before it moves). The collapse
 * is a timed animation (COLLAPSE_SECONDS) that plays once the row crosses the
 * start point, and plays back in reverse when you scroll back above it
 * (animation feedback round 3: scrubbed felt too fast). `-end` is unused.
 *
 * Offsets are measured centre to centre (current translate removed) and
 * recomputed on every ScrollTrigger refresh, so the stack stays aligned
 * across resizes and breakpoints. The anchor must not be transformed. Under
 * `prefers-reduced-motion: reduce` the end state (the stack) is shown with
 * no animation.
 *
 * Below 768px the collapse does not run; the row becomes a swipeable Swiper
 * slider instead: the row is the Swiper wrapper, its parent the container and
 * its direct children the slides (Swiper classes are added at runtime and
 * removed again at 768px and up). An optional
 * `[data-image-stack-collapse-progress]` fill inside the parent scales from
 * 1/n to n/n as the slides change.
 */

const DEFAULT_START = 'top 55%'
const DEFAULT_END = 'center 40%'
/** Seconds the collapse (and its reverse) takes. */
const COLLAPSE_SECONDS = 1.6
const MOBILE = '(max-width: 767px)'
const DESKTOP = '(min-width: 768px)'

const findAnchor = (items: HTMLElement[]) =>
  items.find((item) => item.dataset.imageStackCollapseItem === 'anchor') ??
  items[Math.floor(items.length / 2)]

// Subpixel rects (offsetLeft rounds to whole pixels); the item's current
// GSAP translate is added back so the result is its layout distance.
const offsetToAnchor = (item: HTMLElement, anchor: HTMLElement) => {
  const itemRect = item.getBoundingClientRect()
  const anchorRect = anchor.getBoundingClientRect()
  return {
    x:
      anchorRect.left + anchorRect.width / 2 -
      (itemRect.left + itemRect.width / 2) +
      Number(gsap.getProperty(item, 'x')),
    y:
      anchorRect.top + anchorRect.height / 2 -
      (itemRect.top + itemRect.height / 2) +
      Number(gsap.getProperty(item, 'y')),
  }
}

const raiseAnchor = (items: HTMLElement[], anchor: HTMLElement) => {
  items.forEach((item) => {
    if (getComputedStyle(item).position === 'static') gsap.set(item, { position: 'relative' })
    gsap.set(item, { zIndex: item === anchor ? 2 : 1 })
  })
}

// Returns the matchMedia cleanup that restores the desktop DOM.
const mountSlider = (stack: HTMLElement) => {
  const container = stack.parentElement
  if (!container) return
  const slides = Array.from(stack.children)
  const fill = container.querySelector<HTMLElement>('[data-image-stack-collapse-progress]')
  const setProgress = (index: number) =>
    fill && gsap.to(fill, { scaleX: (index + 1) / slides.length, duration: 0.4, ease: 'power2.out' })

  stack.classList.add('swiper-wrapper')
  slides.forEach((slide) => slide.classList.add('swiper-slide'))
  if (fill) gsap.set(fill, { scaleX: 1 / slides.length, transformOrigin: 'left center' })

  const swiper = new Swiper(container, {
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 600,
    grabCursor: true,
    // Header and footer share the container; only the images take the drag.
    touchEventsTarget: 'wrapper',
    on: { slideChange: (instance: SwiperInstance) => setProgress(instance.activeIndex) },
  })
  // Swiper hides its a11y live region only under a `.swiper` class, which the
  // container lacks; out of the flex flow it no longer adds a row gap.
  const notification = container.querySelector<HTMLElement>('.swiper-notification')
  if (notification) gsap.set(notification, { position: 'absolute' })

  return () => {
    swiper.destroy(true, true)
    stack.classList.remove('swiper-wrapper')
    slides.forEach((slide) => slide.classList.remove('swiper-slide'))
    if (fill) gsap.set(fill, { clearProps: 'transform' })
  }
}

export const imageStackCollapse = () => {
  const stacks = document.querySelectorAll<HTMLElement>('[data-image-stack-collapse]')
  if (!stacks.length) return

  stacks.forEach((stack) => {
    const items = Array.from(
      stack.querySelectorAll<HTMLElement>('[data-image-stack-collapse-item]'),
    )
    if (items.length < 2) return

    const anchor = findAnchor(items)
    const movingItems = items.filter((item) => item !== anchor)

    const mm = gsap.matchMedia()
    mm.add(MOBILE, () => mountSlider(stack))
    mm.add(
      {
        allowsMotion: `${DESKTOP} and (prefers-reduced-motion: no-preference)`,
        reducesMotion: `${DESKTOP} and (prefers-reduced-motion: reduce)`,
      },
      (context) => {
        raiseAnchor(items, anchor)

        if (context.conditions.reducesMotion) {
          // A bare trigger only to re-apply the stack on every refresh (resize).
          const showStack = () =>
            movingItems.forEach((item) => gsap.set(item, offsetToAnchor(item, anchor)))
          showStack()
          ScrollTrigger.create({ trigger: stack, onRefresh: showStack })
          return
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stack,
            start: stack.dataset.imageStackCollapseStart || DEFAULT_START,
            end: stack.dataset.imageStackCollapseEnd || DEFAULT_END,
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        })

        movingItems.forEach((item) => {
          timeline.fromTo(
            item,
            { x: 0, y: 0 },
            {
              x: () => offsetToAnchor(item, anchor).x,
              y: () => offsetToAnchor(item, anchor).y,
              duration: COLLAPSE_SECONDS,
              ease: 'power2.inOut',
            },
            0,
          )
        })
      },
    )
  })
}
