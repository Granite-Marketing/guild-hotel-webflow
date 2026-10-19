/**
 * Modals: accessible dialog open/close.
 *
 * DOM contract (set in Webflow Designer):
 *   - Trigger:    `[data-modal-open="{id}"]`, value matches a modal's id
 *   - Modal:      `[role="dialog"]` with a native `id` attribute
 *   - Close:      `[data-modal-close]`
 *   - Overlay:    `[data-modal-overlay]`, optional global backdrop
 *                 (individual modals can opt out with `data-modal-no-overlay`)
 *
 * Open state is expressed via the `is-open` class; CSS handles visibility,
 * animation, and easing via Webflow combo classes.
 *
 * Page-scroll lock: the active smooth-scroll engine (Lenis by default, see
 * `$utils/smoothScroll`) is stopped on open and resumed on close. This halts
 * page scrolling AND releases the modal's overflow-y:auto for native
 * wheel/touch handling. No body styles or scrollTo are touched.
 *
 * Under ScrollSmoother the dialog and overlay must live OUTSIDE
 * `#smooth-content` in the Designer; this script does not reparent them.
 *
 * Focus management: the script finds modals via `getElementById`, so triggers
 * and dialogs can live anywhere in the DOM.
 */

import { smoothScroll } from '$utils/smoothScroll'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export const modals = () => {
  const modalElements = document.querySelectorAll<HTMLElement>('[role="dialog"]')
  if (!modalElements.length) return

  const overlayElement = document.querySelector<HTMLElement>('[data-modal-overlay]')

  let activeModal: HTMLElement | null = null
  let activeTrigger: HTMLElement | null = null

  modalElements.forEach((modal) => {
    if (!modal.id) return

    const titleElement = modal.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6')
    if (titleElement) {
      if (!titleElement.id) titleElement.id = `${modal.id}-title`
      modal.setAttribute('aria-labelledby', titleElement.id)
    }

    const descriptionElement = modal.querySelector<HTMLElement>(
      '.w-richtext, [role="document"], p',
    )
    if (descriptionElement) {
      if (!descriptionElement.id) descriptionElement.id = `${modal.id}-desc`
      modal.setAttribute('aria-describedby', descriptionElement.id)
    }
  })

  function getFocusableElements(root: HTMLElement): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) => !element.hasAttribute('disabled') && element.offsetParent !== null,
    )
  }

  function openModal(modal: HTMLElement, trigger: HTMLElement) {
    if (activeModal) closeModal()

    activeModal = modal
    activeTrigger = trigger

    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
    trigger.setAttribute('aria-expanded', 'true')

    const overlayEnabled = overlayElement && !modal.hasAttribute('data-modal-no-overlay')
    if (overlayEnabled) {
      overlayElement.classList.add('is-open')
      overlayElement.setAttribute('aria-hidden', 'false')
    }

    // Stop the scroll engine so page scrolling halts and the modal's own
    // overflow-y:auto takes over for native wheel/touch handling.
    smoothScroll.stop()

    // Defer focus until the open transition has finished: focusing while the
    // modal is mid-slide can cause the browser's focus-into-view request to
    // scroll the underlying page. Deferring lets the focusable settle inside
    // the viewport before focus runs.
    focusAfterTransition(modal)
  }

  function focusAfterTransition(modal: HTMLElement) {
    const computed = getComputedStyle(modal)
    const duration = parseSecondsList(computed.transitionDuration)
    const delay = parseSecondsList(computed.transitionDelay)
    const waitMs = Math.max(50, (duration + delay) * 1000 + 50)
    window.setTimeout(() => {
      if (activeModal !== modal) return
      const focusable = getFocusableElements(modal)
      const firstFocusable = focusable[0] ?? modal
      firstFocusable.focus({ preventScroll: true })
    }, waitMs)
  }

  function parseSecondsList(value: string): number {
    return Math.max(
      0,
      ...value.split(',').map((v) => {
        const trimmed = v.trim()
        if (trimmed.endsWith('ms')) return parseFloat(trimmed) / 1000
        if (trimmed.endsWith('s')) return parseFloat(trimmed)
        return 0
      }),
    )
  }

  function closeModal() {
    if (!activeModal) return

    const modal = activeModal
    const trigger = activeTrigger

    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
    trigger?.setAttribute('aria-expanded', 'false')

    if (overlayElement) {
      overlayElement.classList.remove('is-open')
      overlayElement.setAttribute('aria-hidden', 'true')
    }

    smoothScroll.start()

    trigger?.focus({ preventScroll: true })

    activeModal = null
    activeTrigger = null
  }

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null
    const trigger = target?.closest<HTMLElement>('[data-modal-open]')
    if (trigger) {
      event.preventDefault()
      const modalId = trigger.getAttribute('data-modal-open')
      if (!modalId) return
      const modal = document.getElementById(modalId)
      if (modal && modal.getAttribute('role') === 'dialog') {
        openModal(modal, trigger)
      }
      return
    }

    const closeButton = target?.closest<HTMLElement>('[data-modal-close]')
    if (closeButton && activeModal) {
      event.preventDefault()
      closeModal()
    }
  })

  document.addEventListener('keydown', (event) => {
    if (!activeModal) return

    if (event.key === 'Escape') {
      event.preventDefault()
      closeModal()
      return
    }

    if (event.key === 'Tab') {
      const focusable = getFocusableElements(activeModal)
      if (!focusable.length) {
        event.preventDefault()
        return
      }
      const firstFocusable = focusable[0]
      const lastFocusable = focusable[focusable.length - 1]
      const currentFocus = document.activeElement as HTMLElement | null

      if (event.shiftKey && currentFocus === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus({ preventScroll: true })
      } else if (!event.shiftKey && currentFocus === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus({ preventScroll: true })
      }
    }
  })
}
