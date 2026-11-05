// Viewport screenshots at fixed scroll steps, for pinned or scroll-driven sections.
// Usage: node scripts/visual/live-scroll.mjs <url> <out-dir> <from> <to> <step>
import { chromium } from '@playwright/test'
const [url, out, from, to, step] = process.argv.slice(2)
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: { width: 390, height: 844 } })
await p.goto(url + '?v=' + Date.now(), { waitUntil: 'load' })
for (let y = +from; y <= +to; y += +step) {
  await p.mouse.wheel(0, 0)
  await p.evaluate((t) => window.scrollTo(0, t), y)
  await p.waitForTimeout(900)
  await p.screenshot({ path: `${out}/s-${String(y).padStart(5, '0')}.jpg`, quality: 60, type: 'jpeg' })
}
await b.close()
