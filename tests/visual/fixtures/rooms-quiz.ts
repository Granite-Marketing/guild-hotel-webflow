/**
 * Fixture entry for rooms-quiz.html: runs hoverImageSwap (F25) and roomsQuiz
 * (F26) against the /rooms quiz markup. The room cards already hold their
 * nested options, so CMS Nest itself is not loaded; this entry plays its
 * part by firing the `cmsnest` callbacks. `?nest=hold` withholds them and
 * empties every nest target, as an unfinished CMS Nest leaves the cards, to
 * exercise the loading timeout; `?timeout=<ms>` shortens it.
 */

import { hoverImageSwap } from '../../../src/utils/hoverImageSwap'
import { roomsQuiz } from '../../../src/utils/roomsQuiz'

const params = new URLSearchParams(window.location.search)
const holdNest = params.get('nest') === 'hold'
if (holdNest) document.querySelectorAll('[data-rooms-quiz-tags]').forEach((nestTarget) => nestTarget.replaceChildren())
const timeout = params.get('timeout')
if (timeout) document.querySelector('[data-rooms-quiz]')?.setAttribute('data-rooms-quiz-timeout', timeout)

gsap.registerPlugin(ScrollTrigger)
hoverImageSwap()
roomsQuiz()

if (!holdNest) {
  for (const entry of window.fsAttributes ?? []) {
    const [key, callback] = entry as [string, (instances: unknown[]) => void]
    if (key === 'cmsnest') callback([])
  }
}
