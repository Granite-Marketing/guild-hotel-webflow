import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const ledger = JSON.parse(readFileSync(new URL('../project/tokens.json', import.meta.url), 'utf8')) as {
  tokens: Record<string, { approved: string | number }>
}
const remToPx = (value: string | number) => `${parseFloat(String(value)) * 16}px`
const display = remToPx(ledger.tokens['type.heading.display'].approved)
const displayTablet = remToPx(ledger.tokens['type.heading.display-tablet'].approved)
const displayMobile = remToPx(ledger.tokens['type.heading.display-mobile'].approved)

test('visual: component fixture matrix remains stable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page).toHaveScreenshot('component-fixtures.png', { fullPage: true })
})

test('responsive rules switch at both sides of every Webflow breakpoint', async ({ page }) => {
  await page.goto('/')
  const read = async (width: number) => {
    await page.setViewportSize({ width, height: 900 })
    return page.locator('[data-component="example-section"]').first().evaluate((section) => {
      const heading = section.querySelector('h2') as HTMLElement
      const container = section.firstElementChild as HTMLElement
      return {
        fontSize: getComputedStyle(heading).fontSize,
        paddingTop: getComputedStyle(container).paddingTop,
        paddingLeft: getComputedStyle(container).paddingLeft,
      }
    })
  }

  expect(await read(992)).toMatchObject({ fontSize: display, paddingTop: '96px', paddingLeft: '32px' })
  expect(await read(991)).toMatchObject({ fontSize: displayTablet, paddingTop: '80px', paddingLeft: '32px' })
  expect(await read(990)).toMatchObject({ fontSize: displayTablet, paddingTop: '80px', paddingLeft: '32px' })
  expect(await read(768)).toMatchObject({ fontSize: displayTablet, paddingTop: '80px', paddingLeft: '32px' })
  expect(await read(767)).toMatchObject({ fontSize: displayTablet, paddingTop: '64px', paddingLeft: '20px' })
  expect(await read(766)).toMatchObject({ fontSize: displayTablet, paddingTop: '64px', paddingLeft: '20px' })
  expect(await read(480)).toMatchObject({ fontSize: displayTablet, paddingTop: '64px', paddingLeft: '20px' })
  expect(await read(479)).toMatchObject({ fontSize: displayMobile, paddingTop: '64px', paddingLeft: '20px' })
  expect(await read(478)).toMatchObject({ fontSize: displayMobile, paddingTop: '64px', paddingLeft: '20px' })
})
