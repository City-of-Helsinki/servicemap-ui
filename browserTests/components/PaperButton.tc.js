/* eslint-disable no-await-in-loop */
import { Selector } from 'testcafe';
import { paletteDefault } from '../../src/themes';

const PaperButtonTest = async (t) => {
  const paperButtons = Selector('div[class*="PaperButton-container"]');
  const count = await paperButtons.count;
  
  await t.expect(paperButtons.count).gt(0, 'Paper buttons should exist in HomeView');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < count; i++) {
    const b = paperButtons.nth(i);
    const button = await b.find('button');
    const disabled = await button.getAttribute('disabled') !== null;
    const bgColor = !!disabled ? paletteDefault.disabled.main : 'rgb(255, 255, 255)';
    const hoverColor = !!disabled ? paletteDefault.disabled.main : paletteDefault.primary.main;
    
    await t
      .expect(b.getStyleProperty('background-color')).eql(bgColor)
      .hover(b)
      .expect(b.getStyleProperty('background-color')).eql(hoverColor)
    ;
  }
};

export default PaperButtonTest;
