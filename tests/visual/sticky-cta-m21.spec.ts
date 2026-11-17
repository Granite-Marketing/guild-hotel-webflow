import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * M21 and M22 (Stephen, 17 Nov). Phones: the Reserve button is hidden at load,
 * fades in docked at the bottom centre after a short scroll, hides again back
 * at the top, never cropped. Desktop: fully visible in the hero on first
 * load, then docks. Both: hidden once "Other dining options" is in view.
 * Needs network for GSAP from jsDelivr.
 */

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/sticky-cta-m21.ts'],
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

const isOnScreen = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector<HTMLElement>('[data-reserve]')!
    const rect = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    if (style.visibility === 'hidden' || Number(style.opacity) < 0.95) return false
    if (rect.top < 0 || rect.bottom > window.innerHeight || rect.left < 0 || rect.right > window.innerWidth) return false
    return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2) === el
  })

const scrollTo = async (page: Page, y: number) => {
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForTimeout(700)
}

const sectionTop = (page: Page, selector: string) =>
  page.evaluate((sel) => document.querySelector(sel)!.getBoundingClientRect().top + window.scrollY, selector)

const centreOffset = (page: Page) =>
  page.evaluate(() => {
    const rect = document.querySelector('[data-reserve]')!.getBoundingClientRect()
    return Math.abs(rect.x + rect.width / 2 - window.innerWidth / 2)
  })

for (const viewport of [
  { width: 390, height: 700, phone: true },
  { width: 1440, height: 700, phone: false },
]) {
  test.describe(`M21/M22 at ${viewport.width}px`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test.beforeEach(async ({ page }) => {
      await page.goto(`${origin}/tests/visual/fixtures/sticky-cta-m21.html`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(900)
    })

    test('first load: hidden on phones, fully visible on desktop', async ({ page }) => {
      expect(await isOnScreen(page)).toBe(!viewport.phone)
      if (viewport.phone) await expect(button(page)).toHaveCSS('visibility', 'hidden')
    })

    test('after a short scroll it is shown docked at the bottom, centred and uncropped', async ({ page }) => {
      await scrollTo(page, 500) // past half a screen, where the desktop button settles at the bottom
      expect(await isOnScreen(page)).toBe(true)
      expect(await centreOffset(page)).toBeLessThan(2)
      const bottomGap = await page.evaluate(
        () => window.innerHeight - document.querySelector('[data-reserve]')!.getBoundingClientRect().bottom,
      )
      expect(bottomGap).toBeLessThan(40)
    })

    test('M21 phones: hidden again back at the top', async ({ page }) => {
      test.skip(!viewport.phone, 'phone behaviour')
      await scrollTo(page, 400)
      expect(await isOnScreen(page)).toBe(true)
      await scrollTo(page, 0)
      await expect(button(page)).toHaveCSS('visibility', 'hidden')
    })

    test('M21 phones: no empty slot is left in the hero', async ({ page }) => {
      test.skip(!viewport.phone, 'phone behaviour')
      const holderHeight = await page.evaluate(
        () => document.querySelector<HTMLElement>('[data-reserve]')!.parentElement!.getBoundingClientRect().height,
      )
      expect(holderHeight).toBe(0)
    })

    test('M22: hides when "Other dining options" comes into view, returns scrolling back', async ({ page }) => {
      const endTop = await sectionTop(page, '.section_card-carousel-header-left')
      await scrollTo(page, endTop - viewport.height + 100)
      await expect(button(page)).toHaveCSS('visibility', 'hidden')
      await scrollTo(page, endTop - viewport.height - 300)
      expect(await isOnScreen(page)).toBe(true)
    })
  })
}
