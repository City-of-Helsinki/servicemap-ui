import { getContrast, getParentElementBG, getElementBG } from '../../src/utils/componentContrast';
import { Selector } from 'testcafe';

export default (componentSelectorQuery) => {
  const getComponentSelectorQuery = () => {
    return componentSelectorQuery;
  }

  test(`Component with selector ${getComponentSelectorQuery()} has good contrast ratio with background`, async (t) => {
    const elements = Selector(getComponentSelectorQuery());
    
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
        .expect(highestContrast).gt(3, `Component with selector ${getComponentSelectorQuery()} contrast with background is too low`)
    } else {
      console.warn('Element background is image or gradient color, check contrast manually')
    }}
  })
}
