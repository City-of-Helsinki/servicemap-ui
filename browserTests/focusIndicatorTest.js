import { Selector, ClientFunction } from 'testcafe';
import { getContrast, getParentElementBG } from '../src/utils/componentContrast';

export default () => {
  test('Input fields have correct focus indicators', async (t) => {
    const inputFields = Selector(`main input`);
    const inputFieldsCount = await inputFields.count;
    
    for(let i = 0; i < inputFieldsCount; i++) {
      const field = inputFields.nth(i);
      const parent = field.parent();
      const disabled = await field.getAttribute('disabled');

      if (disabled === undefined || disabled === false) {
        const focusElement = ClientFunction(() => {
          field().focus();
        }, {
        dependencies: { field }
        });
        
        await focusElement()
        
        // Check if focus border is on the input element or its parent. (Mui InputBase puts focus on wrapper div insted of the input field itself)
        const currentFocused = await field.getStyleProperty('box-shadow')
        const parentFocused = await parent.getStyleProperty('box-shadow')
        let focusedElement = null;

        if (currentFocused !== 'none') {
          focusedElement = field;
        } else if (parentFocused !== 'none'){
          focusedElement = parent;
        }

        await t
          .expect(focusedElement).ok('Input field does not have correct box-shadow focus indicator')

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

    for(let i = 0; i < buttonsCount; i++) {  
      const button = buttons.nth(i);
      const disabled = await button.getAttribute('disabled');

      if (disabled === undefined || disabled === false) {
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
          .expect(focusBorder !== 'none').ok('Input field does not have correct box-shadow focus indicator')

        const parentBackground = await getParentElementBG(await button, await button.parent())
        const contrastWithBackground = getContrast(parentBackground, await button.getStyleProperty('box-shadow'));
        const contrastWithElement = getContrast(await button.getStyleProperty('background-color'), await button.getStyleProperty('box-shadow'));

        await t
          .expect(contrastWithBackground).gte(3, `Button "${await button.innerText}" contrast ratio between focus border and parent background is not enough`)
          .expect(contrastWithElement).gte(3, `Button "${await button.innerText}" contrast ratio between focus border and element is not enough`)
      }
    }
  })
}