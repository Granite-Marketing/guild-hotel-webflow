// Headless page loading for the heading check. Read only: every call is a page load (GET).
// Reuses the copy check's load, scroll and wait routine; only the in-page collector differs.
import { loadPageElements } from './copy-check-browser.mjs'

// Runs inside the page. Returns, in DOM order: every heading (h1 to h6), paragraph and image with alt text, plus
// any other element that carries text of its own and sits outside a heading or paragraph. A heading with no text
// but an image takes the image's alt text (the wrapped logo case) and is marked hasImage. textContent is used,
// so CSS text-transform never changes what is compared.
export function collectHeadingElementsInPage() {
  const collapse = (text) => (text || '').replace(/\s+/g, ' ').trim()
  const skipSelector = 'svg, script, style, noscript, template, head'
  const found = []
  for (const element of document.body.querySelectorAll('*')) {
    if (element.closest(skipSelector)) continue
    const tag = element.tagName.toLowerCase()
    const isHeading = /^h[1-6]$/.test(tag)
    const insideTextBlock = Boolean(element.parentElement?.closest('h1, h2, h3, h4, h5, h6, p'))
    let text = ''
    let hasImage = false
    if (isHeading || tag === 'p') {
      if (insideTextBlock) continue
      text = collapse(element.textContent)
      const image = element.querySelector('img[alt]')
      if (image) {
        hasImage = true
        if (text === '') text = collapse(image.getAttribute('alt'))
      }
    } else if (tag === 'img') {
      if (insideTextBlock) continue
      text = collapse(element.getAttribute('alt'))
    } else {
      if (insideTextBlock) continue
      const ownText = [...element.childNodes].filter((node) => node.nodeType === 3).map((node) => node.textContent).join(' ')
      text = collapse(ownText)
    }
    if (text === '' || text === 'BESbswy') continue // BESbswy is the font loader probe
    let section = null
    let swiperClone = false
    for (let ancestor = element; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
      if (ancestor.classList.contains('swiper-slide-duplicate')) swiperClone = true
      if (!section) section = [...ancestor.classList].find((className) => className.startsWith('section_')) || null
    }
    found.push({ order: found.length, tag, text, hasImage, classes: [...element.classList], section, swiperClone })
  }
  return found
}

export const loadHeadingElements = (browser, url) => loadPageElements(browser, url, collectHeadingElementsInPage)
