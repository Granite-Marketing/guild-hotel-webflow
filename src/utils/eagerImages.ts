/**
 * Eager Images
 *
 * Promotes loading="lazy" images to eager when marked with [data-eager],
 * either on the image itself or on any ancestor (typically a section or card).
 *
 * Use when images lack width/height attributes (for example API-imported
 * Webflow CMS images, which emit no intrinsic size) and therefore reserve no
 * aspect-ratio space. Each late load then shifts layout downward, and any
 * ScrollTrigger below the shift fires against a stale cached position, which
 * shows up on iOS as animations playing before they are in view.
 *
 * Promoting to eager makes window.load wait for these images, so the
 * engine's load refresh (scrollTriggerRefresh.ts) measures the settled
 * layout.
 *
 *   <section data-eager>...</section>           all lazy imgs inside
 *   <img data-eager loading="lazy" src="..." />  just this image
 *
 * Must run first inside Webflow.push, before any ScrollTrigger is created.
 */

export const eagerImages = () => {
  const eagerRoots = document.querySelectorAll<HTMLElement>('[data-eager]')
  if (!eagerRoots.length) return

  eagerRoots.forEach((element) => {
    if (element instanceof HTMLImageElement && element.loading === 'lazy') {
      element.loading = 'eager'
    }
    element.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((image) => {
      image.loading = 'eager'
    })
  })
}
