import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const qaseToken =
  process.env.QASE_TESTOPS_API_TOKEN || process.env.QASE_API_TOKEN;

const reporters: any[] = [["list"], ["html", { open: "never" }]];

if (qaseToken) {
  reporters.push([
    "playwright-qase-reporter",
    {
      mode: "testops",
      testops: {
        api: {
          token: qaseToken,
        },
        project: "VALTIVE",
        run: {
          complete: true,
        },
      },
      logging: true,
      rootSuiteTitle: "Valtive Calendly Automated Booking",
    },
  ]);
}

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: reporters,
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    viewport: { width: 1280, height: 720 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    launchOptions: {
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--disable-infobars",
      ],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
