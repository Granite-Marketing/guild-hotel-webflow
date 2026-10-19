/**
 * Webflow MCP Starter: single bundle entry point.
 *
 * Loaded once via `<script src>` in Webflow Site Settings footer, after the
 * GSAP/ScrollTrigger/SplitText/Swiper/Lenis CDN tags. `Webflow.push` fires
 * after DOMContentLoaded and Webflow.js init, so every CDN global is
 * available inside the callback: no polling, no queues.
 *
 * Per-project modules live in `src/utils/` and are imported + called below.
 * The starter wires a generic baseline only: lazy-image promotion, the
 * smooth-scroll engine (Lenis by default, swappable in `$utils/smoothScroll`),
 * modals, Swiper sliders, accordion, footer year, and scroll-triggered
 * fade/slide reveals. Opt-in modules are listed in the commented block
 * below; DOM contracts and order rules are in
 * docs/reference/runtime-modules.md.
 */

import { accordion } from '$utils/accordion'
import { currentYear } from '$utils/currentYear'
import { eagerImages } from '$utils/eagerImages'
import { gsapBasicAnimations } from '$utils/gsapBasicAnimations'
import { modals } from '$utils/modals'
import { smoothScroll } from '$utils/smoothScroll'
import { swiperSliders } from '$utils/swiperSliders'

/*
 * Opt-in modules. Uncomment the import and the call, keeping the call in
 * the slot shown in the Webflow.push order below.
 *
 *   import { debugOverlay } from '$utils/debugOverlay'               // slot A
 *   import { scrollPin } from '$utils/scrollPin'                     // slot B
 *   import { backgroundVideo } from '$utils/backgroundVideo'         // slot C
 *   import { heroTextReveal } from '$utils/heroTextReveal'           // slot C
 *   import { navToggle } from '$utils/navToggle'                     // slot D
 *   import { imageHoverScale } from '$utils/imageHoverScale'         // slot D
 *   import { imageTrailHover } from '$utils/imageTrailHover'         // slot D
 *   import { viewSwitcher } from '$utils/viewSwitcher'               // slot E
 *   import { cmsFilterLinks } from '$utils/cmsFilterLinks'           // slot E
 *   import { filterPanels } from '$utils/filterPanels'               // slot F
 *   import { scrollHint } from '$utils/scrollHint'                   // slot F
 *   import { finsweetRefresh } from '$utils/finsweetRefresh'         // slot F
 *   import { filterActiveState } from '$utils/filterActiveState'     // slot F
 *   import { scrollTextReveal } from '$utils/scrollTextReveal'       // slot G
 *   import { imageStackCollapse } from '$utils/imageStackCollapse'   // slot G
 */

window.Webflow ||= [] as unknown as WebflowQueue
window.Webflow.push(() => {
  // Promote [data-eager] images before any ScrollTrigger exists, so
  // window.load waits for them and the load refresh measures settled layout.
  eagerImages()

  // slot A: debugOverlay() (before the engine, so it logs the first refresh)
  smoothScroll.init()
  // slot B: scrollPin() (after the engine; required under ScrollSmoother)

  // slot C: backgroundVideo(), heroTextReveal()
  swiperSliders()

  // slot D: navToggle(), imageHoverScale(), imageTrailHover()
  //   imageTrailHover: enable once home section 14 (heading-wide-image-cta)
  //   carries [data-image-trail-hover].
  accordion()
  modals()

  currentYear()
  // slot E: viewSwitcher(), cmsFilterLinks()
  // slot F, in this order: filterPanels(), scrollHint(), finsweetRefresh(),
  //   filterActiveState()

  // ScrollTrigger-creating reveals last, after DOM-mutating modules settle.
  gsapBasicAnimations()
  // slot G: scrollTextReveal()
  // slot G: imageStackCollapse() (enable once a page carries [data-image-stack-collapse])
})
