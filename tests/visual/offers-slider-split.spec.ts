import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'
import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { extname, join } from 'node:path'

/**
 * Q008 offers slider split: builds tests/visual/fixtures/offers-slider-split.{html,ts}
 * the same way `pnpm dev` does, serves it from a fake origin, and checks the
 * counter, loop, fade, hidden controls and the two-column to stacked layout.
 * Swiper loads from jsDelivr, as on the site.
 */

const FIXTURE_ORIGIN = 'http://fixture.test'
const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.webp': 'image/webp',
}
const SCREENSHOT_DIRECTORY = 'docs/figma/build-plans/Q008'

let buildDirectory = ''

test.beforeAll(async () => {
  buildDirectory = mkdtempSync(join(tmpdir(), 'offers-slider-split-'))
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true })
  await esbuild.build({
    bundle: true,
    entryPoints: [
      'tests/visual/fixtures/offers-slider-split.html',
      'tests/visual/fixtures/offers-slider-split.ts',
    ],
    outdir: buildDirectory,
    target: 'esnext',
    loader: { '.html': 'copy', '.webp': 'file' },
    assetNames: 'assets/[name]-[hash]',
    logLevel: 'error',
  })
})

const openFixture = async (page: Page, width: number, height: number) => {
  await page.setViewportSize({ width, height })
  await page.route(`${FIXTURE_ORIGIN}/**`, (route) => {
    const path = new URL(route.request().url()).pathname
    route.fulfill({
      body: readFileSync(join(buildDirectory, path)),
      contentType: CONTENT_TYPES[extname(path)] ?? 'application/octet-stream',
    })
  })
  await page.goto(`${FIXTURE_ORIGIN}/offers-slider-split.html`, { waitUntil: 'networkidle' })
}

const sliderA = (page: Page) => page.locator('[data-offers-slider]').nth(0)
const sliderC = (page: Page) => page.locator('[data-offers-slider]').nth(2)

test('offers slider: counter, next and loop at 1440', async ({ page }) => {
  await openFixture(page, 1440, 900)
  const slider = sliderA(page)
  const current = slider.locator('[data-offers-slider-current]')
  const total = slider.locator('[data-offers-slider-total]')

  await expect(total).toHaveText('05')
  await expect(current).toHaveText('01')

  await slider.locator('[data-offers-slider-next]').click()
  await expect(current).toHaveText('02')
  const second = slider.locator('.swiper-slide:not(.swiper-slide-duplicate)').nth(1)
  await expect(second).toHaveClass(/swiper-slide-active/)
  await expect
    .poll(() => second.evaluate((element) => getComputedStyle(element).opacity))
    .toBe('1')

  await slider.locator('[data-offers-slider-prev]').click()
  await expect(current).toHaveText('01')
  // Swiper ignores clicks while a looped transition is running (800ms).
  await page.waitForTimeout(1000)
  await slider.locator('[data-offers-slider-prev]').click()
  await expect(current).toHaveText('05')
  await page.waitForTimeout(1000)
  await sliderA(page).screenshot({ path: `${SCREENSHOT_DIRECTORY}/fixture-1440.png` })
})

test('offers slider: single slide hides its controls', async ({ page }) => {
  await openFixture(page, 1440, 900)
  const controls = sliderC(page).locator('[data-offers-slider-controls]')
  await expect(controls).toHaveClass(/hide/)
  await expect(controls).toBeHidden()
  await expect(sliderC(page).locator('[data-offers-slider-total]')).toHaveText('01')
})

test('offers slider: panel and figure each take half the width at 1440', async ({ page }) => {
  await openFixture(page, 1440, 900)
  const slider = sliderA(page)
  const active = slider.locator('.swiper-slide-active')
  const content = await active.locator('.offers-slider-split_content').boundingBox()
  const figure = await active.locator('.offers-slider-split_figure').boundingBox()
  expect(content && figure).toBeTruthy()
  expect(Math.abs(content!.width - 720)).toBeLessThan(2)
  expect(Math.abs(figure!.width - 720)).toBeLessThan(2)
  expect(figure!.x).toBeGreaterThan(content!.x)
})

test('offers slider: item stacks with the figure below at 390', async ({ page }) => {
  await openFixture(page, 390, 844)
  const active = sliderA(page).locator('.swiper-slide-active')
  const content = await active.locator('.offers-slider-split_content').boundingBox()
  const figure = await active.locator('.offers-slider-split_figure').boundingBox()
  expect(content && figure).toBeTruthy()
  expect(figure!.y).toBeGreaterThanOrEqual(content!.y + content!.height - 1)
  expect(Math.abs(figure!.width - 390)).toBeLessThan(2)
  await sliderA(page).screenshot({ path: `${SCREENSHOT_DIRECTORY}/fixture-390.png` })
})
