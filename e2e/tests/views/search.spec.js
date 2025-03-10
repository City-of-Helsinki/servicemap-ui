import { test, expect } from '@playwright/test';
import { acceptCookieConcent, getBaseUrl, getLocation } from '../utils';
import { SearchPage } from '../utils/pageObjects';
import paginationTest from '../utils/paginationTest';
import resultOrdererTest from '../utils/resultOrdererTest';

// Common URLs
const searchPageUrl = `${getBaseUrl()}/fi/search?q=kirjasto`;
const bathUrl = `${getBaseUrl()}/fi/search?q=maauimala`;
const embedBathUrl = `${getBaseUrl()}/fi/embed/search?q=maauimala&search_language=fi&show_list=side`;
const homePage = `${getBaseUrl()}/fi`;

/**
 * Search view tests
 */
test.describe('Search view test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(searchPageUrl);
    await acceptCookieConcent(page);
  });

  /**
   * Test: Result orderer test
   *
   * This test verifies the functionality of the result orderer.
   */
  test('Result orderer test', async ({ page }) => {
    await resultOrdererTest(page);
  });

  /**
   * This test verifies the pagination functionality on the search page.
   * It ensures that when navigating through search results, the pagination
   * behavior works as expected. The test leverages the helper function
   * "paginationTest" to perform detailed assertions regarding pagination.
   */
  test('Pagination test', async ({ page }) => {
    await paginationTest(page, searchPageUrl);
  });

  /**
   * This test validates that sorting the search results works correctly.
   * Steps:
   * 1. Initiate a search with the query 'kirjasto' to load the search results.
   * 2. Capture the text content of the first item before sorting.
   * 3. Type 't' in the search bar to trigger dynamic behavior.
   * 4. Click the sorting select input and simulate keyboard navigation to select a sort option.
   * 5. Verify that after sorting, the first item in the result list has changed.
   *
   * This ensures that the sort functionality adjusts the order of results based
   *  on the chosen criteria.
   */
  test('Search view should sort results', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Test result orderer navigation
    await searchPage.searchUnits('kirjasto');
    const firstItemText = await searchPage.listItems.first().textContent();

    await searchPage.searchInput.type('t');
    await searchPage.resultSorter.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const newFirstItemText = await searchPage.listItems.first().textContent();
    expect(newFirstItemText).not.toBe(firstItemText);
  });

  /**
   * This test validates keyboard navigation in the search view.
   *
   * The test performs a search for "kirjasto" to load search results and then simulates
   * typing in the search bar. It navigates through various UI elements with successive Tab
   * key presses and verifies that focus moves correctly to the expected result list items.
   *
   * Steps:
   * 1. Execute a search query 'kirjasto' to load search results.
   * 2. Type 't' into the search bar to trigger any dynamic behavior.
   * 3. Simulate a series of Tab presses to traverse the UI (cancel button, search icon,
   *    address search, settings, etc.).
   * 4. Verify focus moves to the first and then to the second list item.
   * 5. Use Shift+Tab to navigate backwards and confirm that focus returns to the first list item.
   */
  test('Tab navigation works correctly', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Skipping tests on Firefox due to known issues');
    const searchPage = new SearchPage(page);

    // Test result orderer navigation
    await searchPage.searchUnits('kirjasto');

    await searchPage.searchInput.type('t');

    // Tab through all the elements in order
    await page.keyboard.press('Tab'); // Tabs to cancel button
    await expect(searchPage.cancelButton).toBeFocused();

    await page.keyboard.press('Tab'); // Tabs to search icon button
    await expect(searchPage.searchIconButton).toBeFocused();

    await page.keyboard.press('Tab'); // Address search
    await expect(searchPage.addressInput).toBeFocused();

    await page.keyboard.press('Tab'); // Address search clear
    await expect(searchPage.addressSearchClear).toBeFocused();

    await page.keyboard.press('Tab'); // hide settings
    await expect(searchPage.hideSettings).toBeFocused();

    await page.keyboard.press('Tab'); // sense settings
    await expect(searchPage.senseSettings).toBeFocused();

    await page.keyboard.press('Tab'); // mobility settings
    await expect(searchPage.mobilitySettings).toBeFocused();

    await page.keyboard.press('Tab'); // city settings
    await expect(searchPage.citySettings).toBeFocused();

    await page.keyboard.press('Tab'); // organization settings
    await expect(searchPage.organizationSettings).toBeFocused();

    await page.keyboard.press('Tab'); // Reset settings button
    await expect(searchPage.resetSettings).toBeFocused();

    await page.keyboard.press('Tab'); // Result orderer
    await expect(searchPage.resultSorter).toBeFocused();

    await page.keyboard.press('Tab'); // First tab
    await expect(searchPage.tabs.first()).toBeFocused();

    // Note: Removed phantom tab press as noted in TODO

    await page.keyboard.press('Tab'); // Tabs to first item in list
    await expect(searchPage.listItems.first()).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(searchPage.listItems.nth(1)).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(searchPage.listItems.first()).toBeFocused();
  });

  /**
   * This test verifies that keyboard-based tab navigation works correctly in the search view.
   *
   * Steps performed:
   * 1. Execute a search for 'kirjasto' to display the results.
   * 2. Locate the tab elements and the two result lists: services and units.
   * 3. Click the second tab and assert that multiple service items are listed.
   * 4. Click back to the first tab and assert that unit items are listed.
   * 5. Use the Right Arrow key to move focus to the second tab.
   * 6. Press Enter followed by Tab to move focus inside the service items list.
   * 7. Use Shift+Tab to move focus back to the tab area.
   * 8. Use the Left Arrow key to shift focus back to the first tab.
   * 9. Press Enter and Tab to move focus into the unit items list.
   * 10. Finally, use Shift+Tab to move focus back to the first tab.
   */
  test('Tab and arrow navigation works correctly', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Skipping tests on Firefox due to known issues');

    const searchPage = new SearchPage(page);

    // Test tabs navigation
    await searchPage.searchUnits('kirjasto');

    // Check that clicks work correctly
    await searchPage.tabs.nth(1).click();
    await expect(searchPage.services).not.toHaveCount(0);

    await searchPage.tabs.nth(0).click();
    await expect(searchPage.units).not.toHaveCount(0);

    // Check keyboard navigation
    // Check right tab (services tab)
    await page.keyboard.press('ArrowRight');
    await expect(searchPage.tabs.nth(1)).toBeFocused();

    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(searchPage.services).not.toHaveCount(0);
    await expect(searchPage.services.first()).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(searchPage.tabs.nth(1)).toBeFocused();

    // Check left tab (units tab)
    await page.keyboard.press('ArrowLeft');
    await expect(searchPage.tabs.nth(0)).toBeFocused();

    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(searchPage.units).not.toHaveCount(0);
    await expect(searchPage.units.first()).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(searchPage.tabs.nth(0)).toBeFocused();
  });

  /**
   * Test: Search does list results
   *
   * This test verifies that a search returns a non-empty list of results.
   * It locates the result list container (identified by the 'data-sm' attribute)
   * and asserts that there is at least one list item present.
   */
  test('Search does list results', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await expect(searchPage.resultList).not.toHaveCount(0);
  });

  /**
   * This test validates the address search functionality on the search page.
   *
   * Steps:
   * 1. Execute a search with the query 'kirjasto' to display search results.
   * 2. Fill the address search input with 'mannerheimintie'.
   * 3. Wait for the address suggestion list to appear.
   * 4. Verify that the suggestion list contains at least one option.
   * 5. Simulate pressing the 'Enter' key to select an address suggestion.
   * 6. Assert that exactly one marker appears on the map.
   * 7. Confirm that the distance text (e.g., indicating proximity) is present and non-empty.
   */
  test('Address search does work', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Perform initial search to load results
    await searchPage.searchUnits('kirjasto');

    // Enter address and check suggestions
    await searchPage.addressInput.fill('mannerheimintie');
    await expect(searchPage.addressSuggestions).not.toHaveCount(0);

    // Select first suggestion
    await page.keyboard.press('Enter');

    // Verify marker and distance information
    await expect(searchPage.marker).toHaveCount(1);
    await expect(searchPage.distanceText).not.toHaveCount(0);
    await expect(searchPage.distanceText.first()).toHaveText(/m$/);
  });

  /**
   * This test validates that clicking on a unit item in the search results navigates
   * the user to the corresponding unit page. It does so by:
   * 1. Locating the list of unit items in the "Toimipisteet" (units) results.
   * 2. Extracting the text content (name) from the first unit item.
   * 3. Clicking on the first unit item.
   * 4. Verifying that the unit page displays a title identical to the clicked unit item's name.
   */
  test('UnitItem click event takes to unit page', async ({ page }) => {
    const searchPage = new SearchPage(page);

    const unit = searchPage.units.first();

    // Extract the text content of the first unit item's textbox, which represents the unit's name.
    const name = await unit.locator('p[role="textbox"]').textContent();

    // Click the first unit item to navigate to the unit page.
    await unit.click();

    // Verify that the unit page title matches the name extracted from the clicked unit item.
    await expect(searchPage.title).toHaveText(name);
  });

  /**
   * This test verifies that the service item click event correctly navigates
   * the user to the service details page. It ensures that the service title
   * displayed on the service page matches the title from the service list.
   *
   * Steps:
   * 1. Execute a search with the query "kirjasto" to load service items.
   * 2. Locate the tab elements and the list of service items.
   * 3. Click on the second tab to switch to the service view.
   * 4. Retrieve the text content of the first service item in the list.
   * 5. Simulate a click on that service item.
   * 6. Verify that the title shown on the resulting service page matches
   *    the service item’s title (comparison is case-insensitive).
   */
  test('ServiceItem click event takes to service page', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Search for services and switch to services tab
    await searchPage.searchUnits('kirjasto');
    await searchPage.tabs.nth(1).click();

    // Get the first service name and click it
    const serviceName = await searchPage.services.first().textContent();
    await searchPage.services.first().click();

    // Verify service page title matches clicked service name
    const serviceTitle = await searchPage.title.textContent();
    expect(serviceTitle.toLowerCase()).toBe(serviceName.toLowerCase());
  });

  /**
   * This test verifies the accessibility configuration of the SearchBar component.
   * It checks that:
   *  - The search bar has the correct role ("combobox") and no placeholder.
   *  - When activated, the search bar loads suggestion items.
   *  - Each suggestion item has an appropriate accessibility role ("option").
   */
  test('SearchBar accessibility is OK', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Check searchbar input accessibility attributes
    const role = await searchPage.searchInput.getAttribute('role');
    const placeholder = await searchPage.searchInput.getAttribute('placeholder');

    // Verify input attributes
    expect(role).toBe('combobox', 'SearchBar input should have combobox role');
    expect(placeholder).toBeNull();

    // Check search suggestion accessibility
    await searchPage.searchInput.click();

    const suggestions = page.locator('#SuggestionList li');
    await expect(suggestions).not.toHaveCount(0);

    const suggestionRole = await suggestions.first().getAttribute('role');
    expect(suggestionRole).toBe('option');
  });

  /**
   * This test verifies the accessibility attributes of a result list item in the search view.
   * It checks for:
   *  - Correct role and tabindex on the list item.
   *  - The image within the list item is hidden from assistive technologies.
   *  - The first paragraph (screen reader only text) has the proper class and contains
   *  non-empty text.
   *  - The second paragraph (result title) has the appropriate class and is hidden via aria-hidden.
   */
  test('ResultList accessibility attributes are OK', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Check UnitItem role and tabindex
    const resultRole = await searchPage.resultItem.getAttribute('role');
    expect(resultRole).toBe('link', 'UnitItem should have role=link');

    const resultTabindex = await searchPage.resultItem.getAttribute('tabindex');
    expect(resultTabindex).toBe('0', 'UnitItem should have tabindex=0');

    // Check image accessibility
    const resultImageAria = await searchPage.resultItemImage.getAttribute('aria-hidden');
    expect(resultImageAria).toBe('true', 'UnitItem image icon should be aria-hidden');

    // Check screen reader text
    const hasClass = await searchPage.resultItemSRText.evaluate((el) => el.classList.contains('ResultItem-srOnly'));
    expect(hasClass).toBe(true, 'Expected UnitItem srOnly text to have class ResultItem-srOnly');

    const srText = await searchPage.resultItemSRText.innerText();
    expect(srText.length).toBeGreaterThan(0);

    // Check title accessibility
    const hasTitleClass = await searchPage.resultItemTitle.evaluate((el) => el.classList.contains('ResultItem-title'));
    expect(hasTitleClass).toBe(true, 'Expected distance text to have class ResultItem-title');

    const titleAriaHidden = await searchPage.resultItemTitle.getAttribute('aria-hidden');
    expect(titleAriaHidden).toBe('true', 'Title should be hidden from screen readers');

    /**
 * TODO: Figure out a way to test ResultItem in isolation in order to guarantee
 * values for subtitle and distance texts. Otherwise these nodes don't exist in DOM

  const resultSubtitle = await result.findReact('p').nth(2); // .getAttribute('aria-hidden');
  await t
    .expect(resultSubtitle.hasClass('ResultItem-subtitle')).ok('Expected subtitle text to
     have class ResultItem-distance')
    .expect(resultSubtitle.getAttribute('aria-hidden')).eql('true');

  const resultDistance = await result.findReact('p').nth(3); // .getAttribute('aria-hidden');
  console.log(await resultDistance.classNames);
  await t
    .expect(resultDistance.hasClass('ResultItem-distance')).ok('Expected distance text to have
     class ResultItem-distance')
    .expect(resultDistance.getAttribute('aria-hidden')).eql('true');

*/
  });

  /**
   * This test checks that each tab within the tablist has a valid, non-empty aria-label.
   * Ensuring that tabs have proper aria-labels helps assistive technologies to communicate
   * the purpose or content of each tab to users, thereby improving accessibility.
   */
  test('Tabs accessibility attributes are OK', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Check aria-label for first tab
    await expect(searchPage.tabs.nth(0)).toHaveAttribute('aria-label', /.+/);

    // Check aria-label for second tab
    await expect(searchPage.tabs.nth(1)).toHaveAttribute('aria-label', /.+/);
  });

  /**
   * This test verifies that keyboard navigation using the Arrow Up and Arrow Down keys in
   * the search suggestion list correctly loops the focus. It simulates the navigation by:
   * 1. Opening the search bar (via searchBarInput).
   * 2. Waiting for the suggestion list to load.
   * 3. Pressing ArrowDown to highlight the first suggestion, and checking that its box-shadow
   *    contains the expected color.
   * 4. Pressing ArrowUp to loop focus to the last suggestion, again verifying the style.
   * 5. Pressing ArrowDown to loop back to the first suggestion.
   */
  test('Search suggestion arrow navigation does loop correctly', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const expectedBoxShadowColor = 'rgb(71, 131, 235)';

    await searchPage.searchUnits('kirjasto');

    const items = searchPage.suggestionsOptions;
    await expect(items).not.toHaveCount(0);

    await page.keyboard.press('ArrowDown');

    let style = await items.nth(0).evaluate((el) => getComputedStyle(el).boxShadow);
    expect(style).toContain(expectedBoxShadowColor);

    await page.keyboard.press('ArrowUp');

    const itemCount = await items.count();

    style = await items.nth(itemCount - 1).evaluate((el) => getComputedStyle(el).boxShadow);
    expect(style).toContain(expectedBoxShadowColor);

    await page.keyboard.press('ArrowDown');

    style = await items.nth(0).evaluate((el) => getComputedStyle(el).boxShadow);
    expect(style).toContain(expectedBoxShadowColor);
  });

  /**
   * This test validates the behavior when a user interacts with the search suggestions.
   * It performs the following steps:
   * 1. Verifies that the current URL indicates the search page.
   * 2. Clicks the search input field, selects all existing text (using Meta+A on macOS)
   *  and clears it.
   * 3. Fills the search input with the query 'Tekijänoikeuden erikoiskirjasto'.
   * 4. Waits for the suggestion list to appear in the DOM and confirms there is exactly
   *  one suggestion.
   * 5. Retrieves the text content of the first suggestion, clicks it, and then verifies
   *  that the title
   *    container displays text matching the clicked suggestion.
   */
  test('Search suggestion click works correctly', async ({ page }) => {
    const searchPage = new SearchPage(page);
    expect(await getLocation(page)).toContain(`${getBaseUrl()}/fi/search`);

    const { searchInput } = searchPage;
    await searchInput.click();

    // On macOS, use Meta+A to select all text, then Delete to clear the input.
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Delete');

    await searchInput.fill('Tekijänoikeuden erikoiskirjasto');

    const suggestions = searchPage.suggestionsOptions;
    await expect(suggestions).toHaveCount(1);

    const clickedItem = suggestions.first();
    const textContent = await clickedItem.textContent();
    await clickedItem.click();

    await expect(searchPage.title).toHaveText(textContent);
  });
});

