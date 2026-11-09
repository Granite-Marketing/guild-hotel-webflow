/**
 * Underline hover (animation feedback, Trello Desktop-CTA-UnderlineText)
 *
 * Every link drawn with an underline gets [data-underline] on the element
 * that carries the line: the roll label of a [data-btn] link, or the link
 * itself. CSS (docs/reference/site-head/underline-hover.css) swaps the text
 * decoration for a 1px background line that, on hover, wipes out to the
 * right and then draws back in from the left. Runs after buttonHover so the
 * roll labels exist.
 */

const isUnderlined = (element: Element) =>
  getComputedStyle(element).textDecorationLine.includes('underline')

export const underlineHover = () => {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[href]')
  if (!links.length) return

  links.forEach((link) => {
    const label = link.querySelector<HTMLElement>('[data-btn-label]')
    const underlined = isUnderlined(link) || (label && Array.from(label.children).some(isUnderlined))
    if (!underlined) return
    ;(label ?? link).dataset.underline = ''
  })
}
