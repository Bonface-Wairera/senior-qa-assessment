
import { expect, type Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async addProduct(productId: string): Promise<void> {
    await this.page.locator(
      `[data-test="add-to-cart-${productId}"]`
    ).click();
  }

  async assertCartCount(count: number): Promise<void> {
    await expect(
      this.page.locator('[data-test="shopping-cart-badge"]')
    ).toHaveText(String(count));
  }

  async openCart(): Promise<void> {
    await this.page.locator('[data-test="shopping-cart-link"]').click();

    await expect(this.page).toHaveURL(/\/cart\.html$/);
  }
}
