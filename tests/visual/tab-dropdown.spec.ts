import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * tabDropdown (M19): the mobile subnav panel grows its height with easing and
 * staggers the links in; links are clickable as soon as they show; aria-expanded,
 * Escape and focus behave as before; reduced motion is instant.
 *
 * Serves the repo root with esbuild (fixture entry built in memory). GSAP loads
 * from jsDelivr, so this needs network.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/tab-dropdown.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: { 'tab-dropdown': 'tests/visual/fixtures/tab-dropdown.ts' },
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

test.use({ viewport: { width: 390, height: 800 } })

const load = async (page: Page) => {
  await page.goto(`${origin}${FIXTURE_PATH}`, { waitUntil: 'networkidle' })
  await expect(page.locator('[data-tab-dropdown-toggle]')).toHaveAttribute('aria-expanded', 'false')
}

const toggle = (page: Page) => page.locator('[data-tab-dropdown-toggle]')
const panelHeight = (page: Page) => page.$eval('[data-tab-dropdown-panel]', (panel) => panel.getBoundingClientRect().height)
const links = (page: Page) => page.locator('[data-tab-dropdown-panel] > a')

test('opening eases the panel height and staggers the links', async ({ page }) => {
  await load(page)
  const closedHeight = await panelHeight(page)
  expect(closedHeight).toBeLessThanOrEqual(41)

  await toggle(page).click()
  // Sample the height over the open tween: it must pass through values between
  // the closed and the settled height, not jump.
  const samples = await page.evaluate(async () => {
    const panel = document.querySelector('[data-tab-dropdown-panel]') as HTMLElement
    const values: number[] = []
    const end = performance.now() + 900
    while (performance.now() < end) {
      values.push(panel.getBoundingClientRect().height)
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }
    return values
  })
  const settled = samples[samples.length - 1]
  expect(settled).toBeGreaterThan(closedHeight + 100)
  expect(samples.some((value) => value > closedHeight + 5 && value < settled - 5)).toBe(true)
  for (let i = 1; i < samples.length; i++) expect(samples[i]).toBeGreaterThanOrEqual(samples[i - 1] - 0.5)

  // Settled: no inline animation leftovers.
  await expect(links(page).last()).toHaveCSS('opacity', '0.62')
  expect(await page.$eval('[data-tab-dropdown-panel]', (panel) => (panel as HTMLElement).style.height)).toBe('')
})

test('links reveal in stagger order', async ({ page }) => {
  await load(page)
  await toggle(page).click()
  await page.waitForTimeout(250)
  const opacities = await links(page).evaluateAll((items) => items.map((item) => Number(getComputedStyle(item).opacity)))
  // Mid-reveal the earlier links are further along than the later ones.
  expect(opacities[1]).toBeGreaterThan(opacities[opacities.length - 1])
})

test('a link is clickable as soon as it is visible', async ({ page }) => {
  await load(page)
  await toggle(page).click()
  const target = links(page).nth(1)
  await expect.poll(() => target.evaluate((item) => getComputedStyle(item).visibility)).toBe('visible')
  await target.click({ trial: true })
  await target.click()
  expect(page.url()).toContain('#lobby')
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false')
})

test('aria state, Escape and focus return are unchanged', async ({ page }) => {
  await load(page)
  await expect(toggle(page)).toHaveAttribute('aria-controls', 'tab-dropdown-0')
  await toggle(page).click()
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle(page)).toBeFocused()
  // List stays visible while it collapses, then goes.
  await expect(page.locator('[data-tab-dropdown]')).not.toHaveClass(/is-open/)
  expect(await panelHeight(page)).toBeLessThanOrEqual(41)
  await page.locator('[data-fixture="after"]').click()
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false')
})

test('opening does not change the page height', async ({ page }) => {
  await load(page)
  const before = await page.evaluate(() => document.documentElement.scrollHeight)
  await toggle(page).click()
  await page.waitForTimeout(900)
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(before)
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('opens and closes instantly', async ({ page }) => {
    await load(page)
    await toggle(page).click()
    const opened = await panelHeight(page)
    expect(opened).toBeGreaterThan(150)
    await expect(links(page).first()).toHaveCSS('opacity', '1')
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true')
    await toggle(page).click()
    expect(await panelHeight(page)).toBeLessThanOrEqual(41)
    await expect(page.locator('[data-tab-dropdown]')).not.toHaveClass(/is-open/)
  })
})
