/**
 * Filter Active State
 *
 * Mirrors Finsweet CMS Filter (v1) input state onto classes the Designer can
 * style. Works with checkbox (multi-select) and radio (single-select)
 * filters. Pair with finsweetRefresh.ts for ScrollTrigger refreshes.
 *
 * DOM contract, inside each `[fs-cmsfilter-element="filters"]` form:
 *   [data-filter-option]          wrapper around one radio/checkbox; gets
 *                                 `fs-cmsfilter_active` while its input is
 *                                 checked
 *   [fs-cmsfilter-element="clear"]
 *                                 an "All" button; its parent gets
 *                                 `fs-cmsfilter_active` while nothing in its
 *                                 group is set. The group is the closest
 *                                 `[data-filter-panel]`, else the whole form.
 *   [data-filter-clear-all]       on a clear button: hidden (template `hide`
 *                                 class) until any filter in the form is set
 *
 * Opt-in panel mode: add `data-filter-panels` to the form to also
 *   - mark each `[data-filter-panel-toggle]` with `fs-cmsfilter_active`
 *     while its `[data-filter-panel]` has a value, and
 *   - replace the text of a `[data-filter-label]` inside the panel with the
 *     checked option's Webflow form label, restoring the default when
 *     cleared.
 *
 * Range inputs (`fs-cmsfilter-range` from/to) count as set when non-empty.
 */

const ACTIVE_CLASS = 'fs-cmsfilter_active'
const HIDE_CLASS = 'hide'
const FILTER_INPUTS = 'input[type="checkbox"], input[type="radio"]'

const groupHasValue = (group: HTMLElement) =>
  Array.from(group.querySelectorAll<HTMLInputElement>('input')).some((input) =>
    input.type === 'checkbox' || input.type === 'radio'
      ? input.checked
      : input.type !== 'range' && input.value.trim() !== '',
  )

const syncPanels = (filterForm: HTMLElement) => {
  filterForm.querySelectorAll<HTMLElement>('[data-filter-panel]').forEach((panel) => {
    panel
      .querySelector('[data-filter-panel-toggle]')
      ?.classList.toggle(ACTIVE_CLASS, groupHasValue(panel))

    const label = panel.querySelector<HTMLElement>('[data-filter-label]')
    if (!label) return
    label.dataset.filterLabelDefault ??= label.textContent ?? ''
    const checkedInput = panel.querySelector<HTMLInputElement>('input:checked')
    const selectedText = checkedInput
      ?.closest('.w-radio, .w-checkbox')
      ?.querySelector('.w-form-label')
      ?.textContent?.trim()
    label.textContent = selectedText || label.dataset.filterLabelDefault
  })
}

const syncActiveStates = (filterForm: HTMLElement) => {
  if (filterForm.hasAttribute('data-filter-panels')) syncPanels(filterForm)

  filterForm.querySelectorAll<HTMLElement>('[data-filter-clear-all]').forEach((clearAll) => {
    clearAll.classList.toggle(HIDE_CLASS, !groupHasValue(filterForm))
  })

  filterForm
    .querySelectorAll<HTMLElement>('[fs-cmsfilter-element="clear"]:not([data-filter-clear-all])')
    .forEach((clearButton) => {
      const group = clearButton.closest<HTMLElement>('[data-filter-panel]') ?? filterForm
      const hasChecked = Array.from(group.querySelectorAll<HTMLInputElement>(FILTER_INPUTS)).some(
        (input) => input.checked,
      )
      const hasRange = Array.from(
        group.querySelectorAll<HTMLInputElement>('input[fs-cmsfilter-range]'),
      ).some((input) => input.value !== '')
      clearButton.parentElement?.classList.toggle(ACTIVE_CLASS, !hasChecked && !hasRange)
    })

  filterForm.querySelectorAll<HTMLInputElement>(FILTER_INPUTS).forEach((input) => {
    input.closest('[data-filter-option]')?.classList.toggle(ACTIVE_CLASS, input.checked)
  })
}

export const filterActiveState = () => {
  const filterForms = document.querySelectorAll<HTMLElement>('[fs-cmsfilter-element="filters"]')
  if (!filterForms.length) return

  filterForms.forEach((filterForm) => {
    syncActiveStates(filterForm)
    filterForm.addEventListener('change', () => syncActiveStates(filterForm))
    filterForm.addEventListener('input', () => syncActiveStates(filterForm))

    // Finsweet resets inputs in its own click handler; sync on the next
    // frame so a still-checked radio is not read as active.
    filterForm
      .querySelectorAll<HTMLElement>('[fs-cmsfilter-element="clear"]')
      .forEach((clearButton) => {
        clearButton.addEventListener('click', () => {
          requestAnimationFrame(() => syncActiveStates(filterForm))
        })
      })
  })

  // URL-driven initial state is applied by Finsweet after boot; resync then.
  const fsAttributes = (window.fsAttributes ??= [])
  fsAttributes.push([
    'cmsfilter',
    () => filterForms.forEach((filterForm) => syncActiveStates(filterForm)),
  ])
}
