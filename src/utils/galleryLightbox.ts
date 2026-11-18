/**
 * Gallery Lightbox (Stephen 18 Nov, #295)
 *
 * On /gallery each photo sits in a native Webflow Lightbox
 * (`[data-gallery-lightbox]`, built in the Designer around the CMS image).
 * The Designer cannot bind a lightbox's media to a CMS field through the API,
 * so this fills each lightbox from the photo inside it, and keeps the
 * lightbox set in step with the gallery filter: only photos the filter shows
 * share the "gallery" group, so next and previous never leave the filter.
 * Hidden photos get a group of their own. Re-runs Webflow's lightbox after
 * each change so it rebuilds its groups.
 *
 * Order: after galleryFilter (which toggles `hide` on the items).
 */

const GROUP = 'gallery'
const HIDDEN_CLASS = 'hide'

export const galleryLightbox = () => {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-gallery-lightbox]'))
  const lightbox = window.Webflow?.require?.('lightbox')
  if (!links.length || !lightbox?.ready) return

  const entries = links.map((link) => {
    let json = link.querySelector<HTMLScriptElement>('script.w-json')
    if (!json) {
      json = document.createElement('script')
      json.type = 'application/json'
      json.className = 'w-json'
      link.append(json)
    }
    return { link, json, item: link.closest<HTMLElement>('[data-gallery-filter-item]') ?? link, image: link.querySelector('img') }
  })

  const sync = () => {
    entries.forEach(({ json, item, image }, index) => {
      if (!image) return
      const shown = !item.classList.contains(HIDDEN_CLASS)
      json.textContent = JSON.stringify({
        items: [{ type: 'image', url: image.currentSrc || image.src }],
        group: shown ? GROUP : `${GROUP}-hidden-${index}`,
      })
    })
    lightbox.ready?.()
  }
  sync()

  // The filter toggles `hide` on items; resync once per batch of changes.
  let queued = false
  const observer = new MutationObserver(() => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      sync()
    })
  })
  entries.forEach(({ item }) => observer.observe(item, { attributes: true, attributeFilter: ['class'] }))
}
