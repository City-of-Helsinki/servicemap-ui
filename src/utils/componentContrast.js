/* eslint-disable no-param-reassign */
const getElementBG = async (element) => {
  const elementBG = await element.getStyleProperty('background-color');
  const elementBGImg = await element.getStyleProperty('background-image');
  if (elementBGImg.includes('url(') || elementBGImg.includes('gradient')) {
    return null;
  }
  return elementBG;
};

const getParentElementBG = async (current, parent) => {
  // Find the parent element that is the element's background and return its background color
  const currentSize = await current.boundingClientRect;
  const parentSize = await parent.boundingClientRect;
  // If no parent element with background found, use white color as default
  if (!parentSize) {
    return 'rgb(255, 255, 255)';
  }
  /* Parent element is defined here as first ancestor
   element that is significally larger than the focused element */
  if (parentSize.width - currentSize.width > 8 && parentSize.height - currentSize.height > 8) {
    const parentBG = await getElementBG(parent);
    // If parent has no background color (is transparent), check the next parent
    if (parentBG === 'rgba(0, 0, 0, 0)') {
      return getParentElementBG(current, parent.parent());
    }
    return parentBG;
  }
  // If parent element was not over 8px larger, check the next parent.
  return getParentElementBG(current, parent.parent());
};


const getColorValues = (rgb) => {
  const strings = rgb.split('(');
  strings.shift();
  const colors = [];
  strings.forEach((color) => {
    colors.push(color.split(')')[0].split(','));
  });

  return colors;
};

function luminanace(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : ((
        v + 0.055) / 1.055) ** 2.4;
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}


const getContrast = (background, element) => {
  const rgb1 = getColorValues(background)[0];
  const rgb2 = getColorValues(element);

  const contrasts = rgb2.map((color) => {
    const lum1 = luminanace(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = luminanace(color[0], color[1], color[2]);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05)
        / (darkest + 0.05);
  });

  return Math.max(...contrasts);
};

const getFocusedElement = async (element, parent) => {
  const indicator = await element.getStyleProperty('box-shadow');
  if (indicator !== 'none') {
    return element;
  } if (parent.parent()) {
    return getFocusedElement(parent, parent.parent());
  }
  return null;
};

export {
  getContrast,
  getElementBG,
  getParentElementBG,
  getFocusedElement,
};
