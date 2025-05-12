const { test, expect } = require('@playwright/test');
const {
  getContrast,
  getParentElementBG,
  getElementBG
} = require('./componentContrast');

export default function componentContrastTest(componentSelector) {
  const getComponentSelector = () => {
    return componentSelector;
  }
  /**
     * Test: Component contrast tests for component: ${getComponentSelector()}
     *
     * Test Description Review:
     * This test verifies that each element matching the provided component selector
     *  has sufficient contrast
     * relative to its parent background. For each element, it calculates the contrast
     *  of its background
     * color (and border color if applicable), and ensures that the highest contrast value
     *  is above the threshold (3:1).
     */
  test(`Component contrast tests (${getComponentSelector()})`, async ({ page }) => {
    // Locate all elements that match the component selector.
    const elements = page.locator(componentSelector);
    const count = await elements.count();

    // Loop through each element to perform contrast checks.
    for (let i = 0; i < count; i++) {
      const element = elements.nth(i);

      // Get the computed border widths to check if a border is present.
      const borderTopWidth = await element.evaluate(el =>
        parseFloat(window.getComputedStyle(el).borderTopWidth)
      );
      const borderBottomWidth = await element.evaluate(el =>
        parseFloat(window.getComputedStyle(el).borderBottomWidth)
      );

      let elementBorder = null;
      // If both top and bottom borders are set (non-zero), retrieve the border color.
      if (borderTopWidth !== 0 && borderBottomWidth !== 0) {
        elementBorder = await element.evaluate(el =>
          window.getComputedStyle(el).borderTopColor
        );
      }

      // Find the parent element using XPath (one level up).
      const parentLocator = element.locator('xpath=..');
      // Retrieve the background color of the parent element.
      const parentBackground = await getParentElementBG(element, parentLocator);

      // Retrieve the background color of the element.
      const elementBackround = await getElementBG(element);

      if (elementBackround && parentBackground) {
        // Calculate the contrast between the parent's background and the element's background.
        const elementContrast = getContrast(parentBackground, elementBackround);
        // Calculate the contrast for the border if it exists.
        const borderContrast = elementBorder
          ? getContrast(parentBackground, elementBorder)
          : 0;
        const highestContrast = Math.max(elementContrast, borderContrast);
        // Assert that the contrast is greater than the threshold (e.g., 3:1).
        expect(highestContrast).toBeGreaterThan(3);
      } else {
        // Warn if background data could not be retrieved, indicating a need for manual review.
        console.warn(
          `Element background is an image/gradient or couldn't be retrieved. 
                    Check contrast manually for element ${i}. 
                    parentBackground: ${parentBackground}, elementBackround: ${elementBackround}`
        );
      }
    }
  });
}
module.exports = { componentContrastTest };
