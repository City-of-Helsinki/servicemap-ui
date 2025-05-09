/**
 * Verifies result ordering in alphabetical, reverse alphabetical, and accessibility order.
 * @param {import('@playwright/test').Page} page - Playwright page instance
 */
import { expect } from '@playwright/test';

export default async function resultOrdererTest(page) {
  // ...initialize locators and variables...
  const listItems = page.locator('div[data-sm="ResultListRoot"] li[role="link"]');
  const alphabeticalFirstItemContent = await listItems.nth(0).textContent();

  await page.waitForTimeout(100);
  await page.click('[data-sm="ResultSorterInput"]');
  expect(await listItems.nth(0).textContent()).toBe(alphabeticalFirstItemContent);

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  const reverseAlphabeticalFirstItemContent = await listItems.nth(0).textContent();
  expect(reverseAlphabeticalFirstItemContent).not.toBe(alphabeticalFirstItemContent);

  // ...repeat for other order selections with arrow keys and expects...
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  const accessibilityOrderFirstItemContent = await listItems.nth(0).textContent();
  expect(accessibilityOrderFirstItemContent).not.toBe(alphabeticalFirstItemContent);
  expect(accessibilityOrderFirstItemContent).not.toBe(reverseAlphabeticalFirstItemContent);

  // ...verify transitions back to reverse alphabetical...
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  expect(await listItems.nth(0).textContent()).toBe(reverseAlphabeticalFirstItemContent);

  // ...finally check alphabetical again...
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  expect(await listItems.nth(0).textContent()).toBe(alphabeticalFirstItemContent);
}