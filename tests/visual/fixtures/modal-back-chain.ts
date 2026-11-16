/**
 * Fixture entry for modal-back-chain.html: runs the modal module against a
 * two-level chain (page -> A -> B). No smooth-scroll engine is initialised and
 * gsap is not loaded from the CDN, so a minimal ticker stub stands in for it
 * (modals.ts only adds and removes a ticker callback).
 */

import { modals } from '../../../src/utils/modals'

Object.assign(window, { gsap: { ticker: { add: () => {}, remove: () => {} } } })

modals()
