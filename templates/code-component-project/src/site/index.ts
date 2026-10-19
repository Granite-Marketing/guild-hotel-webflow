/**
 * Site-wide JS bundle — single entry point (Granite native-lane pattern).
 *
 * Ships in every project scaffold. Native MCP / normal-Webflow builds NEED this
 * (animation + behaviour live here, driven by the `data-*` hooks the build emits);
 * DevLink-only projects usually don't (animation lives inside the code components) —
 * keep, extend, or delete per project.
 *
 * Build → tag → jsDelivr → load via a <script src> in Webflow Site Settings footer,
 * AFTER the GSAP / ScrollTrigger / Lenis / SplitText / Swiper CDN tags. See the
 * `webflow-mcp:react-to-native` skill's references/custom-code.md for the full flow.
 */

import { animate } from './utils/animate'

window.Webflow ||= [] as unknown as WebflowQueue
window.Webflow.push(() => {
  animate()
  // one call per util; add modules under ./utils and import them here
})
