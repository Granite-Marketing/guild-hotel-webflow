/**
 * Split registry: lets dayNight change the text of an element that SplitText
 * has already split, without leaving duplicated or stale lines and without
 * ever reverting an autoSplit instance by hand (CLAUDE.md SplitText rule).
 *
 * A module that splits text creates its instance through `trackSplit`, which
 * builds the SplitText itself so it can add one hook. To change the text,
 * dayNight calls `changeSplitText(element, apply)`. The registry asks the
 * instance to re-split through its public `split()`: SplitText restores its
 * stored markup, calls `onRevert` (where `apply` writes the new text), then
 * reads the element again and splits the new text. The new text becomes the
 * instance's own original, so later autoSplit re-splits (resize, font load)
 * keep it. Text that was never split just runs `apply`.
 *
 * After a content change, an animation the module's onSplit returned is
 * restarted (SplitText would otherwise carry its old time over), unless it is
 * scroll-driven: a scroll reveal keeps the state its scroll position gives it.
 */

interface TrackedSplit {
  change: (apply: () => void) => void
}

interface Restartable {
  restart: () => unknown
  scrollTrigger?: unknown
}

const tracked = new WeakMap<Element, TrackedSplit>()

const isRestartable = (value: unknown): value is Restartable =>
  typeof value === 'object' && value !== null && typeof (value as Restartable).restart === 'function'

/** Splits `element` with `options` (autoSplit included) and remembers how to change its text later. */
export const trackSplit = (element: HTMLElement, options: SplitTextOptions): SplitTypeInstance => {
  let pendingChange: (() => void) | null = null
  let lastAnimation: unknown = null

  const instance = new SplitText(element, {
    ...options,
    onRevert: (self: SplitTypeInstance) => {
      // Runs after SplitText has put its stored markup back and before it reads the element again.
      const apply = pendingChange
      pendingChange = null
      apply?.()
      options.onRevert?.(self)
    },
    onSplit: (self: SplitTypeInstance) => {
      lastAnimation = options.onSplit?.(self)
      return lastAnimation
    },
  })

  tracked.set(element, {
    change: (apply) => {
      if (!instance.isSplit) {
        apply()
        return
      }
      pendingChange = apply
      instance.split()
      if (isRestartable(lastAnimation) && !lastAnimation.scrollTrigger) lastAnimation.restart()
    },
  })
  return instance
}

/**
 * Runs `apply` on the element's plain (unsplit) content and splits the result
 * again if the element is split. `apply` must leave plain text or markup.
 */
export const changeSplitText = (element: Element, apply: () => void) => {
  const split = tracked.get(element)
  if (split) split.change(apply)
  else apply()
}
