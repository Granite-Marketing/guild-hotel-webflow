/**
 * Button hover (feedback F34)
 *
 * Wraps each button label in two stacked spans so CSS (site head block, see
 * docs/reference/site-scripts.md) can fill the background from the bottom and
 * roll the label up while a copy rolls in. The module adds attributes only:
 *   [data-btn]        on the button (anchor, p, div): enables the fill layer
 *   [data-btn-fill]   on input[type=submit]: fill only (inputs cannot hold spans)
 *   [data-btn-label]  wrapper around the label, holding the real label span
 *                     and an aria-hidden copy span ([data-btn-copy])
 * No class toggling, so navTheme's class MutationObserver is unaffected.
 * Opt out per element with data-btn-hover="off".
 */
const BUTTON_SELECTOR = [
  '.button',
  '.offers-slider-split_button',
  '.overlay-detail-panel-modal_button',
  '.overlay-detail-panel-modal_item-button:not([class*="w-variant-0e56f707"])',
].join(',')

const isSubmitInput = (element: HTMLElement): element is HTMLInputElement =>
  element instanceof HTMLInputElement && ['submit', 'button'].includes(element.type)

const hasText = (node: ChildNode) => node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim()

const buildLabel = (text: string) => {
  const label = document.createElement('span')
  label.dataset.btnLabel = ''
  const main = document.createElement('span')
  main.textContent = text
  const copy = document.createElement('span')
  copy.textContent = text
  copy.dataset.btnCopy = ''
  copy.setAttribute('aria-hidden', 'true')
  label.append(main, copy)
  return label
}

const enhance = (button: HTMLElement) => {
  if (button.dataset.btnHover === 'off') return
  if (button.hasAttribute('data-btn') || button.hasAttribute('data-btn-fill')) return
  if (isSubmitInput(button)) {
    button.dataset.btnFill = ''
    return
  }
  // Label host: the button itself, or its single text-only child (div.text-style-button).
  const ownText = Array.from(button.childNodes).some(hasText)
  const onlyChild = button.children.length === 1 ? (button.children[0] as HTMLElement) : null
  const host =
    !ownText && onlyChild && !onlyChild.children.length && onlyChild.textContent?.trim()
      ? onlyChild
      : button
  const textNodes = Array.from(host.childNodes).filter(hasText)
  if (!textNodes.length) return // icon-only button
  textNodes.forEach((node) =>
    node.replaceWith(buildLabel((node.textContent ?? '').replace(/\s+/g, ' ').trim())),
  )
  button.dataset.btn = ''
}

const enhanceWithin = (root: ParentNode) => {
  if (root instanceof HTMLElement && root.matches(BUTTON_SELECTOR)) enhance(root)
  root.querySelectorAll<HTMLElement>(BUTTON_SELECTOR).forEach(enhance)
}

export const buttonHover = () => {
  const buttons = document.querySelectorAll<HTMLElement>(BUTTON_SELECTOR)
  if (!buttons.length) return
  buttons.forEach(enhance)
  // Buttons inserted later (modals, CMS nest, Swiper clones made after init).
  new MutationObserver((records) =>
    records.forEach((record) =>
      record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) enhanceWithin(node)
      }),
    ),
  ).observe(document.body, { childList: true, subtree: true })
}
