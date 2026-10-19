import { StrictMode, type ReactElement } from 'react'
import { createRoot, hydrateRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import styles from '../styles/globals.css?inline'
import { ExampleSection } from '../components/ExampleSection/ExampleSection'

const fixtures = [
  {
    key: 'light',
    hydrate: true,
    element: <ExampleSection eyebrow="Component preview" heading="A client-safe React and Webflow baseline" body="Replace this example with approved, section-level components." theme="Light" />,
  },
  {
    key: 'dark',
    hydrate: false,
    element: <ExampleSection eyebrow="Dark variant" heading="Each instance receives a unique accessible heading relationship" body="This long-content fixture checks wrapping, responsive spacing, independent React roots, and the curated dark theme without exposing arbitrary CSS controls." theme="Dark" headingLevel="h3" />,
  },
] satisfies Array<{ key: string; hydrate: boolean; element: ReactElement }>

function shadowStyles() {
  return styles.replaceAll(':root', ':host')
}

function mountFixture(host: HTMLElement, element: ReactElement, key: string, hydrate: boolean) {
  const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' })
  shadow.replaceChildren()
  const style = document.createElement('style')
  style.textContent = shadowStyles()
  const container = document.createElement('div')
  container.dataset.fixtureRoot = key
  shadow.append(style, container)

  const identifierPrefix = `preview-${key}-`
  const content = <StrictMode>{element}</StrictMode>
  let reactRoot: Root
  if (hydrate) {
    container.innerHTML = renderToString(content, { identifierPrefix })
    reactRoot = hydrateRoot(container, content, {
      identifierPrefix,
      onRecoverableError(error) {
        const errors = JSON.parse(host.dataset.hydrationErrors ?? '[]') as string[]
        errors.push(error instanceof Error ? error.message : String(error))
        host.dataset.hydrationErrors = JSON.stringify(errors)
      },
    })
  } else {
    reactRoot = createRoot(container, { identifierPrefix })
    reactRoot.render(content)
  }
  return reactRoot
}

export function mountPreview(root: HTMLElement) {
  document.body.style.margin = '0'
  root.replaceChildren()
  const main = document.createElement('main')
  const controls = document.createElement('nav')
  controls.hidden = true
  controls.setAttribute('aria-label', 'Preview fixture controls')
  root.append(main, controls)

  for (const fixture of fixtures) {
    const host = document.createElement('div')
    host.dataset.fixture = fixture.key
    host.dataset.hydrationErrors = '[]'
    main.append(host)
    let reactRoot = mountFixture(host, fixture.element, fixture.key, fixture.hydrate)

    const remount = document.createElement('button')
    remount.type = 'button'
    remount.dataset.remount = fixture.key
    remount.textContent = `Remount ${fixture.key}`
    remount.addEventListener('click', () => {
      reactRoot.unmount()
      reactRoot = mountFixture(host, fixture.element, fixture.key, false)
    })
    controls.append(remount)
  }
}
