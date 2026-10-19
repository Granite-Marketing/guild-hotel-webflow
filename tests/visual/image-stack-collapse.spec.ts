import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * imageStackCollapse: the three images reach the stacked end state on
 * scroll, and reduced motion shows the stack with no animation.
 *
 * Serves the repo root with esbuild (fixture entry built in memory), so it
 * needs no Webflow site. GSAP loads from jsDelivr, so this needs network.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/image-stack-collapse.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/image-stack-collapse.ts'],
    bundle: true,
    outdir: 'tests/visual/fixtures',
    logLevel: 'silent',
  })
  const server = await context.serve({ servedir: '.', host: '127.0.0.1' })
  origin = `http://127.0.0.1:${server.port}`
})

test.afterAll(async () => {
  await context.dispose()
})

/** Horizontal distance of each item's centre from the anchor's centre. */
const centreOffsets = (page: Page) =>
  page.$$eval('[data-image-stack-collapse-item]', (items) => {
    const centre = (element: Element) => {
      const rect = element.getBoundingClientRect()
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    }
    const anchor = centre(items.find((item) => item.getAttribute('data-image-stack-collapse-item') === 'anchor')!)
    return items.map((item) => {
      const point = centre(item)
      return Math.round(Math.hypot(point.x - anchor.x, point.y - anchor.y))
    })
  })

const scrollStackToCentre = (page: Page) =>
  page.evaluate(() => {
    const stack = document.querySelector('[data-image-stack-collapse]')!
    const rect = stack.getBoundingClientRect()
    window.scrollTo(0, window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2 + 200)
  })

test('image stack collapse reaches the stacked end state on scroll', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'networkidle' })

  const start = await centreOffsets(page)
  expect(Math.max(...start)).toBeGreaterThan(300)

  await scrollStackToCentre(page)
  await expect.poll(() => centreOffsets(page)).toEqual([0, 0, 0])

  const anchorIsOnTop = await page.$eval('[data-image-stack-collapse]', (stack) => {
    const rect = stack.querySelector('[data-image-stack-collapse-item="anchor"]')!.getBoundingClientRect()
    const topElement = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
    return topElement?.closest('[data-image-stack-collapse-item]')?.getAttribute('data-image-stack-collapse-item')
  })
  expect(anchorIsOnTop).toBe('anchor')

  // Viewport shot: an element screenshot would scroll and so un-scrub the stack.
  await page.screenshot({ path: 'test-results/image-stack-collapse-end.png' })

  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(async () => Math.max(...(await centreOffsets(page)))).toBeGreaterThan(300)
})

test('image stack collapse shows the stack with no animation under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'networkidle' })

  expect(await centreOffsets(page)).toEqual([0, 0, 0])

  await page.setViewportSize({ width: 900, height: 900 })
  await expect.poll(() => centreOffsets(page)).toEqual([0, 0, 0])
})
