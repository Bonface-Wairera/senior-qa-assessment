
import { expect, type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async enterCustomerDetails(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);

    await this.page.locator('[data-test="continue"]').click();

    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
  }

  async assertOrderSummary(
    productNames: string[],
    expectedSubtotal: number
  ): Promise<void> {
    const items = this.page.locator('[data-test="inventory-item"]');

    await expect(items).toHaveCount(productNames.length);

    for (const name of productNames) {
      await expect(
        items.locator('[data-test="inventory-item-name"]', {
          hasText: name
        })
      ).toHaveCount(1);
    }

    const subtotal = this.page.locator('[data-test="subtotal-label"]');

    await expect(subtotal).toHaveText(
      `Item total: $${expectedSubtotal.toFixed(2)}`
    );

    const taxText = await this.page
      .locator('[data-test="tax-label"]')
      .innerText();

    const totalText = await this.page
      .locator('[data-test="total-label"]')
      .innerText();

    const tax = Number(taxText.replace(/[^0-9.]/g, ''));
    const total = Number(totalText.replace(/[^0-9.]/g, ''));

    expect(Number.isFinite(tax)).toBe(true);
    expect(Number.isFinite(total)).toBe(true);

    expect(Math.round(total * 100)).toBe(
      Math.round(expectedSubtotal * 100) + Math.round(tax * 100)
    );
  }

  async finishOrder(): Promise<void> {
    await this.page.locator('[data-test="finish"]').click();
  }

  async assertOrderConfirmed(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);

    await expect(
      this.page.locator('[data-test="complete-header"]')
    ).toHaveText('Thank you for your order!');

    await expect(
      this.page.locator('[data-test="complete-text"]')
    ).toBeVisible();
  }
}
