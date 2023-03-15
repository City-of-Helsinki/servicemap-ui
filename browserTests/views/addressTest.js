/* eslint-disable */
import { Selector } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import config from '../config';
import { getLocation } from '../utility';

const { server } = config;
const testLocation = `http://${server.address}:${server.port}/fi/address/helsinki/Topeliuksenkatu 27`;

fixture`Address view test`
  .page`${testLocation}`
  .beforeEach(async () => {
    await waitForReact();
  });

test('AddressView does render correct view', async (t) => {
  const title = await ReactSelector('TitleBar').getReact(({props}) => props.title);
  const tab1 = await Selector('div[role="tablist"] button').nth(0).textContent;
  const tab2 = Selector('div[role="tablist"] button').nth(1);
  const divisions = ReactSelector('DivisionItem').count;
  const tab2Text = await tab2.textContent;
  
  await t
    .expect(title).eql('Topeliuksenkatu 27,  Helsinki')
    .expect(tab1).eql('Palvelualueet')
    .expect(tab2Text.indexOf('Lähellä')).eql(0, 'Tab text should include text "Lähellä"')
    .expect(divisions).gt(1, 'First tab should show divisions')
    .click(tab2)
  ;

  const units = await ReactSelector('UnitItem').count;
  await t
    .expect(units).gt(1, 'Closeby units tab should show unit items', { timeout: 4000 })
  ;
});

test('AddressView map renders correctly', async (t) => {
  const zoomOut = await Selector('.zoomOut');
  await t
    .click(zoomOut)
    .click(zoomOut)
    .wait(500)
  ;

  // By default administrative district tab should be open with unit markers
  let markers = await Selector('.unitMarker, .unitClusterMarker').count;
  await t
    .expect(markers).gt(1)
  ;

  // Change to nearby tab and expect markers to appear
  const closebyTab = await Selector('div[role="tablist"] button').nth(1);
  await t
    .click(closebyTab)
    .wait(500)
  ;
  markers = await Selector('.unitMarker, .unitClusterMarker').count;
  await t
    // Expect markers to appear
    .expect(markers).gt(1)
  ;
});

// TODO: update this test
// test('AddressView\'s area view link does take correct address to AreaView', async (t) => {
//   const areaViewLink = Selector('#areaViewLink');
//   const addressBar = Selector('#addressSearchbar')
//   const addressMarker = Selector('div[class*="leaflet-marker-icon"][class*="addressIcon"]')

//   await t
//     .click(areaViewLink)
//     .expect(getLocation()).contains('/fi/area')
//     .expect(addressBar.value).contains('Topeliuksenkatu 27,  Helsinki')
//     .expect(addressMarker.exists).ok('Address marker should be shown on map')
//   ;
// });

test('AddressView buttons work correctly', async (t) => {
  const buttons = Selector('#tab-content-0 ul button[role="link"]');
  const buttonTitleText = await buttons.nth(1).find('p[aria-hidden="true"]').textContent;
  const unitTitle = Selector('.TitleText');
  const backToAddressButton = Selector('#SearchBar .SMBackButton')

  await t
    .expect(buttons.count).gt(0, 'Service buttons should exist for AddressView')
  ;

  for(let i = 0; i < buttons.count; i++) {
    await t
      .click(buttons.nth(1))
      .expect(unitTitle.textContent).eql(buttonTitleText, 'Unit should have same title text as button')
      .click(backToAddressButton)
    ;
  }
});

// test('AddressView health station links work correctly', async (t) => {
//   const links = Selector('#tab-content-0 a');
//   const unitTitle = Selector('.TitleText');

//   await t
//     .click(links.nth(0))
//     .expect(getLocation()).contains('/fi/unit/62976')
//     .expect(unitTitle.textContent).contains('Uusi lastensairaala')
//     .navigateTo(testLocation)
//     .click(links.nth(1))
//     .expect(getLocation()).eql('https://www.hus.fi/potilaalle/sairaalat-ja-toimipisteet/uusi-lastensairaala')
//     .navigateTo(testLocation)
//     // .click(links.nth(2))
//     // .expect(getLocation()).contains('/fi/unit/26104')
//     // .expect(unitTitle.textContent).contains('Haarmanin sairaala')
//     // .navigateTo(testLocation)
//     .click(links.nth(2))
//     .expect(getLocation()).eql('https://www.hel.fi/fi/sosiaali-ja-terveyspalvelut/terveydenhoito/kiireellinen-hoito-ja-paivystys')
//     .navigateTo(testLocation)
//   ;
// });

test('AddressView nearby services tab works correctly', async (t) => {
  const tabNearbyUnits = Selector('button[role="tab"]').nth(1);
  const unitTitle = Selector('.TitleText');
  const listItems = Selector('#tab-content-1 li[role="link"]');
  const listItemTopRow = (listItem) => listItem.find('div[class*="ResultItem-topRow"] p[aria-hidden="true"]');
  const backToAddressButton = Selector('#SearchBar .SMBackButton')

  await t
    .click(tabNearbyUnits)
  ;

  const clickedItem = listItems.nth(5);
  const clickedItemText = await listItemTopRow(clickedItem).textContent;
  await t
    .click(clickedItem)
    .expect(unitTitle.textContent).eql(clickedItemText)
    .click(backToAddressButton)
  ;

  // Test pagination
  const firstUnitText = await listItemTopRow(listItems.nth(0)).textContent;
  const pagination = ReactSelector('PaginationComponent');
  const buttons = pagination.find('button');
  await t
  .expect(listItemTopRow(listItems.nth(0)).textContent).eql(firstUnitText, 'List items should change on pagination page change')
    .click(buttons.nth(1))
    .expect(getLocation()).contains('p=2')
    .expect(listItemTopRow(listItems.nth(0)).textContent).notEql(firstUnitText, 'List items should change on pagination page change')
  ;

});

