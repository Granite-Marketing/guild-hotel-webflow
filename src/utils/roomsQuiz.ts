/**
 * Rooms quiz (feedback F26): the /rooms quiz shows one step at a time.
 * Clicking an option records it, marks it selected and moves to the next
 * step; after step 3 the results reveal the rooms linked to all three
 * answers, else the closest matches (the guest answer plus at least one
 * other), else an empty message.
 *
 * DOM contract (built in Webflow, see docs/reference/runtime-modules.md):
 *   - Root:     `[data-rooms-quiz]`, the quiz section.
 *   - Panel:    `[data-rooms-quiz-step="1|2|3"]`; the visible one carries
 *               `is-active` (step 1 in the Designer, so it shows without JS).
 *   - Option:   `[data-rooms-quiz-option="{slug}"]` inside a panel.
 *   - Back:     `[data-rooms-quiz-back]` inside panels 2 and 3.
 *   - Results:  `[data-rooms-quiz-results]`, one or more sections, hidden by
 *               a Designer `hide` combo until the quiz is finished.
 *   - Lines:    `[data-rooms-quiz-closest]`, `[data-rooms-quiz-empty]`,
 *               `[data-rooms-quiz-loading]`, each hidden with `hide`.
 *   - Restart:  `[data-rooms-quiz-restart]` clears answers, back to step 1.
 *   - Scroll:   `data-scroll-flush` on the root and the first results section
 *               lands them at the viewport top, under the transparent nav.
 *   - Cards:    each item of the `[fs-cmsnest-element="list"]` room list is a
 *               room card. Finsweet CMS Nest replaces the card's nest target
 *               with the room's options list, so the card is read whole: its
 *               options each carry `[data-rooms-quiz-tag="{slug}"]`. With an
 *               odd number of matches the last card gets `is-wide` and spans
 *               the row.
 *
 * Matching waits for CMS Nest (`window.fsAttributes` `cmsnest` callback).
 * If it has not reported when step 3 is answered, the loading line shows
 * until it does or until the timeout (8s, `data-rooms-quiz-timeout` on the
 * root overrides it), then whatever cards are filled are evaluated. A card
 * with no options never matches.
 */

import { smoothScroll } from '$utils/smoothScroll'

const ACTIVE_CLASS = 'is-active'
const WIDE_CLASS = 'is-wide'
const HIDDEN_CLASS = 'hide'
const STEPS = 3
const GUEST_STEP = 1
const NEST_TIMEOUT_MS = 8000
// hoverImageSwap listens for this to put a panel back on its resting photo.
const SWAP_RESET_EVENT = 'hover-swap:reset'

const setHidden = (element: Element | null, hidden: boolean) => {
  element?.classList.toggle(HIDDEN_CLASS, hidden)
}

const waitForNest = () =>
  new Promise<void>((resolve) => {
    window.fsAttributes ??= []
    window.fsAttributes.push(['cmsnest', () => resolve()])
  })

