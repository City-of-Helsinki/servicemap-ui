import { test, expect } from '@playwright/test';
import { acceptCookieConcent, getBaseUrl, getLocation } from '../utils';
import { AddressPage } from '../utils/pageObjects';

const testLocation = `${getBaseUrl()}/fi/address/helsinki/Topeliuksenkatu 27`;

test.describe('AddressView tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testLocation);
    await acceptCookieConcent(page);
  });

  /**
     * This test verifies that the AddressView renders the correct address details and displays
     * the appropriate tabs.
     * It checks that the address information contains the expected street, city, postal code,
     * and district.
     * It also validates that:
     *  - The first tab is labelled "Palvelualueet".
     *  - The second tab's label starts with "Lähellä".
     *  - There are multiple division items available.
     *  - When the second tab is clicked, the nearby units load correctly (i.e. no loading or
     * no-data messages are visible)
     *    and at least one unit item is displayed.
     */
  test('AddressView does render correct view', async ({ page }) => {
    const addressPage = new AddressPage(page);

    const addressText = await addressPage.addressInfo.textContent();
    expect(addressText).toContain('Topeliuksenkatu 27');
    expect(addressText).toContain('Helsinki');
    expect(addressText).toContain('00250');
    expect(addressText).toContain('Taka-Töölö');

    const tab1 = await addressPage.tabList.nth(0).textContent();
    const tab2 = await addressPage.tabList.nth(1).textContent();
    expect(tab1).toBe('Palvelualueet');
    expect(tab2.indexOf('Lähellä')).toBe(0, 'Tab text should include text "Lähellä"');

    const divisionsCount = await addressPage.divisions.count();
    expect(divisionsCount).toBeGreaterThan(1, 'First tab should show divisions');

    await addressPage.tabList.nth(1).click();
    await expect(addressPage.loadingMessage).not.toBeVisible();
    await expect(addressPage.noDataMessage).not.toBeVisible();

    await expect(addressPage.unitItems).not.toHaveCount(0);
  });

  /**
     * This test verifies that the map in the AddressView renders correctly under
     * different conditions.
     * It simulates user interactions by performing the following steps:
     *  - Zooming out of the map twice to adjust the view.
     *  - Checking that a sufficient number of unit markers or cluster markers are visible.
     *  - Switching to the "close-by" tab and verifying again that markers are displayed.
     */
  test('AddressView map renders correctly', async ({ page }) => {
    const addressPage = new AddressPage(page);

    // Zoom out twice
    await addressPage.zoomOutButton.click();
    await page.waitForTimeout(500);
    await addressPage.zoomOutButton.click();
    await page.waitForTimeout(500);

    // Check markers on default administrative district tab
    let markerCount = await addressPage.unitMarkers.count();
    expect(markerCount).toBeGreaterThan(1);

    // Switch to nearby tab and check markers
    await addressPage.tabList.nth(1).click();
    await page.waitForTimeout(500);
    markerCount = await addressPage.unitMarkers.count();
    expect(markerCount).toBeGreaterThan(1);
  });

  /**
     * This test verifies that the area view link in the AddressView navigates correctly
     * to the AreaView.
     * It simulates a user clicking the area view link and confirms that:
     *  - The URL changes to include '/fi/area', indicating navigation to the AreaView.
     *  - The address marker is visible on the AreaView, confirming that the correct address
     *  is displayed.
     */
  test("AddressView's area view link does take correct address to AreaView", async ({ page }) => {
    const addressPage = new AddressPage(page);

    await addressPage.areaViewLink.click();
    expect(await getLocation(page)).toContain('/fi/area');
    await expect(addressPage.addressMarker).toBeVisible();
  });

  /**
     * This test verifies that the service buttons in the AddressView work correctly.
     * For each service button, the test:
     *  - Clicks the button to load the corresponding unit details.
     *  - Waits for the unit title element to appear.
     *  - Verifies that the displayed unit title matches the expected title (captured from
     *  a button).
     *  - Uses the "Palaa takaisin" button to navigate back to the service list before testing
     *  the next button.
     */
  test('AddressView buttons work correctly', async ({ page }) => {
    const addressPage = new AddressPage(page);

    const buttonCount = await addressPage.serviceButtons.count();
    expect(buttonCount).toBeGreaterThan(0, 'Service buttons should exist for AddressView');

    const buttonTitleText = await addressPage.serviceButtons
      .nth(1)
      .locator('p[aria-hidden="true"]')
      .textContent();

    await addressPage.serviceButtons.nth(1).click();
    await expect(addressPage.unitTitle).toHaveText(buttonTitleText);
    await addressPage.backToAddressButton.click();
  });

  /**
     * This test verifies that the health station links in the AddressView work correctly.
     * It simulates clicking on various health station links and checks that:
     * 1. The first link navigates to the correct unit page (Uusi lastensairaala) by
     *  verifying the URL
     *    contains '/fi/unit/62976' and the unit title contains 'Uusi lastensairaala'.
     * 2. The second link navigates to the expected external URL on the Hus website.
     * 3. The third link navigates to the expected external URL for emergency care.
     * After each navigation, the test returns to a preset test location.
     */
  test('AddressView health station links work correctly', async ({ page }) => {
    const addressPage = new AddressPage(page);

    const { links } = addressPage;
    const { unitTitle } = addressPage;

    // Click the first health station link.
    await links.nth(0).click();
    expect(await getLocation(page)).toContain('/fi/unit/62976');
    await expect(unitTitle).toContainText('Uusi lastensairaala');
    await page.goto(testLocation);

    // Click the second health station link.
    await links.nth(1).click();
    expect(await getLocation(page)).toEqual('https://www.hus.fi/potilaalle/sairaalat-ja-toimipisteet/uusi-lastensairaala');
    await page.goto(testLocation);

    // TODO - Fix data -> empty link
    // The following commented-out block is intended for a link that needs to be fixed:
    // await links.nth(2).click();
    // expect(await getLocation(page)).toContain('/fi/unit/26104');
    // expect(await unitTitle.textContent()).toContain('Haarmanin sairaala');
    // await page.goto(testLocation);

    // Click the third health station link.
    await links.nth(2).click();
    expect(await getLocation(page)).toEqual('https://www.hel.fi/fi/sosiaali-ja-terveyspalvelut/terveydenhoito/kiireellinen-hoito-ja-paivystys');
  });

  /**
     * This test verifies that the "Nearby Services" tab in the AddressView works correctly.
     * It simulates a user clicking the tab, selecting a service item, and verifying that the
     * corresponding unit detail is displayed. It also tests the pagination by confirming that
     * clicking the next page button updates the URL and loads new results.
     */
  test('Nearby services tab works correctly', async ({ page }) => {
    const addressPage = new AddressPage(page);

    await addressPage.nearbyUnitsTab.click();

    // Test clicking a list item
    const clickedItemText = await addressPage.getListItemTopRowText(5);
    await addressPage.listItems.nth(5).click();
    await expect(addressPage.unitTitle).toHaveText(clickedItemText);
    await addressPage.backToAddressButton.click();

    // Test pagination
    const firstUnitText = await addressPage.getListItemTopRowText(0);
    await addressPage.paginationNextButton.click();

    const url = await getLocation(page);
    expect(url).toContain('p=2');

    const newFirstUnitText = await addressPage.getListItemTopRowText(0);
    expect(newFirstUnitText).not.toBe(firstUnitText);
  });
});
