import * as esbuild from 'esbuild'
import { readdirSync } from 'node:fs'
import { join, sep } from 'node:path'

const PRODUCTION = process.env.NODE_ENV === 'production'
const WATCH = process.argv.includes('--watch')

// Config output
const BUILD_DIRECTORY = 'dist'

// Config entrypoint files
const ENTRY_POINTS = ['src/index.ts']

// Local preview fixtures (dev only): each tests/visual/fixtures/<name>.html is
// copied to dist/fixtures/ (gitignored) with its <name>.ts entry bundled next
// to it, so `pnpm dev` serves them at /fixtures/<name>.html. Images imported
// by a fixture entry are copied alongside.
const FIXTURE_DIRECTORY = 'tests/visual/fixtures'
const FIXTURE_OPTIONS = {
  bundle: true,
  outdir: `${BUILD_DIRECTORY}/fixtures`,
  target: 'esnext',
  loader: { '.html': 'copy', '.webp': 'file', '.png': 'file', '.jpg': 'file' },
  assetNames: 'assets/[name]-[hash]',
}

// Config dev serving
const SERVE_PORT = 3000
const SERVE_ORIGIN = `http://localhost:${SERVE_PORT}`

// Create context
const context = await esbuild.context({
  bundle: true,
  entryPoints: ENTRY_POINTS,
  outdir: BUILD_DIRECTORY,
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: PRODUCTION ? 'es2020' : 'esnext',
  define: WATCH ? { SERVE_ORIGIN: JSON.stringify(SERVE_ORIGIN) } : undefined,
})

// Build files in prod / non-watch
if (PRODUCTION || !WATCH) {
  await context.rebuild()
  await context.dispose()
  console.log(`Built ${ENTRY_POINTS.join(', ')} → ${BUILD_DIRECTORY}/index.js`)
} else {
  // Watch and serve files in dev
  await context.watch()
  const fixtureEntries = readdirSync(FIXTURE_DIRECTORY)
    .filter((file) => file.endsWith('.html') || file.endsWith('.ts'))
    .map((file) => join(FIXTURE_DIRECTORY, file))
  if (fixtureEntries.length) {
    const fixtureContext = await esbuild.context({ ...FIXTURE_OPTIONS, entryPoints: fixtureEntries })
    await fixtureContext.watch()
  }
  await context
    .serve({
      servedir: BUILD_DIRECTORY,
      port: SERVE_PORT,
    })
    .then(logServedFiles)
}

/**
 * Logs information about the files that are being served during local development.
 */
function logServedFiles() {
  /**
   * Recursively gets all files in a directory.
   * @param {string} dirPath
   * @returns {string[]} An array of file paths.
   */
  const getFiles = (dirPath) => {
    const files = readdirSync(dirPath, { withFileTypes: true }).map((dirent) => {
      const path = join(dirPath, dirent.name)
      return dirent.isDirectory() ? getFiles(path) : path
    })

    return files.flat()
  }

  const files = getFiles(BUILD_DIRECTORY)

  const filesInfo = files
    .map((file) => {
      if (file.endsWith('.map')) return

      // Normalize path and create file location
      const paths = file.split(sep)
      paths[0] = SERVE_ORIGIN

      const location = paths.join('/')

      // Create import suggestion
      const tag = location.endsWith('.css')
        ? `<link href="${location}" rel="stylesheet" type="text/css"/>`
        : `<script defer src="${location}"></script>`

      return {
        'File Location': location,
        'Import Suggestion': tag,
      }
    })
    .filter(Boolean)

  console.table(filesInfo)
}
