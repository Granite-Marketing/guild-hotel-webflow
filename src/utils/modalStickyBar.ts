/**
 * Modal Sticky Bar (desktop feedback F91, F92, Meetings)
 *
 * Venue detail modals (the ones with layout options) keep their top row,
 * back arrow, title and "submit your request", pinned while the panel
 * scrolls (ACC style). The Designer places the arrow in an absolute bar and
 * the CTA in an absolute footer inside the content column, so this moves
 * all three into one row that is a direct child of the panel; CSS in
 * docs/reference/site-head/modal-sticky-bar.css makes it sticky, with the
 * CTA inset from the right by the same 24px the arrow has on the left.
 *
 * Desktop only (768px and up): phones were signed off with their own layout.
 * shortcut: decided once at load, so a resize across 768px keeps the first state.
 */

const DIALOG_SELECTOR = '[role="dialog"]:has(.overlay-detail-panel-modal_extras)'

export const modalStickyBar = () => {
  if (!window.matchMedia('(min-width: 768px)').matches) return
  document.querySelectorAll<HTMLElement>(DIALOG_SELECTOR).forEach((dialog) => {
    const panel = dialog.querySelector<HTMLElement>('.overlay-detail-panel-modal_panel')
    const header = dialog.querySelector<HTMLElement>('.overlay-detail-panel-modal_header')
    const back = dialog.querySelector<HTMLElement>('.overlay-detail-panel-modal_back')
    const footer = dialog.querySelector<HTMLElement>('.overlay-detail-panel-modal_footer')
    if (!panel || !header || !back || !footer) return
    header.classList.add('is-sticky-bar')
    header.prepend(back)
    header.append(footer)
    panel.prepend(header)
  })
}
