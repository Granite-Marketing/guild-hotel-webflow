import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
      threshold: 0.2,
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js build && node node_modules/vite/bin/vite.js preview --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 991, height: 900 } } },
    { name: 'mobile-landscape', use: { ...devices['Desktop Chrome'], viewport: { width: 767, height: 900 } } },
    { name: 'mobile-portrait', use: { ...devices['Desktop Chrome'], viewport: { width: 479, height: 844 } } },
  ],
})
