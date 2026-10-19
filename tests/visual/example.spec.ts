import { test } from '@playwright/test'

/**
 * Example visual regression test.
 *
 * The `/build-component` skill creates new specs in this directory per
 * component it builds — naming convention: `<component-name>.spec.ts`.
 * Each spec captures a screenshot to `test-results/` for Claude vision to
 * compare against the Figma reference.
 *
 * The Webflow staging URL is read from `WEBFLOW_SITE_URL` in `.env` (with
 * a fallback in `playwright.config.ts`). Replace the route below and the
 * selector with your project's first component.
 */
test('capture example component', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  const component = page.locator('section').first()
  await component.waitFor({ state: 'visible' })

  await component.screenshot({ path: 'test-results/example-current.png' })
})
