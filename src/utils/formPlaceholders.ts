/**
 * Form Placeholders (F24)
 *
 * Every form field shows its label text as the input placeholder sitting on
 * the underline; the <label> stays in the DOM as screen-reader-only text.
 * This is the default for every form on the site.
 *
 *   <form>
 *     <label for="email">Email</label>        gets .u-sr-only
 *     <input id="email" class="... is-labelled" placeholder="">
 *   </form>                                    placeholder = "Email",
 *                                              .is-labelled removed
 *
 * Control lookup per label: the element named by `for`, then the next
 * sibling, then the first text control in the same parent. Checkbox and
 * radio labels (.w-checkbox, .w-radio) are skipped and stay visible.
 *
 * Selects: the empty-value prompt option (<option value="">) takes the label
 * text, and the select toggles .is-placeholder while its value is "". A
 * select with no empty option keeps its visible label.
 *
 * Opt out per form or field with data-form-label="visible" on the field or
 * any ancestor.
 *
 * Without JS the current state remains (visible label, .is-labelled hides the
 * default placeholder), so no field ever ships unlabelled.
 *
 * Runs directly after eagerImages and before the scroll engine: hiding the
 * labels shortens forms by about 22px per row, which would otherwise shift
 * every ScrollTrigger position below them.
 */

const LABEL_SELECTOR = 'form label:not(.w-checkbox):not(.w-radio)'
const CONTROL_SELECTOR = 'input, textarea, select'
const OPT_OUT_SELECTOR = '[data-form-label="visible"]'
const SR_ONLY_CLASS = 'u-sr-only'
// Combo fallback for labels whose base class sets position, padding and
// margins (newsletter prefix label); harmless where no such style exists.
const SR_ONLY_COMBO_CLASS = 'is-sr-only'
const LABELLED_INPUT_CLASS = 'is-labelled'
const PLACEHOLDER_SELECT_CLASS = 'is-placeholder'
const SKIPPED_INPUT_TYPES = new Set([
  'checkbox',
  'radio',
  'submit',
  'button',
  'hidden',
  'file',
  'image',
  'reset',
  'range',
  'color',
])

type FieldControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

const isTextControl = (element: Element | null): element is FieldControl =>
  !!element &&
  element.matches(CONTROL_SELECTOR) &&
  !(element instanceof HTMLInputElement && SKIPPED_INPUT_TYPES.has(element.type))

const findControl = (label: HTMLLabelElement): FieldControl | null => {
  const controlByFor = label.htmlFor ? document.getElementById(label.htmlFor) : null
  if (isTextControl(controlByFor)) return controlByFor

  const nextSibling = label.nextElementSibling
  if (isTextControl(nextSibling)) return nextSibling

  const parentControls = label.parentElement?.querySelectorAll<FieldControl>(CONTROL_SELECTOR) ?? []
  return (
    [...parentControls].find((element) => !label.contains(element) && isTextControl(element)) ?? null
  )
}

const ensureControlId = (control: FieldControl, label: HTMLLabelElement, index: number) => {
  if (control.id) return control.id
  const preferredId = label.htmlFor || (control.name ? `field-${control.name}` : '')
  const candidateId =
    preferredId && !document.getElementById(preferredId) ? preferredId : `form-field-${index}`
  control.id = candidateId
  return candidateId
}

export const formPlaceholders = () => {
  const labels = document.querySelectorAll<HTMLLabelElement>(LABEL_SELECTOR)
  if (!labels.length) return

  labels.forEach((label, index) => {
    if (label.closest(OPT_OUT_SELECTOR)) return

    const control = findControl(label)
    const labelText = label.textContent?.replace(/\s+/g, ' ').trim()
    if (!control || !labelText) return
    if (control.closest(OPT_OUT_SELECTOR)) return

    if (control instanceof HTMLSelectElement) {
      const promptOption = control.querySelector<HTMLOptionElement>('option[value=""]')
      if (!promptOption) return // no prompt option: keep the visible label
      promptOption.textContent = labelText
      const syncPlaceholderState = () =>
        control.classList.toggle(PLACEHOLDER_SELECT_CLASS, control.value === '')
      syncPlaceholderState()
      control.addEventListener('change', syncPlaceholderState)
      control.form?.addEventListener('reset', () => requestAnimationFrame(syncPlaceholderState))
    } else {
      control.placeholder = labelText
      control.classList.remove(LABELLED_INPUT_CLASS) // reveals the existing ::placeholder style
    }

    // Repairs the published for="" on component labels (ids set by attribute).
    label.htmlFor = ensureControlId(control, label, index)
    label.classList.add(SR_ONLY_CLASS, SR_ONLY_COMBO_CLASS)
  })
}
