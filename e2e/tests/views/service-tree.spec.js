import { test, expect } from '@playwright/test';
import { acceptCookieConcent, getLocation } from '../utils';
import finnish from '../../../src/i18n/fi';
import { TreeView } from '../utils/pageObjects';

test.describe('Service tree page tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/services`);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies that the search functionality within the service tree page works
   *  as expected.
   * It performs the following steps:
   * 1. Executes the tree search test logic using the helper function "treeSearchTest".
   * 2. Verifies that the current URL contains the expected query parameter for a service node.
   * 3. Checks that the search back button has the proper aria-label (translated into Finnish).
   * 4. Clicks the back button and confirms that the URL navigates back to the services page.
   */
  test('Service tree search works correctly', async ({ page }) => {
    const treeView = new TreeView(page);
    await treeView.testTreeSearch();

    // Retrieve the current URL and verify it contains the expected service_node parameter.
    expect(await getLocation(page)).toContain('/fi/search?service_node=');

    // Locate the search back button within the search bar and check its aria-label.
    const searchBackButton = page.locator('#SearchBar .SMBackButton');
    await expect(searchBackButton).toHaveAttribute('aria-label', finnish['general.back.serviceTree']);

    // Click the back button to return to the services page.
    await searchBackButton.click();

    // Verify that the current URL now points to the services page.
    expect(await getLocation(page)).toContain('/fi/services');
  });

  /**

   * This test verifies the functionality of the accordion in the service tree view.
   * It does so by delegating the test logic to the helper function "treeViewAccordionTest",
   * ensuring that the accordion operates as expected when interacted with.
   */
  test('Service tree view accordion works correctly', async ({ page }) => {
    const treeView = new TreeView(page);
    await treeView.testAccordions();
  });
});
