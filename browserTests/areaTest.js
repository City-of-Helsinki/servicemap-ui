/* eslint-disable */
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { ClientFunction, Selector } from 'testcafe';

import config from './config';
const { server } = config;

fixture`Area view test`
  .page`http://${server.address}:${server.port}/fi/area`
  .beforeEach(async () => {
    await waitForReact();
  });

const drawerButtons = ReactSelector('ServiceTab SMAccordion');
const radioButtons = ReactSelector('DistrictToggleButton');

test('District lists are fetched and rendered correctly', async (t) => {
  const listLength = await drawerButtons.count;

  await t
    .expect(listLength).gt(0, 'No district buttons rendered')

  for(let i = 0; i < listLength; i++) {  
    await t 
      .click(drawerButtons.nth(i))

    const districtList = Selector('.districtList')

    await t
      .expect(districtList.exists).ok('District list not rendered correctly')
      .expect(districtList.childElementCount).gt(0, `Category ${i} did not receive children`)
      .click(drawerButtons.nth(i))
  }
})  

test('District selection is updated' , async (t) => {
  // Select radio button to see if data to draw on map on Districts component changes
  await t
    .click(drawerButtons.nth(0))
    .click(radioButtons.nth(0).child())

  const districtDataLength = ReactSelector('Districts').getReact(({props}) => props.districtData.length);
  const secondButton = radioButtons.nth(1);

  await t
    .expect(await districtDataLength).gt(0, 'Data not set correctly to Districts component')
    // Select another radio button to see if data changes
    .click(secondButton.child())

  const districtDataType = ReactSelector('Districts').getReact(({props}) => props.districtData[0].type);

  await t
    .expect(await secondButton.getAttribute('id')).eql(await districtDataType, 'Data not updated correctly to Districts component')
})

test('Unit list functions correctly' , async (t) => {
  const unitList = Selector('.districtUnits')
  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click(drawerButtons.nth(0))
    .click(radioButtons.nth(0).child())
    .expect(unitList.childElementCount).gt(0, 'No units listed for selected district')
    .click(unitList.child())
    .expect(getLocation()).contains(`${server.address}:${server.port}/fi/unit`);
})

test('Address search bar field updates and gets results', async (t, inputText = 'mann') => {
  const addressBar = Selector('#addressSearchbar')
  const suggestions = Selector('#address-results div[role="option"]');

  await t
    .typeText(addressBar, inputText)
    .expect(suggestions.count).gt(0)

  const suggestion = suggestions.nth(0);
  const suggestionText = await suggestion.textContent;

  await t
    .pressKey('down')
    .pressKey('enter')
    .expect(addressBar.value).eql(suggestionText, 'Address search bar did not update text when suggesttion was selected');
});

test.only('Embeder tool does not crash area view', async (t) => {
  const toolMenuButton = Selector('#ToolMenuButton')
  const toolMenu = Selector('#ToolMenuPanel')
  const closeEmbedderButton = Selector('button[class*="closeButton"]')
  await t
    .click(toolMenuButton)
    .click(toolMenu.child(0))
    .click(closeEmbedderButton)
    .expect(toolMenuButton.exists).ok('Area view was not rendered correctly')
});

