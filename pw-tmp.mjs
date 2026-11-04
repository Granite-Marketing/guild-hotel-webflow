import { chromium } from '@playwright/test'
const S='/private/tmp/claude-501/-Users-sanindo-guild-hotel-webflow--claude-worktrees-client-feedback-implementation-c8b545/befc8e0a-85ea-410f-82d7-a18b729baefb/scratchpad'
const b=await chromium.launch({channel:'chrome'})
for(const w of [390,1440]){
  const p=await b.newPage({viewport:{width:w,height:900}})
  await p.goto('https://the-guild-hotel-c34e71.webflow.io/dining/dining-zuma',{waitUntil:'networkidle'})
  console.log(w,await p.evaluate(()=>[...document.querySelectorAll('section')].map(s=>s.className+' '+getComputedStyle(s).display+' h='+Math.round(s.getBoundingClientRect().height)+' '+(s.innerText||'').slice(0,40).replace(/\n/g,' '))))
  await p.close()}
await b.close()
