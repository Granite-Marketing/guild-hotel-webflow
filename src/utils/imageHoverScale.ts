/**
 * Image Hover Scale
 *
 * Scales an image (or any element) up while its parent is hovered. The
 * parent gets `overflow: hidden` so the scale stays clipped.
 *
 * DOM contract:
 *   <figure>                                   parent: hover target + clip box
 *     <img data-hover-scale src="..." />       default scale 1.1
 *     <img data-hover-scale="1.05" ... />      custom scale
 *   </figure>
 *
 * Optional `data-hover-scale-duration="0.8"` (seconds, default 0.5).
 * Skipped entirely on devices without hover (touch), so taps never leave an
 * image stuck at the scaled state.
 */

const DEFAULT_SCALE = 1.1
const DEFAULT_DURATION = 0.5

const readNumber = (value: string | null, fallback: number) => {
  const parsed = value ? parseFloat(value) : NaN
  return Number.isFinite(parsed) ? parsed : fallback
}

export const imageHoverScale = () => {
  const scaleTargets = document.querySelectorAll<HTMLElement>('[data-hover-scale]')
  if (!scaleTargets.length) return
  if (!window.matchMedia('(hover: hover)').matches) return

  scaleTargets.forEach((target) => {
    const parentElement = target.parentElement
    if (!parentElement) return

    const scale = readNumber(target.getAttribute('data-hover-scale'), DEFAULT_SCALE)
    const duration = readNumber(
      target.getAttribute('data-hover-scale-duration'),
      DEFAULT_DURATION,
    )

    gsap.set(parentElement, { overflow: 'hidden' })

    parentElement.addEventListener('mouseenter', () => {
      gsap.to(target, { scale, duration, ease: 'power2.out' })
    })

    parentElement.addEventListener('mouseleave', () => {
      gsap.to(target, { scale: 1, duration, ease: 'power2.out' })
    })
  })
}
