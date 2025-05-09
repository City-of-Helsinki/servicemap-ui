import { test, expect } from '@playwright/test';
import { acceptCookieConcent, getLocation } from '../utils';
import { UnitPage } from '../utils/pageObjects';

const testUrl = `/fi/unit/51342`;

test.describe('Unit page tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testUrl);
    await acceptCookieConcent(page);
  });

  /**
   * This test ensures that a unit marker is correctly drawn on the map by verifying:
   * 1. There is at least one marker element present.
   * 2. There is exactly one marker on the map.
   */
  test('Unit marker is drawn on map', async ({ page }) => {
    const unitPage = new UnitPage(page);
    await expect(unitPage.unitMarkers).toHaveCount(1);
  });

  /**
   * This test verifies that the unit page details are rendered correctly by:
   * 1. Ensuring that the title element is visible.
   * 2. Confirming that the title element contains the expected unit name.
   */
  test('Unit page details does render correctly', async ({ page }) => {
    const unitPage = new UnitPage(page);
    await expect(unitPage.title).toBeVisible();
    await expect(unitPage.title).toContainText(unitPage.unitName);
  });

  /**
   * This test verifies that when the "Show More Events" button is clicked on the unit page,
   * the user is redirected to the events list page. It ensures that:
   * 1. The "Show More Events" button is visible.
   * 2. Clicking the button navigates to a URL that contains the expected events path.
   */
  test('Unit page show more events should take user to events list', async ({ page }) => {
    const unitPage = new UnitPage(page);
    await expect(unitPage.showMoreEventsButton).toBeVisible();
    await unitPage.showMoreEventsButton.click();
    const location = await getLocation(page);
    expect(location).toContain('/fi/unit/51342/events');
  });

  /**
   * This test ensures that the event navigation on the unit page functions correctly.
   * It simulates the following steps:
   * 1. Verifies that the "Show More Events" button is visible (with a timeout) and
   *  clicks it to load event items.
   * 2. Extracts the text content (event names) from the first two event items.
   * 3. Clicks on the first event item and checks that the event detail page displays
   *  a title matching that event name.
   * 4. Uses the back button to return to the event list, then clicks on the second
   *  event item and verifies its title.
   */
  test('Unit page event click does take to events page', async ({ page }) => {
    const unitPage = new UnitPage(page);

    // Ensure the "Show More Events" button is visible (with a timeout) before interacting.
    await expect(unitPage.showMoreEventsButton).toBeVisible({ timeout: 5000 });
    // Click the button to load the event items.
    await unitPage.showMoreEventsButton.click();

    const { eventLinks } = unitPage;

    const firstEventName = await eventLinks.nth(0).locator('p').nth(1).textContent();
    const secondEventName = await eventLinks.nth(1).locator('p').nth(1).textContent();

    // Click the first event item to navigate to its detail page.
    await eventLinks.nth(0).click();
    await expect(unitPage.title).toHaveText(firstEventName, { timeout: 5000 });
    await unitPage.backButton.click();

    // Click the second event item to navigate to its detail page.
    await eventLinks.nth(1).click();
    await expect(unitPage.title).toHaveText(secondEventName, { timeout: 5000 });
  });

  /**
   * This test checks that when the unit feedback button is clicked, the user is
   *  navigated to the unit feedback page.
   * Specifically, it ensures that:
   * 1. The feedback button is visible on the unit page.
   * 2. Clicking the button navigates to a URL containing '/unit/51342/feedback'.
   * 3. The feedback page displays the correct unit title.
   */
  test('Unit page feedback button should take unit feedback page', async ({ page }) => {
    const unitPage = new UnitPage(page);
    await expect(unitPage.feedbackButton).toBeVisible();
    await unitPage.feedbackButton.click();

    const location = await getLocation(page);
    expect(location).toContain('/unit/51342/feedback');
    await expect(unitPage.title).toContainText(unitPage.unitName);
  });

  /**
   * This test verifies that the unit feedback page functions as expected. It simulates the user
   * clicking the feedback button, then confirms that the feedback page shows the correct unit title
   * and that the feedback information link is visible. This ensures that navigation to and
   * rendering of the feedback page operate correctly.
   */
  test('Unit feedback page does work correctly', async ({ page }) => {
    const unitPage = new UnitPage(page);
    await unitPage.feedbackButton.click();
    await expect(unitPage.title).toContainText(unitPage.unitName);
    await expect(unitPage.infoLink).toBeVisible();
  });

  /**
   * This test verifies that the "additional entrances" section on the unit page behaves as
   * expected. Initially, the accordion should be collapsed and the first tab (indicating the
   * default view) should be selected. After clicking the accordion and then the button to
   * show additional entrance information, the active state should switch from the first
   * tab to the second, reflecting the updated UI state.
   */
  test('Unit page additional entrances does show correctly', async ({ page }) => {
    const unitPage = new UnitPage(page);

    await expect(unitPage.tabListButtons.first()).toHaveAttribute('aria-selected', 'true');
    await expect(unitPage.additionalEntrances).toContainText('Katso lisäsisäänkäynnit');

    await unitPage.additionalEntrances.click();
    await unitPage.showAccessibilityInfo.click();

    await expect(unitPage.tabListButtons.first()).toHaveAttribute('aria-selected', 'false');
    await expect(unitPage.tabListButtons.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  /**
   * This test verifies that the links within the unit page are working correctly by:
   * 1. Checking that the Home page link contains the expected text ("Kotisivu") and opens
   *    a new page with the correct URL.
   * 2. Checking that the HSL route planner link contains the expected text ("Katso reitti tänne")
   *    and opens a new page with the correct URL.
   *
   * After each link interaction, the test navigates back to the base unit page.
   */
  test('Unit page links do work correctly', async ({ page, context }) => {
    const unitPage = new UnitPage(page);

    // Test homepage link
    const [homePage] = await Promise.all([
      context.waitForEvent('page'),
      unitPage.infoTabLinks.nth(1).click()
    ]);
    expect(homePage.url()).toContain('https://oodihelsinki.fi/');
    await homePage.close();

    await expect(unitPage.infoTabLinks.nth(2)).toContainText('Katso reitti tänne');
    // Test HSL route planner link
    const [hslPage] = await Promise.all([
      context.waitForEvent('page'),
      unitPage.infoTabLinks.nth(2).click()
    ]);
    expect(hslPage.url()).toContain('https://reittiopas.hsl.fi/reitti/');
    await hslPage.close();
  });

  /**
   * This test verifies that the hearing map link within the unit's accessibility tab, when clicked,
   * opens a new page with the correct target URL. It simulates user interaction by switching to the
   * accessibility tab, validating the link's text, triggering a new page navigation, and confirming
   * that the new page's URL contains the expected domain.
   */
  test('Unit view hearing map link opens correctly', async ({ page, context }) => {
    // Locate the accessibility tab (assumed to be the second tab in the tablist) and click it.
    const accessibilityTab = page.locator('div[role="tablist"] button').nth(1);
    await accessibilityTab.click();

    // Locate the list of links within the accessibility tab content.
    const aLinks = page.locator('#tab-content-1 li[role="link"]');
    // Select the first link, which is expected to be the hearing map link.
    const hearingMapLink = aLinks.nth(0);

    // Verify that the hearing map link contains the expected text.
    await expect(hearingMapLink).toContainText('Lainaus 1 - palvelupiste 3. krs');

    // Click the hearing map link and wait for a new page to open.
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      hearingMapLink.click()
    ]);

    // Confirm that the new page's URL points to the expected domain.
    expect(newPage.url()).toContain('https://kuulokuvat.fi');

    // Close the new page.
    await newPage.close();
  });

  /**
   * This test ensures that the accessibility tab within the unit view responds to
   * accessibility settings changes correctly.
   *
   * Steps performed:
   * 1. Click the accessibility tab (second tab in the tablist).
   * 2. Verify that the accessibility information container includes a default message
   *    ("Ei tiedossa olevia puutteita") indicating no known accessibility issues.
   * 3. Apply accessibility settings using the helper function 'selectSettingsAndClose(page)'.
   * 4. Confirm that additional accessibility details (shortcoming title and text) are now visible.
   */
  test('Unit view accessibility tab changes according to accessibility settings', async ({ page }) => {
    const unitPage = new UnitPage(page);

    // Switch to accessibility tab
    await unitPage.accessibilityTab.click();

    // Check default message
    await expect(unitPage.accessibilityInfoContainer.locator('p'))
      .toContainText('Ei tiedossa olevia puutteita');

    // Apply accessibility settings
    await unitPage.selectAccessibilitySettings();

    // Verify shortcoming elements are visible
    await expect(unitPage.accessibilityShortcomingTitle.first()).toBeVisible();
    await expect(unitPage.accessibilityShortcoming.first()).toBeVisible();
  });

  /**
   * This test verifies that the services tab in the unit view displays the correct list of
   * services. The test simulates user interactions by clicking on the services tab, then
   * clicking the "more services" button, and finally confirming that the service title
   * contains the expected text. After validation, it navigates back to the previous view.
   */
  test('Unit view services tab lists work correctly', async ({ page }) => {
    const unitPage = new UnitPage(page);

    await unitPage.navigateToService();
    await expect(unitPage.serviceTitle).toContainText(
      'Keskustakirjasto Oodi - Toimipisteeseen liittyvät palvelut'
    );
    await unitPage.backButton.click();
  });

  /**
   * This test verifies that the share link in the unit view functions properly. It simulates
   * the following steps:
   * 1. Switch to the accessibility tab.
   * 2. Apply accessibility settings and close the settings panel.
   * 3. Click the share button to open the share dialog.
   * 4. Retrieve the current URL and verify that the copied share link in the dialog includes:
   *    - The current page's URL.
   *    - Query parameters for accessibility settings (senses and mobility).
   */
  test('Unit view share link does work correctly', async ({ page }) => {
    const unitPage = new UnitPage(page);

    await unitPage.accessibilityTab.click();
    await unitPage.selectAccessibilitySettings();

    await unitPage.shareButton.click();

    const currentLocation = await getLocation(page);
    await expect(unitPage.copyLinkButton).toContainText(currentLocation);
    await expect(unitPage.copyLinkButton).toContainText('senses=hearingAid%2CvisuallyImpaired');
    await expect(unitPage.copyLinkButton).toContainText('mobility=wheelchair');
  });
});
