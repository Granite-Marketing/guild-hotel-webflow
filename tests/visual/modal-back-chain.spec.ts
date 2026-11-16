import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * Modal stack, offline fixture: page -> artwork -> artist.
 * Back, ESC and click-outside pop one level; the dialog beneath returns with
 * focus on the link that opened the popped one; a grid-opened dialog still
 * closes to the page and its trigger.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/modal-back-chain.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/modal-back-chain.ts'],
    bundle: true,
    outdir: 'tests/visual/fixtures',
    tsconfig: 'tsconfig.json',
    logLevel: 'silent',
  })
  const server = await context.serve({ servedir: '.', host: '127.0.0.1' })
  origin = `http://127.0.0.1:${server.port}`
})

test.afterAll(async () => {
  await context?.dispose()
})

const openChain = async (page: Page) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  await page.locator('#grid-trigger').click()
  await expect(page.locator('#artwork')).toHaveClass(/is-open/)
  await page.locator('#artist-link').click()
  await expect(page.locator('#artist')).toHaveClass(/is-open/)
  await expect(page.locator('#artwork')).not.toHaveClass(/is-open/)
}

const expectPage = async (page: Page) => {
  await expect(page.locator('#artwork')).not.toHaveClass(/is-open/)
  await expect(page.locator('#artist')).not.toHaveClass(/is-open/)
  await expect(page.locator('[data-modal-overlay]')).not.toHaveClass(/is-open/)
  await expect(page.locator('#grid-trigger')).toBeFocused()
}

test('Back in the second dialog returns to the first, then closes to the page', async ({ page }) => {
  await openChain(page)
  await page.locator('#artist-back').click()
  await expect(page.locator('#artwork')).toHaveClass(/is-open/)
  await expect(page.locator('#artist')).not.toHaveClass(/is-open/)
  await expect(page.locator('#artist-link')).toBeFocused()
  await expect(page.locator('[data-modal-overlay]')).toHaveClass(/is-open/)

  await page.locator('#artwork-back').click()
  await expectPage(page)
})

test('ESC follows the stack', async ({ page }) => {
  await openChain(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('#artwork')).toHaveClass(/is-open/)
  await expect(page.locator('#artist')).not.toHaveClass(/is-open/)
  await expect(page.locator('#artist-link')).toBeFocused()
  await page.keyboard.press('Escape')
  await expectPage(page)
})

test('click outside follows the stack', async ({ page }) => {
  await openChain(page)
  await page.mouse.click(1200, 650)
  await expect(page.locator('#artwork')).toHaveClass(/is-open/)
  await expect(page.locator('#artist')).not.toHaveClass(/is-open/)
  await expect(page.locator('#artist-link')).toBeFocused()
  await page.mouse.click(1200, 650)
  await expectPage(page)
})

test('a data-modal-open button inside a dialog pushes too', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  await page.locator('#grid-trigger').click()
  await page.locator('#artist-button').click()
  await expect(page.locator('#artist')).toHaveClass(/is-open/)
  await page.locator('#artist-back').click()
  await expect(page.locator('#artwork')).toHaveClass(/is-open/)
  await expect(page.locator('#artist-button')).toBeFocused()
})

test('a grid-opened dialog closes straight to the page', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  await page.locator('#grid-trigger').click()
  await expect(page.locator('#artwork')).toHaveClass(/is-open/)
  await page.locator('#artwork-back').click()
  await expectPage(page)
})
