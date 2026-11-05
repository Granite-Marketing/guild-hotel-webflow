// Print text, image and button boxes inside each top-level section of a live
// page at 390px, relative to the section top, with the section's padding.
// Usage: node scripts/visual/live-boxes.mjs <url> [section-index]
import { chromium } from '@playwright/test'

const [url, only] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto(`${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`, { waitUntil: 'load' })
const pageHeight = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < pageHeight; y += 400) {
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForTimeout(100)
}
await page.waitForTimeout(800)

const report = await page.evaluate((only) => {
  const sections = [...document.querySelectorAll('main.main-wrapper > *')].filter((s) => s.getBoundingClientRect().height >= 2)
  const lines = []
  sections.forEach((section, index) => {
    if (only !== undefined && String(index) !== only) return
    const box = section.getBoundingClientRect()
    const padded = [section, ...section.querySelectorAll('*')].find((el) => parseFloat(getComputedStyle(el).paddingTop) > 0)
    const cs = padded ? getComputedStyle(padded) : null
    lines.push(`## ${index} ${section.className} h${Math.round(box.height)} pad ${cs?.paddingTop}/${cs?.paddingBottom} on .${padded?.className.split(' ').join('.')}`)
    const leaves = [...section.querySelectorAll('h1,h2,h3,h4,h5,h6,p,img,a,button,[class*="eyebrow"],[class*="counter"]')]
    for (const el of leaves) {
      const r = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      if (r.height < 2 || style.visibility === 'hidden' || style.display === 'none') continue
      if (el.tagName === 'A' && el.querySelector('img')) continue
      const text = (el.tagName === 'IMG' ? 'img ' + (el.alt || '') : el.textContent).trim().replace(/\s+/g, ' ').slice(0, 50)
      const range = document.createRange()
      range.selectNodeContents(el)
      const lineCount = el.tagName === 'IMG' ? 0 : new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size
      lines.push(`${String(Math.round(r.top - box.top)).padStart(5)} -> ${String(Math.round(r.bottom - box.top)).padStart(5)}  x${String(Math.round(r.left)).padStart(4)} w${String(Math.round(r.width)).padStart(4)} ${style.fontSize}/${style.lineHeight} L${lineCount}  ${el.tagName} .${el.className.split(' ')[0]}  ${text}`)
    }
  })
  return lines.join('\n')
}, only)
console.log(report)
await browser.close()
