/**
 * Modal Text Mask (animation feedback, Trello "Offers & Packages")
 *
 * Dialogs with [data-modal-reveal] (on the dialog or a wrapper, e.g. the
 * Booking Menu component root) mask their copy in line by line when they
 * open, like the large hexagon sections, instead of only dissolving; the
 * mask reverses when they close. Watches the `is-open` class that modals.ts
 * toggles, so the dialog contract is unchanged. The panel is the dialog's
 * `[class*="_panel"]` child, or the dialog itself.
 */

import { createLineMaskTimeline } from '$utils/lineMaskReveal'

const BOOK_MENU_SPEED = 2

export const modalTextMask = () => {
  const dialogs = document.querySelectorAll<HTMLElement>(
    '[role="dialog"][data-modal-reveal], [data-modal-reveal] [role="dialog"]',
  )
  if (!dialogs.length) return

  dialogs.forEach((dialog) => {
    const panel = dialog.querySelector<HTMLElement>('[class*="_panel"]') ?? dialog
    // Row buttons and arrows carry data-line-mask in the Designer. The Book menu's
    // first panel opens at twice the speed; its sub-panels (Reserve a table) keep
    // the standard reveal (Stephen 18 Nov).
    const reveal = createLineMaskTimeline(panel, dialog.id === 'book' ? BOOK_MENU_SPEED : 1)
    new MutationObserver(() =>
      dialog.classList.contains('is-open') ? reveal.play() : reveal.reverse(),
    ).observe(dialog, { attributes: true, attributeFilter: ['class'] })
  })
}
