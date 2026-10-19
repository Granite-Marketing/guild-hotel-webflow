// Screenshots each preview instance at 1440 and 390 wide.
// Run from the repo root: node docs/figma/build-plans/Q018/screenshot.mjs
import { chromium } from '@playwright/test'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch()
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(pathToFileURL(join(planDir, 'preview.html')).href)
  await page.evaluate(() => document.fonts.ready)
  for (const id of ['base', 'base-feature-title', 'base-heading-only', 'base-no-heading']) {
    await page.locator(`#${id} > section`).screenshot({ path: join(planDir, `preview-${id}-${width}.png`) })
  }
  await page.close()
}
await browser.close()
