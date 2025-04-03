// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, devices } from '@playwright/test';

export const E2E_TESTS_ENV_URL = process.env.E2E_TESTS_ENV_URL ?? 'http://localhost:2048';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e/tests',

  // Timeout for each test in milliseconds
  timeout: 60 * 1000,

  // Run tests sequentially
  fullyParallel: true,

  // Use only one worker locally
  workers: process.env.CI ? 2 : 2,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // The maximum number of retry attempts given to failed tests
  retries: process.env.CI ? 1 : 0,

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [
    ['junit', { outputFile: 'report/e2e-junit-results.xml' }],
    ['html', { open: 'never', outputFolder: 'report/html' }]
  ],

  expect: {
    timeout: 15000
  },
  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: E2E_TESTS_ENV_URL,

    // Whether to ignore HTTPS errors when sending network requests
    ignoreHTTPSErrors: true,

    // Whether to automatically capture a screenshot after each test
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },

    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',

    // https://playwright.dev/docs/videos
    video: 'on-first-retry',
    contextOptions: { recordVideo: { dir: './report/videos/' } },

    // Add viewport size for consistent testing
    viewport: { width: 1280, height: 720 },

    // Add action timeouts
    actionTimeout: 15000,
    navigationTimeout: 30000,

    // Clear storage state between tests for isolation
    storageState: undefined,
  },

  outputDir: './report/playwright',

  webServer: {
    command: 'node dist',
    url: E2E_TESTS_ENV_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
