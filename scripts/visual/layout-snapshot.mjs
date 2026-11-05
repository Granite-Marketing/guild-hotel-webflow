// Record every main section's box (and its text/image leaves) for a list of
// pages at one viewport width, so a later run can prove nothing moved.
// Usage: node scripts/visual/layout-snapshot.mjs <width> <out.json> [compare.json]
import { chromium } from '@playwright/test'
import fs from 'node:fs'

const [width, out, compareWith] = process.argv.slice(2)
const base = 'https://the-guild-hotel-c34e71.webflow.io'
const pages = ['/', '/history', '/dining', '/dining/dining-zuma', '/dining/dining-gardenterrace', '/rooms', '/rooms/cozy-courtyard-king', '/wellness', '/guidelines', '/happenings', '/blog', '/happenings-stories/historical-tours', '/meetings', '/legal-corporate/corporate', '/legal-corporate/legal', '/neighborhood', '/gallery', '/arts', '/contact', '/press', '/privacy-policy']
const browser = await chromium.launch({ channel: 'chrome' })
const result = {}
for (const path of pages) {
  const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } })
  await page.goto(`${base}${path}?v=${Date.now()}`, { waitUntil: 'load' })
  const height = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(60)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(600)
  result[path] = await page.evaluate(() =>
    [...document.querySelectorAll('main.main-wrapper > *')].map((section) => {
      const box = section.getBoundingClientRect()
      const leaves = [...section.querySelectorAll('h1,h2,h3,p,img,a')]
        .filter((el) => el.getBoundingClientRect().height > 1 && !el.closest('.gm-style'))
        .slice(0, 40)
        .map((el) => {
          const r = el.getBoundingClientRect()
          return [el.tagName, Math.round(r.left), Math.round(r.top - box.top), Math.round(r.width), Math.round(r.height)].join(',')
        })
      return { cls: section.className.split(' ')[0], h: Math.round(box.height), leaves }
    }),
  )
  await page.close()
}
await browser.close()
fs.writeFileSync(out, JSON.stringify(result))
if (compareWith) {
  const before = JSON.parse(fs.readFileSync(compareWith, 'utf8'))
  let changes = 0
  for (const path of pages) {
    const a = before[path] || []
    const b = result[path] || []
    b.forEach((section, i) => {
      const old = a[i]
      if (!old || old.cls !== section.cls || Math.abs(old.h - section.h) > 2 || old.leaves.join('|') !== section.leaves.join('|')) {
        changes++
        console.log(`CHANGED ${path} #${i} ${section.cls} h ${old?.h} -> ${section.h}`)
      }
    })
    if (a.length !== b.length) console.log(`CHANGED ${path} section count ${a.length} -> ${b.length}`)
  }
  console.log(changes ? `${changes} section(s) changed` : 'no layout changes')
}
