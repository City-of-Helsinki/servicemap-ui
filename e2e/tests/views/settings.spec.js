import { test, expect } from '@playwright/test';
import { acceptCookieConcent, getBaseUrl } from '../utils';
import { SettingsPage } from '../utils/pageObjects';

test.describe('Settings view test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${getBaseUrl()}/fi/`);
    await acceptCookieConcent(page);
  });

  /**
   * This test confirms that before interacting with the settings, all dropdown menus
   * (senses, mobility, city, and organisation) are hidden. It then clicks the Settings menu button
   * and asserts that all dropdowns become visible, indicating the settings view has opened
   *  successfully.
   */
  test('Settings does open and close correctly', async ({ page }) => {
    const settingsPage = new SettingsPage(page);

    // Check dropdowns are not visible initially
    await expect(settingsPage.sensesDropdown).not.toBeVisible();
    await expect(settingsPage.mobilityDropdown).not.toBeVisible();
    await expect(settingsPage.cityDropdown).not.toBeVisible();
    await expect(settingsPage.organisationDropdown).not.toBeVisible();

    // Open settings menu
    await settingsPage.settingsMenuButton.click();

    // Check dropdowns are visible
    await expect(settingsPage.sensesDropdown).toBeVisible();
    await expect(settingsPage.mobilityDropdown).toBeVisible();
    await expect(settingsPage.cityDropdown).toBeVisible();
    await expect(settingsPage.organisationDropdown).toBeVisible();
  });

  /**
   * This test ensures that the 3D map link in the tool menu is not visible by default.
   * When the Tool Menu button is clicked, the test confirms that the 3D map link appears,
   * validating the proper behavior of the tool menu.
   */
  test('Map tool menu should contain 3d map link', async ({ page }) => {
    const settingsPage = new SettingsPage(page);

    await expect(settingsPage.mapLink3d).not.toBeVisible();
    await settingsPage.mapToolsButton.click();
    await expect(settingsPage.mapLink3d).toBeVisible();
  });

  // TODO: fix this unstable test
  test.skip('Settings saves correctly', async ({ page }) => {
    const settingsPage = new SettingsPage(page);

    // Click second checkbox and verify state
    await settingsPage.checkboxes.nth(1).click();
    await expect(settingsPage.checkboxes.nth(1)).toBeChecked();
    await expect(settingsPage.ariaLiveElement).toContainText(
      'Asetukset muutettu. Muista tallentaa'
    );

    // Save settings using bottom button
    await settingsPage.bottomSaveButton.click();
    await expect(settingsPage.ariaLiveElement).toContainText(
      'Asetukset on tallennettu'
    );
    await expect(settingsPage.closeButton).toBeFocused();

    // Toggle checkbox again
    await settingsPage.checkboxes.nth(1).click();
    await expect(settingsPage.checkboxes.nth(1)).not.toBeChecked();
    await expect(settingsPage.ariaLiveElement).toContainText(
      'Asetukset muutettu. Muista tallentaa'
    );

    // Save settings using top button
    await settingsPage.topSaveButton.click();
    await expect(settingsPage.ariaLiveElement).toContainText(
      'Asetukset on tallennettu'
    );
    await expect(settingsPage.title).toBeFocused();
  });
});
