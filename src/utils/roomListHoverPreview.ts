/**
 * Room list hover preview (Q007): hovering or focusing a room name in the
 * all-rooms dialog shows that room's photo and details in the media column.
 *
 * DOM contract (built in Webflow, see docs/reference/runtime-modules.md):
 *   - Root:    `[data-room-preview]` on the dialog (one per page)
 *   - Trigger: `[data-room-preview-trigger="{key}"]` on each room link
 *   - Panel:   `[data-room-preview-panel="{key}"]` on each preview
 *
 * The first trigger and panel carry `is-active` in Webflow, so the dialog
 * shows a room before this module runs. The All / Rooms / Suites tabs are
 * the existing galleryFilter contract on the same root; when a filter hides
 * the active room, the first visible room becomes active.
 */

const ACTIVE_CLASS = 'is-active'
const HIDDEN_CLASS = 'hide'

export const roomListHoverPreview = () => {
  const root = document.querySelector<HTMLElement>('[data-room-preview]')
  if (!root) return

  const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-room-preview-trigger]'))
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-room-preview-panel]'))
  if (!triggers.length || !panels.length) return

  const keyOf = (element: HTMLElement, attribute: string) => element.getAttribute(attribute) ?? ''

  const activate = (key: string) => {
    triggers.forEach((trigger) => {
      trigger.classList.toggle(ACTIVE_CLASS, keyOf(trigger, 'data-room-preview-trigger') === key)
    })
    panels.forEach((panel) => {
      const isActive = keyOf(panel, 'data-room-preview-panel') === key
      panel.classList.toggle(ACTIVE_CLASS, isActive)
      panel.setAttribute('aria-hidden', String(!isActive))
    })
  }

  const isVisible = (trigger: HTMLElement) =>
    !trigger.closest(`.${HIDDEN_CLASS}`) && trigger.offsetParent !== null

  triggers.forEach((trigger) => {
    const key = keyOf(trigger, 'data-room-preview-trigger')
    trigger.addEventListener('mouseenter', () => activate(key))
    trigger.addEventListener('focus', () => activate(key))
  })

  // galleryFilter toggles `hide` on the list items; keep the preview on a
  // room that is still listed.
  const list = triggers[0].closest('ul, ol') ?? root
  new MutationObserver(() => {
    const active = triggers.find((trigger) => trigger.classList.contains(ACTIVE_CLASS))
    if (active && isVisible(active)) return
    const firstVisible = triggers.find(isVisible)
    if (firstVisible) activate(keyOf(firstVisible, 'data-room-preview-trigger'))
  }).observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] })

  const initial =
    triggers.find((trigger) => trigger.classList.contains(ACTIVE_CLASS)) ?? triggers[0]
  activate(keyOf(initial, 'data-room-preview-trigger'))
}
