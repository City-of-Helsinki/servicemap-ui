const { test, expect } = require('@playwright/test');
const {
  getElementBG,
  getParentElementBG,
  getMaxContrastFromBoxShadow,
} = require('./componentContrast');

export default function buttonFocusTests() {
  test('Buttons have correct focus indicators', async ({ page }) => {
    // Locate all buttons in the main element
    const buttons = page.locator('main button');
    const buttonsCount = await buttons.count();

    for (let i = 0; i < buttonsCount; i++) {
      const button = buttons.nth(i);

      // Skip the ReadSpeaker button (example logic from your code)
      const dataRsContainer = await button.getAttribute('data-rs-container');
      if (dataRsContainer === 'readspeaker_button1') {
        continue;
      }

      // Check "disabled", "tabindex", and bounding box
      const disabled = await button.getAttribute('disabled');
      const tabIndex = await button.getAttribute('tabindex');
      const box = await button.boundingBox();

      // boundingBox() can be null if the element is off-DOM or invisible
      if (!box) continue;

      if ((disabled === null || disabled === false) && tabIndex !== '-1' && box.height !== 0) {
        // Focus the button via JavaScript
        await button.focus();

        // Again, simulate keyboard usage
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        await page.waitForTimeout(20);

        // Check the focus style (box-shadow)
        const focusBorder = await button.evaluate(el => {
          return window.getComputedStyle(el).boxShadow;
        });

        // Expect it not to be "none"
        expect(focusBorder).not.toBe('none');

        // Contrast with the parent’s background
        const parentBackground = await getParentElementBG(button, button.locator('xpath=..'));
        if (parentBackground) {
          const contrastWithBackground = getMaxContrastFromBoxShadow(parentBackground, focusBorder);
          expect(contrastWithBackground).toBeGreaterThanOrEqual(3);
        } else {
          console.warn(
            `Parent element background is image or gradient color, check contrast manually for button with text: "${await button.innerText()}".`
          );
        }

        // Contrast with the element’s own background
        const elementBackground = await getElementBG(button);
        if (elementBackground) {
          const contrastWithElement = getMaxContrastFromBoxShadow(
            elementBackground,
            focusBorder
          );
          expect(contrastWithElement).toBeGreaterThanOrEqual(3);
        } else {
          console.warn(
            `Element background is image or gradient color, check contrast manually for button with text: "${await button.innerText()}".`
          );
        }
      }
    }
  });
}
module.exports = { buttonFocusTests };
