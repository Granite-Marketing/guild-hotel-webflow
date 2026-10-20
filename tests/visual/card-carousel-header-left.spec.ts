import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'
import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { extname, join } from 'node:path'

/**
 * Q009 card carousel header left: builds
 * tests/visual/fixtures/card-carousel-header-left.{html,ts} the same way
 * `pnpm dev` does, serves it from a fake origin, and checks the arrows,
 * the end states, the locked single card and the stacked layout.
 * Swiper loads from jsDelivr, as on the site.
 */

const FIXTURE_ORIGIN = 'http://fixture.test'
const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
}
const SCREENSHOT_DIRECTORY = 'docs/figma/build-plans/Q009'

let buildDirectory = ''

test.beforeAll(async () => {
  buildDirectory = mkdtempSync(join(tmpdir(), 'card-carousel-header-left-'))
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true })
  await esbuild.build({
    bundle: true,
    entryPoints: [
      'tests/visual/fixtures/card-carousel-header-left.html',
      'tests/visual/fixtures/card-carousel-header-left.ts',
    ],
    outdir: buildDirectory,
    target: 'esnext',
    loader: { '.html': 'copy' },
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
  await page.goto(`${FIXTURE_ORIGIN}/card-carousel-header-left.html`, { waitUntil: 'networkidle' })
}

const carousel = (page: Page, index: number) => page.locator('[data-card-carousel]').nth(index)

const firstSlideX = (page: Page, index: number) =>
  carousel(page, index)
    .locator('.swiper-slide')
    .first()
    .evaluate((element) => element.getBoundingClientRect().x)

test('card carousel: next and prev move one card at 1440', async ({ page }) => {
  await openFixture(page, 1440, 900)
  const slider = carousel(page, 0)
  const previous = slider.locator('[data-card-carousel-prev]')
  const next = slider.locator('[data-card-carousel-next]')

  await expect(previous).toHaveClass(/is-disabled/)
  await expect(next).not.toHaveClass(/is-disabled/)
  await slider.screenshot({ path: `${SCREENSHOT_DIRECTORY}/fixture-1440.png` })

  const start = await firstSlideX(page, 0)
  await next.click()
  await expect(previous).not.toHaveClass(/is-disabled/)
  // One card plus the 2rem gap: 356 + 32.
  await expect.poll(async () => Math.round(start - (await firstSlideX(page, 0)))).toBe(388)

  await page.waitForTimeout(800)
  await previous.click()
  await expect.poll(async () => Math.round(await firstSlideX(page, 0))).toBe(Math.round(start))
  await expect(previous).toHaveClass(/is-disabled/)
})

test('card carousel: next disables at the last position', async ({ page }) => {
  await openFixture(page, 1440, 900)
  const slider = carousel(page, 0)
  const next = slider.locator('[data-card-carousel-next]')
  for (let step = 0; step < 6; step += 1) {
    if (await next.evaluate((element) => element.classList.contains('is-disabled'))) break
    await next.click()
    await page.waitForTimeout(800)
  }
  await expect(next).toHaveClass(/is-disabled/)
  const lastCard = await slider.locator('.swiper-slide').last().boundingBox()
  expect(lastCard).toBeTruthy()
  // The last card ends one 2rem gap (its own right margin) short of the viewport edge.
  expect(Math.abs(lastCard!.x + lastCard!.width + 32 - 1440)).toBeLessThan(2)
})

test('card carousel: staggered card heights and header column at 1440', async ({ page }) => {
  await openFixture(page, 1440, 900)
  const slider = carousel(page, 0)
  const heights = await slider
    .locator('.card-carousel-header-left_figure')
    .evaluateAll((figures) => figures.slice(0, 3).map((figure) => figure.getBoundingClientRect().height))
  expect(heights).toEqual([502, 352, 463])
  const firstCard = await slider.locator('.swiper-slide').first().boundingBox()
  expect(Math.round(firstCard!.x)).toBe(687)
  expect(Math.round(firstCard!.width)).toBe(356)
})

test('card carousel: compact variant is shorter than base', async ({ page }) => {
  await openFixture(page, 1440, 900)
  const base = await carousel(page, 0).boundingBox()
  const compact = await carousel(page, 1).boundingBox()
  expect(Math.round(base!.height - compact!.height)).toBe(2 * (215 - 136))
})

test('card carousel: a single card locks and hides the arrows', async ({ page }) => {
  await openFixture(page, 1440, 900)
  const slider = carousel(page, 2)
  await expect(slider.locator('[data-card-carousel-prev]')).toBeHidden()
  await expect(slider.locator('[data-card-carousel-next]')).toBeHidden()
})

test('card carousel: stacks below the header at 390', async ({ page }) => {
  await openFixture(page, 390, 844)
  const slider = carousel(page, 0)
  const header = await slider.locator('.card-carousel-header-left_content').boundingBox()
  const firstCard = await slider.locator('.swiper-slide').first().boundingBox()
  expect(firstCard!.y).toBeGreaterThan(header!.y + header!.height - 1)
  expect(Math.round(firstCard!.width)).toBe(256)
  const start = await firstSlideX(page, 0)
  await slider.locator('[data-card-carousel-next]').click()
  // One card plus the 1rem gap: 256 + 16.
  await expect.poll(async () => Math.round(start - (await firstSlideX(page, 0)))).toBe(272)
  await page.waitForTimeout(800)
  await slider.screenshot({ path: `${SCREENSHOT_DIRECTORY}/fixture-390.png` })
})
