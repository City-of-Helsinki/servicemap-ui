import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { acceptCookieConcent, getBaseUrl } from '../utils';
import { ToolMenuPage } from '../utils/pageObjects';

test.describe('General tests', () => {
  const siteRoot = getBaseUrl();
  const EXPECTED_MENU_ITEMS = 4;

  test.beforeEach(async ({ page }) => {
    await page.goto(`${siteRoot}/fi`);
    await acceptCookieConcent(page);
  });

  /**
    * This test verifies that the ToolMenu panel closes correctly under various
    * interaction scenarios.
    * It simulates user actions by clicking the ToolMenu button and then:
    * 1. Pressing Escape to close the panel.
    * 2. Pressing Tab then Escape to close the panel.
    * 3. Moving focus away through Tab and Shift+Tab.
    * 4. Clicking outside the panel using the swedishButton.
    * The test asserts that after each action, the ToolMenu panel is closed
    * (i.e., its menu items are not visible).
    */
  test('ToolMenu closes correctly with different interactions', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Skipping tests on Firefox due to known issues');
    
    const toolMenuPage = new ToolMenuPage(page);
    const closeScenarios = [
      {
        name: 'Escape key press',
        action: async () => page.keyboard.press('Escape'),
      },
      {
        name: 'Tab and Escape',
        action: async () => {
          await page.keyboard.press('Tab');
          await page.keyboard.press('Escape');
        },
      },
      {
        name: 'Focus movement',
        action: async () => {
          await page.keyboard.press('Tab');
          await page.keyboard.press('Shift+Tab');
        },
      },
      {
        name: 'Outside click',
        action: async () => toolMenuPage.swedishButton.click(),
      },
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const scenario of closeScenarios) {
      // Test each closing scenario
      // eslint-disable-next-line no-await-in-loop
      await test.step(`Testing ToolMenu closing with ${scenario.name}`, async () => {
        await toolMenuPage.toolMenu.click();
        await expect(toolMenuPage.toolMenuItems).toHaveCount(EXPECTED_MENU_ITEMS);
        await scenario.action();
        await expect(toolMenuPage.toolMenuItems).toHaveCount(0);
      });
    }
  });

  test('ToolMenu focus management works correctly', async ({ page }) => {
    const toolMenuPage = new ToolMenuPage(page);
    const toolSelections = [
      {
        index: 0,
        expectedFocus: toolMenuPage.embedderCloseButton,
        cleanup: async () => toolMenuPage.embedderCloseButton.click(),
      },
      {
        index: 1,
        expectedFocus: toolMenuPage.downloadDialogCloseButton,
        cleanup: async () => toolMenuPage.downloadDialogCloseButton.click(),
      },
      {
        index: 2,
        expectedFocus: toolMenuPage.printToolCloseButton,
        cleanup: async () => toolMenuPage.printToolCloseButton.click(),
      },
      {
        index: 3,
        expectedFocus: toolMenuPage.measuringCloseButton,
        cleanup: async () => { }, // No cleanup needed for measuring tool
      },
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const { index, expectedFocus, cleanup } of toolSelections) {
      // eslint-disable-next-line no-await-in-loop
      await test.step(`Testing tool selection ${index}`, async () => {
        await toolMenuPage.toolMenu.click();
        await toolMenuPage.toolMenuItems.nth(index).click();
        await expect(expectedFocus).toBeFocused();
        await cleanup(page);
      });
    }
  });

  test('Tool Menu meets accessibility standards', async ({ page }) => {
    const toolMenuPage = new ToolMenuPage(page);
    await toolMenuPage.toolMenu.click();

    const results = await new AxeBuilder({ page })
      .include('#ToolMenuPanel')
      .disableRules('aria-hidden-focus')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