/**
 * Tests for custom URL with city/org parameter
 */
test.describe('Search view custom url with city and org param test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homePage);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies that municipality settings are correctly applied through URL parameters.
   *
   * Steps:
   *  - Pre-populate localStorage with the 'espoo' municipality setting.
   *  - Load the default search page (bathUrl) and verify that:
   *       * The city chip displays 'Espoo'.
   *       * Only the expected unit marker for Espoo (leppavaaraBath) is visible,
   *         and the unit marker for Helsinki (kumpulaBath) is hidden.
   *  - Navigate to the URL with the city parameter set to 'helsinki' and verify that:
   *       * The city chip displays 'Helsinki'.
   *       * The Helsinki marker (kumpulaBath) becomes visible,
   *         while the Espoo marker (leppavaaraBath) is hidden.
   *  - Finally, switch back to the 'espoo' setting in the URL and confirm the original state.
   */
  test('Should override municipality settings by url', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Set initial city preference
    await searchPage.setLocalStorage('SM:espoo', 'true');

    // Check default view (Espoo)
    await page.goto(bathUrl);
    await expect(searchPage.cityChips).toHaveCount(1);
    await expect(searchPage.cityChips).toHaveText('Espoo');
    await expect(searchPage.leppavaaraBath).toBeVisible('Should find bath in Espoo');
    await expect(searchPage.kumpulaBath).not.toBeVisible('Should hide baths of Helsinki');

    // Check Helsinki view
    await page.goto(`${bathUrl}&city=helsinki`);
    await expect(searchPage.cityChips).toHaveCount(1);
    await expect(searchPage.cityChips).toHaveText('Helsinki');
    await expect(searchPage.kumpulaBath).toBeVisible('Should find bath in Helsinki');
    await expect(searchPage.leppavaaraBath).not.toBeVisible('Should hide baths of Espoo');

    // Check back to Espoo view
    await page.goto(`${bathUrl}&city=espoo`);
    await expect(searchPage.cityChips).toHaveCount(1);
    await expect(searchPage.cityChips).toHaveText('Espoo');
    await expect(searchPage.leppavaaraBath).toBeVisible('Should find bath in Espoo');
    await expect(searchPage.kumpulaBath).not.toBeVisible('Should hide baths of Helsinki');
  });

  /**
   * This test verifies that city settings maintain consistent behavior
   * between the embedded view and the normal view.
   *
   * Steps:
   *  - Pre-populate localStorage with the 'espoo' city setting.
   *  - In the embedded view, verify that both unit markers are visible initially.
   *  - Override city setting to 'espoo' in the embedded view and check that:
   *       * The marker for Kumpula is hidden.
   *       * The marker for Leppävaara remains visible.
   *  - Override city setting to 'helsinki' in the embedded view and check that:
   *       * The marker for Kumpula becomes visible.
   *       * The marker for Leppävaara is hidden.
   *  - In the normal view, verify that the markers reflect the default city setting.
   */
  test('Should not mess up city settings between embedded and normal view', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Set initial city preference
    await searchPage.setLocalStorage('SM:espoo', 'true');

    // Check embedded view with default settings
    await page.goto(embedBathUrl);
    await expect(searchPage.kumpulaBath).toBeVisible('Should find bath in Helsinki');
    await expect(searchPage.leppavaaraBath).toBeVisible('Should find bath in Espoo');

    // Check embedded view with Espoo filter
    await page.goto(`${embedBathUrl}&city=espoo`);
    await expect(searchPage.kumpulaBath).not.toBeVisible('Should not find baths in Helsinki');
    await expect(searchPage.leppavaaraBath).toBeVisible('Should find baths in Espoo');

    // Check embedded view with Helsinki filter
    await page.goto(`${embedBathUrl}&city=helsinki`);
    await expect(searchPage.kumpulaBath).toBeVisible('Should find baths in Helsinki');
    await expect(searchPage.leppavaaraBath).not.toBeVisible('Should not find baths in Espoo');

    // Check normal view maintains original settings
    await page.goto(bathUrl);
    await expect(searchPage.kumpulaBath).not.toBeVisible('Should not find bath in Helsinki');
    await expect(searchPage.leppavaaraBath).toBeVisible('Should find bath in Espoo');
  });

  /**
   * This test verifies that organization settings are correctly overridden via URL parameters.
   *
   * The test performs the following steps:
   *  - Pre-sets an organization (Espoon kaupunki) in localStorage.
   *  - Navigates to the default search page (bathUrl) and asserts that:
   *      * The organization chip displays 'Espoon kaupunki'.
   *      * Only the expected unit marker (leppavaaraBath) is visible, while the other
   *  (kumpulaBath) is hidden.
   *  - Overrides the organization setting to Helsinki via URL and verifies that:
   *      * The organization chip displays 'Helsingin kaupunki'.
   *      * The unit marker for Helsinki (kumpulaBath) becomes visible, while leppavaaraBath
   *  is hidden.
   *  - Overrides the organization setting back to Espoo via URL and asserts that:
   *      * The organization chip displays 'Espoon kaupunki'.
   *      * The unit marker for Espoo (leppavaaraBath) is visible and the Helsinki marker
   *  (kumpulaBath) is hidden.
   */
  test('Should override organization settings by url', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Set initial organization preference
    await searchPage.setLocalStorage(`SM:${searchPage.ESPOO_ORG}`, 'true');

    // Check default view (Espoo)
    await page.goto(bathUrl);
    await expect(searchPage.orgChips).toHaveCount(1);
    await expect(searchPage.orgChips).toHaveText('Espoon kaupunki');
    await expect(searchPage.leppavaaraBath).toBeVisible('Should find bath of Espoo org');
    await expect(searchPage.kumpulaBath).not.toBeVisible('Should hide baths of Helsinki org');

    // Check Helsinki view
    await page.goto(`${bathUrl}&organization=${searchPage.HELSINKI_ORG}`);
    await expect(searchPage.orgChips).toHaveCount(1);
    await expect(searchPage.orgChips).toHaveText('Helsingin kaupunki');
    await expect(searchPage.kumpulaBath).toBeVisible('Should find bath of Helsinki org');
    await expect(searchPage.leppavaaraBath).not.toBeVisible('Should hide baths of Espoo org');

    // Check back to Espoo view
    await page.goto(`${bathUrl}&organization=${searchPage.ESPOO_ORG}`);
    await expect(searchPage.orgChips).toHaveCount(1);
    await expect(searchPage.orgChips).toHaveText('Espoon kaupunki');
    await expect(searchPage.leppavaaraBath).toBeVisible('Should find bath of Espoo org');
    await expect(searchPage.kumpulaBath).not.toBeVisible('Should hide baths of Helsinki org');
  });

  /**
   * This test verifies that organization settings are properly applied in the URL
   * for both embedded and normal views without interfering with one another.
   *
   * It performs the following steps:
   *  - Pre-sets an organization in localStorage.
   *  - Loads the embedded search view and verifies that initially both unit markers are visible.
   *  - Overrides the organization setting to Espoo via URL and asserts that only the expected
   *  marker(s) are visible.
   *  - Overrides the organization setting to Helsinki via URL and asserts the inverted visibility.
   *  - Finally, navigates to the normal search view (bathUrl) to confirm that the original
   *  organization settings apply.
   */
  test('Should not mess up organization settings between embedded and normal view', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Set initial organization preference
    await searchPage.setLocalStorage(`SM:${searchPage.ESPOO_ORG}`, 'true');

    // Check embedded view with default settings
    await page.goto(embedBathUrl);
    await expect(searchPage.kumpulaBath).toBeVisible('Should find bath of Helsinki org');
    await expect(searchPage.leppavaaraBath).toBeVisible('Should find bath of Espoo org');

    // Check embedded view with Espoo organization filter
    await page.goto(`${embedBathUrl}&organization=${searchPage.ESPOO_ORG}`);
    await expect(searchPage.kumpulaBath).not.toBeVisible('Should not find baths of Helsinki org');
    await expect(searchPage.leppavaaraBath).toBeVisible('Should find baths of Espoo org');

    // Check embedded view with Helsinki organization filter
    await page.goto(`${embedBathUrl}&organization=${searchPage.HELSINKI_ORG}`);
    await expect(searchPage.kumpulaBath).toBeVisible('Should find baths of Helsinki org');
    await expect(searchPage.leppavaaraBath).not.toBeVisible('Should not find baths of Espoo org');

    // Check normal view maintains original settings
    await page.goto(bathUrl);
    await expect(searchPage.kumpulaBath).not.toBeVisible('Should not find bath of Helsinki org');
    await expect(searchPage.leppavaaraBath).toBeVisible('Should find bath of Espoo org');
  });
});

