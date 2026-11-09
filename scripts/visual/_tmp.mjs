import { chromium } from '@playwright/test'
import fs from 'fs'
const S='https://the-guild-hotel-c34e71.webflow.io'
const out='/private/tmp/claude-501/-Users-sanindo-guild-hotel-webflow--claude-worktrees-client-feedback-implementation-c8b545/befc8e0a-85ea-410f-82d7-a18b729baefb/scratchpad'
const b = await chromium.launch({ channel: 'chrome' })
const page = async (w,h=900) => { const p = await b.newPage({ viewport:{width:w,height:h} })
  await p.route(/cdn\.jsdelivr\.net\/gh\/Granite-Marketing\/guild-hotel-webflow@.*\/dist\/(index\.js|site\.css)/, r => r.fulfill({ body: fs.readFileSync('dist/'+r.request().url().split('/dist/')[1]), contentType: r.request().url().endsWith('.css')?'text/css':'text/javascript' }))
  return p }
// 9: quiz gaps
for (const w of [393, 800, 1440]) {
  const p = await page(w, 852)
  await p.goto(S+'/rooms?v='+Date.now(), { waitUntil: 'load' }); await p.waitForTimeout(2500)
  for (const [s,o] of [[1,'two-guests'],[2,'couples-getaway'],[3,'spaciousness']]) { await p.click(`[data-rooms-quiz-step="${s}"] [data-rooms-quiz-option="${o}"]`); await p.waitForTimeout(1200) }
  await p.waitForTimeout(3000)
  console.log('quiz', w, JSON.stringify(await p.evaluate(()=>{const it=[...document.querySelectorAll('[fs-cmsnest-element="list"] > .w-dyn-items > .w-dyn-item:not(.hide)')];const sec=it[0].closest('section');return {items:it.map(i=>{const r=i.getBoundingClientRect(),c=i.firstElementChild.getBoundingClientRect();return [i.querySelector('h3').textContent,Math.round(r.top+scrollY),Math.round(r.bottom+scrollY),'card',Math.round(c.bottom+scrollY)]}), secBottom:Math.round(sec.getBoundingClientRect().bottom+scrollY), next:Math.round(sec.nextElementSibling.getBoundingClientRect().top+scrollY)}})))
  if (w===393) { await p.evaluate(()=>document.querySelector('[fs-cmsnest-element="list"] .w-dyn-item:not(.hide)').scrollIntoView()); await p.waitForTimeout(1500); await p.screenshot({path:out+'/fix-quiz-393.png'}) }
  if (w===1440) {
    const card = p.locator('[fs-cmsnest-element="list"] .w-dyn-item:not(.hide)').filter({hasText:'Cozy Queen'}).first()
    await card.evaluate(c=>c.scrollIntoView({block:'center'})); await p.waitForTimeout(1500); await card.hover(); await p.waitForTimeout(3500)
    console.log('video', JSON.stringify(await card.evaluate(c=>{const v=c.querySelector('video');return {src:v.currentSrc,t:v.currentTime.toFixed(2),paused:v.paused,op:getComputedStyle(v).opacity,w:v.videoWidth}})))
    await card.screenshot({path:out+'/fix-video-hover.png'})
  }
  await p.close()
}
// 8: meetings button
{ const p = await page(1440)
  await p.goto(S+'/meetings?v='+Date.now(), { waitUntil: 'load' }); await p.waitForTimeout(2000)
  const btn = p.locator('.section_meetings-collection-features .button.is-dark').first()
  await btn.evaluate(e=>e.scrollIntoView({block:'center'})); await p.waitForTimeout(1500)
  await btn.screenshot({path:out+'/fix-btn-rest.png'}); await btn.hover(); await p.waitForTimeout(800); await btn.screenshot({path:out+'/fix-btn-hover.png'}); await p.close() }
// 5: corporate
{ const p = await page(1440)
  await p.goto(S+'/legal-corporate/corporate?v='+Date.now(), { waitUntil: 'load' }); await p.waitForTimeout(2000)
  const item = p.locator('.feature-grid-dark-eyebrow_item').nth(2)
  await item.evaluate(e=>e.scrollIntoView({block:'center'})); await p.waitForTimeout(1500)
  const bx = await item.boundingBox(); await p.mouse.move(bx.x+bx.width*0.6, bx.y+bx.height*0.5, {steps:5}); await p.waitForTimeout(1200)
  await p.screenshot({path:out+'/fix-corporate.png'}); await p.close() }
await b.close()
