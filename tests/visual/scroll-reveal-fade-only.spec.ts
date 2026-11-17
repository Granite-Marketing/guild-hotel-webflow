import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * Scroll reveal, fade-only option and the new code-applied rows (ticket #233),
 * offline fixture running the real scrollReveal module:
 * - form fields and a Designer data-reveal="fade-only" block change opacity
 *   with no transform movement;
 * - FAQ rows (divider fades) and the mobile-only collage reveal;
 * - reduced motion shows everything at once.
 * Needs the GSAP CDN tags, like the other fixtures.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/scroll-reveal-fade-only.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/scroll-reveal-fade-only.ts'],
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

const load = async (page: Page) => {
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => (window as unknown as { fixtureReady?: boolean }).fixtureReady === true)
}

const opacity = (page: Page, selector: string, index = 0) =>
  page.locator(selector).nth(index).evaluate((element) => Number(getComputedStyle(element).opacity))
const transform = (page: Page, selector: string, index = 0) =>
  page.locator(selector).nth(index).evaluate((element) => getComputedStyle(element).transform)

test('form fields are hidden until scrolled to, then fade in with no movement', async ({ page }) => {
  await load(page)
  const field = '.form-split-script-contact_field'
  expect(await opacity(page, field)).toBe(0)
  const samples: string[] = []
  await page.locator(field).first().scrollIntoViewIfNeeded()
  for (let i = 0; i < 8; i++) {
    samples.push(await transform(page, field))
    await page.waitForTimeout(100)
  }
  expect(samples.every((value) => value === 'none' || value === 'matrix(1, 0, 0, 1, 0, 0)')).toBe(true)
  await expect.poll(() => opacity(page, field)).toBe(1)
  await expect.poll(() => opacity(page, field, 2), { timeout: 5000 }).toBe(1)
})

test('a Designer fade-only block fades without rising', async ({ page }) => {
  await load(page)
  expect(await opacity(page, '[data-test="designer"]')).toBe(0)
  await page.locator('[data-test="designer"]').scrollIntoViewIfNeeded()
  await expect.poll(() => opacity(page, '[data-test="designer"]')).toBe(1)
  expect(await transform(page, '[data-test="designer"]')).toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/)
})

test('FAQ rows: each row divider fades in, staggered by row', async ({ page }) => {
  await load(page)
  const delays = await page.locator('.accordion_item').evaluateAll((items) => items.map((item) => (item as HTMLElement).dataset.revealDelay))
  expect(delays).toEqual(['0', '0.1', '0.2'])
  await page.locator('.accordion_item').first().scrollIntoViewIfNeeded()
  await expect.poll(() => opacity(page, '.accordion_item', 2), { timeout: 5000 }).toBe(1)
})

test('collage images fade in on mobile only', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await load(page)
  expect(await opacity(page, '[data-test="collage"]')).toBe(0)
  await page.locator('[data-test="collage"]').scrollIntoViewIfNeeded()
  await expect.poll(() => opacity(page, '[data-test="collage"]')).toBe(1)
})

test('collage is left alone on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await load(page)
  expect(await opacity(page, '[data-test="collage"]')).toBe(1)
})

test('reduced motion shows everything at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 800 })
  await load(page)
  for (const selector of ['.form-split-script-contact_field', '.accordion_item', '[data-test="collage"]', '[data-test="designer"]']) {
    expect(await opacity(page, selector)).toBe(1)
  }
})
