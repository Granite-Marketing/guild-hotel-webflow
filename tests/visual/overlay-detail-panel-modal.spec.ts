import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * Q006 Overlay Detail Panel Modal on the modals.ts contract: every trigger
 * opens its dialog (is-open, aria-hidden false, focus inside), Escape, the
 * back or close control and the backdrop close it, and focus returns to the
 * trigger. Saves a 1440 and a 390 screenshot of each variant to the Q006
 * build plan folder.
 *
 * Serves the repo root with esbuild. The published Webflow CSS loads from the
 * Webflow CDN, so this needs network.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/overlay-detail-panel-modal.html'
const SHOTS = 'docs/figma/build-plans/Q006'

const DIALOGS = [
  { id: 'meetings-overlay', variant: 'base', close: '.overlay-detail-panel-modal_back' },
  { id: 'arts-artist', variant: 'dark', close: '.overlay-detail-panel-modal_back' },
  { id: 'arts-artwork', variant: 'dark-artwork', close: '.overlay-detail-panel-modal_back' },
  { id: 'dining-menu', variant: 'image-bg', close: '.overlay-detail-panel-modal_close' },
  { id: 'book-menu', variant: 'burgundy', close: '.overlay-detail-panel-modal_close' },
  { id: 'neighborhood-overlay', variant: 'centered', close: '.overlay-detail-panel-modal_back' },
]

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/overlay-detail-panel-modal.ts'],
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
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
}

const open = async (page: Page, id: string) => {
  await page.locator(`[data-modal-open="${id}"]`).click()
  const dialog = page.locator(`#${id}`)
  await expect(dialog).toHaveClass(/is-open/)
  await expect(dialog).toHaveAttribute('aria-hidden', 'false')
  await expect(dialog).toHaveCSS('opacity', '1')
  return dialog
}

test('every dialog is hidden until opened', async ({ page }) => {
  await load(page)
  for (const { id } of DIALOGS) {
    const dialog = page.locator(`#${id}`)
    await expect(dialog).toHaveAttribute('role', 'dialog')
    await expect(dialog).toHaveCSS('visibility', 'hidden')
  }
})

for (const { id, variant, close } of DIALOGS) {
  test(`${variant}: opens, traps focus and closes from its own control`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await load(page)
    const dialog = await open(page, id)
    await expect(page.locator(`[data-modal-open="${id}"]`)).toHaveAttribute('aria-expanded', 'true')
    await page.waitForTimeout(500)
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    await page.screenshot({ path: `${SHOTS}/fixture-${variant}-1440.png` })

    await dialog.locator(close).click()
    await expect(dialog).not.toHaveClass(/is-open/)
    await expect(page.locator(`[data-modal-open="${id}"]`)).toBeFocused()
  })

  test(`${variant}: 390 layout`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await load(page)
    await open(page, id)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${SHOTS}/fixture-${variant}-390.png` })
  })
}

test('Escape and the backdrop close the dialog', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await load(page)
  let dialog = await open(page, 'arts-artist')
  await page.keyboard.press('Escape')
  await expect(dialog).not.toHaveClass(/is-open/)

  dialog = await open(page, 'book-menu')
  // The burgundy window leaves the left of the viewport uncovered: click the backdrop there.
  await page.mouse.click(100, 600)
  await expect(dialog).not.toHaveClass(/is-open/)
})
