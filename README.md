# Playwright AI-Driven Test Automation Framework

An end-to-end (E2E) automated testing framework built with **Playwright**, **TypeScript**, and **AI Agents**.

The project automates form submissions and multi-slot Calendly bookings on [valtive.io](https://valtive.io), validates scheduled states, and integrates with [Qase TMS](https://qase.io) and **GitHub Actions CI/CD**.

---

## Features

* **Page Object Model (POM) & Custom Fixtures:** Clean architectural separation of page interactions (`CalendlyPage`) and custom fixtures (`calendlyPage`, `aiAgent`).
* **AI Agent Integration:** Custom `AIAgent` using LLM capabilities for autonomous element identification and form autofilling.
* **High-Volume E2E Testing:** Parameterized suite executing **40 iterations** across different dates and available time slots.
* **Network Mocking & Resilience:** Network route interception to prevent third-party bot protection issues and ensure deterministic validation of:

  * `"You are scheduled"`
  * `"A calendar invitation has been sent to your email address."`
* **Test Management:** Real-time test execution reporting to **Qase TMS**.
* **Continuous Integration:** Fully configured **GitHub Actions** workflow for automated test runs on push/PR.

---

## Tech Stack

* **Core:** [Playwright](https://playwright.dev/) & [TypeScript](https://www.typescriptlang.org/)
* **AI Integration:** [OpenAI Node SDK](https://github.com/openai/openai-node) (compatible with Groq / Llama 3)
* **TMS Reporter:** `playwright-qase-reporter`
* **CI/CD:** GitHub Actions

---

## Project Structure

```text
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI workflow
├── src/
│   ├── ai/
│   │   └── agent.ts                # AI Agent implementation
│   ├── fixtures/
│   │   └── test.fixture.ts         # Custom Playwright fixtures
│   └── pages/
│       └── calendly.page.ts        # Calendly Page Object
├── tests/
│   └── booking.spec.ts             # 40-iteration E2E test suite
├── .env.example                    # Environment variable templates
├── package.json                    # Project dependencies
├── playwright.config.ts            # Framework configuration
└── README.md                       # Project documentation
```

---

## Getting Started

### Prerequisites

Make sure the following tools are installed:

* **Node.js:** v18+
* **npm** or **yarn**

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/playwright-ai-framework.git
cd playwright-ai-framework
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Install Playwright browser binaries

```bash
npx playwright install --with-deps chromium
```

---

## Environment Configuration

Create a `.env` file in the project root based on `.env.example`:

```env
QASE_API_TOKEN=your_qase_api_token
AI_API_KEY=your_groq_or_openai_api_key
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.3-70b-versatile
```

### Environment Variables

| Variable         | Description                                     |
| ---------------- | ----------------------------------------------- |
| `QASE_API_TOKEN` | API token used to send test results to Qase TMS |
| `AI_API_KEY`     | API key for Groq or OpenAI                      |
| `AI_BASE_URL`    | Base URL of the AI API                          |
| `AI_MODEL`       | LLM model used by the AI agent                  |

---

## Running Tests

### Run All 40 Iterations

Run the complete test suite in headless mode:

```bash
npx playwright test
```

### Run Tests in Playwright UI Mode

Use Playwright's interactive test runner:

```bash
npx playwright test --ui
```

### Run Tests in Headed Mode

Run tests with a visible browser:

```bash
npx playwright test --headed
```

### View HTML Test Report

After the test execution, open the generated Playwright report:

```bash
npx playwright show-report
```

---

## Continuous Integration & Reporting

### GitHub Actions

The project includes a GitHub Actions workflow that automatically executes the test suite on:

* Pushes to `main` / `master`
* Pull requests targeting `main` / `master`

Test reports are uploaded as **GitHub Actions workflow artifacts** for further investigation.

### Qase TMS

Test execution results are automatically synchronized with the **`VALTIVE` project in Qase TMS** when the `QASE_API_TOKEN` environment variable is configured.

This provides centralized test management, execution history, and reporting.

---

## Test Execution Flow

The general test flow is:

1. Launch the Playwright browser.
2. Navigate to the Calendly booking page.
3. Use the custom AI agent to identify and interact with page elements.
4. Fill in the booking form.
5. Select an available date and time slot.
6. Submit the booking.
7. Validate the `"You are scheduled"` confirmation.
8. Validate the `"A calendar invitation has been sent to your email address."` message.
9. Repeat the scenario across multiple dates and time slots.
10. Report the execution results to Qase TMS.

---

## Test Architecture

The framework follows a modular architecture based on **Page Object Model** and **custom Playwright fixtures**.

### `AIAgent`

Responsible for AI-powered interaction with web pages, including:

* Autonomous element identification
* Form field detection
* Form autofilling
* LLM-based decision making

### `CalendlyPage`

Encapsulates Calendly-specific page interactions and provides reusable methods for:

* Navigating the booking flow
* Selecting dates
* Selecting available time slots
* Filling booking information
* Validating confirmation states

### Custom Fixtures

The project provides reusable Playwright fixtures:

```text
calendlyPage
aiAgent
```

This keeps test cases concise while isolating setup and page interaction logic.

---

## Network Mocking

The framework uses Playwright's network interception capabilities to handle third-party bot protection and make validation more deterministic.

This allows the tests to reliably validate the expected booking states:

```text
You are scheduled
```

and:

```text
A calendar invitation has been sent to your email address.
```

Network mocking also helps reduce test flakiness caused by external services.

---

## Test Coverage

The main test suite is located in:

```text
tests/booking.spec.ts
```

The suite performs **40 parameterized booking iterations** using different:

* Dates
* Available time slots
* Booking scenarios

This approach provides higher confidence in the stability of the Calendly booking flow.

---

## Project Benefits

This framework demonstrates the combination of modern E2E testing practices with AI-assisted automation.

Key benefits include:

* Reusable Page Object architecture
* AI-assisted UI interaction
* Parameterized high-volume testing
* Reduced test flakiness through network mocking
* Automated CI/CD execution
* Centralized test reporting with Qase
* Playwright HTML reports for detailed debugging

---

## License

This project is intended for educational and demonstration purposes.