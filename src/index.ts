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
import { buttonHover } from '$utils/buttonHover'
import { cardCarouselHeaderLeft } from '$utils/cardCarouselHeaderLeft'
import { cmsItemLinks } from '$utils/cmsItemLinks'
import { currentYear } from '$utils/currentYear'
import { eagerImages } from '$utils/eagerImages'
import { formPlaceholders } from '$utils/formPlaceholders'
import { galleryFilter } from '$utils/galleryFilter'
import { gsapBasicAnimations } from '$utils/gsapBasicAnimations'
import { historyStickyYear } from '$utils/historyStickyYear'
import { hoverFollowImage } from '$utils/hoverFollowImage'
import { hoverImageSwap } from '$utils/hoverImageSwap'
import { imageHoverScale } from '$utils/imageHoverScale'
import { imageStackCollapse } from '$utils/imageStackCollapse'
import { imageTrailHover } from '$utils/imageTrailHover'
import { map } from '$utils/map'
import { mediaTabs } from '$utils/mediaTabs'
import { modals } from '$utils/modals'
import { navTheme } from '$utils/navTheme'
import { navToggle } from '$utils/navToggle'
import { offersSliderSplit } from '$utils/offersSliderSplit'
import { roomGridHoverReveal } from '$utils/roomGridHoverReveal'
import { roomListHoverPreview } from '$utils/roomListHoverPreview'
import { roomsQuiz } from '$utils/roomsQuiz'
import { scrollEnlargeSnap } from '$utils/scrollEnlargeSnap'
import { smoothScroll } from '$utils/smoothScroll'
import { staggerCards } from '$utils/staggerCards'
import { stickyCta } from '$utils/stickyCta'
import { stickyTabs } from '$utils/stickyTabs'
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
  // F24: labels become sr-only and the placeholder carries the text; runs
  // before the scroll engine because hiding labels shortens forms by ~22px
  // per row and would shift ScrollTrigger positions.
  formPlaceholders()
  // F34: wrap button labels for the fill-and-roll hover (CSS in the site head
  // block). Before the scroll engine and before swiperSliders so Swiper loop
  // clones copy already-wrapped markup.
  buttonHover()

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
  // F01: navTheme replaces navContrast (PR #101); one nav colour module only.
  navTheme()
  imageHoverScale()
  roomGridHoverReveal()
  imageTrailHover()
  hoverFollowImage()
  accordion()
  modals()
  roomListHoverPreview()
  // F25, F40: /rooms quiz option hover swaps the step's photo.
  hoverImageSwap()
  // F26: /rooms quiz steps, selection and CMS-driven room matches.
  roomsQuiz()
  mediaTabs()
  map()

  currentYear()
  // slot E: viewSwitcher(), cmsFilterLinks()
  // F30: CMS card and category links (Designer cannot bind current-item links headlessly)
  cmsItemLinks()
  // F36: alternate CMS cards across groups (Figma)
  staggerCards()
  galleryFilter()
  // slot F, in this order: filterPanels(), scrollHint(), finsweetRefresh(),
  //   filterActiveState()

  // ScrollTrigger-creating reveals last, after DOM-mutating modules settle.
  gsapBasicAnimations()
  // slot G: scrollTextReveal()
  historyStickyYear()
  imageStackCollapse()
  // F36: sticky topic bar on /happenings, /blog, /press
  stickyTabs()
  // F10: Reserve a Table on the Dinings template. The button sits in the
  // shared Hero component, so it is scoped by the template's page id.
  stickyCta(`html[data-wf-page="${DININGS_TEMPLATE_PAGE_ID}"] .section_hero-fullbleed-centered .button`)
})
