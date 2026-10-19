import { expect, test } from '@playwright/test'

test.skip(!process.env.WEBFLOW_SMOKE_URL, 'Set WEBFLOW_SMOKE_URL after a development-library import.')

test('Webflow staging renders the imported component contract', async ({ page }) => {
  await page.goto(process.env.WEBFLOW_SMOKE_URL!)
  await expect(page.locator('[data-component="example-section"]')).toHaveCount(2)
})
