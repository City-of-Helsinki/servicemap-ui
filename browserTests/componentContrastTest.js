import { getContrast, getParentElementBG, getElementBG } from '../src/utils/componentContrast';
import { ReactSelector } from 'testcafe-react-selectors';

export default (component) => {
  const getComponentName = () => {
    return component;
  }

  test('Component has good contrast ratio with background', async (t) => {
    const componentName = getComponentName();
    const elements = ReactSelector(`main ${componentName}`);
    const elementsCount = await elements.count;

    for (let i = 0; i < elementsCount; i++) {
      const element = elements.nth(i);
      let elementBorder;

      if (await element.getStyleProperty('border-top-width') !== 0
        && await element.getStyleProperty('border-bottom-width') !== 0
      ) {
        elementBorder = await element.getStyleProperty('border-top-color');
      }
      
      const parentBackground = await getParentElementBG(element, element.parent())
      const elementColor = await getElementBG(await element)

      if (elementColor && parentBackground) {
        const elementContrast = getContrast(await parentBackground, elementColor)
        const borderContrast = getContrast(await parentBackground, elementBorder)
        const highestContrast = Math.max(borderContrast, elementContrast);
      await t
        .expect(highestContrast).gt(3, `Component ${componentName} contrast with background is too low`)
    } else {
      console.warn('Element background is image or gradient color, check contrast manually')
    }}
  })
}
