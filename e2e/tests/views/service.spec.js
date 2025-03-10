import { test, expect } from '@playwright/test';
import { acceptCookieConcent, getBaseUrl } from '../utils';
import paginationTest from '../utils/paginationTest';
import resultOrdererTest from '../utils/resultOrdererTest';
import { ServicePage } from '../utils/pageObjects';

const coordinates = ['60.281936', '24.949933'];

test.describe('Service page coordinate tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${getBaseUrl()}/fi/service/813?lat=${coordinates[0]}&lon=${coordinates[1]}`);
    await acceptCookieConcent(page);
  });

  test('User marker is drawn on map based on coordinates', async ({ page }) => {
    const servicePage = new ServicePage(page);
    await expect(servicePage.marker).toHaveCount(1);
  });
});

const servicePageUrl = `${getBaseUrl()}/fi/service/813`;

test.describe('Service page tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(servicePageUrl);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies the functionality of the result orderer on the service page.
   * It leverages the helper function "resultOrdererTest" to check that results are ordered
   * correctly according to the application logic.
   */
  test('Result orderer test', async ({ page }) => {
    await resultOrdererTest(page);
  });

  /**
   * This test validates that the pagination functionality on the service page works as expected.
   * It uses the helper function "paginationTest" together with the service page URL,
   * ensuring that the pagination controls and behavior are correct when navigating through results.
   */
  test('Pagination test', async ({ page }) => {
    await paginationTest(page, servicePageUrl);
  });

  /**
   * This test confirms that clicking on a service view list item correctly navigates the user
   * to the corresponding unit view. The test performs the following:
   * 1. Locates the list of unit items by their role.
   * 2. Retrieves the name of the first unit item.
   * 3. Clicks the first unit item.
   * 4. Verifies that the unit details page displays the correct title matching the clicked name.
   * 5. Clicks the "Back" button and asserts that focus returns to the service page title element.
   */
  test('Service view list item click takes to correct unit view', async ({ page }) => {
    const servicePage = new ServicePage(page);

    // Get the name of the first unit
    const name = await servicePage.firstUnitTextbox.textContent();

    // Click the first unit and verify navigation
    await servicePage.units.first().click();
    await expect(servicePage.unitTitle).toHaveText(name);

    // Go back and verify focus
    await servicePage.backToServiceButton.click();
    await expect(servicePage.servicePageTitle).toBeFocused();
  });
});
