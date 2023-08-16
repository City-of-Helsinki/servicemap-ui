import { Selector, ClientFunction } from 'testcafe';
import { getContrast, getElementBG, getParentElementBG, getFocusedElement } from '../../src/utils/componentContrast';

export default () => {
  test('Input fields have correct focus indicators', async (t) => {
    const inputFields = Selector(`main input`);
    const inputFieldsCount = await inputFields.count;
    
    for(let i = 0; i < inputFieldsCount; i++) {
      const field = inputFields.nth(i);
      const parent = field.parent();
      const disabled = await field.getAttribute('disabled');
      const tabindex = await field.getAttribute('tabindex');

      if ((disabled === undefined || disabled === false) && tabindex !== '-1' ) {
        const focusElement = ClientFunction(() => {
          field().focus();
        }, {
        dependencies: { field }
        });
        
        await focusElement()

        // Focusing on Mui checkbox element does not display focus border. Element needs to be focused with tab as well.
        await t
          .pressKey('tab')
          .pressKey('shift+tab')
          .wait(20)
        

        const focusedElement = await getFocusedElement(field, parent);

        await t
          .expect(focusedElement.exists).ok('Input field does not have correct box-shadow focus indicator')

        const parentBackground = await getParentElementBG(await focusedElement, await focusedElement.parent());
        const contrastWithBackground = getContrast(parentBackground, await focusedElement.getStyleProperty('box-shadow'));
        const contrastWithElement = getContrast(await focusedElement.getStyleProperty('background-color'), await focusedElement.getStyleProperty('box-shadow'));
      
      
        await t
          .expect(contrastWithBackground).gte(3, `Input contrast ratio between focus border and parent background is not enough`)
          .expect(contrastWithElement).gte(3, `Input contrast ratio between focus border and element background is not enough`)
      }
    }
  })

  test('Buttons have correct focus indicators', async (t) => {
    const buttons = Selector(`main button`);
    const buttonsCount = await buttons.count;

    for (let i = 0; i < buttonsCount; i++) {
      const button = buttons.nth(i);
      const disabled = await button.getAttribute('disabled');
      const tabindex = await button.getAttribute('tabindex');
      const size = await button.boundingClientRect;

      if (await button.getAttribute('data-rs-container') !== "readspeaker_button1") { // Ignore readspeaker button. TODO: better implementation  
        if ((disabled === undefined || disabled === false) && tabindex !== '-1' && size.height !== 0) {
          const focusElement = ClientFunction(() => {
            button().focus();
          }, {
          dependencies: { button }
          });

          await focusElement()
          
          // Focusing on Mui button element does not display focus border. Element needs to be focused with tab as well.
          await t
            .pressKey('tab')
            .pressKey('shift+tab')
            .wait(20)


          const focusBorder = await button.getStyleProperty('box-shadow')
          await t
          .expect(focusBorder !== 'none').ok(`Button "${await button.innerText}" does not have correct box-shadow focus indicator`);

          const parentBackground = await getParentElementBG(await button, await button.parent())
          if (parentBackground) {
            const contrastWithBackground = getContrast(parentBackground, focusBorder);
            await t
              .expect(contrastWithBackground).gte(3, `Button "${await button.innerText}" contrast ratio between focus border and parent background is not enough`)
          } else {
            console.warn('Parent element background is image or gradient color, check contrast manually.');
          }

          const elementBackground = await getElementBG(await button)
          if (elementBackground) {
            const contrastWithElement = getContrast(elementBackground, await button.getStyleProperty('box-shadow'));
            await t
              .expect(contrastWithElement).gte(3, `Button "${await button.innerText}" contrast ratio between focus border and element is not enough`)
          } else {
            console.warn('Element background is image or gradient color, check contrast manually')
          }
        }
     } 
    }
  })
}
