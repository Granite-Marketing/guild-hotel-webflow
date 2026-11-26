/**
 * Fixture entry for heading-tags-420.html: runs every module that used to find
 * a heading by its tag (modals, room grid hover reveal, rooms quiz) plus the
 * script and line mask reveals, against markup whose headings are paragraphs.
 */

import { prepareLineMaskReveal } from '../../../src/utils/lineMaskReveal'
import { modals } from '../../../src/utils/modals'
import { roomGridHoverReveal } from '../../../src/utils/roomGridHoverReveal'
import { roomsQuiz } from '../../../src/utils/roomsQuiz'
import { scriptReveal } from '../../../src/utils/scriptReveal'

gsap.registerPlugin(ScrollTrigger)

modals()
roomGridHoverReveal()
roomsQuiz()
scriptReveal()
const lineMaskBox = document.querySelector<HTMLElement>('#line-mask-box')
if (lineMaskBox) prepareLineMaskReveal(lineMaskBox)
