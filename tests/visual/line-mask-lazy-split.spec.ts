import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * Page load and scroll (ticket #176), offline fixture:
 * - the page scrolls from the first wheel input while an image is still
 *   loading (window.load has not fired);
 * - only text in or near the first screen is split up front, the rest is
 *   plain text until it nears the screen (splitting every block at load froze
 *   the main thread for seconds on the real pages);
 * - a block is split before it scrolls into view, and each reveal plays once.
 * Needs the GSAP CDN tags, like the other fixtures.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/line-mask-lazy-split.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/line-mask-lazy-split.ts'],
    bundle: true,
    outdir: 'tests/visual/fixtures',
    tsconfig: 'tsconfig.json',
    logLevel: 'silent',
  })
  const server = await context.serve({ servedir: '.', host: '127.0.0.1' })
  origin = `http://127.0.0.1:${server.port}`
})

test.afterAll(async () => {
  await context?.dispose()
})

/** Holds the image request open, so `window.load` never fires. */
const holdImageOpen = (page: Page) => page.route('**/never-finishes.png', () => undefined)

const isSplit = (page: Page, id: string) =>
  page.locator(`[data-fixture-reveal="${id}"]`).evaluate((element) => element.querySelector('div') !== null)

const splitCount = (page: Page) =>
  page.locator('[data-fixture-reveal]').evaluateAll(
    (elements) => elements.filter((element) => element.querySelector('div') !== null).length,
  )

test('scroll responds from the first wheel input, before the page has loaded', async ({ page }) => {
  await holdImageOpen(page)
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.fixtureReady === true)
  expect(await page.evaluate(() => document.readyState)).not.toBe('complete')

  await page.mouse.move(400, 300)
  await page.mouse.wheel(0, 600)
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 2000 }).toBeGreaterThan(300)
  expect(await page.evaluate(() => document.readyState)).not.toBe('complete')
})

test('only text near the first screen is split at load', async ({ page }) => {
  await holdImageOpen(page)
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.fixtureReady === true)
  await expect.poll(() => isSplit(page, 'hero')).toBe(true)
  // First screen plus one viewport ahead is a handful of blocks, never all 31.
  expect(await splitCount(page)).toBeLessThanOrEqual(6)
  expect(await isSplit(page, 'p30')).toBe(false)
})

test('a block is split before it scrolls into view, and each reveal plays once', async ({ page }) => {
  await holdImageOpen(page)
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.fixtureReady === true)

  const farTop = await page.locator('[data-fixture-reveal="p20"]').evaluate((element) => element.getBoundingClientRect().top + window.scrollY)
  const viewport = page.viewportSize()?.height ?? 900
  // Stop one and a half screens above p20: not in view yet, but close enough to be split.
  await page.evaluate((top) => window.scrollTo(0, top), farTop - viewport * 1.5)
  await expect.poll(() => isSplit(page, 'p20')).toBe(true)
  expect(await page.evaluate(() => window.fixturePlays?.p20)).toBeUndefined()

  await page.evaluate(([top, height]) => window.scrollTo(0, top - height * 0.5), [farTop, viewport])
  await expect.poll(() => page.evaluate(() => window.fixturePlays?.p20)).toBe(1)
  await page.waitForTimeout(1800)
  const hidden = async () =>
    page.locator('[data-fixture-reveal="p20"] div div').evaluateAll(
      (words) => words.filter((word) => getComputedStyle(word).transform.replace(/[^\d.,-]/g, '').split(',').some((part, index) => index === 5 && Math.abs(Number(part)) > 1)).length,
    )
  expect(await hidden()).toBe(0)

  // Away and back: the block stays shown and its reveal does not run again.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.evaluate(([top, height]) => window.scrollTo(0, top - height * 0.5), [farTop, viewport])
  await page.waitForTimeout(600)
  expect(await page.evaluate(() => window.fixturePlays?.p20)).toBe(1)
  expect(await hidden()).toBe(0)
})
