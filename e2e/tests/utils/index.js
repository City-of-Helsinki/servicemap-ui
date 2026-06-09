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
  const cookieButton = page.locator('.hds-cc__all-cookies-button').first();

  // Some views do not show the banner every time (already accepted / disabled).
  // In those cases we should continue the test instead of failing.
  try {
    await cookieButton.waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    return;
  }

  // Wait for element to be stable and ready to interact
  await page.waitForTimeout(500); // Give extra time for any animations/transitions
  // Try clicking with force since Firefox has stability issues
  try {
    await cookieButton.click({ timeout: 10000 });
  } catch (error) {
    // Fallback: try with force click for stubborn elements
    await cookieButton.click({ force: true, timeout: 5000 });
  }
  // Wait for page to settle after cookie consent
  await page.waitForTimeout(2000);
};
