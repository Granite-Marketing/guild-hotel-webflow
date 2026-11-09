/**
 * Media Tabs
 *
 * A row list that works as tabs: the active row switches a stacked panel
 * (background media plus a content block). Built for the Guild home
 * Meetings & Events section (feedback F06), with full ARIA tabs semantics.
 * On hover-capable devices hovering a row previews it (image and active row
 * switch) and leaving the list returns to the committed row; a click or
 * keyboard switch commits. Touch devices switch on tap. This reverses F16's
 * click-only rule (client feedback, November 2026). Only the image animates
 * (crossfade); the panel copy swaps instantly with no text animation, so
 * identical copy reads as static (client feedback, November 2026).
 *
 * DOM contract (attributes, so Designer classes stay free):
 *
 *   [data-media-tabs]                 section root (the guard selector)
 *     [data-media-tabs-list]          optional; the rows' wrapper, gets
 *                                     role="tablist"
 *       [data-media-tabs-tab]         one per row, in panel order. Use a
 *                                     <button> or a link block; the module
 *                                     adds role, tabindex and aria-*.
 *     [data-media-tabs-media]         optional; one per tab, stacked (for
 *                                     example absolute figures). The
 *                                     background image for that tab. Media
 *                                     still crossfades.
 *     [data-media-tabs-panel]         one per tab, stacked on top of each
 *                                     other in the Designer (same grid cell
 *                                     or absolute). The content block.
 *
 * The first tab is active on load. The active tab, media and panel get
 * `is-active`; the tab gets aria-selected="true" and tabindex="0", the
 * others -1 (roving tabindex). Arrow keys move between tabs and activate
 * them; Home and End jump to the first and last. Inactive panels are set to
 * autoAlpha 0 (never tweened), so they never intercept clicks.
 *
 * prefers-reduced-motion: media swaps instantly too.
 */

const ROOT_SELECTOR = '[data-media-tabs]'
const ACTIVE_CLASS = 'is-active'
const FADE_DURATION = 0.6
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const HOVER_POINTER = '(hover: hover) and (pointer: fine)'

let instanceCount = 0

export const mediaTabs = () => {
  const roots = document.querySelectorAll<HTMLElement>(ROOT_SELECTOR)
  if (!roots.length) return

  roots.forEach((root) => setupTabs(root))
}

const setupTabs = (root: HTMLElement) => {
  const tabs = Array.from(root.querySelectorAll<HTMLElement>('[data-media-tabs-tab]'))
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-media-tabs-panel]'))
  const media = Array.from(root.querySelectorAll<HTMLElement>('[data-media-tabs-media]'))
  if (!tabs.length || tabs.length !== panels.length) {
    console.warn('[mediaTabs] needs one -panel per -tab', root)
    return
  }
  if (media.length && media.length !== tabs.length) {
    console.warn('[mediaTabs] needs one -media per -tab when -media is used', root)
    return
  }

  instanceCount += 1
  const idPrefix = `media-tabs-${instanceCount}`
  const list = root.querySelector<HTMLElement>('[data-media-tabs-list]')
  list?.setAttribute('role', 'tablist')

  tabs.forEach((tab, index) => {
    const tabId = tab.id || `${idPrefix}-tab-${index}`
    const panelId = panels[index].id || `${idPrefix}-panel-${index}`
    tab.id = tabId
    panels[index].id = panelId
    tab.setAttribute('role', 'tab')
    tab.setAttribute('aria-controls', panelId)
    panels[index].setAttribute('role', 'tabpanel')
    panels[index].setAttribute('aria-labelledby', tabId)
  })

  // The media stack uses z-index 0/1 to crossfade, so lift the content
  // above it; otherwise the active image covers the tab rows.
  const panelLayer = panels[0].parentElement
  if (media.length && panelLayer && getComputedStyle(panelLayer).position !== 'static') {
    panelLayer.style.zIndex = '2'
  }

  let activeIndex = 0
  let initialised = false
  const reducedMotion = window.matchMedia(REDUCED_MOTION).matches

  const showPanelOnly = (index: number) => {
    panels.forEach((panel, panelIndex) =>
      gsap.set(panel, {
        autoAlpha: panelIndex === index ? 1 : 0,
        zIndex: panelIndex === index ? 1 : 0,
      }),
    )
  }

  const activate = (index: number, animate: boolean) => {
    if (initialised && index === activeIndex) return
    initialised = true
    const previous = activeIndex
    activeIndex = index

    tabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === index
      tab.classList.toggle(ACTIVE_CLASS, isActive)
      tab.setAttribute('aria-selected', String(isActive))
      tab.tabIndex = isActive ? 0 : -1
    })
    ;[...panels, ...media].forEach((element) =>
      element.classList.toggle(
        ACTIVE_CLASS,
        panels[index] === element || media[index] === element,
      ),
    )

    if (media.length) crossfade(media, index, previous, animate && !reducedMotion)
    showPanelOnly(index)
  }

  activate(0, false)

  // The tab a click or key last chose; hover only previews other tabs.
  let committedIndex = 0
  const commit = (index: number) => {
    committedIndex = index
    activate(index, true)
  }
  const canHover = window.matchMedia(HOVER_POINTER)

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      // A row linked to a real page navigates (home Meetings rows go to the
      // Meetings & Events page, animation feedback); hover still previews.
      // Rows left on "#" stay tabs and must not navigate.
      const href = tab.getAttribute('href')
      if (href && href !== '#') return
      event.preventDefault()
      commit(index)
    })
    tab.addEventListener('keydown', (event) => {
      const target = targetIndex(event.key, index, tabs.length)
      if (target === null) return
      event.preventDefault()
      tabs[target].focus()
      commit(target)
    })
    tab.addEventListener('mouseenter', () => {
      if (canHover.matches) activate(index, true)
    })
  })

  ;(list ?? tabs[0].parentElement)?.addEventListener('mouseleave', () => {
    if (canHover.matches) activate(committedIndex, true)
  })
}

const targetIndex = (key: string, current: number, count: number): number | null => {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (current + 1) % count
    case 'ArrowLeft':
    case 'ArrowUp':
      return (current - 1 + count) % count
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return null
  }
}

/** Fades the new media in over the old one, then hides the old one. */
const crossfade = (
  elements: HTMLElement[],
  index: number,
  previous: number,
  animate: boolean,
) => {
  const incoming = elements[index]
  gsap.killTweensOf(elements)

  if (!animate || previous === index) {
    elements.forEach((element, elementIndex) =>
      gsap.set(element, {
        autoAlpha: elementIndex === index ? 1 : 0,
        zIndex: elementIndex === index ? 1 : 0,
      }),
    )
    return
  }

  elements.forEach((element, elementIndex) => {
    if (elementIndex !== index && elementIndex !== previous) {
      gsap.set(element, { autoAlpha: 0, zIndex: 0 })
    }
  })
  gsap.set(elements[previous], { zIndex: 0 })
  gsap.set(incoming, { zIndex: 1 })

  gsap.fromTo(
    incoming,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: FADE_DURATION,
      ease: 'power2.out',
      onComplete: () => gsap.set(elements[previous], { autoAlpha: 0 }),
    },
  )
}
