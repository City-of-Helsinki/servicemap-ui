/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import config from './config';
const { server } = config;

fixture`Search view test`
  .page`http://${server.address}:${server.port}/fi/search?q=uimastadion`
  .beforeEach(async () => {
    await waitForReact();
  });

const getLocation = ClientFunction(() => document.location.href);

const searchUnits = async (t, search = 'uimastadion') => {
  const input = ReactSelector('InputBase');

  // Make new search
  await t
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/search`)
    .click(input)
    .pressKey('ctrl+a delete')
    .typeText(input, search)
    .pressKey('enter');

  // Get search list's data length
  const searchView = ReactSelector('SearchView');
  const unitCount = await searchView.getReact(({props}) => props.units.length);

  return unitCount;
}

test('Navigate search view ', async (t) => {
  // Test result orderer navigation
  const unitCount = await searchUnits(t);
  const input = ReactSelector('InputBase');
  let select =  ReactSelector('ResultOrderer Select');

  await t
    .typeText(input, 'kirjasto')
    .pressKey('tab') // Tabs to search icon button
    .pressKey('tab') // Narrow search
    .pressKey('tab') // Result orderer
    .expect(select.getReact(({props}) => props.value)).eql('match-desc')
    .pressKey('down')
    .expect(select.getReact(({props}) => props.value)).eql('alphabetical-desc')
    .pressKey('up')
    .expect(select.getReact(({props}) => props.value)).eql('match-desc');
  // Test result list navigation
  const firstSearchItems =  ReactSelector('TabLists ResultItem');
  const secondSearchItems = firstSearchItems.nth(1);

  await t
    .typeText(input, 'kirjasto')
    .pressKey('tab') // Tabs to search icon button
    .pressKey('tab') // Narrow search
    .pressKey('tab') // Result orderer
    .pressKey('tab') // First tab
    .pressKey('tab') // Tabs to first item in list
    .expect(firstSearchItems.focused).ok('Tab did move focus to first list item')
    .pressKey('tab')
    .expect(secondSearchItems.focused).ok('Tab did move focus to second list item')
    .pressKey('shift+tab')
    .expect(firstSearchItems.focused).ok('Tab did move focus back to first list item');

  // Test tabs navigation
  await searchUnits(t, 'kirjasto');
  const tabs =  ReactSelector('TabLists Tab');

  await t
    .click(tabs.nth(1));

  let services =  ReactSelector('TabLists ServiceItem');
  await t // Check that services exist
    .expect(services.count).gt(1)
    .click(tabs.nth(0));

  let units =  ReactSelector('TabLists UnitItem');
  await t // Check that units exist
    .expect(units.count).gt(1);

  await t
    .pressKey('tab')
    .expect(tabs.nth(1).focused).ok('Tab did move focus back to second tab item')
    .pressKey('enter');

  services =  ReactSelector('TabLists ServiceItem');
  await t // Check that units exist
    .expect(services.count).gt(1)
    .pressKey('shift+tab enter')
    .expect(tabs.nth(0).focused).ok('Tab did move focus back to first tab item');

  units =  ReactSelector('TabLists UnitItem');
  await t // Check that units exist
    .expect(units.count).gt(1)
});
test('Search does list results', async (t) => {
  // const unitCount = await searchUnits(t);
  const searchView = ReactSelector('SearchView')
  await t
    .expect(searchView.getReact(({props}) => props.units.length)).gt(5, `Search didn't get results`);
});

test('UnitItem click event takes to unit page', async(t) => {
  const tabs =  ReactSelector('TabLists Tab');
  const units =  ReactSelector('TabLists UnitItem');
  const id = await units.nth(0).getReact(({props}) => props.unit.id);
  const target = `http://${server.address}:${server.port}/fi/unit/${id}`;

  await t
    .click(units.nth(0))
    .navigateTo(target);
});

test('ServiceItem click event takes to service page', async(t) => {
  await searchUnits(t, 'kirjasto');
  const tabs =  ReactSelector('TabLists Tab');

  await t
    .click(tabs.nth(1));

  const services =  ReactSelector('TabLists ServiceItem');
  const id = await services.nth(0).getReact(({props}) => props.service.id);
  const target = `http://${server.address}:${server.port}/fi/service/${id}`;

  await t
    .click(services.nth(0))
    .navigateTo(target);
});
