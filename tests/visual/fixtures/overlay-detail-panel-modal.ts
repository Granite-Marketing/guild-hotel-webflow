/**
 * Fixture entry for overlay-detail-panel-modal.html: runs the shared modal
 * module against the published Q006 markup. No smooth-scroll engine is
 * initialised, so smoothScroll.stop() and start() are no-ops here.
 */

import { modals } from '../../../src/utils/modals'

// gsap is not loaded from the CDN; modals.ts only adds and removes a ticker callback.
Object.assign(window, { gsap: { ticker: { add: () => {}, remove: () => {} } } })

modals()
