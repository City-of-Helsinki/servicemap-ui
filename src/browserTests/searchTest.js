/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import config from '../../config';
const { server } = config;

// TODO: move these to the related view folders
fixture`Search view test`
  .page`http://${server.address}:${server.port}/fi/search`
  .beforeEach(async () => {
    await waitForReact();
  });

const getLocation = ClientFunction(() => document.location.href);

const searchUnits = async (t) => {
  const input = ReactSelector('InputBase');

  // Make new search
  await t
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/search`)
    .typeText(input, 'Kallion kirjasto')
    .pressKey('enter');

  // Get search list's data length
  const searchList = await ReactSelector('ResultList');
  const unitCount = await searchList.getReact(({props}) => props.data.length);

  return unitCount;
}

test('Search does list results', async (t) => {
  const unitCount = await searchUnits(t);

  await t
    .expect(unitCount).gt(0, `Search didn't get results`);
});

test('Navigate search results with keyboard', async (t) => {
  const unitCount = await searchUnits(t);

  const firstSearchItems =  ReactSelector('ResultList ResultItem');
  const secondSearchItems = ReactSelector('ResultList ResultItem').nth(1);

  await t
    .pressKey('tab') // Tabs to search icon button
    .pressKey('tab') // Tabs to first item in list
    .expect(firstSearchItems.focused).ok('Tab did move focus to first list item')
    .pressKey('tab')
    .expect(secondSearchItems.focused).ok('Tab did move focus to second list item')
    .pressKey('shift+tab')
    .expect(firstSearchItems.focused).ok('Tab did move focus back to first list item');
});