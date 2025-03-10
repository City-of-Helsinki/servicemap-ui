/**
 * Utility functions to retrieve background colors, traverse parent backgrounds,
 * and calculate contrast in a Playwright environment.
 */

// Extract computed style property in Playwright
async function getStyleProperty(locator, property) {
  return locator.evaluate((el, prop) => {
    return window.getComputedStyle(el)[prop];
  }, property);
}

/**
 * Retrieve an element's background color if it is a solid color (not a gradient or image).
 * @param {import('@playwright/test').Locator} elementLocator
 * @returns {Promise<string|null>}
 */
async function getElementBG(elementLocator) {
  const bgColor = await getStyleProperty(elementLocator, 'backgroundColor');
  const bgImage = await getStyleProperty(elementLocator, 'backgroundImage');

  if (!bgColor) {
    console.warn('getElementBG has no background color');
    return null;
  }
  if (bgImage.includes('url(') || bgImage.includes('gradient')) {
    console.warn('getElementBG has image or gradient background');
    return null; // image or gradient, so not a solid color
  }
  return bgColor;
}

/**
 * Recursively find a parent element that is significantly bigger than the current element,
 * and return that parent's background color (or default to white if none is found).
 * @param {import('@playwright/test').Locator} currentLocator
 * @param {import('@playwright/test').Locator} parentLocator
 * @param {number} level - keeps track of recursion depth
 * @returns {Promise<string>}
 */
async function getParentElementBG(currentLocator, parentLocator, level = 0) {
  // Limit the recursion depth to prevent infinite climbing in edge cases
  const MAX_LEVELS = 10;
  if (level > MAX_LEVELS) {
    // Return default after too many levels
    return 'rgb(255, 255, 255)';
  }

  // Check if the parent element exists
  const parentCount = await parentLocator.count();
  if (parentCount === 0) {
    // No parent? Return default
    return 'rgb(255, 255, 255)';
  }

  // Get bounding boxes
  const currentBB = await currentLocator.boundingBox();
  const parentBB = await parentLocator.boundingBox();

  // If the parent has no bounding box (e.g., not visible or out of the DOM), return default
  if (!parentBB) {
    return 'rgb(255, 255, 255)';
  }

  // If no current bounding box, fallback as well
  if (!currentBB) {
    return 'rgb(255, 255, 255)';
  }

  // "Significantly larger" means at least 8px more in width & height
  if (
    (parentBB.width - currentBB.width > 8) &&
    (parentBB.height - currentBB.height > 8)
  ) {
    const parentBG = await getElementBG(parentLocator);
    if (parentBG === 'rgba(0, 0, 0, 0)') {
      // Parent is transparent, go further up
      return getParentElementBG(
        currentLocator,
        parentLocator.locator('xpath=..'),
        level + 1
      );
    }
    return parentBG;
  }

  // Not large enough, move to the next parent
  return getParentElementBG(
    currentLocator,
    parentLocator.locator('xpath=..'),
    level + 1
  );
}

/**
 * Parse an RGB or RGBA color string into numeric r, g, b components.
 * @param {string} rgbString - e.g. "rgb(255, 0, 0)" or "rgba(255, 0, 0, 1)"
 * @returns {number[][]} An array of arrays, typically [[r, g, b]] 
 */
function getColorValues(rgbString) {
  const match = rgbString.match(/\d+/g);
  if (!match) return [[0, 0, 0]];
  const [r, g, b] = match.map(Number);
  return [[r, g, b]];
}
/**
 * Calculate relative luminance of a given r, g, b set.
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @returns {number}
 */
function luminance(r, g, b) {
  const [R, G, B] = [r, g, b].map(channel => {
    channel /= 255; // normalized into [0,1]
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Compute contrast ratio of two RGB strings (e.g., "rgb(255, 255, 255)" vs "rgb(0, 0, 0)").
 * @param {string} color1 
 * @param {string} color2 
 * @returns {number} contrast ratio
 */
function getContrast(color1, color2) {
  if (!color1 || !color2) return 0;
  const [[r1, g1, b1]] = parseRgbOrRgba(color1);
  const [[r2, g2, b2]] = parseRgbOrRgba(color2);

  const l1 = luminance(r1, g1, b1) + 0.05;
  const l2 = luminance(r2, g2, b2) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

function getMaxContrastFromBoxShadow(parentBackground, boxShadow) {
  if (!parentBackground || !boxShadow) return 0;

  // Matches both rgb(...) and rgba(...) forms
  const colorRegex = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*\d+(\.\d+)?)?\)/g;
  const matches = boxShadow.match(colorRegex) || [];

  let maxContrast = 0;
  for (const colorStr of matches) {
    // Parse color channels. Example: "rgba(10, 26, 175, 0.5)" -> [10, 26, 175, 0.5]
    const channels = getColorChannels(colorStr);
    if (!channels) {
      continue;
    }

    // If there's an alpha channel of 0, effectively no visible color.
    if (channels.length === 4 && channels[3] === 0) {
      continue;
    }

    // Compare each color to the parent background
    const contrast = getContrast(parentBackground, colorStr);
    if (contrast > maxContrast) {
      maxContrast = contrast;
    }
  }

  return maxContrast;
}

// Parse "rgb(r,g,b)" or "rgba(r,g,b,a)" into [r, g, b, (a)] as numbers.
function getColorChannels(rgbString) {
  // Grab all numeric parts (including decimal for alpha)
  const parts = rgbString.match(/\d+(\.\d+)?/g);
  if (!parts) {
    return null;
  }
  // Convert to numbers
  return parts.map(Number);
}

function parseRgbOrRgba(str) {
  // We only need R, G, B for the WCAG luminance formula
  const parts = str.match(/\d+(\.\d+)?/g);
  if (!parts) {
    return [[0, 0, 0]];
  }
  // First three are R, G, B
  const [r, g, b] = parts.map(Number);
  return [[r, g, b]];
}

async function getFocusedElement(element) {

  // Get the computed box-shadow style of the element.
  const indicator = await getStyleProperty(element, 'boxShadow');

  if (indicator !== 'none') {
    return element;
  }

  // Get the parent element.
  const parentHandle = await element.evaluateHandle((el) => el.parentElement);
  const parentElement = parentHandle.asElement();
  await parentHandle.dispose();

  // If there is a parent, recurse upward.
  if (parentElement) {
    return await getFocusedElement(parentElement);
  }

  return null;
}

module.exports = {
  getElementBG,
  getParentElementBG,
  getColorValues,
  luminance,
  getContrast,
  getMaxContrastFromBoxShadow,
  getFocusedElement,
};
