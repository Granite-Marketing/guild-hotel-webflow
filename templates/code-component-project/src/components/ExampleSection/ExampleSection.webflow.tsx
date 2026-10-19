import { props } from '@webflow/data-types'
import { declareComponent } from '@webflow/react'
import { ExampleSection } from './ExampleSection'

export default declareComponent(ExampleSection, {
  name: 'Example Section',
  description: 'Replace this contract example with an approved project section.',
  group: 'Sections',
  props: {
    eyebrow: props.Text({ name: 'Eyebrow', group: 'Content', defaultValue: 'Component preview' }),
    heading: props.Text({ name: 'Heading', group: 'Content', defaultValue: 'Section heading' }),
    body: props.Text({ name: 'Body', group: 'Content', defaultValue: 'Section body copy.' }),
    theme: props.Variant({ name: 'Theme', group: 'Style', options: ['Light', 'Dark'], defaultValue: 'Light' }),
    headingLevel: props.Variant({ name: 'Heading level', group: 'Accessibility', options: ['h2', 'h3'], defaultValue: 'h2' }),
  },
  options: {
    ssr: true,
  },
})
