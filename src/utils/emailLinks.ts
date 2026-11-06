/**
 * Email links (desktop feedback F112, /press)
 *
 * A form section detail whose whole text is an email address (the press
 * enquiries address) becomes a mailto link, underlined by
 * docs/reference/site-head/press.css. The Designer binds that text to a
 * component prop, which cannot hold a link per instance.
 */

// Press variant of form-split-script-contact; other forms keep plain text (signed off).
const PRESS_FORM = '.section_form-split-script-contact.w-variant-69366689-4811-652d-211d-fe0e9582a917'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const emailLinks = () => {
  document
    .querySelectorAll<HTMLElement>(`${PRESS_FORM} p, ${PRESS_FORM} div`)
    .forEach((element) => {
      const address = element.textContent?.trim() ?? ''
      if (element.children.length || !EMAIL.test(address)) return
      const link = document.createElement('a')
      link.href = `mailto:${address}`
      link.textContent = address
      link.dataset.emailLink = ''
      element.replaceChildren(link)
    })
}
