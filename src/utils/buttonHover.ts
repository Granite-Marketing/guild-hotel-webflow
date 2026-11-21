/**
 * Button hover (feedback F34)
 *
 * Wraps each button label in two stacked spans so the button system CSS
 * (docs/reference/site-head/button-system.css, embed in Site Nav) can roll the
 * label up while a copy rolls in. The fill and outline need no
 * script. The module adds attributes only:
 *   [data-btn]        on the button (anchor, p, div): enables the label roll
 *   [data-btn-fill]   on input[type=submit]: marker only (inputs cannot hold spans)
 *   [data-btn-label]  wrapper around the label, holding the real label span
 *                     and an aria-hidden copy span ([data-btn-copy])
 *   [data-btn-art]    on chamfer buttons: an inline svg.btn-art draws the fill and
 *                     the 1px outline. Inline SVG is pixel-snapped like the box, so
 *                     diagonals match the straight edges; the CSS ring was soft and
 *                     lost corners at half-pixel positions (#190).
 * No class toggling, so navTheme's class MutationObserver is unaffected.
 * Opt out per element with data-btn-hover="off".
 */
const BUTTON_SELECTOR = [
  '.button',
  '.overlay-detail-panel-modal_item-button:not([class*="w-variant-0e56f707"],.is-booking)',
].join(',')

const CHAMFER_SELECTOR =
  '.button.is-chamfer, .overlay-detail-panel-modal_item-button:not([class*="w-variant-0e56f707"],.is-booking,[class*="603a80753681"])'
const SVG_NS = 'http://www.w3.org/2000/svg'

/** Octagon inset by `inset` px on every side, diagonals kept parallel to the chamfer. */
export const chamferPoints = (width: number, height: number, cornerX: number, cornerY: number, inset: number) => {
  const diagonal = Math.hypot(cornerX, cornerY)
  const alongY = cornerY + (inset * (diagonal - cornerY)) / cornerX
  const alongX = cornerX + (inset * (diagonal - cornerX)) / cornerY
  return [
    [inset, alongY], [alongX, inset], [width - alongX, inset], [width - inset, alongY],
    [width - inset, height - alongY], [width - alongX, height - inset], [alongX, height - inset], [inset, height - alongY],
  ]
}

/** --cx / --cy are rem (fixed corners) or % of the box (outline buttons). */
const toPixels = (value: string, full: number) => {
  const number = parseFloat(value)
  if (value.trim().endsWith('%')) return (number * full) / 100
  if (value.trim().endsWith('rem')) return number * parseFloat(getComputedStyle(document.documentElement).fontSize)
  return number
}

const artObserver = new ResizeObserver((entries) =>
  entries.forEach((entry) => {
    const box = entry.borderBoxSize?.[0]
    const width = box ? box.inlineSize : entry.contentRect.width
    const height = box ? box.blockSize : entry.contentRect.height
    const button = entry.target as HTMLElement
    const art = button.querySelector<SVGSVGElement>(':scope > .btn-art')
    if (!art || !width || !height) return
    const style = getComputedStyle(button)
    const half = (parseFloat(style.getPropertyValue('--btn-outline-width')) || 1) / 2
    const points = chamferPoints(width, height, toPixels(style.getPropertyValue('--cx'), width), toPixels(style.getPropertyValue('--cy'), height), half)
      .map((point) => point.map((n) => +n.toFixed(3)).join(','))
      .join(' ')
    art.setAttribute('viewBox', `0 0 ${width} ${height}`)
    art.querySelectorAll('polygon').forEach((polygon) => polygon.setAttribute('points', points))
  }),
)

const drawArt = (button: HTMLElement) => {
  if (!button.matches(CHAMFER_SELECTOR)) return
  // Swiper clones arrive with the svg already inside; reuse it.
  if (!button.querySelector(':scope > .btn-art')) {
    const art = document.createElementNS(SVG_NS, 'svg')
    art.setAttribute('class', 'btn-art')
    art.setAttribute('aria-hidden', 'true')
    art.setAttribute('focusable', 'false')
    art.setAttribute('preserveAspectRatio', 'none')
    ;['fill', 'ring'].forEach((name) => {
      const polygon = art.appendChild(document.createElementNS(SVG_NS, 'polygon'))
      polygon.setAttribute('class', name)
    })
    button.prepend(art)
  }
  button.dataset.btnArt = ''
  artObserver.observe(button)
}

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
  // Submit inputs cannot hold children; they stay filled, so the CSS ring never shows.
  if (isSubmitInput(button)) {
    button.dataset.btnFill = ''
    return
  }
  if (!button.hasAttribute('data-btn')) labelRoll(button)
  drawArt(button) // after the label (the svg would count as a child); idempotent, so Swiper clones get observed too
}

const labelRoll = (button: HTMLElement) => {
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
