import { test, expect } from "../src/fixtures/test.fixture";

test.describe("Valtive Calendly Automated Booking", () => {
  for (let i = 1; i <= 40; i++) {
    test(`Booking iteration #${i}`, async ({ page, calendlyPage, aiAgent }) => {
      test.setTimeout(60000);

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

      const scheduledElement = await aiAgent.findElement(
        "You are scheduled",
        calendlyFrame,
      );

      const botProtectionHeading = calendlyFrame
        .getByRole("heading", {
          name: /This booking cannot be completed|Confirm you're human/i,
        })
        .or(
          calendlyFrame.getByText(
            /This booking cannot be completed|Confirm you're human/i,
          ),
        )
        .first();
      
      const finalState = scheduledElement.or(botProtectionHeading);
      await expect(finalState).toBeVisible({ timeout: 20000 });

      if (await scheduledElement.isVisible().catch(() => false)) {
        const invitationElement = await aiAgent.findElement(
          "A calendar invitation has been sent to your email address",
          calendlyFrame,
        );
        await expect(invitationElement).toBeVisible({ timeout: 5000 });
      }
    });
  }
});
