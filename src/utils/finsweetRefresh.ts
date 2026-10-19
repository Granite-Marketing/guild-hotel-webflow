/**
 * Finsweet Refresh
 *
 * Single ScrollTrigger refresh point for Finsweet CMS Filter (v1)
 * rehydration. When the filter swaps collection items in or out, the list
 * height changes and every ScrollTrigger below it holds stale start/end
 * positions. This module:
 *
 *   1. Hooks each list instance's `renderitems` event through the
 *      `window.fsAttributes` queue (safe before or after Finsweet loads).
 *   2. Attaches a load listener to every not-yet-loaded image in the newly
 *      rendered items; image loads share a 100ms trailing debounce instead
 *      of refreshing once per image.
 *   3. Collapses every request in a frame into one refresh on the next
 *      frame: ScrollTrigger.sort() (dynamic insertion leaves triggers out of
 *      source order, the usual cause of "cannot scroll past a pin"), then
 *      ScrollTrigger.refresh(true), which defers past momentum scroll.
 *   4. Registers a MutationObserver on each list (childList only, no
 *      subtree, so pin-spacers cannot feed back) as a fallback when some
 *      other path rehydrates the list.
 *
 * DOM contract: any `[fs-cmsfilter-element="list"]` on the page. Works
 * under Lenis and ScrollSmoother. Run it before modules that push their own
 * `cmsfilter` callbacks so the refresh callback is registered first.
 */

const IMAGE_SETTLE_MS = 100
let refreshFrame: number | undefined
let imageSettleTimer: number | undefined

const refreshAfterCmsHydration = () => {
  if (refreshFrame !== undefined) return
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = undefined
    ScrollTrigger.sort()
    ScrollTrigger.refresh(true)
  })
}

const refreshAfterImageLoads = () => {
  window.clearTimeout(imageSettleTimer)
  imageSettleTimer = window.setTimeout(refreshAfterCmsHydration, IMAGE_SETTLE_MS)
}

const attachImageRefreshListener = (image: HTMLImageElement) => {
  if (image.complete && image.naturalWidth > 0) return
  image.addEventListener('load', refreshAfterImageLoads, { once: true })
}

export const finsweetRefresh = () => {
  const filterLists = document.querySelectorAll<HTMLElement>('[fs-cmsfilter-element="list"]')
  if (!filterLists.length) return

  const fsAttributes = (window.fsAttributes ??= [])
  fsAttributes.push([
    'cmsfilter',
    (filterInstances: FinsweetFilterInstance[]) => {
      filterInstances?.forEach((instance) => {
        instance.listInstance?.on('renderitems', () => {
          instance.listInstance.items.forEach((item) => {
            item.element.querySelectorAll<HTMLImageElement>('img').forEach(attachImageRefreshListener)
          })
          refreshAfterCmsHydration()
        })
      })
    },
  ])

  filterLists.forEach((listElement) => {
    let mutationPending = false
    const isPinSpacer = (node: Node) =>
      node instanceof HTMLElement && node.classList.contains('pin-spacer')
    const listObserver = new MutationObserver((mutations) => {
      // A refresh can wrap a pinned child in a pin-spacer; ignore those
      // mutations so the refresh cannot feed back into itself.
      const onlyPinSpacers = mutations.every((mutation) =>
        [...mutation.addedNodes, ...mutation.removedNodes].some(isPinSpacer),
      )
      if (onlyPinSpacers || mutationPending) return
      mutationPending = true
      requestAnimationFrame(() => {
        listElement.querySelectorAll<HTMLImageElement>('img').forEach(attachImageRefreshListener)
        refreshAfterCmsHydration()
        mutationPending = false
      })
    })
    listObserver.observe(listElement, { childList: true, subtree: false })
  })
}
