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
import { anchorScroll } from '$utils/anchorScroll'
import { buttonHover } from '$utils/buttonHover'
import { cardCarouselHeaderLeft } from '$utils/cardCarouselHeaderLeft'
import { cmsItemLinks } from '$utils/cmsItemLinks'
import { contactStickyColumn } from '$utils/contactStickyColumn'
import { currentYear } from '$utils/currentYear'
import { eagerImages } from '$utils/eagerImages'
import { emailLinks } from '$utils/emailLinks'
import { formPlaceholders } from '$utils/formPlaceholders'
import { galleryCanvas } from '$utils/galleryCanvas'
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
import { modalImageSlider } from '$utils/modalImageSlider'
import { modalStickyBar } from '$utils/modalStickyBar'
import { modals } from '$utils/modals'
import { modalTextMask } from '$utils/modalTextMask'
import { navTheme } from '$utils/navTheme'
import { navToggle } from '$utils/navToggle'
import { offersSliderSplit } from '$utils/offersSliderSplit'
import { placeholderLinks } from '$utils/placeholderLinks'
import { roomGridHoverReveal } from '$utils/roomGridHoverReveal'
import { roomListHoverPreview } from '$utils/roomListHoverPreview'
import { roomsQuiz } from '$utils/roomsQuiz'
import { scrollEnlargeSnap } from '$utils/scrollEnlargeSnap'
import { scrollReveal } from '$utils/scrollReveal'
import { scriptReveal } from '$utils/scriptReveal'
import { sectionVideo } from '$utils/sectionVideo'
import { smoothScroll } from '$utils/smoothScroll'
import { staggerCards } from '$utils/staggerCards'
import { earlyVenueTabs } from '$utils/earlyVenueTabs'
import { stickyCta } from '$utils/stickyCta'
import { scriptTiltSpace } from '$utils/scriptTiltSpace'
import { stickyTabs } from '$utils/stickyTabs'
import { swiperSliders } from '$utils/swiperSliders'
import { tabDropdown } from '$utils/tabDropdown'
import { underlineHover } from '$utils/underlineHover'

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
const DINING_PAGE_ID = '6ad66fd476d24ed37ac4c5cb'

window.Webflow ||= [] as unknown as WebflowQueue
window.Webflow.push(() => {
  // Promote [data-eager] images before any ScrollTrigger exists, so
  // window.load waits for them and the load refresh measures settled layout.
  eagerImages()
  // F24: labels become sr-only and the placeholder carries the text; runs
  // before the scroll engine because hiding labels shortens forms by ~22px
  // per row and would shift ScrollTrigger positions.
  formPlaceholders()
  // F103: before the scroll engine, since it moves the contact form and changes page height.
  contactStickyColumn()
  emailLinks()
  placeholderLinks()
  // F34: wrap button labels for the fill-and-roll hover (CSS in the site head
  // block). Before the scroll engine and before swiperSliders so Swiper loop
  // clones copy already-wrapped markup.
  buttonHover()
  underlineHover()
  // M6: mobile tab bars collapse to a compact selector; before the scroll
  // engine because it shortens the bars below 768px.
  tabDropdown()
  // Desktop feedback: tilted script headings get room for their tilt; before the scroll engine (changes page height).
  scriptTiltSpace()

  // slot A: debugOverlay() (before the engine, so it logs the first refresh)
  smoothScroll.init()
  // slot B: scrollPin() (after the engine; required under ScrollSmoother)
  scrollEnlargeSnap()

  // slot C: backgroundVideo(), heroTextReveal()
  swiperSliders()
  // Mobile review: the venue modal image is a slider on every width (Figma Meetings-Overlay).
  modalImageSlider()
  modalStickyBar()
  // F106: Dinings second section plays its CMS video over the image when one is set.
  sectionVideo()
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
  modalTextMask()
  anchorScroll()
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
  // Gallery canvas: /gallery and /arts drag and zoom board, after galleryFilter's initial hide classes.
  galleryCanvas()
  // slot F, in this order: filterPanels(), scrollHint(), finsweetRefresh(),
  //   filterActiveState()

  // ScrollTrigger-creating reveals last, after DOM-mutating modules settle.
  gsapBasicAnimations()
  // Desktop feedback: data-reveal="fade|text-mask|image-mask" opt-in scroll reveals.
  scriptReveal()
  scrollReveal()
  // Lifts the first-screen pre-hide (reveal-prehide.css) now that reveal start states are set.
  document.documentElement.classList.add('reveal-ready')
  // slot G: scrollTextReveal()
  historyStickyYear()
  imageStackCollapse()
  // F36: sticky topic bar on /happenings, /blog, /press
  stickyTabs()
  // F10: Reserve a Table on the Dinings template. The button sits in the
  // shared Hero component, so it is scoped by the template's page id.
  // It leaves at "Other dining options" (DiningIndividual feedback, 2026-11-12).
  stickyCta(
    `html[data-wf-page="${DININGS_TEMPLATE_PAGE_ID}"] .section_hero-fullbleed-centered .button`,
    '.section_card-carousel-header-left, .section_cta-booking-newsletter, .section_footer-links',
  )
  // Story "Learn more" floats over the copy (Figma mobile; F80 desktop too).
  stickyCta('.section_article-body .article-body_footer .button')
  // shortcut: decided once at load, so a resize across 768px keeps the first state; fine for phones.
  if (window.matchMedia('(max-width: 767px)').matches) {
    // Mobile review: the Dining venue selector shows from the first screen (Figma mobile).
    earlyVenueTabs(`html[data-wf-page="${DINING_PAGE_ID}"]`)
  }
})
