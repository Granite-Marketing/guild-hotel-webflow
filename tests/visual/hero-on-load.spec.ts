import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * M23 (ticket #267), offline fixture running the real scrollReveal and
 * heroImageScale plus the real reveal-prehide.css:
 * - the hero photo is already zoomed and clipped before the bundle runs, so
 *   it never shows at full size first;
 * - the hero copy plays on load with no scroll, even low on a phone screen;
 * - the zoom is scale only (opacity stays 1) and settles to normal;
 * - reduced motion shows copy and photo still;
 * - if the bundle never loads, the CSS fail-safe clears the zoom and shows the copy.
 * Stephen's later words (17 Nov) override the feedback doc: on load, never on scroll.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/hero-on-load.html'
const PREHIDE_CSS = readFileSync('docs/reference/site-head/reveal-prehide.css', 'utf8')

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/hero-on-load.ts'],
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

const open = async (page: Page, query = '') => {
  await page.addInitScript((css) => {
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style')
      style.textContent = css
      document.head.append(style)
    })
  }, PREHIDE_CSS)
  await page.goto(`${origin}${FIXTURE_PATH}${query}`, { waitUntil: 'domcontentloaded' })
}

const imageScale = (page: Page) =>
  page.locator('.hero-fullbleed-centered_image').evaluate((image) => {
    const frame = image.parentElement!.getBoundingClientRect()
    return { ratio: image.getBoundingClientRect().width / frame.width, opacity: Number(getComputedStyle(image).opacity) }
  })

test('the photo is zoomed and clipped before the bundle runs, then settles to 1 with opacity 1', async ({ page }) => {
  await open(page, '?bundle=0')
  const before = await imageScale(page)
  expect(before.ratio).toBeCloseTo(1.12, 2)
  expect(before.opacity).toBe(1)
  expect(await page.locator('.hero-fullbleed-centered_figure').evaluate((frame) => getComputedStyle(frame).overflow)).toBe('hidden')

  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => (window as unknown as { fixtureReady?: boolean }).fixtureReady === true)
  await expect.poll(async () => (await imageScale(page)).ratio, { timeout: 5000 }).toBeCloseTo(1, 2)
  expect((await imageScale(page)).opacity).toBe(1)
})

test('phone: the hero copy plays on load with no scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await open(page)
  await page.waitForFunction(() => (window as unknown as { fixtureReady?: boolean }).fixtureReady === true)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  // The mask has real work to do (some word is parked below its line), then finishes with no scroll.
  const hiddenWords = () =>
    page.locator('[data-test="title"]').evaluate((title) => [...title.querySelectorAll('*')].filter((node) => Number(gsap.getProperty(node, 'yPercent')) !== 0).length)
  await expect.poll(hiddenWords, { timeout: 6000 }).toBe(0)
  await expect.poll(() => page.locator('.hero-fullbleed-centered_component').evaluate((el) => getComputedStyle(el).visibility)).toBe('visible')
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
})

test('reduced motion: copy and photo show still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  await page.waitForFunction(() => (window as unknown as { fixtureReady?: boolean }).fixtureReady === true)
  expect((await imageScale(page)).ratio).toBeCloseTo(1, 2)
  expect(await page.locator('.hero-fullbleed-centered_component').evaluate((el) => getComputedStyle(el).visibility)).toBe('visible')
})

test('fail-safe: with no bundle the zoom clears and the copy shows after about 3s', async ({ page }) => {
  await open(page, '?bundle=0')
  await expect.poll(async () => (await imageScale(page)).ratio, { timeout: 5000 }).toBeCloseTo(1, 2)
  expect(await page.locator('.hero-fullbleed-centered_component').evaluate((el) => getComputedStyle(el).visibility)).toBe('visible')
})
