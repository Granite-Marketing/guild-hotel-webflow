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

export const modalTextMask = () => {
  const dialogs = document.querySelectorAll<HTMLElement>(
    '[role="dialog"][data-modal-reveal], [data-modal-reveal] [role="dialog"]',
  )
  if (!dialogs.length) return

  dialogs.forEach((dialog) => {
    const panel = dialog.querySelector<HTMLElement>('[class*="_panel"]') ?? dialog
    // Venue rows use their own button class, which the line mask does not pick up by default.
    panel
      .querySelectorAll<HTMLElement>('.overlay-detail-panel-modal_item-button')
      .forEach((button) => (button.dataset.lineMask = ''))
    const reveal = createLineMaskTimeline(panel)
    new MutationObserver(() =>
      dialog.classList.contains('is-open') ? reveal.play() : reveal.reverse(),
    ).observe(dialog, { attributes: true, attributeFilter: ['class'] })
  })
}