/**
 * Tests for accessibility param
 */
test.describe('Search view custom url with accessibility param test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homePage);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies that the accessibility settings are correctly overridden via URL parameters.
   * It performs the following steps:
   * 1. Pre-sets the hearing aid setting in localStorage.
   * 2. Navigates to a URL with specific accessibility settings (visually impaired, reduced
   *  mobility, colour blind).
   * 3. Opens the settings menu to verify that the sense chips and mobility input reflect the
   *  provided settings.
   * 4. Removes the accessibility settings from the URL and confirms that the sense chips and
   *  mobility input are reset.
   */
  test('Should override accessibility settings', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Set initial accessibility preference
    await searchPage.setLocalStorage('SM:hearingAid', 'true');

    // Check settings with URL parameters
    await page.goto(`${bathUrl}&accessibility_setting=visually_impaired,reduced_mobility,colour_blind`);
    await searchPage.settingsMenuButton.click();

    // Verify sense chips
    await expect(searchPage.senseChips).toHaveCount(2);

    expect(await searchPage.senseChips.filter({ hasText: 'Minun on vaikea erottaa värejä' }).count()).toBeGreaterThan(0);
    expect(await searchPage.senseChips.filter({ hasText: 'Olen näkövammainen' }).count()).toBeGreaterThan(0);

    // Verify mobility setting
    await expect(searchPage.mobilityInput).toHaveValue('Olen liikkumisesteinen');

    // Check settings are cleared with empty parameter
    await page.goto(`${bathUrl}&accessibility_setting=`);
    await searchPage.settingsMenuButton.click();

    // Verify settings are cleared
    await expect(searchPage.senseChips).toHaveCount(0);
    await expect(searchPage.mobilityInput).toHaveValue('');
  });
});

