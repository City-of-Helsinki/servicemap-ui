import { test, expect } from '@playwright/test';
import finnish from '../../../src/i18n/fi';
import { acceptCookieConcent, getLocation } from '../utils';
import { TreeView } from '../utils/pageObjects';
/**
 * Mobility tree page tests
 */
test.describe('Mobility tree page tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/mobility`);
    await acceptCookieConcent(page);
  });

  // Registers an accordion functionality test
  test('Mobility tree accordion works correctly', async ({ page }) => {
    const treeView = new TreeView(page);
    await treeView.testAccordions();
  });

  /**
   * This test verifies the search functionality in the Mobility tree view.
   * It performs the following checks:
   *  - Reuses a pre-defined tree search test to simulate search input and result rendering.
   *  - Verifies that the URL contains the expected query parameter for a mobility node.
   *  - Checks that the back button's aria-label matches the expected Finnish label.
   *  - Simulates clicking the back button and confirms navigation back to the mobility page.
   */
  test('Mobility tree search works correctly', async ({ page }) => {
    const treeView = new TreeView(page);
    await treeView.testTreeSearch();
    // Locate the back button within the search bar.
    const searchBackButton = page.locator('#SearchBar .SMBackButton');

    // Verify that the URL reflects a search action with a mobility node query parameter.
    expect(await getLocation(page)).toContain('/fi/search?mobility_node=');

    // Check that the back button's aria-label matches the Finnish translation.
    expect(await searchBackButton.getAttribute('aria-label')).toBe(
      finnish['general.back.mobilityTree']
    );

    // Simulate clicking the back button to navigate back.
    await searchBackButton.click();

    // Verify that after clicking back, the URL indicates navigation to the mobility page.
    expect(await getLocation(page)).toContain('/fi/mobility');
  });
});
