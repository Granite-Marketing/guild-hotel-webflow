import { defineConfig, devices } from '@playwright/test'

/**
 * Local fixture checks for runtime modules. `pnpm dev` serves each
 * tests/visual/fixtures/<name>.html at http://localhost:3000/fixtures/.
 */
export default defineConfig({
  testDir: './tests/visual/fixtures',
  testMatch: '*.spec.ts',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000/index.js',
    // Port 3000 is shared by every worktree: never reuse a server that may be
    // serving another checkout. Stop your own `pnpm dev` before running.
    reuseExistingServer: false,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
})
