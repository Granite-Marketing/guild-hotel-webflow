// Fixture entry for history-sticky-year.html: bundled on the fly by
// tests/visual/history-sticky-year.spec.ts. Native scroll, no Lenis, so the
// check is deterministic.
import { historyStickyYear } from '../../../src/utils/historyStickyYear'

gsap.registerPlugin(ScrollTrigger)
historyStickyYear()
