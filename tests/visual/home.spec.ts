import { expect, test } from '@playwright/test'

/**
 * Home smoke check on the published staging site: the page loads, the main
 * nav exists and at least one section is in the DOM. Sections are not
 * required to be visible, because GSAP hides some of them until they scroll
 * into view.
 *
 * Uses `WEBFLOW_SITE_URL` when it is set to a real site, else the staging URL
 * cached in docs/reference/webflow-ids.md. Needs network.
 */

const STAGING_URL = 'https://the-guild-hotel-c34e71.webflow.io'
const configuredUrl = process.env.WEBFLOW_SITE_URL
const HOME_URL =
  configuredUrl && !configuredUrl.includes('your-site') ? configuredUrl : STAGING_URL

test('home loads with the main nav and at least one section', async ({ page }) => {
  const response = await page.goto(HOME_URL, { waitUntil: 'domcontentloaded' })
  expect(response?.ok()).toBe(true)
  await expect(page.locator('nav[aria-label="Main"]')).toHaveCount(1)
  expect(await page.locator('section').count()).toBeGreaterThan(0)
})
