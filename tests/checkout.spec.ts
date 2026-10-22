
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import testData from '../test-data/users.json';

const standardUser = testData.users.find(
  user => user.username === 'standard_user'
);

if (!standardUser) {
  throw new Error('Standard user test data is missing');
}

test('CHECKOUT-001: Customer purchases two products successfully', async ({
  page
}) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await test.step('Login as standard user', async () => {
    await loginPage.navigate();
    await loginPage.login(standardUser.username, standardUser.password);
    await loginPage.assertLoginSuccessful();
  });

  await test.step('Add two distinct products to cart', async () => {
    await inventoryPage.addProduct('sauce-labs-backpack');
    await inventoryPage.addProduct('sauce-labs-bike-light');
    await inventoryPage.assertCartCount(2);
  });

  await test.step('Verify products and quantities in cart', async () => {
    await inventoryPage.openCart();

    await cartPage.assertProducts([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light'
    ]);
  });

  await test.step('Proceed to checkout', async () => {
    await cartPage.checkout();

    await checkoutPage.enterCustomerDetails(
      'Test',
      'Customer',
      '00100'
    );
  });

  await test.step('Verify order summary and totals', async () => {
    await checkoutPage.assertOrderSummary(
      ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
      39.98
    );
  });

  await test.step('Complete order and verify confirmation', async () => {
    await checkoutPage.finishOrder();
    await checkoutPage.assertOrderConfirmed();
  });
});