export const roomsQuiz = () => {
  const root = document.querySelector<HTMLElement>('[data-rooms-quiz]')
  if (!root) return

  const panels = new Map<number, HTMLElement>()
  root.querySelectorAll<HTMLElement>('[data-rooms-quiz-step]').forEach((panel) => {
    panels.set(Number(panel.dataset.roomsQuizStep), panel)
  })
  if (panels.size !== STEPS) return

  const resultSections = Array.from(document.querySelectorAll<HTMLElement>('[data-rooms-quiz-results]'))
  const closestLine = document.querySelector<HTMLElement>('[data-rooms-quiz-closest]')
  const emptyLine = document.querySelector<HTMLElement>('[data-rooms-quiz-empty]')
  const loadingLine = document.querySelector<HTMLElement>('[data-rooms-quiz-loading]')
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>('[fs-cmsnest-element="list"] > .w-dyn-items > .w-dyn-item'),
  )

  const timeout = Number(root.dataset.roomsQuizTimeout) || NEST_TIMEOUT_MS
  let nestReady = false
  const nestDone = waitForNest().then(() => {
    nestReady = true
  })

  const answers = new Map<number, string>()
  // Guards a stale evaluation when the visitor restarts while it waits.
  let evaluationId = 0

  const panelOptions = (step: number) =>
    Array.from(panels.get(step)?.querySelectorAll<HTMLElement>('[data-rooms-quiz-option]') ?? [])

  panels.forEach((panel) => {
    const heading = panel.querySelector<HTMLElement>('h2, h3')
    if (heading && !heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
  })

  const showStep = (step: number, moveFocus: boolean) => {
    panels.forEach((panel, panelStep) => {
      const isCurrent = panelStep === step
      if (!isCurrent && panel.classList.contains(ACTIVE_CLASS)) {
        panel.dispatchEvent(new Event(SWAP_RESET_EVENT))
      }
      panel.classList.toggle(ACTIVE_CLASS, isCurrent)
    })
    if (moveFocus) panels.get(step)?.querySelector<HTMLElement>('h2, h3')?.focus({ preventScroll: true })
  }

  const markSelected = (step: number, slug: string | undefined) => {
    panelOptions(step).forEach((option) => {
      const isSelected = option.dataset.roomsQuizOption === slug
      option.classList.toggle(ACTIVE_CLASS, isSelected)
      option.setAttribute('aria-pressed', String(isSelected))
    })
  }

  const cardTags = (card: HTMLElement) =>
    new Set(
      Array.from(card.querySelectorAll<HTMLElement>('[data-rooms-quiz-tag]')).map(
        (tag) => tag.dataset.roomsQuizTag ?? '',
      ),
    )

  const setLines = (state: 'loading' | 'exact' | 'closest' | 'empty') => {
    setHidden(loadingLine, state !== 'loading')
    setHidden(closestLine, state !== 'closest')
    setHidden(emptyLine, state !== 'empty')
  }

  const showMatches = () => {
    const picks = Array.from({ length: STEPS }, (_, index) => answers.get(index + 1) ?? '')
    const guestPick = answers.get(GUEST_STEP) ?? ''
    const otherPicks = picks.filter((_, index) => index + 1 !== GUEST_STEP)
    const tagged = cards.map((card) => ({ card, tags: cardTags(card) }))

    let matches = tagged.filter(({ tags }) => picks.every((pick) => tags.has(pick)))
    let state: 'exact' | 'closest' | 'empty' = 'exact'
    if (!matches.length) {
      matches = tagged.filter(({ tags }) => tags.has(guestPick) && otherPicks.some((pick) => tags.has(pick)))
      state = matches.length ? 'closest' : 'empty'
    }

    const lastOddMatch = matches.length % 2 === 1 ? matches[matches.length - 1].card : null
    tagged.forEach(({ card }) => {
      setHidden(card, !matches.some((match) => match.card === card))
      card.classList.toggle(WIDE_CLASS, card === lastOddMatch)
    })
    setLines(state)
    ScrollTrigger.refresh(true)
  }

  const revealResults = () => {
    const runId = ++evaluationId
    resultSections.forEach((section) => setHidden(section, false))

    if (nestReady) {
      showMatches()
    } else {
      cards.forEach((card) => setHidden(card, true))
      setLines('loading')
      const timedOut = new Promise<void>((resolve) => window.setTimeout(resolve, timeout))
      Promise.race([nestDone, timedOut]).then(() => {
        if (runId === evaluationId) showMatches()
      })
    }

    if (resultSections[0]) smoothScroll.scrollTo(resultSections[0])
  }

  const hideResults = () => {
    evaluationId++
    resultSections.forEach((section) => setHidden(section, true))
    setLines('exact')
    ScrollTrigger.refresh(true)
  }

  const choose = (option: HTMLElement) => {
    const step = Number(option.closest<HTMLElement>('[data-rooms-quiz-step]')?.dataset.roomsQuizStep)
    const slug = option.dataset.roomsQuizOption
    if (!step || !slug) return

    answers.set(step, slug)
    markSelected(step, slug)
    if (step < STEPS) showStep(step + 1, true)
    else revealResults()
  }

  root.addEventListener('click', (event) => {
    const target = event.target as Element
    const option = target.closest<HTMLElement>('[data-rooms-quiz-option]')
    if (option) {
      event.preventDefault()
      choose(option)
      return
    }
    const back = target.closest<HTMLElement>('[data-rooms-quiz-back]')
    if (back) {
      event.preventDefault()
      const step = Number(back.closest<HTMLElement>('[data-rooms-quiz-step]')?.dataset.roomsQuizStep)
      if (step > 1) showStep(step - 1, true)
    }
  })

  // Options are links with role="button": Enter clicks natively, Space does not.
  root.addEventListener('keydown', (event) => {
    if (event.key !== ' ') return
    const option = (event.target as Element).closest<HTMLElement>('[data-rooms-quiz-option]')
    if (!option) return
    event.preventDefault()
    choose(option)
  })

  document.querySelectorAll<HTMLElement>('[data-rooms-quiz-restart]').forEach((restart) => {
    restart.addEventListener('click', (event) => {
      event.preventDefault()
      answers.clear()
      panels.forEach((_, step) => markSelected(step, undefined))
      hideResults()
      showStep(1, false)
      smoothScroll.scrollTo(root)
      panels.get(1)?.querySelector<HTMLElement>('h2, h3')?.focus({ preventScroll: true })
    })
  })
}
