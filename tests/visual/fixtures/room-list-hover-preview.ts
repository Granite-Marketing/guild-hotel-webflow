/**
 * Fixture entry for room-list-hover-preview.html: runs the modules the
 * all-rooms dialog (Q007) uses against the published markup. Production
 * calls them inside Webflow.push from src/index.ts; roomListHoverPreview is
 * not wired there yet (R01 enables it).
 */

import { galleryFilter } from '../../../src/utils/galleryFilter'
import { modals } from '../../../src/utils/modals'
import { roomListHoverPreview } from '../../../src/utils/roomListHoverPreview'

gsap.registerPlugin(ScrollTrigger)
modals()
galleryFilter()
roomListHoverPreview()
