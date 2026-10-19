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
 * positions (defaults `top 75%` / `center center`). The animation is
 * scrubbed, so scrolling back up fans the images out again.
 *
 * Offsets are measured centre to centre (current translate removed) and
 * recomputed on every ScrollTrigger refresh, so the stack stays aligned
 * across resizes and breakpoints. The anchor must not be transformed. Under
 * `prefers-reduced-motion: reduce` the end state (the stack) is shown with
 * no animation.
 */

const DEFAULT_START = 'top 75%'
const DEFAULT_END = 'center center'

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
    mm.add(
      {
        allowsMotion: '(prefers-reduced-motion: no-preference)',
        reducesMotion: '(prefers-reduced-motion: reduce)',
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
            scrub: true,
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
              ease: 'power2.inOut',
            },
            0,
          )
        })
      },
    )
  })
}
