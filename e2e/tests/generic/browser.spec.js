import { test, expect } from '@playwright/test';
import { paletteDefault, paletteDark } from '../../../src/themes';
import { acceptCookieConcent, getBaseUrl } from '../utils';
import { BrowserPage } from '../utils/pageObjects';

const siteRoot = getBaseUrl();

test.describe('Browser tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${siteRoot}/fi`);
    await acceptCookieConcent(page);
  });

  /**
   * This test verifies that clicking the language buttons updates the application's title.
   * It simulates user interactions to:
   *  - Verify that the title updates to English after clicking the English button.
   *  - Verify that the title updates to Swedish after clicking the Swedish button.
   *  - Check that the title reverts back to Finnish upon clicking the Finnish button.
   */
  test('Language switching via buttons updates app title correctly', async ({ page }) => {
    const browserPage = new BrowserPage(page);
    const languages = [
      { button: browserPage.englishButton, expectedTitle: 'Service map' },
      { button: browserPage.swedishButton, expectedTitle: 'Servicekarta' },
      { button: browserPage.finnishButton, expectedTitle: 'Palvelukartta' }
    ];
    // For firefox, the wait time needs to be defined to avoid flakiness.
    const waitTime = 200;
    for (const { button, expectedTitle } of languages) {
      await button.click();
      await page.waitForTimeout(waitTime);
      await expect(browserPage.title).toHaveText(expectedTitle);
    }
  });

  /**
   * This test verifies that updating the URL path for different languages
   * correctly updates the application's title.
   * It confirms that:
   *  - Navigating to the English route updates the title to English.
   *  - Navigating to the Swedish route updates the title to Swedish.
   *  - Navigating back to the Finnish route reverts the title.
   */
  test('Language switching via URL updates app title correctly', async ({ page }) => {
    const browserPage = new BrowserPage(page);
    const routes = [
      { path: 'en', expectedTitle: 'Service map' },
      { path: 'sv', expectedTitle: 'Servicekarta' },
      { path: 'fi', expectedTitle: 'Palvelukartta' }
    ];

    for (const { path, expectedTitle } of routes) {
      await page.goto(`${siteRoot}/${path}`);
      await expect(browserPage.title).toHaveText(expectedTitle);
    }
  });

  /**
   * This test verifies that clicking the contrast button toggles the theme.
   * It confirms that:
   *  - The search bar container's initial background color matches the default (light) palette.
   *  - After clicking the contrast button, the background color updates to match the dark palette.
   */
  test('Contrast mode toggles theme correctly', async ({ page }) => {
    const browserPage = new BrowserPage(page);

    const defaultColor = await browserPage.getSearchbarColor();
    expect(defaultColor).toContain(paletteDefault.primary.main);

    await browserPage.contrastButton.click();

    const darkColor = await browserPage.getSearchbarColor();
    expect(darkColor).toContain(paletteDark.primary.main);
  });
});
