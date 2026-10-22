
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import testData from '../test-data/users.json';

test.describe('Data-Driven Login Tests', () => {
  for (const user of testData.users) {
    test(`DD-LOGIN: Verify login for ${user.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await test.step('Navigate to the login page', async () => {
        await loginPage.navigate();
      });

      await test.step(`Authenticate as ${user.username}`, async () => {
        await loginPage.login(user.username, user.password);
      });

      await test.step('Verify the expected authentication outcome', async () => {
        if (user.expectedResult === 'success') {
          await loginPage.assertLoginSuccessful();
        } else if (
          user.expectedResult === 'error' &&
          user.expectedMessage
        ) {
          await loginPage.assertLoginError(user.expectedMessage);
        } else {
          throw new Error(
            `Invalid test data configuration for ${user.username}`
          );
        }
      });
    });
  }
});
