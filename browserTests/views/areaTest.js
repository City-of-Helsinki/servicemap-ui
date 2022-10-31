/* eslint-disable */
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { Selector } from 'testcafe';

import config from '../config';
import { getLocation } from '../utility';
const { server } = config;

fixture`Area view test`
  .page`http://${server.address}:${server.port}/fi/area`
  .beforeEach(async () => {
    await waitForReact();
  });

const drawerButtons = ReactSelector('ServiceTab SMAccordion');
const radioButtons = ReactSelector('DistrictToggleButton');
const accordions = ReactSelector('SMAccordion');

// Get inner accordions for given element
// Expects ReactSelector element as second parameter
const openInnerAccordion = async (t, element) => {
  const clickedAccordion = element.child().findReact('SMAccordion').nth(0);
  await t
    .click(clickedAccordion)
  ;
  return clickedAccordion;
}

// Open statistical totals section in area view
const openStatisticalTotals = async (t) => {
  const statisticalAccordion = accordions.nth(2);
  await t
    .click(statisticalAccordion)
  ;
  const ageAccordion = await openInnerAccordion(t, statisticalAccordion);
  const totalAccordion = await openInnerAccordion(t, ageAccordion);

  return totalAccordion;
}

test('District lists are fetched and rendered correctly', async (t) => {
  const rootAccordionLength = await accordions.count;

  await t
    .expect(rootAccordionLength).eql(3, 'Expect 3 accordions to exist for each section in AreaView')
    .click(accordions.nth(0));
    
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
    .click(accordions.nth(0))
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

  await t
    .click(accordions.nth(0))
    .click(drawerButtons.nth(0))
    .click(radioButtons.nth(0).child())
    .expect(unitList.childElementCount).gt(0, 'No units listed for selected district')
    .click(unitList.child())
    .expect(getLocation()).contains(`${server.address}:${server.port}/fi/unit`);
})

// TODO: update this test
// test('Address search bar field updates and gets results', async (t, inputText = 'mann') => {
//   const addressBar = Selector('#addressSearchbar')
//   const suggestions = Selector('#address-results div[role="option"]');

//   await t
//     .typeText(addressBar, inputText)
//     .expect(suggestions.count).gt(0)

//   const suggestion = suggestions.nth(0);
//   const suggestionText = await suggestion.textContent;

//   await t
//     .pressKey('down')
//     .pressKey('enter')
//     .expect(addressBar.value).eql(suggestionText, 'Address search bar did not update text when suggesttion was selected');
// });

// TODO: fix this unstable test
// test('Embeder tool does not crash area view', async (t) => {
//   const toolMenuButton = Selector('#ToolMenuButton')
//   const toolMenu = Selector('#ToolMenuPanel')
//   const closeEmbedderButton = Selector('button[class*="closeButton"]')
//   await t
//     .click(toolMenuButton)
//     .click(toolMenu.child(0))
//     .click(closeEmbedderButton)
//     .expect(toolMenuButton.exists).ok('Area view was not rendered correctly')
// });

test('Statistical areas accordions open correctly', async (t) => {
  const totalAccordion = await openStatisticalTotals(t);

  const innerAccordions = totalAccordion.child().findReact('SMAccordion');
  const cityAccordions = totalAccordion.child().find('#StatisticalCityList').findReact('SMAccordion');
  const serviceAccordion = await innerAccordions.nth(0);
  const helsinkiAccordion = await cityAccordions.nth(0);
  await t
    .expect(cityAccordions.count).gt(0, 'Statistical section should show city accordions')
    .expect(serviceAccordion.find('button').getAttribute('disabled')).eql('', 'Expect service button disabled attribute to exist')
    .click(helsinkiAccordion.find('input[type="checkbox"]').nth(0))
    .expect(serviceAccordion.find('button').getAttribute('disabled')).notOk()
    .click(serviceAccordion)
  ;

  const serviceListAccordions = serviceAccordion.child().findReact('SMAccordion');
  await t
    .expect(serviceListAccordions.count).gt(0, 'Service list should have accordion elements', { timeout: 8000 })
    .click(serviceListAccordions.nth(0).find('input[type="checkbox"]'))
    .click(serviceListAccordions.nth(0).find('button'))
  ;
  
  const unitItems = serviceListAccordions.nth(0).child().findReact('ResultItem');
  await t
    .expect(unitItems.count).gt(0)
  ;
})

test('Statistical area district selection works correctly', async (t) => {
  const totalAccordion = await openStatisticalTotals(t);

  const serviceButton = await totalAccordion.child().findReact('SMAccordion').nth(0).find('button');
  // const innerAccordions = totalAccordion.child().findReact('SMAccordion');
  const cityAccordions = totalAccordion.child().find('#StatisticalCityList').findReact('SMAccordion');
  const firstCityAreaCheckbox = cityAccordions.nth(0).find('div').nth(1).find('.MuiCollapse-root input[type="checkbox"]');
  const firstCityCheckbox = cityAccordions.nth(0).find('input[type="checkbox"]');

  await t
    .click(cityAccordions.nth(0))
    .click(firstCityAreaCheckbox.nth(0))
    .expect(serviceButton.getAttribute('disabled')).notOk('Expect service button to be active while selections exist')
    // Test indeterminate functionality
    .expect(firstCityCheckbox.getAttribute('data-indeterminate')).eql('true')
    .click(firstCityCheckbox)
    .expect(firstCityCheckbox.getAttribute('data-indeterminate')).eql('false')
    .click(firstCityCheckbox) // Remove selection
    .expect(serviceButton.getAttribute('disabled')).eql('', 'Expect service button disabled attribute to exist while no selections')

    // Test keyboard functionality
    .pressKey('shift+tab')
    .pressKey('tab')
    .expect(firstCityCheckbox.focused).ok('City checkbox should be focused')
    .pressKey('tab') // Go to city button
    .pressKey('tab') // Go to first district checkbox
    .expect(firstCityCheckbox.focused).notOk('City should not be focused anymore')
    .expect(firstCityAreaCheckbox.focused).ok() // First area checkbox should be focused
    .expect(firstCityCheckbox.getAttribute('data-indeterminate')).eql('false') // City checkbox shouldn't be indeterminate
    .pressKey('space') // Select first district in first city
    .expect(serviceButton.getAttribute('disabled')).notOk('Expect service button to be active while selections exist')
    .expect(firstCityCheckbox.getAttribute('data-indeterminate')).eql('true') // City checkbox should be indeterminate
    .pressKey('shift+tab') // Return to city button
    .pressKey('shift+tab') // Return to city checkbox
    .expect(firstCityCheckbox.focused).ok() // City checkbox should be focused
    .pressKey('enter') // Select city
    .pressKey('enter') // Remove selection
    .expect(serviceButton.getAttribute('disabled')).eql('', 'Expect service button disabled attribute to exist while no selections')

  ;
});

