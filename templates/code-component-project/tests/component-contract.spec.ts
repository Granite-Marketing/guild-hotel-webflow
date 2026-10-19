import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('renders semantic section content', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
  await expect(page.locator('main section article header')).toHaveCount(2)
  const sections = page.locator('[data-component="example-section"]')
  await expect(sections).toHaveCount(2)
  const labelledBy = await sections.evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-labelledby')))
  expect(new Set(labelledBy).size).toBe(2)
  const roots = await page.locator('[data-fixture]').evaluateAll((hosts) => hosts.map((host) => Boolean(host.shadowRoot)))
  expect(roots).toEqual([true, true])
})

test('hydrates and remounts isolated fixtures cleanly', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('[data-component="example-section"]')).toHaveCount(2)
  const hydrationErrors = await page.locator('[data-fixture="light"]').getAttribute('data-hydration-errors')
  expect(hydrationErrors).toBe('[]')
  await page.locator('[data-remount="light"]').evaluate((button: HTMLButtonElement) => button.click())
  await expect(page.locator('[data-component="example-section"]')).toHaveCount(2)
  const animatedStyles = await page.locator('[data-fixture="light"] [data-animate-item]').evaluateAll((elements) => elements.map((element) => ({
    opacity: (element as HTMLElement).style.opacity,
    transform: (element as HTMLElement).style.transform,
  })))
  expect(animatedStyles.every(({ opacity, transform }) => opacity === '' && transform === '')).toBe(true)
  expect(consoleErrors.filter((message) => /hydration|did not match/i.test(message))).toEqual([])
})

test('accessibility: supports reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('main')).toBeVisible()
  const animatedStyles = await page.locator('[data-animate-item]').evaluateAll((elements) => elements.map((element) => ({
    opacity: (element as HTMLElement).style.opacity,
    transform: (element as HTMLElement).style.transform,
  })))
  expect(animatedStyles.every(({ opacity, transform }) => opacity === '' && transform === '')).toBe(true)
})

test('accessibility: has no serious automated violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([])
})
