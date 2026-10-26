import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * F25 hover image swap: on the /rooms quiz step "Who's checking in?",
 * hovering or focusing an option crossfades the right-hand photo to that
 * option's image, and leaving the options restores the default photo.
 *
 * Serves the repo root with esbuild. The published Webflow CSS, the photos
 * and GSAP load from CDNs, so this needs network.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/hover-image-swap.html'
const KEYS = ['just-me', 'two-guests', '3-4-guests', '5-plus-guests']
const FADE_SETTLE_MS = 700

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/hover-image-swap.ts'],
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
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'networkidle' })
}

const media = (page: Page, key: string) => page.locator(`[data-hover-swap-media="${key}"]`)
const trigger = (page: Page, key: string) => page.locator(`[data-hover-swap-trigger="${key}"]`)

test('default photo shows on load and the others are hidden', async ({ page }) => {
  await load(page)
  await expect(media(page, 'default')).toHaveClass(/is-active/)
  await expect(media(page, 'default')).toHaveCSS('visibility', 'visible')
  for (const key of KEYS) await expect(media(page, key)).toHaveCSS('visibility', 'hidden')
})

test('hovering each option swaps to its photo', async ({ page }) => {
  await load(page)
  for (const key of KEYS) {
    await trigger(page, key).hover()
    await page.waitForTimeout(FADE_SETTLE_MS)
    await expect(media(page, key)).toHaveClass(/is-active/)
    await expect(media(page, key)).toHaveCSS('opacity', '1')
    for (const other of ['default', ...KEYS].filter((candidate) => candidate !== key)) {
      await expect(media(page, other)).not.toHaveClass(/is-active/)
      await expect(media(page, other)).toHaveCSS('opacity', '0')
    }
  }
})

test('leaving the options restores the default photo', async ({ page }) => {
  await load(page)
  await trigger(page, '3-4-guests').hover()
  await page.waitForTimeout(FADE_SETTLE_MS)
  await page.mouse.move(5, 5)
  await page.waitForTimeout(FADE_SETTLE_MS)
  await expect(media(page, 'default')).toHaveClass(/is-active/)
  await expect(media(page, 'default')).toHaveCSS('opacity', '1')
  await expect(media(page, '3-4-guests')).toHaveCSS('opacity', '0')
})

test('keyboard focus swaps the photo and leaving restores it', async ({ page }) => {
  await load(page)
  await trigger(page, 'just-me').focus()
  await page.keyboard.press('Tab')
  await expect(trigger(page, 'two-guests')).toBeFocused()
  await page.waitForTimeout(FADE_SETTLE_MS)
  await expect(media(page, 'two-guests')).toHaveClass(/is-active/)
  await expect(media(page, 'two-guests')).toHaveCSS('opacity', '1')

  await trigger(page, '5-plus-guests').focus()
  await page.keyboard.press('Tab')
  await page.waitForTimeout(FADE_SETTLE_MS)
  await expect(media(page, 'default')).toHaveClass(/is-active/)
  await expect(media(page, 'default')).toHaveCSS('opacity', '1')
})

test('reduced motion swaps instantly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await load(page)
  await trigger(page, '5-plus-guests').hover()
  const opacities = await page.evaluate(() =>
    ['5-plus-guests', 'default'].map((key) => {
      const element = document.querySelector(`[data-hover-swap-media="${key}"]`)
      return element ? getComputedStyle(element).opacity : 'missing'
    }),
  )
  expect(opacities).toEqual(['1', '0'])
})

test('option links keep their quiz attributes and classes', async ({ page }) => {
  await load(page)
  await trigger(page, 'just-me').hover()
  await expect(trigger(page, 'two-guests')).toHaveAttribute('aria-pressed', 'true')
  await expect(trigger(page, 'two-guests')).toHaveClass(/is-text-burgundy/)
  await expect(trigger(page, 'just-me')).not.toHaveClass(/is-active/)
})
