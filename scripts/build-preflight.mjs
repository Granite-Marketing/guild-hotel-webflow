// Checks a build needs before it starts, or fixes what it safely can. Prints
// one plain line and exits 1 when this machine cannot run the project.
//
//   node scripts/build-preflight.mjs
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** What node_modules needs: null (ready), "link" (points at another checkout), "missing" or "stale". */
export function dependencyProblem(root) {
  const modules = path.join(root, 'node_modules')
  const stat = lstatSync(modules, { throwIfNoEntry: false })
  if (!stat) return 'missing'
  if (stat.isSymbolicLink()) return 'link'
  const stamp = path.join(modules, '.preflight-lock')
  return existsSync(stamp) && readFileSync(stamp, 'utf8') === lockHash(root) ? null : 'stale'
}

const lockHash = (root) => createHash('sha256').update(readFileSync(path.join(root, 'pnpm-lock.yaml'))).digest('hex')

export function installDependencies(root, problem, install = pnpmInstall) {
  // Remove the link itself first: an install through it would change the other checkout's folder.
  if (problem === 'link') unlinkSync(path.join(root, 'node_modules'))
  install(root)
  writeFileSync(path.join(root, 'node_modules/.preflight-lock'), lockHash(root))
}

function pnpmInstall(root) {
  try {
    execFileSync('pnpm', ['install', '--frozen-lockfile'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, CI: 'true' } })
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error('pnpm is not installed on this machine')
    const line = `${err.stdout ?? ''}\n${err.stderr ?? ''}`.split('\n').map((l) => l.trim()).filter(Boolean).at(-1)
    throw new Error(`the project's packages did not install: ${line ?? err.message}`)
  }
}

function browserProblem() {
  const cache =
    process.env.PLAYWRIGHT_BROWSERS_PATH ||
    (process.platform === 'darwin'
      ? path.join(homedir(), 'Library/Caches/ms-playwright')
      : path.join(process.env.XDG_CACHE_HOME || path.join(homedir(), '.cache'), 'ms-playwright'))
  const found = existsSync(cache) && readdirSync(cache).some((d) => /^chromium-\d+$/.test(d))
  return found ? null : 'the browser for page checks is not installed on this machine (npx playwright install chromium)'
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const problem = dependencyProblem(root)
  if (problem) installDependencies(root, problem)
  const browser = browserProblem()
  if (browser) throw new Error(browser)
  // Page checks read the staging site with this build's own bundle swapped in.
  const { url } = JSON.parse(readFileSync(path.join(root, '.claude/build.json'), 'utf8')).visual
  const answer = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(20_000) }).catch(() => null)
  if (!answer?.ok) throw new Error(`the staging site did not answer (${url})`)
  console.log('preflight: packages, browser and staging site are ready')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(`preflight: ${err.message}`)
    process.exit(1)
  })
}
