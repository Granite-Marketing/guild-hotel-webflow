import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * navToggle: link toggle opens without jumping or changing the URL, the
 * data-nav-lock="always" opt-in pauses scroll at desktop width, Escape and
 * link clicks close, and Enter on a link toggle fires once.
 *
 * Serves the repo root with esbuild (fixture entry built in memory). GSAP and
 * Lenis load from jsDelivr, so this needs network.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/nav-toggle.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/nav-toggle.ts'],
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

const load = async (page: Page, query = '') => {
  await page.goto(`${origin}${FIXTURE_PATH}${query}`, { waitUntil: 'networkidle' })
  // Wait for the module to have set its initial state.
  await expect(page.locator('[data-nav="open"]')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('[data-nav="open"]')).toHaveAttribute('aria-label', 'Open menu')
}

const header = (page: Page) => page.locator('[data-nav="header"]')
const toggle = (page: Page) => page.locator('[data-nav="open"]')
const menuVisibility = (page: Page) =>
  page.$eval('[data-nav="menu"]', (menu) => getComputedStyle(menu).visibility)

/** Scroll by wheel and report how far the page moved. */
const wheelMoves = async (page: Page) => {
  const before = await page.evaluate(() => window.scrollY)
  await page.mouse.move(720, 450)
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(800)
  return (await page.evaluate(() => window.scrollY)) - before
}

test('clicking the link toggle opens the menu without jumping or changing the URL', async ({ page }) => {
  await load(page)
  // Park a little way down so a jump to top (href="#") would be visible.
  await page.evaluate(() => window.scrollTo(0, 200))
  const scrollBefore = await page.evaluate(() => window.scrollY)
  const urlBefore = page.url()

  await toggle(page).click()

  await expect(header(page)).toHaveClass(/is-nav-open/)
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle(page)).toHaveAttribute('aria-label', 'Close menu')
  await expect.poll(() => menuVisibility(page)).toBe('visible')
  expect(page.url()).toBe(urlBefore)
  expect(page.url()).not.toContain('#')
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore)
})

test('data-nav-lock="always" pauses scroll at 1440 wide until Escape', async ({ page }) => {
  await load(page)
  expect(await wheelMoves(page)).toBeGreaterThan(0)
  await page.evaluate(() => window.scrollTo(0, 0))

  await toggle(page).click()
  await expect(header(page)).toHaveClass(/is-nav-open/)
  expect(await wheelMoves(page)).toBe(0)

  await page.keyboard.press('Escape')
  await expect(header(page)).not.toHaveClass(/is-nav-open/)
  expect(await wheelMoves(page)).toBeGreaterThan(0)
})

test('clicking a menu link closes the menu', async ({ page }) => {
  await load(page)
  await toggle(page).click()
  await expect(header(page)).toHaveClass(/is-nav-open/)
  await expect.poll(() => menuVisibility(page)).toBe('visible')

  await page.locator('[data-nav="link"]').first().click()
  await expect(header(page)).not.toHaveClass(/is-nav-open/)
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle(page)).toHaveAttribute('aria-label', 'Open menu')
})

test('Enter on the link toggle opens once and Space closes it', async ({ page }) => {
  await load(page)
  await toggle(page).focus()

  await page.keyboard.press('Enter')
  await expect(header(page)).toHaveClass(/is-nav-open/)
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true')
  // A double toggle would close it again; give any second handler time to run.
  await page.waitForTimeout(800)
  await expect(header(page)).toHaveClass(/is-nav-open/)
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true')

  await page.keyboard.press('Space')
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false')
  await expect(header(page)).not.toHaveClass(/is-nav-open/)
})

test('without data-nav-lock, opening at 1440 wide does not stop scroll', async ({ page }) => {
  await load(page, '?lock=off')
  await expect(header(page)).not.toHaveAttribute('data-nav-lock', /.*/)

  await toggle(page).click()
  await expect(header(page)).toHaveClass(/is-nav-open/)
  expect(await wheelMoves(page)).toBeGreaterThan(0)
})

/** The bar with the given y attribute inside the toggle's SVG. */
const bar = (page: Page, y: string) => page.locator(`[data-nav="open"] svg rect[y="${y}"]`)

test('the hamburger morphs to an X on open and back on close', async ({ page }) => {
  await load(page)
  const topBar = bar(page, '0')
  const middleBar = bar(page, '6.8811')

  await toggle(page).click()
  await expect(toggle(page)).toHaveAttribute('aria-controls', /.+/)
  await expect
    .poll(async () => (await topBar.getAttribute('transform')) ?? '')
    .toMatch(/rotate\(45|matrix\(0\.707/)
  await expect
    .poll(() => middleBar.evaluate((element) => getComputedStyle(element).visibility))
    .toBe('hidden')

  await toggle(page).click()
  await expect(toggle(page)).toHaveAttribute('aria-label', 'Open menu')
  await expect
    .poll(() => middleBar.evaluate((element) => getComputedStyle(element).visibility))
    .toBe('visible')
})
