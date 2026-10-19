import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

function directoryPath(value) {
  return value instanceof URL ? fileURLToPath(value) : resolve(value)
}

async function declarationFiles(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...await declarationFiles(path))
    else if (entry.name.endsWith('.webflow.tsx')) files.push(path)
  }
  return files.sort()
}

export async function auditComponentDirectory(inputDirectory) {
  const findings = []
  const directory = directoryPath(inputDirectory)
  for (const declarationPath of await declarationFiles(directory)) {
    const implementationPath = declarationPath.replace(/\.webflow\.tsx$/, '.tsx')
    const declaration = await readFile(declarationPath, 'utf8')
    const implementation = await readFile(implementationPath, 'utf8').catch(() => '')
    const component = declarationPath.slice(directory.length + 1)
    const add = (rule, message) => findings.push({ component, rule, message })

    if (!implementation) add('paired-implementation', 'Every Webflow declaration needs a sibling React implementation.')
    if (!/ssr:\s*true/.test(declaration)) add('ssr-default', 'Code components must enable SSR unless an exception is documented.')
    if (/\b(?:css|style|className|fontSize|textColor|backgroundColor)\s*:\s*props\.Text\s*\(/.test(declaration)) {
      add('no-arbitrary-css-props', 'Do not expose arbitrary styling through text props.')
    }
    if (/aria-labelledby=/.test(implementation) && (!/useId\s*\(/.test(implementation) || /\bid=["'][^"'{]+["']/.test(implementation))) {
      add('unique-ids', 'Reusable accessible relationships must use per-instance IDs.')
    }
    if (/<section\b/.test(implementation) && !/<article\b/.test(implementation)) add('semantic-wrapper', 'Section components require an article content wrapper.')
    if (/<h[1-6]\b|<Heading\b/.test(implementation) && !/<header\b/.test(implementation)) add('semantic-heading', 'Heading regions require a header wrapper.')
    if (/useGSAP\s*\(/.test(implementation)) {
      if (!/prefers-reduced-motion:\s*reduce/.test(implementation)) add('reduced-motion', 'Animated components must render a reduced-motion final state.')
      if (!/scope\s*:/.test(implementation)) add('animation-scope', 'useGSAP must be scoped to the component root for cleanup.')
    }
    if (/data-w-id|Webflow\.require\(['"]ix/.test(implementation)) add('no-webflow-interactions', 'React components must not use Webflow Interactions.')
  }
  return findings.sort((left, right) => `${left.component}:${left.rule}`.localeCompare(`${right.component}:${right.rule}`))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = process.argv[2] ?? 'src/components'
  const findings = await auditComponentDirectory(directory)
  if (findings.length) {
    console.error(JSON.stringify({ ok: false, findings }, null, 2))
    process.exitCode = 1
  } else {
    console.log(JSON.stringify({ ok: true, findings: [] }, null, 2))
  }
}
