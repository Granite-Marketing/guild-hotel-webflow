import { expect, test, type Page } from '@playwright/test'

import { serveFixtures } from '../../bin/fixtures.js'

/**
 * M6 (iOS toolbar case): the length of a scroll section must not depend on
 * window.innerHeight, which changes when the phone browser's toolbar hides.
 * The test fakes that change, refreshes ScrollTrigger and compares every pin
 * range. GSAP and Lenis load from jsDelivr, so this needs network.
 */

let fixtures: { origin: string; stop: () => Promise<void> }

test.beforeAll(async () => {
  fixtures = await serveFixtures(3103)
})

test.afterAll(async () => {
  await fixtures.stop()
})

test.use({ viewport: { width: 390, height: 800 } })

const pinRanges = (page: Page) =>
  page.evaluate(() => ScrollTrigger.getAll().map((trigger) => ({ start: trigger.start, end: trigger.end })))

test('scroll section lengths stay the same when the toolbar hides', async ({ page }) => {
  await page.goto(`${fixtures.origin}/scroll-enlarge-snap.html`)
  await page.waitForFunction(() => window.fixtureReady === true)
  const before = await pinRanges(page)
  expect(before.length).toBeGreaterThan(0)

  await page.evaluate(() => {
    Object.defineProperty(window, 'innerHeight', { value: 800 + 90, configurable: true })
    ScrollTrigger.refresh()
  })
  const after = await pinRanges(page)
  expect(after).toEqual(before)
})
