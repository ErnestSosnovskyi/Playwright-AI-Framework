import { Page, FrameLocator } from "@playwright/test";

export class CalendlyPage {
  readonly page: Page;
  readonly iframe: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.iframe = page.frameLocator(
      'iframe[title="Select a Date & Time - Calendly"]',
    );
  }

  async selectTimeSlot(slotIndex: number = 0) {
    const iframeNode = this.page.locator(
      'iframe[title="Select a Date & Time - Calendly"]',
    );
    await iframeNode.waitFor({ state: "attached", timeout: 15000 });
    await iframeNode.scrollIntoViewIfNeeded();

    const availableDays = this.iframe
      .getByRole("button", { name: /Times available/i })
      .and(this.iframe.locator(":not([disabled])"));

    await availableDays.first().waitFor({ state: "visible", timeout: 15000 });
    const daysCount = await availableDays.count();
    await availableDays.nth(slotIndex % Math.max(1, daysCount)).click();

    const timeSlots = this.iframe.getByRole("button", {
      name: /^[0-9]{1,2}:[0-9]{2}$/,
    });
    await timeSlots.first().waitFor({ state: "visible", timeout: 10000 });
    const slotsCount = await timeSlots.count();
    await timeSlots.nth(slotIndex % Math.max(1, slotsCount)).click();

    const nextBtn = this.iframe.getByRole("button", { name: /^Next/i }).first();
    await nextBtn.waitFor({ state: "visible", timeout: 5000 });
    await nextBtn.click();
  }

  async fillContactForm(name: string, email: string) {
    const nameInput = this.iframe
      .getByRole("textbox", { name: /Name/i })
      .first();
    await nameInput.waitFor({ state: "visible", timeout: 10000 });
    await nameInput.fill(name);

    const emailInput = this.iframe
      .getByRole("textbox", { name: /Email/i })
      .first();
    await emailInput.fill(email);

    const scheduleBtn = this.iframe
      .getByRole("button", { name: "Schedule Event" })
      .first();
    await scheduleBtn.click();
  }
}
