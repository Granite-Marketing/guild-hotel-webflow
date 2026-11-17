import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * Scroll reveals (ticket #268, items M4, M16, M30, M39): offline fixture with
 * the real class names from staging, running the real scrollReveal module.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/scroll-reveals-268.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/scroll-reveals-268.ts'],
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

const load = async (page: Page, width: number) => {
  await page.setViewportSize({ width, height: 800 })
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => (window as unknown as { fixtureReady?: boolean }).fixtureReady === true)
}

const opacity = (page: Page, selector: string, index = 0) =>
  page.locator(selector).nth(index).evaluate((element) => Number(getComputedStyle(element).opacity))

test.describe('M4 collage on a phone', () => {
  test('tiles fade in one by one, in order, with a stagger', async ({ page }) => {
    await load(page, 390)
    const tile = '[data-test="tile"] figure'
    for (const index of [0, 1, 2]) expect(await opacity(page, tile, index)).toBe(0)
    await page.locator('[data-test="tile"]').first().scrollIntoViewIfNeeded()
    // The first tile is up before the last one starts, so they never pop in together.
    await expect.poll(() => opacity(page, tile, 0), { timeout: 3000 }).toBeGreaterThan(0.2)
    expect(await opacity(page, tile, 2)).toBeLessThan(await opacity(page, tile, 0))
    for (const index of [0, 1, 2]) await expect.poll(() => opacity(page, tile, index), { timeout: 5000 }).toBe(1)
  })

  test('a tile the collage hides stays hidden', async ({ page }) => {
    await load(page, 390)
    await page.locator('[data-test="tile"]').first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(2500)
    // Never tweened: no inline opacity or visibility from the reveal.
    expect(await page.locator('[data-test="hidden-tile"] figure').evaluate((figure) => figure.getAttribute('style') ?? '')).toBe('')
  })

  test('desktop leaves the collage alone', async ({ page }) => {
    await load(page, 1440)
    expect(await opacity(page, '[data-test="tile"] figure')).toBe(1)
  })
})

test.describe('M30 newsletter form', () => {
  test('fields fade in staggered with no slide, even inside a faded column', async ({ page }) => {
    await load(page, 390)
    const delays = await page
      .locator('.cta-booking-newsletter_form > :is(label, input)')
      .evaluateAll((fields) => fields.map((field) => (field as HTMLElement).dataset.revealDelay))
    expect(delays).toEqual(['0', '0.1', '0.2'])
    await page.locator('.cta-booking-newsletter_form').scrollIntoViewIfNeeded()
    const transforms: string[] = []
    for (let i = 0; i < 6; i++) {
      transforms.push(await page.locator('.cta-booking-newsletter_form').evaluate((form) => getComputedStyle(form.closest('[data-reveal]') as Element).transform))
      await page.waitForTimeout(100)
    }
    expect(transforms.every((value) => value === 'none' || value === 'matrix(1, 0, 0, 1, 0, 0)')).toBe(true)
    await expect.poll(() => opacity(page, '.cta-booking-newsletter_input'), { timeout: 5000 }).toBe(1)
  })
})

for (const width of [390, 1440]) {
  test(`M16 room gallery photos scale and fade in at ${width}`, async ({ page }) => {
    await load(page, width)
    expect(await opacity(page, '[data-test="gallery"]')).toBe(0)
    await page.locator('[data-test="gallery"]').first().scrollIntoViewIfNeeded()
    await expect.poll(() => opacity(page, '[data-test="gallery"]'), { timeout: 5000 }).toBe(1)
    // The caption keeps its own text mask: it is not blocked by the photo's reveal.
    expect(await page.locator('.gallery-mosaic-captioned_caption').first().getAttribute('data-reveal')).not.toBe('image-fade')
  })
}

test('M39 Corporate row images scale and fade in on a phone, with no mask', async ({ page }) => {
  await load(page, 390)
  expect(await opacity(page, '[data-test="why"]')).toBe(0)
  await page.locator('[data-test="why"]').scrollIntoViewIfNeeded()
  const scales: number[] = []
  for (let i = 0; i < 6; i++) {
    scales.push(await page.locator('[data-test="why"] img').evaluate((img) => new DOMMatrix(getComputedStyle(img).transform).a))
    await page.waitForTimeout(80)
  }
  expect(Math.max(...scales)).toBeGreaterThan(1)
  expect(await page.locator('[data-test="why"]').evaluate((element) => getComputedStyle(element).clipPath)).toBe('none')
  await expect.poll(() => opacity(page, '[data-test="why"]'), { timeout: 5000 }).toBe(1)
})

test('M39 leaves desktop rows alone (the hover images stay)', async ({ page }) => {
  await load(page, 1440)
  expect(await opacity(page, '[data-test="why"]')).toBe(1)
})
