import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * stickyCta (M21, M22): the Reserve a table button is on screen from first
 * load without scrolling (even when the hero is taller than the screen and the
 * button's own spot is below the fold), stays docked while scrolling, hides
 * once "Other dining options" comes into view, and returns on scrolling back.
 *
 * Serves the repo root with esbuild (fixture entry built in memory). GSAP
 * loads from jsDelivr, so this needs network.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/sticky-cta.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/sticky-cta.ts'],
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

const button = (page: Page) => page.locator('[data-reserve]')

/** The button is inside the viewport, painted, and the topmost thing at its centre. */
const isOnScreen = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector<HTMLElement>('[data-reserve]')!
    const rect = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    if (style.visibility === 'hidden' || Number(style.opacity) < 0.95) return false
    if (rect.top < 0 || rect.bottom > window.innerHeight) return false
    const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
    return hit === el
  })

const scrollTo = async (page: Page, y: number) => {
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForTimeout(700)
}

const sectionTop = (page: Page, selector: string) =>
  page.evaluate((sel) => document.querySelector(sel)!.getBoundingClientRect().top + window.scrollY, selector)

for (const viewport of [
  { width: 390, height: 700 },
  { width: 1440, height: 700 },
]) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport })

    test.beforeEach(async ({ page }) => {
      await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(900)
    })

    test('is on screen on first load, before any scroll', async ({ page }) => {
      expect(await page.evaluate(() => window.scrollY)).toBe(0)
      await expect(button(page)).toHaveAttribute('data-sticky-cta-docked', '')
      expect(await isOnScreen(page)).toBe(true)
    })

    test('stays on screen above later z-indexed sections while scrolling', async ({ page }) => {
      await scrollTo(page, 500)
      expect(await isOnScreen(page)).toBe(true)
    })

    test('hides at "Other dining options" and returns on scrolling back up', async ({ page }) => {
      const endTop = await sectionTop(page, '.section_card-carousel-header-left')
      await scrollTo(page, endTop - viewport.height + 100)
      await expect(button(page)).toHaveCSS('opacity', '0')
      await expect(button(page)).toHaveCSS('visibility', 'hidden')

      await scrollTo(page, endTop - viewport.height - 300)
      await expect(button(page)).toHaveCSS('opacity', '1')
      expect(await isOnScreen(page)).toBe(true)
    })

    test('keeps its docked position after the inline style is rewritten and the page refreshes', async ({ page }) => {
      await page.evaluate(() => {
        document.querySelector<HTMLElement>('[data-reserve]')!.removeAttribute('style')
        window.ScrollTrigger.refresh()
      })
      await page.waitForTimeout(300)
      expect(await isOnScreen(page)).toBe(true)
    })
  })
}
