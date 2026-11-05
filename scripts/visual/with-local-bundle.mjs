// Open a staging page with the jsDelivr bundle swapped for local dist/index.js,
// so a code change can be checked before it is released.
// Usage: import { openWithLocalBundle } from './with-local-bundle.mjs'
import fs from 'node:fs'

export const openWithLocalBundle = async (browser, path, viewport = { width: 390, height: 844 }) => {
  const page = await browser.newPage({ viewport })
  const bundle = fs.readFileSync(new URL('../../dist/index.js', import.meta.url), 'utf8')
  await page.route(/cdn\.jsdelivr\.net\/gh\/Granite-Marketing\/guild-hotel-webflow@[^/]+\/dist\/index\.js/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: bundle }),
  )
  await page.goto(`https://the-guild-hotel-c34e71.webflow.io${path}?v=${Date.now()}`, { waitUntil: 'load' })
  await page.waitForTimeout(1500)
  return page
}
