/**
 * Fixture entry for mobile-code-fixes-235.html: runs the three #235 modules
 * the way src/index.ts does. Built in memory by the Playwright spec.
 */

import { directionsLinks } from '../../../src/utils/directionsLinks'
import { focusRing } from '../../../src/utils/focusRing'
import { scriptTiltSpace } from '../../../src/utils/scriptTiltSpace'

scriptTiltSpace()
directionsLinks()
focusRing()
