/**
 * Contact Sticky Column (desktop feedback F103, Figma contact prototype)
 *
 * On /contact the details column (heading, addresses, socials) stays in view
 * while the request form scrolls past. The Designer builds the form as its
 * own section below, so the left column has nothing to stick against; this
 * moves the form block into the top section's grid, under the image, and
 * hides the then-empty form section. CSS in
 * docs/reference/site-head/contact-sticky.css places it and makes the details
 * column sticky.
 *
 * Desktop only (768px and up): phones were signed off with the stacked layout.
 * shortcut: decided once at load, so a resize across 768px keeps the first state.
 */

export const contactStickyColumn = () => {
  const formSection = document.querySelector<HTMLElement>('.section_form-contact-fields')
  const grid = document.querySelector<HTMLElement>('.form-split-script-contact_component')
  const formBlock = formSection?.querySelector<HTMLElement>('.form-contact-fields_form-block')
  if (!formSection || !grid || !formBlock) return
  if (!window.matchMedia('(min-width: 768px)').matches) return
  grid.append(formBlock)
  formSection.classList.add('hide')
}
