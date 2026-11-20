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
  // Let the image window finish opening before the next click.
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

test('offers slider: figure sits inside the card between title and text at 390', async ({ page }) => {
  await openFixture(page, 390, 844)
  const active = sliderA(page).locator('.swiper-slide-active')
  const heading = await active.locator('.offers-slider-split_heading').boundingBox()
  const figure = await active.locator('.offers-slider-split_figure').boundingBox()
  const text = await active.locator('.offers-slider-split_text').boundingBox()
  expect(heading && figure && text).toBeTruthy()
  expect(figure!.y).toBeGreaterThanOrEqual(heading!.y + heading!.height)
  expect(text!.y).toBeGreaterThanOrEqual(figure!.y + figure!.height)
  // Figma mobile: 350 x 390 inside 20px gutters.
  expect(Math.round(figure!.x)).toBe(20)
  expect(Math.round(figure!.width)).toBe(350)
  expect(Math.round(figure!.height)).toBe(390)
  await sliderA(page).screenshot({ path: `${SCREENSHOT_DIRECTORY}/fixture-390.png` })
})

test('offers slider: image opens through a still window, direction follows navigation', async ({ page }) => {
  await openFixture(page, 1440, 900)
  const slider = sliderA(page)
  // anchored: the side the window opens from (its inset stays 0 while the other shrinks)
  const step = async (button: 'next' | 'prev', anchored: 'right' | 'left') => {
    const leavingIndex = await slider
      .locator('.swiper-slide-active')
      .evaluate((element) => Array.from(element.parentElement!.children).indexOf(element))
    await slider.locator(`[data-offers-slider-${button}]`).click()
    await page.waitForTimeout(300)
    const state = await slider.evaluate((root, index) => {
      const active = root.querySelector<HTMLElement>('.swiper-slide-active')!
      const figure = active.querySelector<HTMLElement>('.offers-slider-split_figure')!
      const figureBox = figure.getBoundingClientRect()
      const imageBox = figure.querySelector('img')!.getBoundingClientRect()
      const leaving = root.querySelector('.swiper-wrapper')!.children[index] as HTMLElement
      return {
        clip: getComputedStyle(figure).clipPath,
        imageDrift: Math.abs(imageBox.left - figureBox.left) + Math.abs(imageBox.width - figureBox.width),
        leavingOpacity: getComputedStyle(leaving).opacity,
        onTop: Number(active.style.zIndex) > Number(leaving.style.zIndex || 0),
      }
    }, leavingIndex)
    const [, right, , left] = state.clip.match(/inset\((.*)\)/)![1].split(' ').map(parseFloat)
    const [fixed, moving] = anchored === 'right' ? [right, left] : [left, right]
    expect(fixed).toBe(0)
    expect(moving).toBeGreaterThan(0)
    expect(moving).toBeLessThan(100)
    expect(state.imageDrift).toBeLessThan(1)
    expect(state.leavingOpacity).toBe('1')
    expect(state.onTop).toBe(true)
    await page.waitForTimeout(1200)
    const shown = await slider.evaluate(
      (root) => Array.from(root.querySelectorAll('.swiper-slide')).filter((slide) => getComputedStyle(slide).opacity === '1').length,
    )
    expect(shown).toBe(1)
  }
  await step('next', 'right')
  await step('prev', 'left')
})

// O1: any slide count, Collection List wrapping, empty list.
const sliderD = (page: Page) => page.locator('[data-offers-slider]').nth(3)
const sliderE = (page: Page) => page.locator('[data-offers-slider]').nth(4)
const sliderF = (page: Page) => page.locator('[data-offers-slider]').nth(5)

const cycleThree = async (page: Page, slider: ReturnType<typeof sliderD>) => {
  const current = slider.locator('[data-offers-slider-current]')
  await slider.scrollIntoViewIfNeeded()
  await expect(slider.locator('[data-offers-slider-total]')).toHaveText('03')
  await expect(current).toHaveText('01')
  for (const expected of ['02', '03', '01']) {
    await slider.locator('[data-offers-slider-next]').click()
    await expect(current).toHaveText(expected)
    await page.waitForTimeout(1000)
  }
  await slider.locator('[data-offers-slider-prev]').click()
  await expect(current).toHaveText('03')
}

for (const [width, height] of [[390, 844], [1440, 900]]) {
  test(`offers slider: three slides count 01 / 03 and loop at ${width}`, async ({ page }) => {
    await openFixture(page, width, height)
    await cycleThree(page, sliderD(page))
  })

  test(`offers slider: three slides inside a Collection List at ${width}`, async ({ page }) => {
    await openFixture(page, width, height)
    await cycleThree(page, sliderE(page))
  })

  test(`offers slider: one slide shows no arrows or counter at ${width}`, async ({ page }) => {
    await openFixture(page, width, height)
    const slider = sliderC(page)
    await expect(slider.locator('[data-offers-slider-prev]')).toBeHidden()
    await expect(slider.locator('[data-offers-slider-next]')).toBeHidden()
    await expect(slider.locator('[data-offers-slider-current]')).toBeHidden()
    await expect(slider.locator('[data-offers-slider-total]')).toBeHidden()
  })
}

test('offers slider: an empty Collection List does nothing and does not throw', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await openFixture(page, 1440, 900)
  const slider = sliderF(page)
  await expect(slider.locator('[data-offers-slider-total]')).toHaveText('05')
  expect(await slider.locator('.swiper-initialized').count()).toBe(0)
  expect(errors).toEqual([])
})
