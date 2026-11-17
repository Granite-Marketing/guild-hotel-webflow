import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * #235: focus rings only for the keyboard, tilted script headings get
 * clearance on phones (untilted get none), Directions links open in a new tab.
 * Serves the repo root with esbuild; no network needed.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/mobile-code-fixes-235.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/mobile-code-fixes-235.ts'],
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

const load = async (page: Page) => {
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'load' })
  // The bundle is served next to the html as mobile-code-fixes-235.js.
  await page.addScriptTag({ url: `${origin}/tests/visual/fixtures/mobile-code-fixes-235.js` })
}

const outlineStyle = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => getComputedStyle(el).outlineStyle)

test.describe('phone viewport', () => {
  test.use({ viewport: { width: 390, height: 800 }, hasTouch: true })

  test('tapping a control leaves no focus ring', async ({ page }) => {
    await load(page)
    await page.locator('#close').click()
    await expect(page.locator('#close')).toBeFocused()
    expect(await outlineStyle(page, '#close')).toBe('none')
  })

  test('a script-focused heading never shows a ring, even after a key press', async ({ page }) => {
    await load(page)
    await page.keyboard.press('Tab')
    await page.evaluate(() => document.getElementById('step-heading')?.focus())
    expect(await outlineStyle(page, '#step-heading')).toBe('none')
    await page.keyboard.press('ArrowDown')
    expect(await outlineStyle(page, '#step-heading')).toBe('none')
  })

  test('a script-focused control after a tap is quiet, and Tab shows a ring on every control', async ({ page }) => {
    await load(page)
    await page.locator('#link').click()
    await page.evaluate(() => document.getElementById('later')?.focus())
    expect(await outlineStyle(page, '#later')).toBe('none')
    // Keyboard: Shift+Tab back through the controls, each shows a ring.
    await page.keyboard.press('Shift+Tab')
    await expect(page.locator('#link')).toBeFocused()
    expect(await outlineStyle(page, '#link')).toBe('solid')
    await page.keyboard.press('Shift+Tab')
    await expect(page.locator('#close')).toBeFocused()
    expect(await outlineStyle(page, '#close')).toBe('solid')
  })

  test('tilted heading gets clearance on a phone, untilted gets none', async ({ page }) => {
    await load(page)
    const margins = (selector: string) =>
      page.locator(selector).evaluate((el) => {
        const style = getComputedStyle(el)
        return { top: parseFloat(style.marginTop), bottom: parseFloat(style.marginBottom) }
      })
    const tilted = await margins('#george')
    expect(tilted.top).toBeGreaterThan(0)
    expect(tilted.bottom).toBeGreaterThan(tilted.top)
    const level = await margins('#venues')
    expect(level).toEqual({ top: 0, bottom: 0 })
  })
})

test('every Directions link opens in a new tab', async ({ page }) => {
  await load(page)
  for (const id of ['cms-dir', 'static-dir']) {
    await expect(page.locator(`#${id}`)).toHaveAttribute('target', '_blank')
    await expect(page.locator(`#${id}`)).toHaveAttribute('rel', 'noopener')
  }
  await expect(page.locator('#plain')).not.toHaveAttribute('target', /.*/)
})
