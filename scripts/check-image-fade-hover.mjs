// Headless check: CSS hover zooms still apply to image-fade photos after their reveal.
// Usage: node scripts/check-image-fade-hover.mjs [dist/index.js | -] [base]
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'
const bundle = process.argv[2]
const base = process.argv[3] || 'https://the-guild-hotel-c34e71.webflow.io'
const sel = '.article-card-staggered_item.is-link .u-image, .split-card-pair-captioned_image, #beyond-downtown .timeline-scatter-images_image'
const browser = await chromium.launch({ headless: true })
for (const path of ['/', '/history', '/neighborhood', '/blog', '/happenings', '/meetings', '/rooms/guild-double']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []; page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  if (bundle && bundle !== '-') { const body = readFileSync(bundle); await page.route(/guild-hotel-webflow@[^/]+\/dist\/index\.js/, (r) => r.fulfill({ body, contentType: 'application/javascript' })) }
  await page.goto(base + path, { waitUntil: 'load', timeout: 90000 }); await page.waitForTimeout(2000)
  const n = await page.evaluate((sel) => { const list = [...document.querySelectorAll(sel)].filter((m) => /1\.04/.test(m.style.transform)); window.__m = list[0]; return { fading: list.length, willChange: list.filter((m) => m.style.willChange).length } }, sel)
  let res = null
  if (n.fading) {
    await page.evaluate(() => window.__m.scrollIntoView({ block: 'center' })); await page.waitForTimeout(2200)
    const box = await page.evaluate(() => { const b = window.__m.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, settled: getComputedStyle(window.__m).transform } })
    await page.mouse.move(box.x, box.y); await page.waitForTimeout(1200)
    const hovered = await page.evaluate(() => getComputedStyle(window.__m).transform)
    await page.mouse.move(2, 2); await page.waitForTimeout(1200)
    const left = await page.evaluate(() => getComputedStyle(window.__m).transform)
    res = { settled: box.settled, hovered, left }
  }
  console.log(path, JSON.stringify(n), JSON.stringify(res), errors.length ? errors : '')
  await page.close()
}
await browser.close()
