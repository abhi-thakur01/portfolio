import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "**/*.spec.mjs",
  fullyParallel: false,
  workers: 1,
  timeout: 40_000,
  expect: { timeout: 8_000 },
  outputDir: "../../test-results",
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4177",
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "tablet", grep: /public cards/, use: { ...devices["iPad Mini"], browserName: "chromium" } },
  ],
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4177 --strictPort",
    url: "http://127.0.0.1:4177/admin/index.html",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
