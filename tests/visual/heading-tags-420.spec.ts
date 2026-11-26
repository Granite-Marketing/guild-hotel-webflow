import { expect, test } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * Heading tags (#420): scripts find a heading by its role (class or data
 * attribute), not by its tag, so the SEO tag changes (h2 to p, div to h3)
 * cannot break them. Offline fixture except the GSAP CDN tags.
 *
 * MUTATION: each guard below fails if its module goes back to finding the
 * heading by tag only (h1 to h6, or h2 and h3).
 */

const FIXTURE_PATH = '/tests/visual/fixtures/heading-tags-420.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/heading-tags-420.ts'],
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

test('a dialog whose title is a paragraph gets its accessible name from that title', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  await expect(page.locator('#paragraph-dialog')).toHaveAttribute('aria-labelledby', 'paragraph-title')
  await page.locator('#open-dialog').click()
  await expect(page.locator('#paragraph-dialog')).toHaveClass(/is-open/)
  await expect(page.getByRole('dialog', { name: 'The paragraph title' })).toBeVisible()
})

test('a title marked data-modal-title wins over an earlier paragraph and a later heading', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  await expect(page.locator('#heading-dialog')).toHaveAttribute('aria-labelledby', 'marked-title')
})

test('the room grid card name can be a paragraph: details are hidden at rest and shown on hover', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  const details = page.locator('#grid-details')
  await expect(details).toHaveCSS('opacity', '0')
  const header = page.locator('.rooms-collection-room-grid_header')
  // At rest the name is shifted down toward the card's bottom inset; that shift needs the name element.
  await expect.poll(() => header.evaluate((element) => Number(gsap.getProperty(element, 'y')))).toBeGreaterThan(0)
  await page.locator('#grid-card').hover()
  await expect(details).toHaveCSS('opacity', '1')
  await expect.poll(() => header.evaluate((element) => Number(gsap.getProperty(element, 'y')))).toBe(0)
})

test('the rooms quiz focuses the heading of the next step when it is a paragraph', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  await expect(page.locator('#quiz-heading-2')).toHaveAttribute('tabindex', '-1')
  await page.locator('#quiz-option').click()
  await expect(page.locator('#quiz-heading-2')).toBeFocused()
})

test('script reveal picks up script text whether it is an h2, h3 or p, and not a div', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  for (const tag of ['h2', 'h3', 'p']) {
    await expect(page.locator(`[data-script-case="${tag}"]`)).toHaveAttribute('data-script-reveal', '')
  }
  await expect(page.locator('[data-script-case="div"]')).not.toHaveAttribute('data-script-reveal', '')
})

test('line mask splits an h2, h3 and p, and a div only when marked data-line-mask', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  const isSplit = (testCase: string) =>
    page.locator(`[data-case="${testCase}"]`).evaluate((element) => element.querySelector('div') !== null)
  for (const testCase of ['h2', 'h3', 'p', 'div-marked']) {
    await expect.poll(() => isSplit(testCase), { message: testCase }).toBe(true)
  }
  expect(await isSplit('div-plain')).toBe(false)
})
