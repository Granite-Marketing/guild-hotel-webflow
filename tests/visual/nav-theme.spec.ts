import { expect, test } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * navTheme: every narrow photo, dark or pale, turns the nav cream across its own
 * width only (Stephen, 26 Nov: all photos white), and a day/night click keeps the masks.
 */

const picture = (colour: string, top = colour) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="${colour}"/><rect width="60" height="12" fill="${top}"/></svg>`)}`

const bundle = async () => {
  const { outputFiles } = await esbuild.build({
    stdin: { contents: "import { navTheme } from '$utils/navTheme'; navTheme()", resolveDir: '.' },
    bundle: true,
    write: false,
    tsconfig: 'tsconfig.json',
  })
  return outputFiles[0].text
}

const page_ = (figures: string) => `
    <style>body{margin:0}header{position:fixed;inset:0 0 auto;color:#f4efdf}.site-nav_bar{height:80px}
      .site-nav_bar a{position:absolute;left:0;right:0;top:20px;height:40px}
      section{position:relative;height:1200px;background:#f4efdf}figure{position:absolute;top:0;height:400px;width:300px;margin:0}
      img{display:block;width:100%;height:100%;object-fit:cover}</style>
    <header data-nav="header"><div class="site-nav_bar"><span id="mode">mode</span><a href="#">logo</a></div></header>
    <section>${figures}</section>`

test('narrow photos, dark or pale, turn the nav cream across their own width only', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 600 })
  await page.setContent(
    page_(`<figure style="left:100px"><img src="${picture('#181008')}"></figure>
      <figure style="left:600px"><img src="${picture('#f8f8f8')}"></figure>`),
  )
  await page.addScriptTag({ content: await bundle() })

  const masks = () =>
    page.evaluate(() => {
      const columns = (element: HTMLElement) => {
        const style = getComputedStyle(element)
        return style.maskPosition.split(', ').map((position, index) => ({
          left: parseFloat(position),
          width: parseFloat(style.maskSize.split(', ')[index]),
          hidden: style.maskImage.split(/,\s*(?=linear-gradient)/)[index].includes('rgb(0, 0, 0)') === false,
        }))
      }
      return {
        clone: columns(document.querySelector<HTMLElement>('body > [inert]')!),
        bar: columns(document.querySelector<HTMLElement>('header .site-nav_bar')!),
        cloneBarMask: document.querySelector<HTMLElement>('body > [inert] .site-nav_bar')!.style.mask,
      }
    })

  const expected = [
    { left: 0, width: 100, hidden: false },
    { left: 100, width: 300, hidden: true },
    { left: 400, width: 200, hidden: false },
    { left: 600, width: 300, hidden: true },
    { left: 900, width: 100, hidden: false },
  ]
  await expect.poll(async () => (await masks()).clone).toEqual(expected)
  expect((await masks()).bar).toEqual(expected.map((column) => ({ ...column, hidden: !column.hidden })))

  // A class change on the bar (the day/night click) rebuilds the clone without copying the bar's inverse mask.
  await page.evaluate(() => document.querySelector('#mode')!.classList.add('is-active'))
  await page.waitForTimeout(100)
  expect((await masks()).clone).toEqual(expected)
  expect((await masks()).cloneBarMask).toBe('')

  // Past the photos: one full-width column again.
  await page.evaluate(() => window.scrollTo(0, 500))
  await expect.poll(async () => (await masks()).clone).toEqual([{ left: 0, width: 1000, hidden: false }])
})

test('a loose photo outside a figure keeps the nav cream; a small icon does not', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 600 })
  await page.setContent(
    page_(`<img style="position:absolute;left:100px;top:0;width:300px;height:400px" src="${picture('#f8f8f8')}">
      <img style="position:absolute;left:600px;top:0;width:40px;height:40px" src="${picture('#181008')}">`),
  )
  await page.addScriptTag({ content: await bundle() })
  await expect
    .poll(() =>
      page.evaluate(() => {
        const style = getComputedStyle(document.querySelector<HTMLElement>('body > [inert]')!)
        return style.maskPosition.split(', ').map((position, index) => ({
          left: parseFloat(position),
          hidden: style.maskImage.split(/,\s*(?=linear-gradient)/)[index].includes('rgb(0, 0, 0)') === false,
        }))
      }),
    )
    .toEqual([
      { left: 0, hidden: false },
      { left: 100, hidden: true },
      { left: 400, hidden: false },
    ])
})
