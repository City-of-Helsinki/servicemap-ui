import { test, expect } from '@playwright/test';
import { acceptCookieConcent, getLocation } from '../utils';
import { AreaPage } from '../utils/pageObjects';

test.describe('Area view test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/area`);
    await acceptCookieConcent(page);
  });

  test.skip('District lists are fetched and rendered correctly', async ({ page }) => {
    const areaPage = new AreaPage(page);

    await expect(areaPage.accordions).toHaveCount(3, 'Expect 3 accordions to exist for each section in AreaView');
    await areaPage.accordions.nth(0).click();

    const buttonCount = await areaPage.drawerButtons.count();
    expect(buttonCount).toBeGreaterThan(0, 'No district buttons rendered');

    for (let i = 0; i < buttonCount; i++) {
      await areaPage.drawerButtons.nth(i).click();
      await expect(areaPage.districtList).toBeVisible();
      await expect(areaPage.districtList.locator('*')).toHaveCount(expect.toBeGreaterThan(0));
      await areaPage.drawerButtons.nth(i).click();
    }
  });

  /**
   * This test verifies that the district selection in the AreaView is updated correctly.
   * It simulates a user filtering district units by:
   *  - Clicking the first accordion to open the service tab area.
   *  - Clicking the first drawer button within the service tab component.
   *  - Toggling the district filter radio button.
   *
   * After these interactions, the test asserts that:
   *  - The district data title displays a count greater than zero and is formatted as expected.
   *  - Changing the district selection (by clicking a different radio button) causes the first 
   * division item name to change,
   *    indicating that the unit list has been updated.
   */
  test('District selection is updated', async ({ page }) => {
    const areaPage = new AreaPage(page);

    await areaPage.accordions.nth(0).click();
    await areaPage.drawerButtons.nth(0).click();
    await areaPage.radioButtons.nth(0).locator('input').click();

    const districtText = await areaPage.districtDataTitle.textContent();
    const districtCount = parseInt(districtText.match(/\d+/)[0], 10);

    expect(districtCount).toBeGreaterThan(0, 'Data not set correctly to Districts component');
    expect(districtText).toBe(`Toimipisteet listana (${districtCount})`);

    const firstName = await areaPage.unitList.locator('[data-sm="DivisionItemName"]').first().textContent();

    await areaPage.radioButtons.nth(1).locator('input').click();
    const newFirstName = await areaPage.unitList.locator('[data-sm="DivisionItemName"]').first().textContent();
    expect(newFirstName).not.toBe(firstName);
  });

  /**
   * This test verifies that the unit list in the AreaView functions correctly.
   * The test simulates a user selecting a district by:
   *  - Clicking the first accordion to open the service tab area.
   *  - Clicking a drawer button within the service tab component.
   *  - Toggling a radio button to filter district units.
   *
   * After applying these selections, the test asserts that:
   *  - The unit list renders at least one unit.
   *  - Clicking the first unit in the list navigates to a unit detail page,
   *    as confirmed by a URL that contains the unit path.
   */
  test('Unit list functions correctly', async ({ page }) => {
    const areaPage = new AreaPage(page);

    await areaPage.accordions.nth(0).click();
    await areaPage.drawerButtons.nth(0).click();
    await areaPage.radioButtons.nth(0).locator('input').click();

    await expect(areaPage.unitList.locator('*')).not.toHaveCount(0);
    await areaPage.unitList.locator('div').first().click();

    const location = await getLocation(page);
    expect(location).toContain(`/fi/unit`);
  });

  /**
   * This test verifies that the address search bar in the Area view correctly updates its value
   * based on user input and returns valid search suggestions. It performs the following actions:
   * 1. Types a partial search term ('mann') into the address search bar.
   * 2. Waits for the suggestions list to appear and confirms that at least one suggestion is
   * visible.
   * 3. Retrieves the text content of the first suggestion.
   * 4. Uses keyboard navigation (ArrowDown and Enter) to select the suggestion.
   * 5. Verifies that the search bar's value updates to match the selected suggestion.
   */
  test('Address search bar field updates and gets results', async ({ page }) => {
    const areaPage = new AreaPage(page);
    const inputText = 'mann';

    await areaPage.addressSearchBar.type(inputText);
    await expect(areaPage.addressSuggestions).not.toHaveCount(0);

    const suggestion = areaPage.addressSuggestions.first();
    const suggestionText = await suggestion.textContent();

    await page.keyboard.press('ArrowDown');
    await expect(areaPage.selectedAddressSuggestion).toBeVisible();
    await page.keyboard.press('Enter');

    await expect(areaPage.addressSearchBar).toHaveValue(suggestionText);
  });

  /**
   * This test verifies that the embedder tool does not cause the AreaView to crash.
   * It simulates a user interacting with the embedder tool by:
   *  - Clicking the map tools button to open tool options.
   *  - Opening the embedder tool.
   *  - Closing the embedder tool.
   *
   * The test then confirms that:
   *  - The AreaView remains visible.
   *  - The map tools button is still accessible.
   *  - The expected number of accordion components (3) is present in the view.
   */
  test('Embeder tool does not crash area view', async ({ page }) => {
    const areaPage = new AreaPage(page);

    await areaPage.mapToolsButton.click();
    await areaPage.embedderToolButton.click();
    await areaPage.embedderToolCloseButton.click();

    await expect(areaPage.areaView).toBeVisible();
    await expect(areaPage.mapToolsButton).toBeVisible();
    await expect(areaPage.accordions).toHaveCount(3);
  });

  // TODO turn of the year
  test.skip('Statistical areas accordions open correctly', async ({ page }) => {
    const areaPage = new AreaPage(page);
    const totalAccordion = await areaPage.openStatisticalTotals();

    const serviceAccordion = totalAccordion.locator('[data-sm="AccordionComponent"]').first();
    const helsinkiAccordion = areaPage.statisticalCityList.locator('[data-sm="AccordionComponent"]').first();

    await expect(areaPage.statisticalCityList.locator('[data-sm="AccordionComponent"]'))
      .toHaveCount(expect.toBeGreaterThan(0));

    await expect(serviceAccordion.locator('button')).toBeDisabled();

    await helsinkiAccordion.locator('input[type="checkbox"]').first().click();
    await expect(serviceAccordion.locator('button')).toBeEnabled();
    await serviceAccordion.click();

    const serviceListAccordions = serviceAccordion.locator('[data-sm="AccordionComponent"]');
    await expect(serviceListAccordions).toHaveCount(expect.toBeGreaterThan(0), { timeout: 8000 });

    await serviceListAccordions.first().locator('input[type="checkbox"]').click();
    await serviceListAccordions.first().locator('button').click();

    await expect(serviceListAccordions.first().locator('[data-sm="ResultItemComponent"]'))
      .toHaveCount(expect.toBeGreaterThan(0));
  });

  // TODO turn of the year
  test.skip('Statistical area district selection works correctly', async ({ page }) => {
    const areaPage = new AreaPage(page);
    const totalAccordion = await areaPage.openStatisticalTotals();

    const serviceButton = totalAccordion.locator('[data-sm="AccordionComponent"]').first().locator('button');
    const firstCity = areaPage.statisticalCityList.locator('[data-sm="AccordionComponent"]').first();
    const firstCityCheckbox = firstCity.locator('input[type="checkbox"]').first();
    const firstCityAreaCheckbox = firstCity.locator('div').nth(1).locator('.MuiCollapse-root input[type="checkbox"]').first();

    await firstCity.click();
    await firstCityAreaCheckbox.click();
    await expect(serviceButton).toBeEnabled();

    // Test indeterminate functionality
    expect(await firstCityCheckbox.getAttribute('data-indeterminate')).toBe('true');
    await firstCityCheckbox.click();
    expect(await firstCityCheckbox.getAttribute('data-indeterminate')).toBe('false');
    await firstCityCheckbox.click(); // Remove selection
    await expect(serviceButton).toBeDisabled();

    // Test keyboard functionality
    await firstCityCheckbox.focus();
    await expect(firstCityCheckbox).toBeFocused();
    await page.keyboard.press('Tab'); // Go to city button
    await page.keyboard.press('Tab'); // Go to first district checkbox
    await expect(firstCityCheckbox).not.toBeFocused();
    await expect(firstCityAreaCheckbox).toBeFocused();
    expect(await firstCityCheckbox.getAttribute('data-indeterminate')).toBe('false');

    await page.keyboard.press('Space'); // Select first district
    await expect(serviceButton).toBeEnabled();
    expect(await firstCityCheckbox.getAttribute('data-indeterminate')).toBe('true');

    await page.keyboard.press('Shift+Tab'); // Return to city button
    await page.keyboard.press('Shift+Tab'); // Return to city checkbox
    await expect(firstCityCheckbox).toBeFocused();
    await page.keyboard.press('Space'); // Select city
    await page.keyboard.press('Space'); // Remove selection
    await expect(serviceButton).toBeDisabled();
  });
});
