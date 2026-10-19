import * as esbuild from 'esbuild'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Local preview server for module fixtures in tests/visual/fixtures.
 *
 * Every `<name>.entry.ts` there is bundled in memory to `<name>.js` and served
 * next to the static HTML, so `<name>.html` loads it with
 * `<script src="<name>.js">`. `pnpm dev` starts it on port 3001; Playwright
 * specs call `serveFixtures` on their own port.
 */

export const FIXTURES_DIRECTORY = 'tests/visual/fixtures'

export const serveFixtures = async (port) => {
  const entryPoints = readdirSync(FIXTURES_DIRECTORY)
    .filter((file) => file.endsWith('.entry.ts'))
    .map((file) => ({
      in: join(FIXTURES_DIRECTORY, file),
      out: file.replace(/\.entry\.ts$/, ''),
    }))

  const context = await esbuild.context({
    bundle: true,
    entryPoints,
    outdir: FIXTURES_DIRECTORY,
    write: false,
    sourcemap: true,
    target: 'esnext',
    // Fixture entries may import placeholder crops from figma/.
    loader: { '.webp': 'file', '.png': 'file', '.jpg': 'file' },
  })
  const server = await context.serve({ servedir: FIXTURES_DIRECTORY, port })

  return {
    origin: `http://localhost:${server.port}`,
    stop: () => context.dispose(),
  }
}
