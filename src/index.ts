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
import { cardCarouselHeaderLeft } from '$utils/cardCarouselHeaderLeft'
import { currentYear } from '$utils/currentYear'
import { eagerImages } from '$utils/eagerImages'
import { galleryFilter } from '$utils/galleryFilter'
import { gsapBasicAnimations } from '$utils/gsapBasicAnimations'
import { historyStickyYear } from '$utils/historyStickyYear'
import { imageHoverScale } from '$utils/imageHoverScale'
import { imageStackCollapse } from '$utils/imageStackCollapse'
import { imageTrailHover } from '$utils/imageTrailHover'
import { mediaTabs } from '$utils/mediaTabs'
import { modals } from '$utils/modals'
import { navTheme } from '$utils/navTheme'
import { navToggle } from '$utils/navToggle'
import { offersSliderSplit } from '$utils/offersSliderSplit'
import { roomListHoverPreview } from '$utils/roomListHoverPreview'
import { scrollEnlargeSnap } from '$utils/scrollEnlargeSnap'
import { smoothScroll } from '$utils/smoothScroll'
import { stickyCta } from '$utils/stickyCta'
import { swiperSliders } from '$utils/swiperSliders'

/*
 * Opt-in modules. Uncomment the import and the call, keeping the call in
 * the slot shown in the Webflow.push order below.
 *
 *   import { debugOverlay } from '$utils/debugOverlay'               // slot A
 *   import { scrollPin } from '$utils/scrollPin'                     // slot B
 *   import { backgroundVideo } from '$utils/backgroundVideo'         // slot C
 *   import { heroTextReveal } from '$utils/heroTextReveal'           // slot C
 *   import { viewSwitcher } from '$utils/viewSwitcher'               // slot E
 *   import { cmsFilterLinks } from '$utils/cmsFilterLinks'           // slot E
 *   import { filterPanels } from '$utils/filterPanels'               // slot F
 *   import { scrollHint } from '$utils/scrollHint'                   // slot F
 *   import { finsweetRefresh } from '$utils/finsweetRefresh'         // slot F
 *   import { filterActiveState } from '$utils/filterActiveState'     // slot F
 *   import { scrollTextReveal } from '$utils/scrollTextReveal'       // slot G
 */

const DININGS_TEMPLATE_PAGE_ID = '6ad67d7416e13e66c2b76107'

window.Webflow ||= [] as unknown as WebflowQueue
window.Webflow.push(() => {
  // Promote [data-eager] images before any ScrollTrigger exists, so
  // window.load waits for them and the load refresh measures settled layout.
  eagerImages()

  // slot A: debugOverlay() (before the engine, so it logs the first refresh)
  smoothScroll.init()
  // slot B: scrollPin() (after the engine; required under ScrollSmoother)
  scrollEnlargeSnap()

  // slot C: backgroundVideo(), heroTextReveal()
  swiperSliders()
  offersSliderSplit()
  cardCarouselHeaderLeft()

  // slot D: navToggle(), imageHoverScale(), imageTrailHover()
  navToggle()
  navTheme()
  imageHoverScale()
  imageTrailHover()
  accordion()
  modals()
  roomListHoverPreview()
  mediaTabs()

  currentYear()
  // slot E: viewSwitcher(), cmsFilterLinks()
  galleryFilter()
  // slot F, in this order: filterPanels(), scrollHint(), finsweetRefresh(),
  //   filterActiveState()

  // ScrollTrigger-creating reveals last, after DOM-mutating modules settle.
  gsapBasicAnimations()
  // slot G: scrollTextReveal()
  historyStickyYear()
  imageStackCollapse()
  // F10: Reserve a Table on the Dinings template. The button sits in the
  // shared Hero component, so it is scoped by the template's page id.
  stickyCta(`html[data-wf-page="${DININGS_TEMPLATE_PAGE_ID}"] .section_hero-fullbleed-centered .button`)
})
