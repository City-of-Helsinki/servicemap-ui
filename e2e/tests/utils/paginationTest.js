import { expect } from '@playwright/test';

/**
 * Tests keyboard navigation of the pagination component
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
async function testKeyboardNavigation(page) {
  const pagination = page.locator('[data-sm="PaginationComponent"]');
  const previousPageButton = pagination.locator('#PaginationPreviousButton');
  const nextPageButton = pagination.locator('#PaginationNextButton');
  const buttons = pagination.locator('button');

  await nextPageButton.click();
  await expect(page).toHaveURL(/p=2/);

  await page.evaluate(() => document.getElementById('PaginationNextButton').focus());
  await page.keyboard.press('Shift+Tab');
  await expect(previousPageButton).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(nextPageButton).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(buttons.nth(2)).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(buttons.nth(4)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/p=3/);
}

/**
 * Tests if pagination attributes change correctly when navigating pages
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
async function testPaginationAttributes(page) {
  const pagination = page.locator('[data-sm="PaginationComponent"]');
  const buttons = pagination.locator('button');
  const previousPageButton = pagination.locator('#PaginationPreviousButton');
  const nextPageButton = pagination.locator('#PaginationNextButton');

  await expect(previousPageButton).toHaveAttribute('tabindex', '-1');
  await expect(previousPageButton).toHaveAttribute('disabled', '');
  await nextPageButton.click();
  await expect(previousPageButton).not.toHaveAttribute('disabled', '');
  await expect(previousPageButton).toHaveAttribute('tabindex', '0');
  await expect(page).toHaveURL(/p=2/);

  await expect(buttons.nth(3)).toHaveAttribute('disabled', '');
  await expect(buttons.nth(3)).toHaveAttribute('tabindex', '-1');

  await buttons.nth(4).click();
  await expect(page).toHaveURL(/p=3/);
  await expect(buttons.nth(3)).not.toHaveAttribute('disabled', '');
  await expect(buttons.nth(3)).toHaveAttribute('tabindex', '0');
  await expect(buttons.nth(4)).toHaveAttribute('disabled', '');
  await expect(buttons.nth(4)).toHaveAttribute('tabindex', '-1');
}

/**
 * Tests if focus changes correctly when the pagination page changes
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
async function testPageChangeFocus(page) {
  const pagination = page.locator('[data-sm="PaginationComponent"]');
  const secondPageElement = pagination.locator('button').nth(3);
  await secondPageElement.click();

  const focusTarget = page.locator('#PaginatedListFocusTarget');
  await expect(focusTarget).toBeFocused();
  await expect(focusTarget).toContainText('sivu 2 kautta');
}

/**
 * Tests if pagination defaults correctly when loading a page with a preset parameter
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
async function testPaginationDefault(page) {
  const pagination = page.locator('[data-sm="PaginationComponent"]');
  const secondPageElement = pagination.locator('button').nth(3);
  const location = page.url();
  const url = new URL(location);
  url.searchParams.set('p', '2');

  await page.goto(url.toString());
  await expect(secondPageElement).toHaveAttribute('tabindex', '-1');
  await expect(secondPageElement).toHaveAttribute('disabled', '');
}

/**
 * Runs all pagination tests
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
export default async function paginationTest(page, servicePage) {

  await page.goto(servicePage);
  await testKeyboardNavigation(page);

  await page.goto(servicePage);
  await testPaginationAttributes(page);

  await page.goto(servicePage);
  await testPageChangeFocus(page);

  await page.goto(servicePage);
  await testPaginationDefault(page);
}
