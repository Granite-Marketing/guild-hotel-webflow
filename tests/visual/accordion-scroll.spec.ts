import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * Accordion scroll stability (M6): opening or closing a FAQ item, including
 * when the page is scrolled to its end, must not move the visitor's scroll
 * position by a jump, and must not trigger a ScrollTrigger refresh on every
 * frame of the height transition.
 *
 * Serves the repo root with esbuild (fixture entry built in memory). GSAP and
 * Lenis load from jsDelivr, so this needs network.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/accordion-scroll.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/accordion-scroll.ts'],
    bundle: true,
    outdir: 'tests/visual/fixtures',
    tsconfig: 'tsconfig.json',
    logLevel: 'silent',
  })
  const server = await context.serve({ servedir: '.', host: '127.0.0.1' })
  origin = `http://127.0.0.1:${server.port}`
})

test.afterAll(async () => {
  await context.dispose()
})

test.use({ viewport: { width: 390, height: 800 } })

const load = async (page: Page) => {
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'networkidle' })
  await expect(page.locator('.accordion_header').first()).toHaveAttribute('aria-expanded', 'true')
}

/** Click a header, sample scrollY every frame for 1.2s, return samples and refresh count. */
const toggleAndSample = async (page: Page, headerIndex: number) => {
  await page.evaluate(() => {
    const w = window as unknown as { __samples: number[]; __stop: boolean; __refreshAtStart: number }
    w.__samples = []
    w.__stop = false
    w.__refreshAtStart = window.__refreshCount
    const tick = () => {
      w.__samples.push(window.scrollY)
      if (!w.__stop) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  await page.locator('.accordion_header').nth(headerIndex).evaluate((header) => (header as HTMLElement).click())
  await page.waitForTimeout(1200)
  return page.evaluate(() => {
    const w = window as unknown as { __samples: number[]; __stop: boolean; __refreshAtStart: number }
    w.__stop = true
    return { samples: w.__samples, refreshes: window.__refreshCount - w.__refreshAtStart }
  })
}

const largestStep = (samples: number[]) =>
  samples.reduce((max, value, index) => (index === 0 ? max : Math.max(max, Math.abs(value - samples[index - 1]))), 0)

const scrollTo = async (page: Page, top: number) => {
  await page.evaluate((y) => window.scrollTo(0, y), top)
  await page.waitForTimeout(300)
}

test('swapping items at the very end of the page leaves the scroll position alone', async ({ page }) => {
  await load(page)
  await scrollTo(page, 100000)
  const before = await page.evaluate(() => window.scrollY)
  // Item 3 opens while item 1 closes: the case that used to lose ~250px of scroll.
  const { samples, refreshes } = await toggleAndSample(page, 2)
  expect(largestStep(samples)).toBeLessThan(2)
  expect(Math.abs(samples[samples.length - 1] - before)).toBeLessThan(2)
  expect(refreshes).toBeLessThanOrEqual(2)
})

test('swapping items mid-page leaves the scroll position alone', async ({ page }) => {
  await load(page)
  await scrollTo(page, 900)
  const before = await page.evaluate(() => window.scrollY)
  const { samples, refreshes } = await toggleAndSample(page, 1)
  expect(largestStep(samples)).toBeLessThan(2)
  expect(Math.abs(samples[samples.length - 1] - before)).toBeLessThan(2)
  expect(refreshes).toBeLessThanOrEqual(2)
})

test('closing the open item at the end of the page follows the shorter page without a jump', async ({ page }) => {
  await load(page)
  await scrollTo(page, 100000)
  const { samples, refreshes } = await toggleAndSample(page, 0)
  // The page really gets 220px shorter, so scroll may only follow it, in eased steps (transition peak is ~25px per frame).
  expect(largestStep(samples)).toBeLessThan(40)
  expect(samples[samples.length - 1]).toBeLessThanOrEqual(samples[0])
  expect(refreshes).toBeLessThanOrEqual(2)
})

test('anchoring is restored after the transition', async ({ page }) => {
  await load(page)
  await page.locator('.accordion_header').nth(1).evaluate((header) => (header as HTMLElement).click())
  await page.waitForTimeout(1000)
  expect(await page.evaluate(() => document.documentElement.style.overflowAnchor)).toBe('')
})
