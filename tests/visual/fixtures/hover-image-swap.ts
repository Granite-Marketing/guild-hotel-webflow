/**
 * Fixture entry for hover-image-swap.html: runs hoverImageSwap (F25) against
 * the /rooms quiz step 1 markup. Production calls it inside Webflow.push
 * from src/index.ts.
 */

import { hoverImageSwap } from '../../../src/utils/hoverImageSwap'

gsap.registerPlugin(ScrollTrigger)
hoverImageSwap()
