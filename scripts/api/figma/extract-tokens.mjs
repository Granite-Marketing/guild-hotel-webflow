#!/usr/bin/env node
// Extracts text styles, colours and fonts from the committed Figma snapshot
// and proposes a mapping onto the Relume style guide classes and variables.
//
// Usage:
//   node scripts/api/figma/extract-tokens.mjs [--input figma/raw/file.json.gz] [--out figma/tokens.json]
//
// Local only: reads a file on disk, makes no network calls.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'

import { extractTokens, serialiseTokens } from './lib/tokens.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const DEFAULT_INPUT = 'figma/raw/file.json.gz'
const DEFAULT_OUT = 'figma/tokens.json'

export const parseArgs = (argv) => {
  const options = { input: DEFAULT_INPUT, out: DEFAULT_OUT }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--input' || argument === '--out') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`${argument} needs a path`)
      options[argument.slice(2)] = value
      index += 1
    } else if (argument === '--help' || argument === '-h') {
      options.help = true
    } else {
      throw new Error(`Unknown argument: ${argument}`)
    }
  }
  return options
}

export const readFigmaFile = (path) => {
  const buffer = readFileSync(path)
  const isGzip = buffer.length > 2 && buffer[0] === 0x1f && buffer[1] === 0x8b
  return JSON.parse((isGzip ? gunzipSync(buffer) : buffer).toString('utf8'))
}

const main = () => {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log('Usage: node scripts/api/figma/extract-tokens.mjs [--input <file.json[.gz]>] [--out <tokens.json>]')
    return
  }
  const inputPath = resolve(repoRoot, options.input)
  const outPath = resolve(repoRoot, options.out)
  const tokens = extractTokens(readFigmaFile(inputPath))
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, serialiseTokens(tokens))

  const { summary, fontsRequiringUpload } = tokens
  console.log(`Wrote ${options.out}`)
  console.log(
    `Named styles: ${Object.entries(summary.namedStyleCounts)
      .map(([kind, count]) => `${kind} ${count}`)
      .join(', ')}`,
  )
  console.log(`Distinct text styles: ${summary.distinctTextStyles}, colours: ${summary.distinctColors}, overrides: ${summary.overrides}`)
  console.log(`Fonts requiring manual upload: ${fontsRequiringUpload.length ? fontsRequiringUpload.join(', ') : 'none'}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`extract-tokens: ${error.message}`)
    process.exit(1)
  }
}
