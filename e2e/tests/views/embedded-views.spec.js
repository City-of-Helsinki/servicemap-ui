import { test, expect } from '@playwright/test';
import { EmbeddedView } from '../utils/pageObjects';

test.describe('Embed view test', () => {
  /**
   * This test verifies that the embedded unit view correctly displays a single unit marker.
   * It navigates to an embed URL for a specific unit (ID: 51342) and checks that:
   *  - The loading indicator disappears, meaning that the data has been successfully loaded.
   *  - Exactly one unit marker is rendered on the map.
   */
  test('Embedded unit view shows unit marker', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    // Navigate to the embedded unit view for unit with ID 51342.
    await page.goto(`/fi/embed/unit/51342`);

    // Assert that the loading indicator is absent, indicating that the data has loaded.
    await expect(embeddedView.loadingIndicator).toHaveCount(0);
    // Assert that exactly one unit marker is visible on the map.
    await expect(embeddedView.unitMarkers).toHaveCount(1);
  });

  /**
   * This test verifies that the embedded unit view displays nearby services correctly.
   * It navigates to an embed URL for a specific unit (ID: 68398) with service filters
   *  (IDs: 961,239) and a distance parameter.
   * The assertions confirm that:
   *  - The loading indicator is absent, indicating data has been loaded.
   *  - At least one unit marker (representing the unit and its nearby services) is
   *  visible on the map.
   */
  test('Embedded unit view shows nearby services', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    await page.goto(`/fi/embed/unit/68398?services=961,239&distance=100`);

    // Confirm that the loading indicator is not present (data is loaded)
    await expect(embeddedView.loadingIndicator).toHaveCount(0);
    // Wait for the first unit marker to be visible, indicating that both the unit and
    //  its nearby services are rendered
    await embeddedView.unitMarkers.first().waitFor({ state: 'visible' });
  });

  /**
   * This test verifies that the embedded search view displays search results correctly.
   * It navigates to an embed URL with a search query ("kirjastot") and a layout parameter
   *  (show_list=side).
   * The test asserts that:
   *  - The loading indicator disappears, confirming that data has been loaded.
   *  - At least one search result marker is rendered to the map.
   *  - The search results list is populated with at least one item.
   *  - Clicking on a search result opens a dialog displaying the correct unit information.
   */
  test('Embedded search view shows search results', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    await page.goto(`/fi/embed/search?q=kirjastot&show_list=side`);

    // Get the search results list container and its first item
    const unitListItem = embeddedView.unitList.first();

    // Ensure no loading indicator is present (data has loaded)
    await expect(embeddedView.loadingIndicator).toHaveCount(0);
    // Wait for the first search result marker to be visible on the map
    await embeddedView.unitMarkers.first().waitFor({ state: 'visible' });

    // Verify that the search result list contains items
    await expect(embeddedView.unitList).not.toHaveCount(0);

    // Click the first search result item and verify that the dialog displays the correct title
    await unitListItem.click();
    const dialogTitleText = await embeddedView.unitDialogTitle.textContent();
    const listItemTitleText = await embeddedView.unitListItemTitle.first().textContent();
    expect(dialogTitleText).toBe(listItemTitleText);
  });

  /**
   * This test verifies that the embedded search view can display a specified set of units.
   * It navigates to an embed URL that specifies particular unit IDs.
   * The test asserts that:
   *  - The loading indicator is absent, indicating data has been loaded.
   *  - Exactly four unit markers, corresponding to the specified unit IDs, are rendered on the map.
   */
  test('Embedded search view shows specified units', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    await page.goto(`/fi/embed/search?units=64196,45980,8264,32359`);

    // Ensure no loading indicator is present (data has loaded)
    await expect(embeddedView.loadingIndicator).toHaveCount(0);
    // Verify that exactly 4 unit markers are rendered on the map
    await expect(embeddedView.unitMarkers).toHaveCount(4);
  });

  /**
   * This test verifies that the embedded search view for service node units loads correctly.
   * It navigates to an embed URL with specific service node parameters and asserts that:
   *  - The loading indicator is absent, indicating that the data has been successfully loaded.
   *  - At least one service node unit marker is visible on the map.
   */
  test('Embedded search view shows service node units', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    await page.goto(`/fi/embed/search?service_node=1065,1066,1062`);

    // Confirm that the loading indicator is not present, meaning data has loaded.
    await expect(embeddedView.loadingIndicator).toHaveCount(0);
    // Wait for the first service node unit marker to be visible on the map.
    await embeddedView.unitMarkers.first().waitFor({ state: 'visible' });
  });

  /**
   * This test verifies that the embedded search view for event units loads correctly.
   * It performs the following steps:
   * 1. Navigates to the embed URL with an events query parameter.
   * 2. Ensures that the loading indicator is absent, indicating that data has finished loading.
   * 3. Waits until at least one unit marker becomes visible on the map.
   */
  // This events test is commented out because it is too unstable. The test fails because
  //  LinkedEvents API is sometimes too slow
  test('Embedded search view shows event units', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    // Navigate to the embedded search page with event query parameter.
    await page.goto(`/fi/embed/search?events=yso:p4354`);

    // Assert that the loading indicator is no longer present.
    await expect(embeddedView.loadingIndicator).toHaveCount(0);

    // Wait for the first unit marker to be visible, confirming that event units are rendered.
    await embeddedView.unitMarkers.first().waitFor({ state: 'visible' });
  });

  /**
   * This test verifies that the embedded service view loads service units correctly.
   * It navigates to an embed URL for a specific service (ID: 813) and asserts that:
   *  - The loading indicator is absent.
   *  - At least one service unit marker is visible on the map.
   */
  test('Embedded service view shows service units', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    await page.goto(`/fi/embed/service/813`);

    // Check that data has finished loading.
    await expect(embeddedView.loadingIndicator).toHaveCount(0);
    // Ensure that a service unit marker appears on the map.
    await embeddedView.unitMarkers.first().waitFor({ state: 'visible' });
  });

  /**
   * This test verifies that the embedded address view displays nearby service units correctly.
   * It first navigates to an address embed URL and confirms that:
   *  - The loading indicator disappears.
   *  - At least one service unit marker is visible on the map.
   * Then it navigates to another URL variant that requests no units, verifying that:
   *  - The loading indicator still disappears.
   *  - No unit markers are rendered on the map.
   */
  test('Embedded address view shows nearby service units correctly', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    // Navigate to the address view with service units rendered.
    await page.goto(`/fi/embed/address/helsinki/Eläintarhantie 3/`);

    // Ensure data has loaded by checking the absence of the loading indicator.
    await expect(embeddedView.loadingIndicator).toHaveCount(0);
    // Wait for at least one service unit marker to be visible on the map.
    await embeddedView.unitMarkers.first().waitFor({ state: 'visible' });

    // Navigate to a variant that should remove service unit markers.
    await page.goto(`/fi/embed/address/helsinki/Eläintarhantie 3/?units=none`);
    // Confirm that data is loaded.
    await expect(embeddedView.loadingIndicator).toHaveCount(0);
    // Verify that no service unit markers are present as expected.
    await expect(embeddedView.unitMarkers).toHaveCount(0);
  });

  /**
   * This test verifies that the embedded area view for service area units loads correctly.
   * It navigates to an embed URL with the "health_station_district" selection and specific
   *  coordinates.
   * The test asserts that:
   *  - The loading indicator disappears (i.e., data has been loaded).
   *  - At least one unit marker is visible on the map.
   */
  test('Embedded area view shows service area units correctly', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    await page.goto(`/fi/embed/area?selected=health_station_district&lat=60.2049198&lng=24.8995213`);

    // Ensure that the loading indicator is not present, indicating data has loaded.
    await expect(embeddedView.loadingIndicator).toHaveCount(0);

    // Verify that at least one unit marker is visible.
    await embeddedView.unitMarkers.first().waitFor({ state: 'visible' });
  });

  /**
   * This test verifies that the embedded area view renders geographical area service units
   *  correctly.
   * It navigates to an embed URL with the "neighborhood" selection, specific district
   *  filters, and services.
   * The assertions confirm that:
   *  - The loading indicator has disappeared.
   *  - At least one geographical service unit marker is visible on the map.
   */
  test('Embedded area view shows geographical area service units correctly', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    await page.goto(`/fi/embed/area?selected=neighborhood&districts=ocd-division/country:fi/kunta:helsinki/kaupunginosa:011,ocd-division/country:fi/kunta:helsinki/kaupunginosa:014&services=239,813`);

    // Confirm that data has been loaded by ensuring no loading indicator is visible.
    await expect(embeddedView.loadingIndicator).toHaveCount(0, { timeout: 20000 });
    // Verify that at least one geographical unit marker is rendered.
    await embeddedView.unitMarkers.first().waitFor({ state: 'visible' });
  });

  /**
   * This test verifies that navigating to a division URL correctly displays both unit markers
   *  and the division area.
   * It navigates to an embed URL for a specific division within Helsinki (with all levels).
   * The test asserts that:
   *  - The loading indicator is not visible (i.e., data has loaded).
   *  - At least one unit marker is visible on the map.
   *  - The division area overlay (SVG element) is visible, confirming that the geographical
   *  boundary is rendered.
   */
  test('Division url shows units and area correctly', async ({ page }) => {
    const embeddedView = new EmbeddedView(page);
    await page.goto(`/fi/embed/division/kunta:helsinki/kaupunginosa:029?level=all`);

    // Ensure that the loading indicator is not present.
    await expect(embeddedView.loadingIndicator).toHaveCount(0);
    // Verify that at least one unit marker is visible.
    await embeddedView.unitMarkers.first().waitFor({ state: 'visible' });
    // Assert that the division area (represented by the SVG element) is visible.
    await expect(embeddedView.districtOverlay).toBeVisible();
  });
});
