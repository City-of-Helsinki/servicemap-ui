/**
 * Gets the current page URL
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<string>} Current page URL
 */
export const getLocation = async (page) => {
  return page.url();
};

/**
 * Accepts the cookie consent if present
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export const acceptCookieConcent = async (page) => {
  await page.waitForSelector('button[data-testid="cookie-consent-approve-button"]');
  const cookieButton = page.locator('button[data-testid="cookie-consent-approve-button"]');
  await cookieButton.click();
};
