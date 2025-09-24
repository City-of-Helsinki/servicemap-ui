import { test, expect } from '@playwright/test';
import { UnitExtendedPage } from '../utils/pageObjects';
import { acceptCookieConcent } from '../utils';

const pages = [
  `/fi/unit/51342/events`,
  `/fi/unit/51342/services`,
  `/fi/unit/51342/reservations`
];

const unitName = 'Keskustakirjasto Oodi';

for (const pageUrl of pages) {
  test.describe(`Page: ${pageUrl}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(pageUrl);
      await acceptCookieConcent(page);
    });

    /**
     * This test checks that the unit page displays the correct title. It retrieves the title
     * element using the page object selector and verifies both its visibility and that its text
     * contains the expected unit name.
     */
    test('has correct title', async ({ page }) => {
      const unitPage = new UnitExtendedPage(page);
      const titleLocator = unitPage.title;
      await expect(titleLocator).toBeVisible();
      await expect(titleLocator).toHaveText(new RegExp(unitName));
    });

    /**
     * This test validates that the unit is correctly displayed on the map by checking that a unit marker
     * is rendered. It asserts that there is exactly one marker present within the map container.
     */
    test('displays unit on map', async ({ page }) => {
      const unitPage = new UnitExtendedPage(page);
      expect(await unitPage.markers.count()).toBe(1);
    });
  });
}
