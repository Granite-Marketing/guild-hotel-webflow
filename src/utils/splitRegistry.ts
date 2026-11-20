/**
 * Split registry: lets dayNight change the text of an element that SplitText
 * has already split, without leaving duplicated or stale lines.
 *
 * A module that splits text creates its instance through `trackSplit`. When
 * dayNight swaps that element's text it calls `releaseSplit` (the element is
 * plain text again, the module's animation is reverted), sets the new text,
 * then `rebuildSplit` (a fresh instance splits the new text and plays the
 * module's own onSplit animation again). Text that was never split needs
 * neither call.
 */

interface TrackedSplit {
  release: () => void
  rebuild: () => void
}

const tracked = new WeakMap<Element, TrackedSplit>()

/** Creates a SplitText through `create` and remembers how to release and rebuild it. */
export const trackSplit = (element: Element, create: () => SplitTypeInstance): SplitTypeInstance => {
  let instance = create()
  tracked.set(element, {
    release: () => instance.revert(),
    rebuild: () => {
      instance = create()
    },
  })
  return instance
}

/** Reverts the element's split, if it has one, so its text can change. */
export const releaseSplit = (element: Element) => tracked.get(element)?.release()

/** Splits the element's new text again, if it was split before. */
export const rebuildSplit = (element: Element) => tracked.get(element)?.rebuild()
