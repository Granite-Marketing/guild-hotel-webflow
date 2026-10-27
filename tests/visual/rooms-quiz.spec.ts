import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * F26 rooms quiz: one step at a time, click to answer and advance, back
 * keeps answers, and step 3 reveals the rooms linked to all three answers,
 * else the closest matches (guests plus one other answer), else an empty
 * message.
 *
 * Fixture rooms (nested options already in place, as CMS Nest leaves them):
 *   A: two-guests, couples-getaway, business-trip, quiet
 *   B: two-guests, couples-getaway, quiet
 *   C: 5-plus-guests, business-trip
 *   D: nest never filled
 *
 * Serves the repo root with esbuild. GSAP loads from a CDN, so this needs
 * network.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/rooms-quiz.html'
const FADE_SETTLE_MS = 700

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/rooms-quiz.ts'],
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
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${origin}${FIXTURE_PATH}${query}`, { waitUntil: 'networkidle' })
}

const panel = (page: Page, step: number) => page.locator(`[data-rooms-quiz-step="${step}"]`)
const option = (page: Page, slug: string) => page.locator(`[data-rooms-quiz-option="${slug}"]`)
const room = (page: Page, id: string) => page.locator(`[data-room="${id}"]`)
const results = (page: Page) => page.locator('[data-rooms-quiz-results]')
const closest = (page: Page) => page.locator('[data-rooms-quiz-closest]')
const empty = (page: Page) => page.locator('[data-rooms-quiz-empty]')
const loading = (page: Page) => page.locator('[data-rooms-quiz-loading]')

const answer = async (page: Page, slugs: string[]) => {
  for (const slug of slugs) await option(page, slug).click()
}

const expectRooms = async (page: Page, visible: string[]) => {
  for (const id of ['a', 'b', 'c', 'd']) {
    if (visible.includes(id)) await expect(room(page, id)).toBeVisible()
    else await expect(room(page, id)).toBeHidden()
  }
}

test('load shows step 1 only, with steps 2 and 3 and the results hidden', async ({ page }) => {
  await load(page)
  await expect(panel(page, 1)).toBeVisible()
  await expect(panel(page, 2)).toBeHidden()
  await expect(panel(page, 3)).toBeHidden()
  for (const section of await results(page).all()) await expect(section).toBeHidden()
})

test('clicking an option marks it pressed, shows step 2 and focuses its question', async ({ page }) => {
  await load(page)
  await option(page, 'two-guests').click()
  await expect(option(page, 'two-guests')).toHaveAttribute('aria-pressed', 'true')
  await expect(option(page, 'two-guests')).toHaveClass(/is-active/)
  await expect(panel(page, 1)).toBeHidden()
  await expect(panel(page, 2)).toBeVisible()
  await expect(panel(page, 2).locator('h2')).toBeFocused()
})

test('the selected option keeps is-fill and its variant classes', async ({ page }) => {
  await load(page)
  await option(page, 'just-me').click()
  await expect(option(page, 'just-me')).toHaveClass('button is-chamfer is-outline-light is-fill is-active')
})

test('an option click does not jump the page to the top', async ({ page }) => {
  await load(page)
  await page.evaluate(() => window.scrollTo(0, 60))
  // Playwright scrolls a target into view before clicking; settle that first.
  await option(page, 'two-guests').scrollIntoViewIfNeeded()
  const before = await page.evaluate(() => window.scrollY)
  expect(before).toBeGreaterThan(0)
  await option(page, 'two-guests').click()
  await expect(panel(page, 2)).toBeVisible()
  expect(await page.evaluate(() => window.scrollY)).toBe(before)
  expect(page.url()).not.toContain('#')
})

test('Enter on a focused option advances the step', async ({ page }) => {
  await load(page)
  await option(page, 'just-me').focus()
  await page.keyboard.press('Enter')
  await expect(panel(page, 2)).toBeVisible()
  await expect(option(page, 'just-me')).toHaveAttribute('aria-pressed', 'true')
})

test('AE1: exact matches show those rooms and no closest line', async ({ page }) => {
  await load(page)
  await answer(page, ['two-guests', 'couples-getaway', 'quiet'])
  await expect(results(page).first()).toBeVisible()
  await expectRooms(page, ['a', 'b'])
  await expect(closest(page)).toBeHidden()
  await expect(empty(page)).toBeHidden()
})

test('AE2: with no exact match, guests plus one other answer shows under the closest line', async ({ page }) => {
  await load(page)
  await answer(page, ['5-plus-guests', 'business-trip', 'courtyard-view'])
  await expectRooms(page, ['c'])
  await expect(closest(page)).toBeVisible()
  await expect(empty(page)).toBeHidden()
})

test('with neither an exact nor a closest match the empty message shows and no cards', async ({ page }) => {
  await load(page)
  await answer(page, ['just-me', 'celebration', 'street-view'])
  await expectRooms(page, [])
  await expect(empty(page)).toBeVisible()
  await expect(closest(page)).toBeHidden()
  await expect(page.locator('[data-rooms-quiz-restart]')).toBeVisible()
})

test('a card whose nest never filled is never shown', async ({ page }) => {
  await load(page)
  await answer(page, ['two-guests', 'business-trip', 'quiet'])
  await expectRooms(page, ['a'])
  await expect(room(page, 'd')).toBeHidden()
})

test('after step 3 the step 3 panel stays visible with its pick pressed', async ({ page }) => {
  await load(page)
  await answer(page, ['two-guests', 'couples-getaway', 'quiet'])
  await expect(panel(page, 3)).toBeVisible()
  await expect(option(page, 'quiet')).toHaveAttribute('aria-pressed', 'true')
})

test('AE3: back on step 3 shows step 2 with its answer pressed, and a new pick replaces it', async ({ page }) => {
  await load(page)
  await answer(page, ['two-guests', 'couples-getaway'])
  await panel(page, 3).locator('[data-rooms-quiz-back]').click()
  await expect(panel(page, 2)).toBeVisible()
  await expect(panel(page, 3)).toBeHidden()
  await expect(option(page, 'couples-getaway')).toHaveAttribute('aria-pressed', 'true')
  await option(page, 'business-trip').click()
  await expect(option(page, 'business-trip')).toHaveAttribute('aria-pressed', 'true')
  await expect(option(page, 'couples-getaway')).toHaveAttribute('aria-pressed', 'false')
  await expect(option(page, 'couples-getaway')).not.toHaveClass(/is-active/)
  await expect(panel(page, 3)).toBeVisible()
})

test('AE3: back to the quiz from the results clears answers, hides results and shows step 1', async ({ page }) => {
  await load(page)
  await answer(page, ['two-guests', 'couples-getaway', 'quiet'])
  await page.locator('[data-rooms-quiz-restart]').click()
  await expect(panel(page, 1)).toBeVisible()
  await expect(panel(page, 3)).toBeHidden()
  for (const section of await results(page).all()) await expect(section).toBeHidden()
  await expect(page.locator('[data-rooms-quiz-option][aria-pressed="true"]')).toHaveCount(0)
  await expect(page.locator('[data-rooms-quiz-option].is-active')).toHaveCount(0)
})

test('with the CMS Nest callback withheld, step 3 shows loading, then the empty message after the timeout', async ({ page }) => {
  await load(page, '?nest=hold&timeout=1500')
  await answer(page, ['two-guests', 'couples-getaway', 'quiet'])
  await expect(loading(page)).toBeVisible()
  await expect(empty(page)).toBeHidden()
  await expect(empty(page)).toBeVisible({ timeout: 4000 })
  await expect(loading(page)).toBeHidden()
  await expect(page.locator('[data-rooms-quiz-restart]')).toBeVisible()
})

test('back after a hovered pick shows the previous step resting photo', async ({ page }) => {
  await load(page)
  await option(page, 'two-guests').hover()
  await page.waitForTimeout(FADE_SETTLE_MS)
  await option(page, 'two-guests').click()
  await panel(page, 2).locator('[data-rooms-quiz-back]').click()
  await page.waitForTimeout(FADE_SETTLE_MS)
  const step1 = panel(page, 1)
  await expect(step1.locator('[data-hover-swap-media="default"]')).toHaveClass(/is-active/)
  await expect(step1.locator('[data-hover-swap-media="two-guests"]')).not.toHaveClass(/is-active/)
})
