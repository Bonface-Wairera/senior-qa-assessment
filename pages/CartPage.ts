
import { expect, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async assertProducts(productNames: string[]): Promise<void> {
    const cartItems = this.page.locator('[data-test="inventory-item"]');

    await expect(cartItems).toHaveCount(productNames.length);

    for (const name of productNames) {
      const item = cartItems.filter({
        has: this.page.locator('[data-test="inventory-item-name"]', {
          hasText: name
        })
      });

      await expect(item).toHaveCount(1);
      await expect(
        item.locator('[data-test="item-quantity"]')
      ).toHaveText('1');
    }
  }

  async checkout(): Promise<void> {
    await this.page.locator('[data-test="checkout"]').click();

    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
  }
}
