import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Button outlines: every outlined chamfer button (outlined at rest, or a filled
 * button hovered so the fill drains) draws its ring with ONE shared thickness,
 * and the diagonals render at that thickness at 1x and 2x.
 *
 * Loads the real shared stylesheet through a local fixture, no network.
 * Set SHOT_LABEL=before|after to save the fixture screenshots for the PR.
 */

const FIXTURE = pathToFileURL(resolve('tests/visual/fixtures/button-outlines.html')).href
const SHOT_DIR = resolve('docs/builds/174/screenshots/179')
const OUTLINE_CASES = ['outline-cream', 'outline-dark', 'outline-burgundy', 'outline-blue', 'outline-tall']
const FILLED_CASES = ['filled-cream', 'filled-dark', 'filled-burgundy', 'filled-blue', 'filled-input']

const widthOf = (page: import('@playwright/test').Page, key: string) =>
  page.locator(`[data-case="${key}"]`).evaluate((el) => getComputedStyle(el).getPropertyValue('--btn-outline-width').trim())

for (const scale of [1, 2]) {
  test.describe(`device scale ${scale}x`, () => {
    test.use({ deviceScaleFactor: scale, viewport: { width: 1100, height: 320 } })

    test('every outlined state shares one outline thickness', async ({ page }) => {
      await page.goto(FIXTURE)
      const widths = new Set<string>()
      for (const key of OUTLINE_CASES) widths.add(await widthOf(page, key))
      for (const key of FILLED_CASES) {
        await page.locator(`[data-case="${key}"]`).hover()
        widths.add(await widthOf(page, key))
      }
      expect([...widths]).toHaveLength(1)
      expect([...widths][0]).not.toBe('')
    })

    test('saves fixture screenshot', async ({ page }) => {
      const label = process.env.SHOT_LABEL
      test.skip(!label, 'set SHOT_LABEL=before|after to save PR screenshots')
      await page.goto(FIXTURE)
      mkdirSync(SHOT_DIR, { recursive: true })
      await page.screenshot({ path: `${SHOT_DIR}/${label}-${scale}x.png` })
    })
  })
}
