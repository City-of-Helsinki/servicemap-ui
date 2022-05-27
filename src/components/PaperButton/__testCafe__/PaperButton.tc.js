/* eslint-disable no-await-in-loop */
import { Selector } from 'testcafe';
import { paletteDefault } from '../../../themes';

const PaperButtonTest = async (t) => {
  const paperButtons = Selector('SM-PaperButton');
  const count = await paperButtons.count;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < count; i++) {
    const b = paperButtons.nth(i);
    const disabled = await b.getReact(({ props }) => props.disabled);
    const isLink = await b.getReact(({ props }) => props.link);
    const button = await b.find('button');
    const bgColor = disabled ? paletteDefault.disabled.main : 'rgb(255, 255, 255)';
    const hoverColor = disabled ? paletteDefault.disabled.main : paletteDefault.primary.main;
    
    await t
      .expect(button.getAttribute('tabindex')).eql(disabled ? '-1' : '0')
      .expect(b.getStyleProperty('background-color')).eql(bgColor)
      .hover(b)
      .expect(b.getStyleProperty('background-color')).eql(hoverColor)
      .expect(button.getAttribute('role')).eql(isLink ? 'link' : 'button')
    ;
  }
};

export default PaperButtonTest;