/**
 * Tests for saving user settings to url
 */
test.describe('Search view should set settings to url test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homePage);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies that the user settings stored in localStorage are correctly
   * reflected in the URL and the UI. It simulates a scenario where user settings for
   * accessibility, mobility, city, and organization are pre-set in localStorage.
   * Upon navigating to the search page, the test asserts that:
   *  - The corresponding UI elements (chips and input fields) display the correct values.
   *  - The URL includes the expected query parameters for city, organization, and
   *  accessibility settings.
   */
  test('Should set user settings to url', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // Set initial user settings
    await searchPage.setLocalStorage('SM:hearingAid', 'true');
    await searchPage.setLocalStorage('SM:mobility', 'rollator');
    await searchPage.setLocalStorage(`SM:${searchPage.ESPOO_ORG}`, 'true');
    await searchPage.setLocalStorage('SM:helsinki', 'true');
    await searchPage.setLocalStorage('SM:kauniainen', 'true');

    // Navigate to bath search
    await page.goto(bathUrl);

    // Check sense settings'
    await expect(searchPage.senses).toHaveCount(1);
    await expect(searchPage.senses.getByText('Käytän kuulolaitetta')).toBeVisible();
    await expect(searchPage.mobility).toHaveValue('Käytän rollaattoria');

    // Check city settings
    await expect(searchPage.cityChips).toHaveCount(2);
    await expect(searchPage.cityChips.getByText('Helsinki')).toBeVisible();
    await expect(searchPage.cityChips.getByText('Kauniainen')).toBeVisible();

    // Check organization settings
    await expect(searchPage.orgChips).toHaveCount(1);
    await expect(searchPage.orgChips.getByText('Espoon kaupunki')).toBeVisible();

    // Check URL parameters
    const location = await getLocation(page);
    expect(location).toContain('city=helsinki%2Ckauniainen');
    expect(location).toContain('organization=520a4492-cb78-498b-9c82-86504de88dce');
    expect(location).toContain('accessibility_setting=hearing_aid%2Crollator');
  });
});

