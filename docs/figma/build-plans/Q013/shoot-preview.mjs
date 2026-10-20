// Screenshots preview.html at 1440 and 390 wide into this folder (K01 follow-up).
// Run from the repo root after regenerating the preview: node docs/figma/build-plans/Q013/shoot-preview.mjs
import { chromium } from '@playwright/test'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
// [file slug, selector of the element to capture]
const targets = [['base', 'section']]

const browser = await chromium.launch()
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(pathToFileURL(join(planDir, 'preview.html')).href)
  await page.waitForLoadState('networkidle')
  for (const [slug, selector] of targets) {
    const file = `preview-${slug}-${width}.png`
    await page.locator(selector).first().screenshot({ path: join(planDir, file) })
    console.log('shot', file)
  }
  await page.close()
}
await browser.close()
