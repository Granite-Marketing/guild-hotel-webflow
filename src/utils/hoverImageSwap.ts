/**
 * Hover image swap (feedback F25): on the /rooms quiz step "Who's checking
 * in?", hovering or focusing an option crossfades the right-hand photo to
 * the one keyed to that option. Leaving the options restores the default.
 *
 * DOM contract (built in Webflow, see docs/reference/runtime-modules.md):
 *   - Root:    `[data-hover-swap]` (the quiz section). One swap per root.
 *   - List:    `[data-hover-swap-list]`, optional, the options wrapper.
 *              Leaving it restores the default image. Falls back to the root.
 *   - Trigger: `[data-hover-swap-trigger="{key}"]` on each option.
 *   - Media:   `[data-hover-swap-media="{key}"]` on each stacked image, all
 *              absolutely positioned in one figure. The one keyed `default`
 *              is the resting image; without one, the first media is used.
 *
 * Non-default media carry a Designer combo (`is-swap`: opacity 0, visibility
 * hidden), so without JS only the default shows. This module never touches
 * the option links' classes, aria-pressed or clicks: quiz selection (F26)
 * owns those.
 */

const ROOT_SELECTOR = '[data-hover-swap]'
const ACTIVE_CLASS = 'is-active'
const DEFAULT_KEY = 'default'
const FADE_DURATION = 0.6
const HOVER_QUERY = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const setupSwap = (root: HTMLElement) => {
  const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-hover-swap-trigger]'))
  const media = Array.from(root.querySelectorAll<HTMLElement>('[data-hover-swap-media]'))
  if (!triggers.length || !media.length) return

  const fallback = media.find((item) => item.dataset.hoverSwapMedia === DEFAULT_KEY) ?? media[0]
  let current = fallback
  fallback.classList.add(ACTIVE_CLASS)

  const hoverQuery = window.matchMedia(HOVER_QUERY)
  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION)

  const show = (key: string) => {
    const next = media.find((item) => item.dataset.hoverSwapMedia === key) ?? fallback
    if (next === current) return
    const previous = current
    current = next

    media.forEach((item) => item.classList.toggle(ACTIVE_CLASS, item === next))

    gsap.killTweensOf(media)
    media.forEach((item) => {
      if (item !== next && item !== previous) gsap.set(item, { autoAlpha: 0, zIndex: 0 })
    })
    gsap.set(previous, { zIndex: 1 })
    gsap.set(next, { zIndex: 2 })

    if (reducedMotionQuery.matches) {
      gsap.set(next, { autoAlpha: 1 })
      gsap.set(previous, { autoAlpha: 0 })
      return
    }

    // Tween from the current computed state, so an interrupted fade carries
    // on instead of jumping back to transparent.
    gsap.to(next, {
      autoAlpha: 1,
      duration: FADE_DURATION,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(previous, { autoAlpha: 0 })
      },
    })
  }

  triggers.forEach((trigger) => {
    const key = trigger.dataset.hoverSwapTrigger ?? ''
    trigger.addEventListener('mouseenter', () => {
      if (hoverQuery.matches) show(key)
    })
    trigger.addEventListener('focus', () => show(key))
  })

  const list = root.querySelector<HTMLElement>('[data-hover-swap-list]') ?? root
  list.addEventListener('mouseleave', () => show(DEFAULT_KEY))

  root.addEventListener('focusout', (event) => {
    const nextFocus = event.relatedTarget
    const staysOnTrigger =
      nextFocus instanceof Element &&
      root.contains(nextFocus) &&
      nextFocus.closest('[data-hover-swap-trigger]') !== null
    if (!staysOnTrigger) show(DEFAULT_KEY)
  })
}

export const hoverImageSwap = () => {
  const roots = document.querySelectorAll<HTMLElement>(ROOT_SELECTOR)
  if (!roots.length) return
  roots.forEach(setupSwap)
}
