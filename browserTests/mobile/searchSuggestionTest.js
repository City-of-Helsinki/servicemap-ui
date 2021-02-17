// 
/* eslint-disable */
import { Selector } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import config from '../config';
const { server } = config;

fixture`Mobile view tests`
  .page`http://${server.address}:${server.port}/fi/search`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Navigate search view', async (t) => {
  const input = ReactSelector('WithStyles(ForwardRef(InputBase))');
  // Make new search
  await t
    .click(input)
    .pressKey('ctrl+a delete')
    .typeText(input, 'kir');

  // Get search list's data length
  const suggestionItem = ReactSelector('SuggestionItem');
  const suggestionText = await (await suggestionItem.innerText).toLowerCase();
  await t.click(suggestionItem.nth(0).find('button'));

  // Expect input value to have been changed to based on selected suggestion
  const value = await (await Selector('#SearchBar input').value).toLowerCase();
  await t.expect(suggestionText).contains(value);
});
