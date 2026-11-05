// Screenshot each top-level section of a live page at 390px.
// Usage: node scripts/visual/live-sections.mjs <url> <out-dir>
import { chromium } from '@playwright/test'
import fs from 'node:fs'

const [url, out] = process.argv.slice(2)
fs.mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto(`${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`, { waitUntil: 'load' })

// Scroll through once so reveals and lazy images settle.
const pageHeight = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < pageHeight; y += 400) {
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForTimeout(120)
}
await page.waitForTimeout(800)

// Measure in document coordinates and clip a full-page capture, so smooth
// scroll (Lenis) and the fixed nav do not shift element screenshots.
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)
const boxes = await page.$$eval('main.main-wrapper > *', (sections) =>
  sections.map((section) => {
    const rect = section.getBoundingClientRect()
    return { top: rect.top + window.scrollY, height: rect.height, name: (section.className || 'el').split(' ')[0].slice(0, 40) }
  }),
)
let index = 0
for (const box of boxes) {
  if (box.height < 2) continue
  const name = box.name
  const file = `${out}/${String(index).padStart(2, '0')}-${name}.jpg`
  await page.screenshot({ path: file, quality: 70, type: 'jpeg', fullPage: true, clip: { x: 0, y: box.top, width: 390, height: box.height } })
  console.log(String(index).padStart(2, "0"), Math.round(box.height), name)
  index++
}
await browser.close()
