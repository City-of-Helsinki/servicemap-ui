import { Selector } from "testcafe";

export default () => {
  test('Result sorter does change result order', async (t) => {
    const select = Selector('#result-sorter');
    const listItems = Selector('div[data-sm="ResultListRoot"] li[role="link"]');
    const alphabeticalFirstItemContent = await listItems.nth(0).textContent;

    await t
      .click(select)
      .expect(select.focused).ok('Select should be focused when active')
      .expect(listItems.nth(0).textContent).eql(alphabeticalFirstItemContent, 'Initial first item should be same as in alphabetical order')
      .pressKey('down')
      .pressKey('enter')
    ;

    const reverseAlphabeticalFirstItemContent = await listItems.nth(0).textContent;
    await t
      .expect(listItems.nth(0).textContent).notEql(alphabeticalFirstItemContent, 'After selecting reverse order first item should be different than with alphabetical order')
      .pressKey('down')
      .pressKey('down')
      .pressKey('enter')
    ;
    
    const accessibilityOrderFirstItemContent = await listItems.nth(0).textContent;
    await t
      .expect(listItems.nth(0).textContent).notEql(reverseAlphabeticalFirstItemContent, 'After selecting accessibility order first item should be different than reverse alphabetical first item')
      .pressKey('up')
      .pressKey('up')
      .pressKey('enter')
      .expect(listItems.nth(0).textContent).notEql(accessibilityOrderFirstItemContent, 'After selecting reverse alphabetical order first item should not be same as first item in accessible order')
      .expect(listItems.nth(0).textContent).eql(reverseAlphabeticalFirstItemContent, 'After selecting reverse alphabetical order first item should be different than for accessible sorting')
      .pressKey('up')
      .pressKey('up')
      .pressKey('enter')
      .expect(listItems.nth(0).textContent).notEql(reverseAlphabeticalFirstItemContent, 'After selecting alphabetical order first item should not be same as first item in reverse alphabetical order')
      .expect(listItems.nth(0).textContent).eql(alphabeticalFirstItemContent, 'After selecting alphabetical result order first list item should be in alphabetical order')
    ;
  });
};
