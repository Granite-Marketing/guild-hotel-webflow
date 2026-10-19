/**
 * View Switcher
 *
 * Toggles between alternative views of a listing (grid / list, map / list)
 * and remembers the choice in localStorage.
 *
 * DOM contract:
 *   <button data-view="grid" data-view-default>Grid</button>
 *   <button data-view="list">List</button>
 *   <div data-view-panel="grid">...</div>
 *   <div data-view-panel="list">...</div>
 *
 *   data-view-key="works-view"   optional, on any toggle: localStorage key
 *                                (default "view-switcher"); use a distinct key
 *                                per listing when a site has several.
 *   data-view-default            optional, on one toggle: initial view when
 *                                nothing is stored (else the first toggle).
 *
 * The active toggle and the active panel get `is-active`; hide inactive
 * panels in CSS (`[data-view-panel]:not(.is-active) { display: none }`).
 * Storage access is wrapped in try/catch: Safari private mode and blocked
 * site data throw on localStorage.
 */

const ACTIVE_CLASS = 'is-active'
const DEFAULT_STORAGE_KEY = 'view-switcher'

const readStoredView = (storageKey: string): string | null => {
  try {
    return window.localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

const storeView = (storageKey: string, view: string) => {
  try {
    window.localStorage.setItem(storageKey, view)
  } catch {
    // storage unavailable; the view still switches for this page load
  }
}

export const viewSwitcher = () => {
  const toggles = Array.from(document.querySelectorAll<HTMLElement>('[data-view]'))
  const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-view-panel]'))
  if (!toggles.length || panels.length < 2) return

  const storageKey =
    toggles.find((toggle) => toggle.hasAttribute('data-view-key'))?.getAttribute('data-view-key') ||
    DEFAULT_STORAGE_KEY

  const hasPanel = (view: string | null): view is string =>
    !!view && panels.some((panel) => panel.getAttribute('data-view-panel') === view)

  const applyView = (view: string) => {
    panels.forEach((panel) => {
      panel.classList.toggle(ACTIVE_CLASS, panel.getAttribute('data-view-panel') === view)
    })
    toggles.forEach((toggle) => {
      const isActive = toggle.getAttribute('data-view') === view
      toggle.classList.toggle(ACTIVE_CLASS, isActive)
      toggle.setAttribute('aria-pressed', String(isActive))
    })
    storeView(storageKey, view)
  }

  const storedView = readStoredView(storageKey)
  const defaultView =
    toggles.find((toggle) => toggle.hasAttribute('data-view-default'))?.getAttribute('data-view') ??
    toggles[0].getAttribute('data-view')
  const initialView = hasPanel(storedView) ? storedView : defaultView
  if (hasPanel(initialView)) applyView(initialView)

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      event.preventDefault()
      const view = toggle.getAttribute('data-view')
      if (hasPanel(view)) applyView(view)
    })
  })
}
