/**
 * Focus Ring (mobile feedback M11a, M28)
 *
 * Keyboard users keep a visible focus ring; mouse and touch users never get
 * one, and neither does anything a script focuses on its own (quiz step
 * headings, a modal's back arrow, a section scrolled to). Browsers decide this
 * with `:focus-visible`, but Webflow's base styles and some engines draw the
 * ring on plain `:focus`, so tapping Close or opening a modal left an outline.
 *
 * This module tracks the last input (key or pointer). When focus lands while
 * the last input was not the keyboard, or lands on a script-focused
 * `tabindex="-1"` target, it sets an inline `outline: none` until focus
 * leaves. Pressing a key (Tab included) restores the ring on a focused
 * control. No CSS is involved, so nothing is needed in the site head.
 *
 * DOM contract: none. Runs on every page.
 */

const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'])

export const focusRing = () => {
  // Start quiet: focus moved by the page on load should not draw a ring.
  let keyboardActive = false
  const quieted = new WeakSet<HTMLElement>()

  const quiet = (element: HTMLElement) => {
    element.style.setProperty('outline', 'none')
    quieted.add(element)
  }
  const restore = (element: HTMLElement) => {
    if (!quieted.has(element)) return
    element.style.removeProperty('outline')
    if (!element.getAttribute('style')) element.removeAttribute('style')
    quieted.delete(element)
  }
  // Elements outside the tab order (focused only by scripts) never show a ring.
  const isScriptFocusTarget = (element: HTMLElement) => element.getAttribute('tabindex') === '-1'

  document.addEventListener(
    'keydown',
    (event) => {
      if (MODIFIER_KEYS.has(event.key)) return
      keyboardActive = true
      const active = document.activeElement
      if (active instanceof HTMLElement && !isScriptFocusTarget(active)) restore(active)
    },
    true,
  )
  const pointerInput = () => {
    keyboardActive = false
  }
  document.addEventListener('pointerdown', pointerInput, true)
  document.addEventListener('mousedown', pointerInput, true)
  document.addEventListener('touchstart', pointerInput, true)

  document.addEventListener(
    'focusin',
    (event) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (!keyboardActive || isScriptFocusTarget(target)) quiet(target)
    },
    true,
  )
  document.addEventListener(
    'focusout',
    (event) => {
      if (event.target instanceof HTMLElement) restore(event.target)
    },
    true,
  )
}
