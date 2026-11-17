/**
 * Hero Image Scale (M23)
 *
 * On load, the full-bleed hero photo settles from a slight zoom to its normal
 * size, alongside the hero text mask (scrollReveal text-mask on
 * `.hero-fullbleed-centered_component`, unchanged). Scale only: no opacity,
 * so the photo never flashes in.
 *
 * DOM contract (Hero Fullbleed Centered component, every page that uses it):
 *   <figure class="hero-fullbleed-centered_figure">   the frame
 *     <img> or <video>                                  the photo (u-image)
 *
 * The frame gets `overflow: hidden` from code, so the zoomed photo never
 * leaves it. Reduced motion leaves the photo still. The transform is cleared
 * at the end so CSS hover zooms and later layout are not affected.
 */

const FRAME = '.hero-fullbleed-centered_figure'
// The photo carries the shared u-image class, not a family class.
const IMAGE = 'img, video'

/** Keep in sync with the pre-load zoom in docs/reference/site-head/reveal-prehide.css. */
export const HERO_IMAGE_START_SCALE = 1.12
export const HERO_IMAGE_DURATION = 1.8

export const heroImageScale = () => {
  const frames = document.querySelectorAll<HTMLElement>(FRAME)
  if (!frames.length) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  frames.forEach((frame) => {
    const image = frame.querySelector<HTMLElement>(IMAGE)
    if (!image) return
    gsap.set(frame, { overflow: 'hidden' })
    gsap.fromTo(
      image,
      { scale: HERO_IMAGE_START_SCALE },
      {
        scale: 1,
        duration: HERO_IMAGE_DURATION,
        ease: 'power2.out',
        clearProps: 'transform',
      },
    )
  })
}
