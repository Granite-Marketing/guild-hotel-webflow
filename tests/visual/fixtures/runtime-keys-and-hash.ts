/**
 * Fixture entry for runtime-keys-and-hash.html: runs the accordion and modal
 * modules against minimal markup. No smooth-scroll engine is initialised, so
 * modals fall back to native scrollIntoView.
 */

import { accordion } from '../../../src/utils/accordion'
import { modals } from '../../../src/utils/modals'

// gsap is not loaded from the CDN; modals.ts only adds and removes a ticker callback.
Object.assign(window, { gsap: { ticker: { add: () => {}, remove: () => {} } } })

accordion()
modals()
