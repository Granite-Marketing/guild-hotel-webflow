import { expect, test, type Page } from '@playwright/test'

import { serveFixtures } from '../../bin/fixtures.js'

/**
 * imageTrailHover against its local fixture (home section 14 placeholders).
 * Runs without Webflow: the fixture server bundles the module in memory.
 */

let fixtures: { origin: string; stop: () => Promise<void> }

test.beforeAll(async () => {
  fixtures = await serveFixtures(3101)
})

test.afterAll(async () => {
  await fixtures.stop()
})

const items = (page: Page) => page.locator('[data-image-trail-hover-item]')

const visibleItemCount = (page: Page) =>
  items(page).evaluateAll(
    (elements) =>
      elements.filter((element) => {
        const style = getComputedStyle(element)
        return style.visibility === 'visible' && parseFloat(style.opacity) === 1
      }).length,
  )

test('trail spawns linked images under the pointer, capped at max', async ({ page }) => {
  await page.goto(`${fixtures.origin}/image-trail-hover.html`)
  const zone = page.getByTestId('trail-zone')
  await zone.scrollIntoViewIfNeeded()

  await expect.poll(() => visibleItemCount(page)).toBe(0)
  await expect(items(page).first()).toHaveCSS('visibility', 'hidden')

  const box = await zone.boundingBox()
  if (!box) throw new Error('trail zone has no box')
  const startX = box.x + box.width * 0.25
  const centerY = box.y + box.height / 2

  await page.mouse.move(startX - 10, centerY)
  for (let step = 0; step <= 5; step += 1) {
    await page.mouse.move(startX + step * 150, centerY, { steps: 5 })
  }

  // End state: exactly max (3) images fully shown, the newest under the pointer.
  await expect.poll(() => visibleItemCount(page)).toBe(3)
  await expect(page.locator('[data-image-trail-hover-item].is-active')).toHaveCount(3)

  const pointerX = startX + 5 * 150
  const topElementHref = await page.evaluate(
    ([x, y]) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href'),
    [pointerX, centerY],
  )
  expect(topElementHref).toMatch(/^\/arts#art-\d$/)

  await zone.screenshot({ path: 'test-results/image-trail-hover-active.png' })

  await page.mouse.move(box.x + box.width / 2, box.y - 200)
  await expect.poll(() => visibleItemCount(page)).toBe(0)
})

test('reduced motion shows the end state with no animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${fixtures.origin}/image-trail-hover.html`)

  // Visible immediately, no tween in flight.
  expect(await visibleItemCount(page)).toBe(3)
  await expect(page.locator('[data-image-trail-hover-item].is-active')).toHaveCount(3)

  await page.getByTestId('trail-zone').screenshot({
    path: 'test-results/image-trail-hover-reduced-motion.png',
  })
})
