/**
 * Placeholder links (desktop feedback F97, Neighborhood "beyond downtown")
 *
 * The Beyond Downtown image cards are links with href "#" until their
 * targets exist. A bare "#" would jump the page to the top, so clicks on
 * these links do nothing for now. Cards that also open a dialog
 * (`[data-modal-open]` on the figure) still open it: modals() handles the
 * same click on the bubbling figure.
 */

const PLACEHOLDER_LINK = 'a.timeline-scatter-images_link[href="#"]'

export const placeholderLinks = () => {
  if (!document.querySelector(PLACEHOLDER_LINK)) return
  document.addEventListener('click', (event) => {
    if ((event.target as Element | null)?.closest(PLACEHOLDER_LINK)) event.preventDefault()
  })
}
