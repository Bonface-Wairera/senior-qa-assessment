# Senior QA Assessment — SauceDemo Automation

## Overview

This project automates critical user journeys on [SauceDemo](https://www.saucedemo.com) using Playwright, TypeScript, and the Page Object Model (POM).

The framework covers successful and locked-out login scenarios, data-driven authentication across three users, and an end-to-end checkout journey involving two products.

## Technology Stack

- Playwright with TypeScript
- Page Object Model (POM)
- JSON-based test data
- Chromium, Firefox, and WebKit
- Playwright HTML reports, traces, and failure screenshots

## Project Structure

```text
pages/
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
  CheckoutPage.ts
test-data/
  users.json
tests/
  login.spec.ts
  data-driven-login.spec.ts
  checkout.spec.ts
playwright.config.ts
tsconfig.json
```

## Setup

**Prerequisite:** Node.js and npm.

```bash
npm ci
npx playwright install
```

## Running Tests

Run the complete suite:

```bash
npx playwright test
```

Run Chromium tests:

```bash
npx playwright test --project=chromium
```

Run tests with a visible browser:

```bash
npx playwright test --project=chromium --headed
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

View the HTML report:

```bash
npx playwright show-report
```

## Test Coverage

| ID | Scenario | Expected Result |
|---|---|---|
| LOGIN-001 | Standard user login | Inventory page displayed |
| LOGIN-002 | Locked-out user login | Access denied with correct error |
| DD-LOGIN | Three-user JSON-driven login | Each user receives expected authentication outcome |
| CHECKOUT-001 | Purchase two distinct products | Correct cart, totals and order confirmation |

## Test Design Decisions

Page Objects encapsulate browser interactions and assertions shared across tests. Test specifications describe business journeys without duplicating locator logic.

Each test receives an isolated Playwright browser context. The framework uses stable `data-test` selectors and Playwright's auto-waiting assertions instead of fixed delays.

The checkout test verifies product identity, quantities, subtotal, calculated total, and order confirmation.

## CI Readiness and Flakiness Reduction

1. **Deterministic dependencies:** Use `npm ci` with a committed lockfile and install Playwright browsers consistently in CI.
2. **Stable selectors and synchronization:** Prefer `data-test` locators and Playwright assertions over arbitrary waits.
3. **Test isolation:** Keep tests independent with fresh browser contexts and avoid relying on execution order.
4. **Failure diagnostics:** Capture screenshots and traces on failure and publish the HTML report as a CI artifact.
5. **Controlled retries:** Permit a limited CI retry for diagnostics, investigate flaky failures, and never treat retries as a substitute for fixing instability.

## Current Validation

The six Chromium tests have passed locally. Cross-browser execution and GitHub Actions validation must be completed separately before claiming full CI coverage.
