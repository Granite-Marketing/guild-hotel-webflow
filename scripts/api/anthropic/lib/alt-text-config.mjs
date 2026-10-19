/**
 * Shared helpers for the alt-text pipeline scripts.
 *
 * Config resolution order:
 *   1. --config <path>
 *   2. assets/alt-text/config.json   (real project config, gitignored via assets/)
 *   3. scripts/api/anthropic/alt-text.config.example.json   (placeholder values; a warning is printed)
 *
 * The config carries everything project specific: brand name, site URL,
 * static pages, collection-to-context mapping and prompt examples. Nothing
 * project specific belongs in the scripts themselves.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.resolve(here, '../../../..')
export const DIR = path.join(ROOT, 'assets/alt-text')
export const EXAMPLE_CONFIG = path.join(ROOT, 'scripts/api/anthropic/alt-text.config.example.json')
export const PROJECT_CONFIG = path.join(DIR, 'config.json')

export const DEFAULT_MODEL = 'claude-sonnet-5-5'
export const DEFAULT_MAX_CHARS = 200

/** Load .env from the repo root when present (Node 20.12+). Existing env vars win. */
export function loadEnv () {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath) || typeof process.loadEnvFile !== 'function') return
  try { process.loadEnvFile(envPath) } catch { /* malformed .env: ignore, scripts check what they need */ }
}

export function parseArgs (argv = process.argv.slice(2)) {
  const has = (name) => argv.includes(`--${name}`)
  const get = (name) => {
    const index = argv.indexOf(`--${name}`)
    return index === -1 ? null : (argv[index + 1] ?? null)
  }
  const positional = argv.filter((value, index) => !value.startsWith('--') && !(index > 0 && argv[index - 1].startsWith('--') && VALUE_FLAGS.has(argv[index - 1].slice(2))))
  return { argv, has, get, positional }
}

const VALUE_FLAGS = new Set(['config', 'tier', 'sample', 'probe', 'baseline'])

export function loadConfig (args) {
  const explicit = args.get('config')
  let configPath
  if (explicit) configPath = path.resolve(process.cwd(), explicit)
  else if (fs.existsSync(PROJECT_CONFIG)) configPath = PROJECT_CONFIG
  else configPath = EXAMPLE_CONFIG
  if (!fs.existsSync(configPath)) throw new Error(`Config not found: ${configPath}`)
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  const isExample = configPath === EXAMPLE_CONFIG
  if (isExample) {
    console.warn(`[alt-text] Using the example config (${path.relative(ROOT, EXAMPLE_CONFIG)}). Copy it to ${path.relative(ROOT, PROJECT_CONFIG)} and fill in real values before any real run.`)
  }
  config.model ||= DEFAULT_MODEL
  config.maxChars ||= DEFAULT_MAX_CHARS
  config.collections ||= {}
  config.staticPages ||= ['/']
  config.promptExamples ||= []
  config.siteUrl = (process.env.ALT_TEXT_SITE_URL || config.siteUrl || '').replace(/\/$/, '')
  return { config, configPath, isExample }
}

export function readJson (filePath, label) {
  if (!fs.existsSync(filePath)) throw new Error(`${label || 'File'} not found: ${path.relative(ROOT, filePath)}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export const relative = (filePath) => path.relative(ROOT, filePath)
