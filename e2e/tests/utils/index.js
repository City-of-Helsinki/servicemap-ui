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
  await page.waitForSelector('button[data-testid="cookie-consent-approve-button"]', { state: 'visible' });
  
  // Wait for the button to be stable before clicking
  const cookieButton = page.locator('button[data-testid="cookie-consent-approve-button"]');
  
  // Wait for element to be stable and ready to interact
  await cookieButton.waitFor({ state: 'visible' });
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
