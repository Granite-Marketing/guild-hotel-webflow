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
 * Additional ways in, no extra attributes needed:
 *   - Keyboard:   Enter and Space open a `[data-modal-open]` trigger that is
 *                 not a native button or link (e.g. a div timeline item).
 *                 Such triggers get `tabindex="0"` and `role="button"` at
 *                 init if they have none.
 *   - Hash link:  any `a[href="#{id}"]` whose id is a dialog opens it through
 *                 the same path, also from inside another open dialog (the
 *                 current one closes first and focus later returns to the
 *                 trigger that opened the first dialog).
 *   - Page load:  `location.hash` naming a dialog id opens that dialog, and
 *                 so does a later `hashchange` to one. A hash naming any
 *                 other element re-scrolls to it after window load, so lazy
 *                 images above it cannot leave the page short.
 *   - Close and scroll: a `[data-modal-close]` with `href="#{section-id}"`
 *                 pointing at a non-dialog element closes the dialog, then
 *                 scrolls to that element and moves focus there.
 *
 * Open state is expressed via the `is-open` class; CSS handles visibility,
 * animation, and easing via Webflow combo classes.
 *
 * Page-scroll lock: the active smooth-scroll engine (Lenis by default, see
 * `$utils/smoothScroll`) is stopped on open and resumed on close. This halts
 * page scrolling AND releases the modal's overflow-y:auto for native
 * wheel/touch handling. No body styles are touched.
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

const HASH_SCROLL_TIMEOUT = 5000
const NATIVE_ACTIVATION_SELECTOR = 'a[href], button, input, select, textarea, summary'

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

  // Non-native triggers (divs, spans) need to be reachable and announced.
  document.querySelectorAll<HTMLElement>('[data-modal-open]').forEach((trigger) => {
    if (trigger.matches(NATIVE_ACTIVATION_SELECTOR)) return
    if (!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex', '0')
    if (!trigger.hasAttribute('role')) trigger.setAttribute('role', 'button')
  })

  function getDialog(id: string | null | undefined): HTMLElement | null {
    if (!id) return null
    const element = document.getElementById(id)
    return element && element.getAttribute('role') === 'dialog' ? element : null
  }

  /** The element id named by an `href="#id"`, or null for `#`, empty or other URLs. */
  function hashTarget(href: string | null): string | null {
    if (!href || !href.startsWith('#') || href.length < 2) return null
    try {
      return decodeURIComponent(href.slice(1))
    } catch {
      return href.slice(1)
    }
  }

  function getFocusableElements(root: HTMLElement): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) => !element.hasAttribute('disabled') && element.offsetParent !== null,
    )
  }

  function openModal(modal: HTMLElement, trigger: HTMLElement | null) {
    if (activeModal === modal) return

    // Opening from inside the current dialog: the inner link is about to be
    // hidden, so keep the trigger that opened the first dialog as the return
    // focus target.
    const returnTrigger =
      activeModal && trigger && activeModal.contains(trigger) ? activeTrigger : trigger

    if (activeModal) closeModal({ restoreFocus: false })

    activeModal = modal
    activeTrigger = returnTrigger

    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
    if (trigger?.hasAttribute('data-modal-open')) trigger.setAttribute('aria-expanded', 'true')

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

  function closeModal({ restoreFocus = true }: { restoreFocus?: boolean } = {}) {
    if (!activeModal) return

    const modal = activeModal
    const trigger = activeTrigger

    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
    if (trigger?.hasAttribute('data-modal-open')) trigger.setAttribute('aria-expanded', 'false')

    if (overlayElement) {
      overlayElement.classList.remove('is-open')
      overlayElement.setAttribute('aria-hidden', 'true')
    }

    smoothScroll.start()

    if (restoreFocus) trigger?.focus({ preventScroll: true })

    activeModal = null
    activeTrigger = null
  }

  /** Close, then scroll to a page section and move focus there. */
  function closeAndScrollTo(section: HTMLElement) {
    closeModal({ restoreFocus: false })
    smoothScroll.scrollTo(section)
    if (!section.matches(FOCUSABLE_SELECTOR)) section.setAttribute('tabindex', '-1')
    section.focus({ preventScroll: true })
  }

  function openFromTrigger(trigger: HTMLElement) {
    const modal = getDialog(trigger.getAttribute('data-modal-open'))
    if (modal) openModal(modal, trigger)
  }

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null
    const trigger = target?.closest<HTMLElement>('[data-modal-open]')
    if (trigger) {
      event.preventDefault()
      openFromTrigger(trigger)
      return
    }

    const closeButton = target?.closest<HTMLElement>('[data-modal-close]')
    if (closeButton && activeModal) {
      event.preventDefault()
      const targetId = hashTarget(closeButton.getAttribute('href'))
      const targetDialog = getDialog(targetId)
      if (targetDialog) {
        openModal(targetDialog, closeButton)
        return
      }
      const section = targetId ? document.getElementById(targetId) : null
      if (section) closeAndScrollTo(section)
      else closeModal()
      return
    }

    const hashLink = target?.closest<HTMLAnchorElement>('a[href^="#"]')
    if (hashLink) {
      const targetDialog = getDialog(hashTarget(hashLink.getAttribute('href')))
      if (targetDialog) {
        event.preventDefault()
        openModal(targetDialog, hashLink)
      }
    }
  })

  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null
    const isActivationKey = event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar'
    if (
      isActivationKey &&
      target?.matches('[data-modal-open]') &&
      !target.matches(NATIVE_ACTIVATION_SELECTOR)
    ) {
      event.preventDefault()
      openFromTrigger(target)
      return
    }

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

  const initialHash = hashTarget(window.location.hash)
  const initialDialog = getDialog(initialHash)
  if (initialDialog) openModal(initialDialog, null)

  // A page-load hash naming a section: the browser jumps before the lazy
  // images above it load, which leaves the page short. Load those images,
  // then scroll there again once the page has settled (below the nav).
  const initialSection = !initialDialog && initialHash ? document.getElementById(initialHash) : null
  if (initialSection) {
    const imagesAbove = Array.from(document.images).filter(
      (image) => image.compareDocumentPosition(initialSection) & Node.DOCUMENT_POSITION_FOLLOWING,
    )
    imagesAbove.forEach((image) => {
      image.loading = 'eager'
    })
    const imagesLoaded = Promise.all(
      imagesAbove
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true })
              image.addEventListener('error', () => resolve(), { once: true })
            }),
        ),
    )
    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })
    const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, HASH_SCROLL_TIMEOUT))
    Promise.race([Promise.all([imagesLoaded, pageLoaded]), timeout]).then(() => {
      ScrollTrigger.refresh()
      smoothScroll.scrollTo(initialSection)
    })
  }

  // Back/forward or a typed hash that names a dialog opens it.
  window.addEventListener('hashchange', () => {
    const dialog = getDialog(hashTarget(window.location.hash))
    if (dialog) openModal(dialog, null)
  })
}
