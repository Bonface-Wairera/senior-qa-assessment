
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import testData from '../test-data/users.json';

const standardUser = testData.users.find(
  user => user.username === 'standard_user'
);

const lockedUser = testData.users.find(
  user => user.username === 'locked_out_user'
);

if (!standardUser || !lockedUser || !lockedUser.expectedMessage) {
  throw new Error('Required login test data is missing');
}

test.describe('SauceDemo Login', () => {
  test('LOGIN-001: Standard user logs in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(standardUser.username, standardUser.password);
    await loginPage.assertLoginSuccessful();
  });

  test('LOGIN-002: Locked-out user is denied access', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(lockedUser.username, lockedUser.password);
    await loginPage.assertLoginError(lockedUser.expectedMessage!);
  });
});
