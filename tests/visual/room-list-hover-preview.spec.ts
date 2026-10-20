import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * Q007 Room List Hover Preview: the all-rooms dialog opens from its trigger
 * (modals.ts), hovering or focusing a room shows that room's preview
 * (roomListHoverPreview), and the Rooms and Suites tabs filter the list
 * (galleryFilter) while keeping the preview on a listed room. Saves 1440 and
 * 390 screenshots to the Q007 build plan folder.
 *
 * Serves the repo root with esbuild. The published Webflow CSS, the photos
 * and GSAP load from CDNs, so this needs network.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/room-list-hover-preview.html'
const SHOTS = 'docs/figma/build-plans/Q007'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/room-list-hover-preview.ts'],
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

const open = async (page: Page) => {
  await page.locator('[data-modal-open="all-rooms"]').click()
  const dialog = page.locator('#all-rooms')
  await expect(dialog).toHaveClass(/is-open/)
  await expect(dialog).toHaveAttribute('aria-hidden', 'false')
  await expect(dialog).toHaveCSS('opacity', '1')
  return dialog
}

const panel = (page: Page, key: string) => page.locator(`[data-room-preview-panel="${key}"]`)

test('dialog is hidden until opened and shows the reference room first', async ({ page }) => {
  await load(page)
  await expect(page.locator('#all-rooms')).toHaveCSS('visibility', 'hidden')
  await open(page)
  await expect(panel(page, 'cozy-courtyard-queen')).toHaveClass(/is-active/)
  await expect(page.locator('.room-list-hover-preview_preview.is-active')).toHaveCount(1)
})

test('every preview has a real photo', async ({ page }) => {
  await load(page)
  const sources = await page
    .locator('.room-list-hover-preview_image')
    .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).src))
  expect(sources).toHaveLength(10)
  for (const source of sources) expect(source).toContain('cdn.prod.website-files.com')
})

test('hover and focus switch the preview', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await load(page)
  await open(page)
  await page.locator('[data-room-preview-trigger="guild-loft-suite"]').hover()
  await expect(panel(page, 'guild-loft-suite')).toHaveClass(/is-active/)
  await expect(panel(page, 'cozy-courtyard-queen')).not.toHaveClass(/is-active/)
  await expect(panel(page, 'guild-loft-suite')).toHaveCSS('opacity', '1')
  await expect(page.locator('[data-room-preview-trigger="guild-loft-suite"]')).toHaveClass(
    /is-active/,
  )

  await page.locator('[data-room-preview-trigger="cozy-king"]').focus()
  await expect(panel(page, 'cozy-king')).toHaveClass(/is-active/)
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${SHOTS}/fixture-1440.png` })
})

test('tabs filter the list and keep the preview on a listed room', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await load(page)
  const dialog = await open(page)
  const items = dialog.locator('.room-list-hover-preview_item')

  await dialog.locator('[data-gallery-filter-tag="suite"]').click()
  await expect(items.locator('visible=true')).toHaveCount(4)
  await expect(panel(page, 'guild-city-level-loft')).toHaveClass(/is-active/)

  await dialog.locator('[data-gallery-filter-tag="room"]').click()
  await expect(items.locator('visible=true')).toHaveCount(6)
  await expect(page.locator('.room-list-hover-preview_preview.is-active')).toHaveCount(1)

  await dialog.locator('[data-gallery-filter-tag="all"]').click()
  await expect(items.locator('visible=true')).toHaveCount(10)
})

test('close and Escape close the dialog and return focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await load(page)
  let dialog = await open(page)
  await dialog.locator('.room-list-hover-preview_close').click()
  await expect(dialog).not.toHaveClass(/is-open/)
  await expect(page.locator('[data-modal-open="all-rooms"]')).toBeFocused()

  dialog = await open(page)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toHaveClass(/is-open/)

  dialog = await open(page)
  await dialog.locator('.room-list-hover-preview_back').click()
  await expect(dialog).not.toHaveClass(/is-open/)
})

test('390 layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await load(page)
  await open(page)
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${SHOTS}/fixture-390.png` })
})
