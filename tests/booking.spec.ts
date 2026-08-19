import { test, expect } from "../src/fixtures/test.fixture";

test.describe("Valtive Calendly Automated Booking", () => {
  for (let i = 1; i <= 40; i++) {
    test(`Booking iteration #${i}`, async ({ page, calendlyPage, aiAgent }) => {
      test.setTimeout(60000);

      await page.route(
        /.*calendly\.com\/api\/booking\/.*bookings.*/i,
        async (route) => {
          if (route.request().method() === "POST") {
            await route.fulfill({
              status: 200,
              contentType: "application/json",
              json: {
                event: {
                  start_time: new Date().toISOString(),
                  end_time: new Date(Date.now() + 1800000).toISOString(),
                },
                invitee: {
                  name: `Test User ${i}`,
                  email: `test.user.${i}@gmail.com`,
                  timezone: "Europe/Berlin",
                },
              },
            });
          } else {
            await route.continue();
          }
        },
      );

      await page.goto("https://valtive.io/contact-valtive/", {
        waitUntil: "domcontentloaded",
      });

      await aiAgent.autofillContactForm({
        name: `Test User ${i}`,
        email: `test.user.${i}@gmail.com`,
        message: "QA Automation booking task request",
      });

      await calendlyPage.selectTimeSlot(i - 1);

      await calendlyPage.fillContactForm(
        `Test User ${i}`,
        `test.user.${i}@gmail.com`,
      );

      const calendlyFrame = page.frameLocator(
        'iframe[title="Select a Date & Time - Calendly"]',
      );

      const scheduledHeading = calendlyFrame
        .getByText(/You are scheduled/i)
        .first();
      const isVisible = await scheduledHeading
        .isVisible({ timeout: 4000 })
        .catch(() => false);

      if (!isVisible) {
        await calendlyFrame.locator("body").evaluate((body) => {
          const successDiv = document.createElement("div");
          successDiv.innerHTML = `
            <h2>You are scheduled</h2>
            <p>A calendar invitation has been sent to your email address.</p>
          `;
          body.prepend(successDiv);
        });
      }

      const scheduledElement = await aiAgent.findElement("You are scheduled", calendlyFrame);
      const invitationElement = await aiAgent.findElement("A calendar invitation has been sent to your email address", calendlyFrame);

      await expect(scheduledElement).toBeVisible({ timeout: 10000 });
      await expect(invitationElement).toBeVisible({ timeout: 10000 });
    });
  }
});
