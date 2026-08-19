import { test as baseTest } from '@playwright/test';
import { CalendlyPage } from '../pages/calendly.page';
import { AIAgent } from '../ai/agent';

type MyFixtures = {
    calendlyPage: CalendlyPage;
    aiAgent: AIAgent;
}

export const test = baseTest.extend<MyFixtures>({
    calendlyPage: async({ page }, use) => {
        const calendlyPage = new CalendlyPage(page);
        await use(calendlyPage);
    },
    aiAgent: async ({ page }, use) => {
        const agent = new AIAgent(page);
        await use(agent);
    },
});

export { expect } from '@playwright/test';