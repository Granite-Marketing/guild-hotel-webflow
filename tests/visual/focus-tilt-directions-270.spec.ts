import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * #270 (M11a, M26, M31b) against the real script-tilt.css: George Marston
 * tilts -5deg on phones only, a click leaves no ring even under an
 * !important stylesheet ring, Tab still shows one, Directions open in a new tab.
 */

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/focus-tilt-directions-270.ts'],
    bundle: true,
    outdir: 'tests/visual/fixtures',
    tsconfig: 'tsconfig.json',
    logLevel: 'silent',
  })
  const server = await context.serve({ servedir: '.', host: '127.0.0.1' })
  origin = `http://127.0.0.1:${server.port}`
})
test.afterAll(async () => context.dispose())

const load = async (page: Page) => {
  await page.goto(`${origin}/tests/visual/fixtures/focus-tilt-directions-270.html`, { waitUntil: 'load' })
  await page.addScriptTag({ url: `${origin}/tests/visual/fixtures/focus-tilt-directions-270.js` })
}

const georgeStyle = (page: Page) =>
  page.locator('#george').evaluate((el) => {
    const style = getComputedStyle(el)
    return { rotate: style.rotate, transform: style.transform, top: parseFloat(style.marginTop), bottom: parseFloat(style.marginBottom) }
  })

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 800 }, hasTouch: true })
  test('George Marston tilts -5deg with clear space above and below', async ({ page }) => {
    await load(page)
    const george = await georgeStyle(page)
    expect(george.rotate).toBe('-5deg')
    expect(george.transform).toBe('none')
    expect(george.top).toBeGreaterThan(0)
    expect(george.bottom).toBeGreaterThan(george.top)
  })
  test('a tap leaves no ring even when the stylesheet ring is important', async ({ page }) => {
    await load(page)
    await page.locator('#back').click()
    await expect(page.locator('#back')).toBeFocused()
    expect(await page.locator('#back').evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('none')
  })
})

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })
  test('George Marston stays level with no added space', async ({ page }) => {
    await load(page)
    const george = await georgeStyle(page)
    expect(['none', '0deg']).toContain(george.rotate)
    expect(george.top).toBe(0)
    expect(george.bottom).toBe(0)
  })
  test('Tab still shows a ring', async ({ page }) => {
    await load(page)
    await page.keyboard.press('Tab')
    await expect(page.locator('#back')).toBeFocused()
    expect(await page.locator('#back').evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid')
  })
  test('every Directions link opens in a new tab with noopener', async ({ page }) => {
    await load(page)
    for (const id of ['d1', 'd2']) {
      await expect(page.locator(`#${id}`)).toHaveAttribute('target', '_blank')
      expect(await page.locator(`#${id}`).getAttribute('rel')).toContain('noopener')
    }
  })
})
