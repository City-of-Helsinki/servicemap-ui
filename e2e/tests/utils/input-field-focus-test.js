// file: focusIndicators.spec.js
const { test, expect } = require('@playwright/test');
const {
  getParentElementBG,
  getMaxContrastFromBoxShadow,
  getFocusedElement,
} = require('./componentContrast');

export default function inputFieldFocusTests() {
  test('Input fields have correct focus indicators', async ({ page }) => {
    // Locate all input fields in the main element
    const inputFields = page.locator('main input:visible:not([disabled]):not([tabindex="-1"])');
    const inputFieldsCount = await inputFields.count();

    for (let i = 0; i < inputFieldsCount; i++) {
      const field = inputFields.nth(i);

      console.log(`Checking input field: ${await field.getAttribute('id')}`);

      await field.focus();

      // Some UI frameworks don’t show the focus ring unless you navigate by keyboard.
      // Simulate tabbing in and out, then back:
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');

      // Retrieve the element that visually has the focus ring
      await expect(field).toBeFocused();

      const focusedElement = await getFocusedElement(field);

      // Get the parent's background (solid color, if available)
      const parentBackground = await getParentElementBG(focusedElement, focusedElement.locator('xpath=..'));

      // Get the box-shadow for the focused element
      const focusBoxShadow = await focusedElement.evaluate(
        (el) => window.getComputedStyle(el).boxShadow
      );

      // Contrast between focus border and parent BG
      const contrastWithBackground = getMaxContrastFromBoxShadow(parentBackground, focusBoxShadow);

      // Contrast between focus border and the element’s own BG
      const elementBGColor = await focusedElement.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      );
      const contrastWithElement = getMaxContrastFromBoxShadow(elementBGColor, focusBoxShadow);

      // Validate contrast
      expect(contrastWithBackground).toBeGreaterThanOrEqual(3);
      expect(contrastWithElement).toBeGreaterThanOrEqual(3);
    }
  });
}
module.exports = { inputFieldFocusTests };
