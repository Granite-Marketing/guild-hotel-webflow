import { expect, test } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * F30 cmsItemLinks: bundles the module, runs it over three CMS-style links
 * and checks the resulting hrefs. No network or Webflow globals needed.
 */

const FIXTURE_HTML = `
  <a id="post" href="#" data-cms-link-path="/happenings-stories/" data-cms-link-slug="locals-night-at-rodeo-bar">post</a>
  <a id="category" href="/happenings" data-cms-link-slug="blog">category</a>
  <a id="empty" href="#" data-cms-link-path="happenings-stories" data-cms-link-slug="">empty</a>
`

let moduleScript = ''

test.beforeAll(async () => {
  const result = await esbuild.build({
    bundle: true,
    write: false,
    format: 'iife',
    target: 'esnext',
    logLevel: 'error',
    stdin: {
      contents: "import { cmsItemLinks } from './src/utils/cmsItemLinks'\ncmsItemLinks()\n",
      resolveDir: process.cwd(),
      loader: 'ts',
    },
  })
  moduleScript = result.outputFiles[0].text
})

test('cmsItemLinks builds item and category hrefs, keeps empty-slug fallback', async ({ page }) => {
  await page.setContent(FIXTURE_HTML)
  await page.addScriptTag({ content: moduleScript })

  await expect(page.locator('#post')).toHaveAttribute('href', '/happenings-stories/locals-night-at-rodeo-bar')
  await expect(page.locator('#category')).toHaveAttribute('href', '/blog')
  await expect(page.locator('#empty')).toHaveAttribute('href', '#')
})
