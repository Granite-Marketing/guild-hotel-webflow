// Headless check: waiting image-fade photos carry no will-change; revealed ones fade, settle and hover-zoom.
// Usage: node scripts/check-image-fade-layers.mjs [--bundle dist/index.js] [--base https://the-guild-hotel-c34e71.webflow.io]
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'

const opt = (name, fallback) => {
  const index = process.argv.indexOf(name)
  return index > -1 ? process.argv[index + 1] : fallback
}
const bundle = opt('--bundle', null)
const base = opt('--base', 'https://the-guild-hotel-c34e71.webflow.io')
const pages = ['/rooms/guild-double', '/', '/meetings', '/history', '/legal-corporate/corporate']
const viewports = [{ width: 1440, height: 900 }, { width: 390, height: 844 }]

// Fade media: an img/video still at the 1.04 start scale, or one that has been revealed (data-fade-seen).
const census = () => {
  const media = [...document.querySelectorAll('img, video')]
  const waiting = media.filter((m) => /1\.04/.test(m.style.transform))
  return {
    waiting: waiting.length,
    waitingWithWillChange: waiting.filter((m) => m.style.willChange === 'transform').length,
    waiting3d: waiting.filter((m) => /3d/.test(m.style.transform)).length,
    allWillChange: media.filter((m) => m.style.willChange === 'transform').length,
  }
}

const browser = await chromium.launch({ headless: true })
let failed = false
for (const viewport of viewports) {
  for (const path of pages) {
    const page = await browser.newPage({ viewport })
    const errors = []
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
    page.on('pageerror', (error) => errors.push(String(error)))
    if (bundle) {
      const body = readFileSync(bundle)
      await page.route(/guild-hotel-webflow@[^/]+\/dist\/index\.js/, (route) => route.fulfill({ body, contentType: 'application/javascript' }))
    }
    await page.goto(base + path, { waitUntil: 'load', timeout: 90000 })
    await page.waitForTimeout(2500)
    const atLoad = await page.evaluate(census)
    // Scroll the first waiting photo into view and watch it reveal.
    const target = await page.evaluateHandle(() => [...document.querySelectorAll('img, video')].find((m) => /1\.04/.test(m.style.transform)) || null)
    let reveal = null
    if (await target.evaluate((t) => !!t)) {
      await target.evaluate((t) => t.scrollIntoView({ block: 'center' }))
      await page.waitForTimeout(250)
      const during = await target.evaluate((t) => ({ willChange: t.style.willChange, transform: getComputedStyle(t).transform }))
      await page.waitForTimeout(2000)
      const after = await target.evaluate((t) => {
        const box = t.getBoundingClientRect()
        let node = t, opacity = 1
        while (node && node !== document.body) { opacity *= Number(getComputedStyle(node).opacity); node = node.parentElement }
        return { willChange: t.style.willChange, transform: getComputedStyle(t).transform, opacity, hoverable: !!t.closest('[data-hover-scale]') || t.hasAttribute('data-hover-scale'), x: box.x + box.width / 2, y: box.y + box.height / 2 }
      })
      let hover = null
      if (after.hoverable && viewport.width > 991) {
        await page.mouse.move(after.x, after.y)
        await page.waitForTimeout(900)
        hover = await target.evaluate((t) => getComputedStyle(t.closest('[data-hover-scale]') || t).transform)
      }
      reveal = { during, after, hover }
    }
    const ok = atLoad.waitingWithWillChange === 0 && atLoad.waiting3d === 0 && (!reveal || (reveal.after.opacity > 0.99 && reveal.after.transform === 'none' && reveal.during.willChange === 'transform')) && errors.length === 0
    if (!ok) failed = true
    console.log(JSON.stringify({ viewport: `${viewport.width}x${viewport.height}`, path, ok, atLoad, reveal, errors }))
    await page.close()
  }
}
await browser.close()
process.exit(failed ? 1 : 0)
