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
    const targetDay = availableDays.nth(slotIndex % Math.max(1, daysCount));
    await targetDay.click();

    await this.page.waitForTimeout(1000);

    const timeSlots = this.iframe
      .getByRole("button", { name: /^\s*\d{1,2}:\d{2}(\s?[ap]m)?\s*$/i })
      .or(this.iframe.locator('[data-container="time-button"] button'));
    await timeSlots.first().waitFor({ state: "visible", timeout: 15000 });
    const slotsCount = await timeSlots.count();
    const targetSlot = timeSlots.nth(slotIndex % Math.max(1, slotsCount));
    await targetSlot.click();
    const nextBtn = this.iframe
      .getByRole("button", { name: /^Next/i })
      .and(this.iframe.locator(":visible")).first();
    await nextBtn.waitFor({ state: "visible", timeout: 10000 });
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
