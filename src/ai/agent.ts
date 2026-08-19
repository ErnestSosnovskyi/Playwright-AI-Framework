import { Page, FrameLocator, Locator } from "@playwright/test";
import OpenAI from "openai";

export class AIAgent {
  private page: Page;
  private openai: OpenAI;
  private model: string;
  private static selectorCache = new Map<
    string,
    { role?: any; name?: string }
  >();

  constructor(page: Page) {
    this.page = page;
    this.openai = new OpenAI({
      apiKey: process.env.AI_API_KEY || "mock-key",
      baseURL: process.env.AI_BASE_URL || "https://api.groq.com/openai/v1",
    });
    this.model = process.env.AI_MODEL || "llama-3.3-70b-versatile";
  }

  async findElement(
    instruction: string,
    context?: FrameLocator,
  ): Promise<Locator> {
    const targetContext = context || this.page;

    if (AIAgent.selectorCache.has(instruction)) {
      const cached = AIAgent.selectorCache.get(instruction)!;
      if (cached.role && cached.name) {
        return targetContext
          .getByRole(cached.role, { name: new RegExp(cached.name, "i") })
          .first();
      }
      return targetContext.getByText(new RegExp(instruction, "i")).first();
    }
    if (!process.env.AI_API_KEY) {
      return context
        ? context.getByText(new RegExp(instruction, "i")).first()
        : this.page.getByText(new RegExp(instruction, "i")).first();
    }

    const prompt = `You are a Playwright Automation Agent.
    Given the target intent: "${instruction}", determine the most robust Playwright-compatible role or text selector strategy.
    Return ONLY valid JSON format: {"role": "button" | "textbox" | "heading", "name": "regex-or-text"}`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const parsed = JSON.parse(completion.choices[0].message.content || "{}");
      const targetContext = context || this.page;

      if (parsed.role && parsed.name) {
        return targetContext
          .getByRole(parsed.role, { name: new RegExp(parsed.name, "i") })
          .first();
      }
    } catch {}

    return (context || this.page)
      .getByText(new RegExp(instruction, "i"))
      .first();
  }

  async autofillContactForm(data: {
    name: string;
    email: string;
    message: string;
  }) {
    const nameField = this.page.getByRole("textbox", { name: /Your name/i });
    if (await nameField.isVisible().catch(() => false)) {
      await nameField.fill(data.name);
      await this.page
        .getByRole("textbox", { name: /Your email/i })
        .fill(data.email);
      await this.page
        .getByRole("textbox", { name: /Tell us about you/i })
        .fill(data.message);
    }
  }
}