/**
 * Tests for setting home address with url
 */
test.describe('Search view should set home address with url test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${homePage}/search?q=maauimala&hcity=helsinki&hstreet=Annankatu+12`);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies that the home address is correctly set from the URL.
   * It does so by retrieving the value from the address search bar and checking that it contains:
   * 1. The expected street address ('Annankatu 12')
   * 2. The expected city name ('Helsinki')
   */
  test('Should set home address from url', async ({ page }) => {
    const searchPage = new SearchPage(page);
    // Retrieve the current value from the address search bar input.
    const value = await searchPage.addressInput.inputValue();

    // Verify that the value contains the expected street address.
    expect(value).toContain('Annankatu 12');

    // Verify that the value contains the expected city.
    expect(value).toContain('Helsinki');
  });
});

/**
 * Tests for setting map type with url
 */
test.describe('Search view should set map type with url test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${homePage}/search?q=maauimala&hcity=helsinki&map=guidemap`);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies that the map type radio selection is correctly set according
   *  to the URL parameter.
   * It checks the following scenarios:
   *  - With the default URL, the "guidemap" radio button should be checked.
   *  - When the URL specifies "ortographic", the "ortographic" radio button should be checked.
   *  - When the URL specifies "accessible_map", the "accessible_map" radio button should
   *  be checked.
   *
   * The test navigates to the corresponding URLs, clicks the map tools button to reveal the
   *  radio buttons,
   * and asserts the expected state for each map type option.
   */
  test('Should set map type from url', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const baseSearchUrl = `${homePage}/search?q=maauimala&hcity=helsinki`;

    // Test guidemap (default)
    await page.goto(`${baseSearchUrl}&map=guidemap`);
    await searchPage.mapToolsButton.click();
    await expect(searchPage.servicemapRadio).not.toBeChecked();
    await expect(searchPage.ortographicRadio).not.toBeChecked();
    await expect(searchPage.guidemapRadio).toBeChecked();
    await expect(searchPage.accessibleMapRadio).not.toBeChecked();

    // Test ortographic map
    await page.goto(`${baseSearchUrl}&map=ortographic`);
    await searchPage.mapToolsButton.click();
    await expect(searchPage.servicemapRadio).not.toBeChecked();
    await expect(searchPage.ortographicRadio).toBeChecked();
    await expect(searchPage.guidemapRadio).not.toBeChecked();
    await expect(searchPage.accessibleMapRadio).not.toBeChecked();

    // Test accessible map
    await page.goto(`${baseSearchUrl}&map=accessible_map`);
    await searchPage.mapToolsButton.click();
    await expect(searchPage.servicemapRadio).not.toBeChecked();
    await expect(searchPage.ortographicRadio).not.toBeChecked();
    await expect(searchPage.guidemapRadio).not.toBeChecked();
    await expect(searchPage.accessibleMapRadio).toBeChecked();
  });
});
