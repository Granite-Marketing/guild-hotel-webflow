/**
 * Underline hover (animation feedback, Trello Desktop-CTA-UnderlineText)
 *
 * Every link drawn with an underline gets its text wrapped in an inline
 * span[data-underline] that carries the line (inside the roll label's text
 * for a [data-btn] link); the old underline's element gets
 * [data-underline-host]. CSS (docs/reference/site-head/underline-hover.css) swaps the text
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
    // The line sits on an inline wrapper round the text, so it follows the
    // font's own baseline whatever padding, line height or flex the link has.
    const host = label?.querySelector<HTMLElement>(':scope > :not([data-btn-copy])') ?? link
    host.dataset.underlineHost = ''
    const line = document.createElement('span')
    line.dataset.underline = ''
    line.append(...Array.from(host.childNodes))
    host.append(line)
  })
}
