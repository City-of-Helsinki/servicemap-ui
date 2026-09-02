import { expect, test } from '@playwright/test';

/**
 * Regression test for UnitView map cleanup with deferred MapView mounting.
 *
 * Verifies that when MapView (lazy-loaded via Suspense with useIsClient hook)
 * mounts after UnitView's initial render, the cleanup function uses the correct
 * (later) map instance to restore view, not a stale null reference from the
 * initial render closure.
 *
 * The bug scenario would be:
 * 1. UnitView mounts, map ref from Redux is null (MapView lazy-loading)
 * 2. Cleanup closure captures map = null
 * 3. MapView lazy-loads and map becomes available in Redux
 * 4. On unmount, cleanup calls map.setView() where map is stale null
 * 5. Error occurs trying to call null.setView()
 *
 * Fix: By including map in the dependency array, React creates a new cleanup
 * whenever map changes, so cleanup always has the correct map reference.
 */
test('UnitView unmount cleanup works with deferred map instance', async ({ page }) => {
  // Navigate to search page and perform a search
  await page.goto('/fi/search?q=kirjasto');

  // Wait for search results and map to load
  await page.waitForSelector('.unitMarker, .unitClusterMarker', { timeout: 10000 });

  // Click first search result to navigate to UnitView
  const firstResult = page.locator('[data-sm="UnitItem"]').first();
  await firstResult.click();

  // Wait for UnitView to fully load (including deferred MapView via useIsClient)
  await page.waitForSelector('[id="view-title"]', { timeout: 10000 });
  await expect(page.locator('.LoadingIndicator')).toHaveCount(0, { timeout: 15000 });

  // Navigate back to search page
  // This triggers UnitView unmount and its cleanup function
  // If cleanup had a stale map=null reference, it would fail calling null.setView()
  await page.goBack();

  // Wait for search page to stabilize
  await page.waitForSelector('[id="view-title"]', { timeout: 10000 });

  // If we got here without errors, cleanup succeeded with correct map instance
  const pageTitle = await page.locator('[id="view-title"]');
  await expect(pageTitle).toBeVisible();
});

/**
 * Verify MapView lazy-loading via Suspense and useIsClient is working correctly.
 * Ensures the deferred mounting scenario (the regression scenario) is exercised.
 */
test('UnitView MapView lazy-loads correctly after client mount', async ({ page }) => {
  // Navigate to unit page directly
  await page.goto('/fi/unit/51342');

  // Wait for unit view to load
  await page.waitForSelector('[id="view-title"]', { timeout: 10000 });

  // MapView is deferred via useIsClient, so initially shows Loading
  // Then once client-mounted, MapView lazy-loads via Suspense
  const loading = page.locator('.LoadingIndicator').first();
  await expect(loading).toHaveCount(0, { timeout: 15000 });

  // Verify Leaflet map container is visible (MapView successfully lazy-loaded)
  const mapContainer = page.locator('.leaflet-container');
  await expect(mapContainer).toBeVisible({ timeout: 5000 });
});
