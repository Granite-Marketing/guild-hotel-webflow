import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * W02 runtime fixes, offline fixture:
 * - accordion opens only the first item on load, sets aria-expanded on every
 *   header, and toggles on Space and Enter;
 * - modals open from Enter and Space on a div trigger, from `#id` hash links
 *   (also inside an open dialog) and from location.hash on load;
 * - a close control with `href="#section"` closes and scrolls to the section.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/runtime-keys-and-hash.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/runtime-keys-and-hash.ts'],
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

const load = (page: Page, hash = '') => page.goto(`${origin}${FIXTURE_PATH}${hash}`)

test('accordion opens only the first item on load', async ({ page }) => {
  await load(page)
  const headers = page.locator('.accordion_header')
  await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'true')
  await expect(headers.nth(0)).toHaveClass(/is-active/)
  await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'false')
  await expect(headers.nth(2)).toHaveAttribute('aria-expanded', 'false')
  const heights = await page
    .locator('.accordion_content-wrapper')
    .evaluateAll((wrappers) => wrappers.map((wrapper) => (wrapper as HTMLElement).style.maxHeight))
  expect(parseFloat(heights[0])).toBeGreaterThan(0)
  expect(heights.slice(1)).toEqual(['0px', '0px'])
})

test('accordion toggles on Space without scrolling, and on Enter', async ({ page }) => {
  await load(page)
  const second = page.locator('.accordion_header').nth(1)
  await second.focus()
  const scrollBefore = await page.evaluate(() => window.scrollY)
  await page.keyboard.press('Space')
  await expect(second).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.accordion_header').nth(0)).toHaveAttribute('aria-expanded', 'false')
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore)
  await page.keyboard.press('Enter')
  await expect(second).toHaveAttribute('aria-expanded', 'false')
})

test('Enter and Space on a div trigger open its dialog', async ({ page }) => {
  await load(page)
  const trigger = page.locator('.timeline_item')
  await expect(trigger).toHaveAttribute('tabindex', '0')
  await expect(trigger).toHaveAttribute('role', 'button')
  const dialog = page.locator('#timeline-dialog')

  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(dialog).toHaveClass(/is-open/)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toHaveClass(/is-open/)
  await expect(trigger).toBeFocused()

  await page.keyboard.press('Space')
  await expect(dialog).toHaveClass(/is-open/)
})

test('a #id hash link opens the dialog without changing the URL', async ({ page }) => {
  await load(page)
  await page.locator('.rooms_link').click()
  await expect(page.locator('#all-rooms')).toHaveClass(/is-open/)
  expect(new URL(page.url()).hash).toBe('')
})

test('a hash link inside an open dialog switches dialogs and keeps return focus', async ({ page }) => {
  await load(page)
  const trigger = page.locator('.timeline_item')
  await trigger.click()
  await expect(page.locator('#timeline-dialog')).toHaveClass(/is-open/)
  await page.locator('.timeline_rooms-link').click()
  await expect(page.locator('#timeline-dialog')).not.toHaveClass(/is-open/)
  await expect(page.locator('#all-rooms')).toHaveClass(/is-open/)
  await page.keyboard.press('Escape')
  await expect(page.locator('#all-rooms')).not.toHaveClass(/is-open/)
  await expect(trigger).toBeFocused()
})

test('location.hash naming a dialog opens it on load', async ({ page }) => {
  await load(page, '#all-rooms')
  await expect(page.locator('#all-rooms')).toHaveClass(/is-open/)
  await expect(page.locator('#all-rooms')).toHaveAttribute('aria-hidden', 'false')
})

test('a close control with a section href closes and scrolls there', async ({ page }) => {
  await load(page)
  await page.locator('.rooms_link').click()
  await expect(page.locator('#all-rooms')).toHaveClass(/is-open/)
  await page.locator('.rooms_quiz-link').click()
  await expect(page.locator('#all-rooms')).not.toHaveClass(/is-open/)
  await expect(page.locator('#quiz')).toBeFocused()
  await expect
    .poll(() => page.locator('#quiz').evaluate((element) => Math.round(element.getBoundingClientRect().top)))
    .toBeLessThan(50)
})
