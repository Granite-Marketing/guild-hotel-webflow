// Screenshots each preview case at 1440 and 390 wide.
// Run: node docs/figma/build-plans/Q025/capture-preview.mjs
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const planDirectory = dirname(fileURLToPath(import.meta.url))
const previewUrl = pathToFileURL(join(planDirectory, 'preview.html')).href
const caseIds = ['base', 'is-right', 'sequence', 'is-tall']
const viewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]

const browser = await chromium.launch()
for (const viewport of viewports) {
  const page = await browser.newPage({ viewport })
  await page.goto(previewUrl)
  for (const caseId of caseIds) {
    const outputPath = join(planDirectory, `preview-${caseId}-${viewport.width}.png`)
    await page.locator(`#case-${caseId}`).screenshot({ path: outputPath })
    console.log(`Wrote ${outputPath}`)
  }
  await page.close()
}
await browser.close()
