import { lstat, readFile, readdir } from 'node:fs/promises'
import { basename, relative, resolve, sep } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const forbiddenSegments = new Set(['.agents', '.claude', '.codex', 'vendor'])
const ignoredSegments = new Set(['.git', 'node_modules', 'dist', 'playwright-report', 'test-results'])
const forbiddenFiles = new Set(['agents.md', 'claude.md', 'skill.md'])
const credentialPattern = /["']?\b((?:WEBFLOW|FIGMA)_(?:(?:WORKSPACE_)?API_)?TOKEN)\b["']?[ \t]*(?:=|:)[ \t]*["']?([^"'\s,}#]*)/gi
const privateSignatures = [
  'BEGIN COMPOUND CODEX TOOL MAP',
  '<skills_instructions>',
  '<multi_agent_mode>',
]

function portable(path) {
  return path.split(sep).join('/')
}

function isPlaceholder(value) {
  const normalized = value.trim()
  return !normalized
    || /^(?:replace|your-|example|placeholder|changeme)/i.test(normalized)
    || /^<.*>$/.test(normalized)
    || /^\$\{/.test(normalized)
    || /^\{\{/.test(normalized)
}

export async function scanClientBoundary(rootDirectory) {
  const root = resolve(rootDirectory)
  const findings = []

  async function inspect(path, relativePath = '') {
    let metadata
    try {
      metadata = await lstat(path)
    } catch (error) {
      findings.push({ type: 'unreadable', path: relativePath || '.', error: error.code ?? 'unknown' })
      return
    }

    if (metadata.isSymbolicLink()) {
      findings.push({ type: 'symlink', path: relativePath || '.' })
      return
    }

    const name = basename(path)
    const normalizedName = name.toLowerCase()
    if (relativePath && (forbiddenSegments.has(normalizedName) || portable(relativePath).toLowerCase().startsWith('scripts/factory/'))) {
      findings.push({ type: 'forbidden-path', path: relativePath })
      return
    }
    if (relativePath && forbiddenFiles.has(normalizedName)) {
      findings.push({ type: 'forbidden-path', path: relativePath })
      return
    }
    if (metadata.isDirectory()) {
      if (ignoredSegments.has(normalizedName) && relativePath) return
      let entries
      try {
        entries = await readdir(path)
      } catch (error) {
        findings.push({ type: 'unreadable', path: relativePath || '.', error: error.code ?? 'unknown' })
        return
      }
      for (const entry of entries) await inspect(resolve(path, entry), relativePath ? `${relativePath}/${entry}` : entry)
      return
    }
    if (!metadata.isFile()) return

    let contents
    try {
      contents = await readFile(path, 'utf8')
    } catch (error) {
      findings.push({ type: 'unreadable', path: relativePath, error: error.code ?? 'unknown' })
      return
    }
    for (const match of contents.matchAll(credentialPattern)) {
      if (isPlaceholder(match[2])) continue
      findings.push({ type: 'credential', path: relativePath, variable: match[1].toUpperCase() })
    }
    for (const signature of privateSignatures) {
      if (contents.includes(signature)) findings.push({ type: 'private-signature', path: relativePath, signature })
    }
  }

  await inspect(root)
  return findings.sort((left, right) => `${left.path}:${left.type}`.localeCompare(`${right.path}:${right.type}`))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = process.argv[2] ?? process.cwd()
  const findings = await scanClientBoundary(target)
  if (findings.length) {
    console.error(JSON.stringify({ ok: false, findings }, null, 2))
    process.exitCode = 1
  } else {
    console.log(JSON.stringify({ ok: true, findings: [] }, null, 2))
  }
}
