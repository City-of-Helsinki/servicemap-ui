import { test, expect } from '@playwright/test';
import { acceptCookieConcent } from '../utils';
import { NavigationPage } from '../utils/pageObjects';

test.describe('Navigation home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi`);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies navigation to the embedder tool.
   * It simulates a user clicking on the map tools button followed by the embedder tool button,
   * and it asserts that the embedder tool title becomes visible, confirming successful navigation.
   */
  test('Should navigate to embedder tool', async ({ page }) => {
    const navigationPage = new NavigationPage(page);
    await navigationPage.mapToolsButton.click();
    await navigationPage.embedderToolButton.click();
    await expect(navigationPage.embedderToolTitle).toBeVisible();
  });

  /**
   * This test verifies navigation from the embedder tool back to the home page.
   * It simulates the process of entering the embedder tool and then closing it,
   * and it asserts that the home page search bar input is visible, confirming a 
   * successful navigation back.
   */
  test('Should navigate back to home from embedder tool', async ({ page }) => {
    const navigationPage = new NavigationPage(page);
    await navigationPage.mapToolsButton.click();
    await navigationPage.embedderToolButton.click();
    await navigationPage.embedderToolCloseButton.click();
    await expect(navigationPage.searchBarInput).toBeVisible();
  });
});

test.describe('Navigation embedder', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to the embedder page using the base URL for Finnish.
    await page.goto(`/fi/embedder`);
  });

  /**
   * This test verifies that a user can navigate from the embedder tool back to the home page.
   * It simulates clicking the close button, accepts the cookie consent, and confirms that
   * the home page search bar input becomes visible.
   */
  test('Should navigate to home page from embedder tool', async ({ page }) => {
    const navigationPage = new NavigationPage(page);
    await navigationPage.embedderToolCloseButton.click();
    await acceptCookieConcent(page);
    await expect(navigationPage.searchBarInput).toBeVisible();
  });

  /**
   * This test verifies that navigation to the information page from the embedder tool
   * works correctly. It simulates a user clicking the info button, then accepting the
   * cookie consent, and finally asserts that the info page title contains the expected text.
   */
  test('Should navigate to info page from embedder tool', async ({ page }) => {
    const navigationPage = new NavigationPage(page);
    await navigationPage.infoButton.click();
    await acceptCookieConcent(page);
    await expect(navigationPage.infoPageTitle).toContainText('Tietoa palvelusta ja saavutettavuusseloste');
  });

  /**
   * This test verifies that navigation to the feedback page from the embedder tool works correctly.
   * It simulates a user clicking the feedback button, accepts the cookie consent,
   * and asserts that the feedback page title contains the expected text.
   */
  test('Should navigate to feedback page from embedder tool', async ({ page }) => {
    const navigationPage = new NavigationPage(page);
    await navigationPage.feedbackButton.click();
    await acceptCookieConcent(page);
    await expect(navigationPage.feedbackTitle).toContainText('Anna palautetta tästä verkkopalvelusta');
  });
});
