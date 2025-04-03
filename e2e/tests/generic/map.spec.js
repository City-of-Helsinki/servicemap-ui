import { test, expect } from '@playwright/test';
import { acceptCookieConcent } from '../utils';
import { MapPage } from '../utils/pageObjects';

test.describe('Map tests', () => {
  // Before each test, navigate to the Finnish site and accept cookies.
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi`);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies that transit markers become visible after zooming in.
   * It simulates multiple zoom-in actions until the transit markers appear,
   * then asserts that at least one transit marker is present on the map.
   *
   * Note: This test is currently skipped.
   */
  test.skip('Transit marker visible after zoom', async ({ page }) => {
    const mapPage = new MapPage(page);

    // Zoom in to make transit markers visible
    for (let i = 0; i < 6; i++) {
      await mapPage.zoomInButton.click();
      await page.waitForTimeout(1000);
    }

    // Wait for markers to appear
    await page.waitForTimeout(2000);

    const markerCount = await mapPage.markers.count();
    expect(markerCount).toBeGreaterThan(0, 'no transit markers found on high zoom');
  });
});

test.describe('Search unit geometry test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the search URL in Finnish with query "latu"
    await page.goto(`/fi/search?q=latu`);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies that the unit geometry is drawn on the map.
   * It simulates a user clicking the first search result from the paginated list
   * and confirms that the corresponding polygon overlay becomes visible on the map.
   */
  test('Unit geometry is drawn on map', async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.listItem.click();
    await expect(mapPage.polygon).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Unit page geometry test', () => {
  const UNIT_ID = '56544';

  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/unit/${UNIT_ID}`);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies that the geometry (polygon overlay) for a unit is drawn on the map.
   * It locates the polygon element from the leaflet overlay and confirms its visibility.
   */
  test('Unit geometry is drawn on map', async ({ page }) => {
    const mapPage = new MapPage(page);
    await expect(mapPage.polygon).toBeVisible();
  });

  /**
   * This test verifies that the height profile graph is rendered on the map.
   * It confirms that the SVG element representing the height profile is visible.
   */
  test('Height profile is drawn on map', async ({ page }) => {
    const mapPage = new MapPage(page);
    await expect(mapPage.heightProfile).toBeVisible();
  });

  /**
   * This test confirms that the browse buttons for the height profile are present.
   * It checks that both the previous and next buttons are visible on the page.
   */
  test('Height profile browse buttons exist', async ({ page }) => {
    const mapPage = new MapPage(page);
    await expect(mapPage.heightProfilePrevButton).toBeVisible();
    await expect(mapPage.heightProfileNextButton).toBeVisible();
  });

  /**
   * This test verifies the functionality of the height profile geometry browsing.
   * It simulates clicking through browse buttons and checks that the height profile
   *  polygon remains visible.
   */
  test('Height profile geometry browsing', async ({ page }) => {
    const mapPage = new MapPage(page);

    await expect(mapPage.polygon).toBeVisible({ message: 'Unit geometry is drawn on map' });
    // Close side panel to make sure the height profile is visible
    await page.locator('button').filter({ hasText: 'Pienennä sivupaneeli' }).click();
    await mapPage.heightProfileNextButton.click();
    await expect(mapPage.polygon).toBeVisible({ message: 'Unit next geometry is drawn on map' });

    await mapPage.heightProfilePrevButton.click();
    await expect(mapPage.polygon).toBeVisible({ message: 'Unit previous geometry is drawn on map' });
  });
});
