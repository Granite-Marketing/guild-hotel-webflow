// Screenshots each variant of preview.html at 1440 and 390 wide.
// Usage: node docs/figma/build-plans/Q019/shoot-preview.mjs
import { chromium } from '@playwright/test'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const url = pathToFileURL(join(planDir, 'preview.html')).href
const variants = ['base', 'is-image-bg', 'is-centered']

const browser = await chromium.launch()
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(url, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  for (const variant of variants) {
    const section = page.locator(`#variant-${variant} section`)
    await section.screenshot({ path: join(planDir, `preview-${variant}-${width}.png`) })
  }
  await page.close()
}
await browser.close()
console.log('Wrote 6 screenshots')
