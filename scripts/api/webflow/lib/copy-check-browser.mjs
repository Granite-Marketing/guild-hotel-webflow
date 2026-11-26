// Headless page loading and text extraction for the copy check. Read only: every call is a page load (GET).
// Same load approach as the catalogue crawl (scripts/api/webflow/catalogue.mjs): load, wait for network idle,
// scroll the page so lazy content renders, then read the DOM. 1440x900 viewport, chromium headless.

export const VIEWPORT = { width: 1440, height: 900 }

export async function openBrowser() {
  const { chromium } = await import('@playwright/test')
  return chromium.launch({ headless: true })
}

// Runs inside the page. Returns every element that carries text of its own (headings, paragraphs, links, list
// items, buttons and any element with a direct text node), in DOM order. textContent is used, not innerText,
// so the CSS text-transform never changes what is compared.
export function collectTextElementsInPage() {
  const collapse = (text) => (text || '').replace(/\s+/g, ' ').trim()
  const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'PATH', 'HEAD'])
  const textTags = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'LI', 'BUTTON', 'SPAN', 'LABEL', 'BLOCKQUOTE', 'FIGCAPTION', 'DT', 'DD'])
  const hasOwnText = (element) => [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim() !== '')
  const found = []
  for (const element of document.body.querySelectorAll('*')) {
    if (skipTags.has(element.tagName.toUpperCase()) || element.closest('svg, script, style, noscript, template')) continue
    if (!textTags.has(element.tagName) && !hasOwnText(element)) continue
    const textContent = collapse(element.textContent)
    if (textContent === '' || textContent === 'BESbswy') continue // BESbswy is the font loader probe
    let section = null
    let swiperClone = false
    for (let ancestor = element; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
      if (ancestor.classList.contains('swiper-slide-duplicate')) swiperClone = true
      if (!section) section = [...ancestor.classList].find((className) => className.startsWith('section_')) || null
    }
    found.push({ order: found.length, tag: element.tagName.toLowerCase(), id: element.id || null, textContent, classes: [...element.classList], section, swiperClone })
  }
  return found
}

export async function loadPageElements(browser, url) {
  const context = await browser.newContext({ viewport: VIEWPORT })
  try {
    const page = await context.newPage()
    const response = await page.goto(url, { waitUntil: 'load', timeout: 45000 })
    const httpStatus = response?.status() ?? null
    if (httpStatus !== null && httpStatus >= 400) return { status: 'failed', error: `HTTP ${httpStatus}`, httpStatus }
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {})
    await page.evaluate(async () => {
      const step = Math.max(300, innerHeight * 0.8)
      for (let offset = 0; offset < document.documentElement.scrollHeight + step; offset += step) {
        scrollTo(0, offset)
        await new Promise((resolve) => setTimeout(resolve, 80))
      }
      scrollTo(0, 0)
    })
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(500)
    return { status: 'ok', httpStatus, elements: await page.evaluate(collectTextElementsInPage) }
  } catch (error) {
    return { status: 'failed', error: String(error.message).split('\n')[0].slice(0, 200) }
  } finally {
    await context.close()
  }
}
