import { test, expect } from '@playwright/test';
import { acceptCookieConcent, getBaseUrl, getLocation } from '../utils';
import { HomePage } from '../utils/pageObjects';

const viewUrl = `${getBaseUrl()}/fi/`;

test.describe('Home view test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(viewUrl);
    await acceptCookieConcent(page);
  });

  /**
   * This E2E test verifies that the Home view's navigation buttons work correctly.
   * It simulates user interactions with the following navigation options:
   *  - Clicking the "Area" button navigates to the Area page.
   *  - Clicking the "Services" button navigates to the Services page.
   *  - Clicking the "Feedback" button navigates to the Feedback page.
   *  - Clicking the "Info" button navigates to the Info page.
   *
   * After each navigation, the test confirms that the URL reflects the correct page,
   * and then uses the Back button to return to the Home view.
   */
  test('Test home page navigation button clicks take user to correct pages', async ({ page }) => {
    const homePage = new HomePage(page);

    // Test area button
    await homePage.areaButton.click();
    expect(await getLocation(page)).toContain(`${viewUrl}area`);
    await homePage.backButton.click();

    // Test services button
    await homePage.servicesButton.click();
    expect(await getLocation(page)).toContain(`${viewUrl}services`);
    await homePage.backButton.click();

    // Test feedback button
    await homePage.feedbackButton.click();
    expect(await getLocation(page)).toContain(`${viewUrl}feedback`);
    await homePage.backButton.click();

    // Test info button
    await homePage.infoButton.click();
    expect(await getLocation(page)).toContain(`${viewUrl}info`);
    await homePage.backButton.click();
  });

  /**
   * This test verifies that when a user performs a search from the Home view, they are navigated
   * to the search view with the correct query parameters in the URL. The test simulates two types
   * of search interactions:
   * 1. Entering a search term ('kirjasto') and pressing 'Enter'.
   * 2. Entering the term and clicking the dedicated search button.
   * After the search, it also tests that using the back button returns the user to the Home view.
   */
  test('Home view search does take user to search view', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.searchInput.click();
    await homePage.searchInput.type('kirjasto');
    await page.keyboard.press('Enter');

    await expect(homePage.unitMarkers).not.toHaveCount(0);
    expect(await getLocation(page)).toContain(`${viewUrl}search?q=kirjasto`);

    await homePage.backButton.click();
    await expect(homePage.unitMarkers).toHaveCount(0);
    expect(await getLocation(page)).toBe(viewUrl);

    await homePage.searchInput.click();
    await homePage.searchInput.type('kirjasto');
    await homePage.searchButton.click();

    await expect(homePage.unitMarkers).not.toHaveCount(0);
    expect(await getLocation(page)).toContain(`${viewUrl}search?q=kirjasto`);

    await homePage.backButton.click();
    await expect(homePage.unitMarkers).toHaveCount(0);
    expect(await getLocation(page)).toBe(viewUrl);
  });
});
