// Screenshots each preview section at 1440 and 390 wide.
// Run: node docs/figma/build-plans/Q022/shoot.mjs
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const directory = path.dirname(fileURLToPath(import.meta.url))
const targets = JSON.parse(fs.readFileSync(path.join(directory, 'preview-targets.json'), 'utf8'))
const browser = await chromium.launch()
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(pathToFileURL(path.join(directory, 'preview.html')).href)
  for (const target of targets) {
    await page.locator(`#${target.id}`).screenshot({ path: path.join(directory, `preview-${target.id}-${width}.png`) })
  }
  await page.close()
}
await browser.close()
console.log(`Captured ${targets.length * 2} screenshots`)
