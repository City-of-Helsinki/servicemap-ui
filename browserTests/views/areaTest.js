/* eslint-disable */
import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import { getBaseUrl, getLocation } from '../utility';
import {
  accordionSelector,
  addressSearchBarInput,
  embedderToolButton,
  embedderToolCloseButton,
  mapToolsButton,
} from '../utility/pageObjects';

fixture`Area view test`
  .page`${getBaseUrl()}/fi/area`
  .beforeEach(async () => {
    await waitForReact();
  });

const drawerButtons = Selector('[data-sm="ServiceTabComponent"]').find(accordionSelector);
const radioButtons = Selector('[data-sm="DistrictToggleButton"]');
const accordions = Selector(accordionSelector);
const unitList = Selector('[data-sm="DistrictUnits"]');

// Get inner accordions for given element
// Expects ReactSelector element as second parameter
const openInnerAccordion = async (t, element) => {
  const clickedAccordion = element.child().find(accordionSelector).nth(0);
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
  await t
    .expect(accordions.count).eql(3, 'Expect 3 accordions to exist for each section in AreaView')
    .click(accordions.nth(0));
    
  await t
    .expect(drawerButtons.count).gt(0, 'No district buttons rendered')
  const listLength = await drawerButtons.count;

  for(let i = 0; i < listLength; i++) {  
    await t 
      .click(drawerButtons.nth(i))

    const districtList = Selector('[data-sm="DistrictList"]')

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

  const districtDataTitle = Selector('[data-sm="DistrictUnitsTitle"]');

  let districtCount = (await districtDataTitle.innerText).match(/\d+/)[0];
  await t
    .expect(parseInt(districtCount, 10)).gt(0, 'Data not set correctly to Districts component')
    .expect(districtDataTitle.innerText).eql(`Toimipisteet listana (${districtCount})`);

  const firstNameSelector = unitList.find('[data-sm="DivisionItemName"]').nth(0);
  const firstName = await firstNameSelector.innerText;

    // Select another radio button to see if data changes
  await t
    .click(radioButtons.nth(1).child());
  districtCount = (await districtDataTitle.innerText).match(/\d+/)[0];
  await t
    .expect(parseInt(districtCount, 10)).gt(0, 'Data not set correctly to Districts component')
    .expect(districtDataTitle.innerText).eql(`Toimipisteet listana (${districtCount})`)
    .expect(firstNameSelector.innerText).notEql(firstName);
})

test('Unit list functions correctly' , async (t) => {

  await t
    .click(accordions.nth(0))
    .click(drawerButtons.nth(0))
    .click(radioButtons.nth(0).child())
    .expect(unitList.childElementCount).gt(0, 'No units listed for selected district')
    .click(unitList.child())
    .expect(getLocation()).contains(`${getBaseUrl()}/fi/unit`);
})

// TODO Flaky test, suggestion list loses focus
test.skip('Address search bar field updates and gets results', async (t, inputText = 'mann') => {
  const addressBar = Selector(addressSearchBarInput)
  const suggestions = Selector('#address-results div[role="option"]');

  await t
    .typeText(addressBar, inputText)
    .expect(suggestions.count).gt(0)

  const suggestion = suggestions.nth(0);
  const suggestionText = await suggestion.textContent;

  await t
    .expect(suggestions.count).gt(0)
    .pressKey('down')
    .expect(Selector('[data-sm="AddressSuggestion"].Mui-selected').exists).ok()
    .pressKey('enter')
    .expect(addressBar.value).eql(suggestionText, 'Address search bar did not update text when suggestion was selected');
});

test('Embeder tool does not crash area view', async (t) => {
  await t
    .click(mapToolsButton)
    .click(embedderToolButton)
    .click(embedderToolCloseButton)
    .expect(Selector('[data-sm="AreaView"]').exists).ok('Area view was not rendered correctly')
    .expect(mapToolsButton.exists).ok('Area view was not rendered correctly')
    .expect(accordions.count).eql(3, 'Expect 3 accordions to exist for each section in AreaView')
});

// TODO turn of the year
test.skip('Statistical areas accordions open correctly', async (t) => {
  const totalAccordion = await openStatisticalTotals(t);

  const innerAccordions = totalAccordion.child().find(accordionSelector);
  const cityAccordions = totalAccordion.child().find('#StatisticalCityList').find(accordionSelector);
  const serviceAccordion = await innerAccordions.nth(0);
  const helsinkiAccordion = await cityAccordions.nth(0);
  await t
    .expect(cityAccordions.count).gt(0, 'Statistical section should show city accordions')
    .expect(serviceAccordion.find('button').getAttribute('disabled')).eql('', 'Expect service button disabled attribute to exist')
    .click(helsinkiAccordion.find('input[type="checkbox"]').nth(0))
    .expect(serviceAccordion.find('button').getAttribute('disabled')).notOk()
    .click(serviceAccordion)
  ;

  const serviceListAccordions = serviceAccordion.child().find(accordionSelector);
  await t
    .expect(serviceListAccordions.count).gt(0, 'Service list should have accordion elements', { timeout: 8000 })
    .click(serviceListAccordions.nth(0).find('input[type="checkbox"]'))
    .click(serviceListAccordions.nth(0).find('button'))
  ;
  
  const unitItems = serviceListAccordions.nth(0).child().find('[data-sm="ResultItemComponent"]');
  await t
    .expect(unitItems.count).gt(0)
  ;
})

// TODO turn of the year
test.skip('Statistical area district selection works correctly', async (t) => {
  const totalAccordion = await openStatisticalTotals(t);

  const serviceButton = await totalAccordion.child().find(accordionSelector).nth(0).find('button');
  const cityAccordions = totalAccordion.child().find('#StatisticalCityList').find(accordionSelector);
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
    .pressKey('space') // Select city
    .pressKey('space') // Remove selection
    .expect(serviceButton.getAttribute('disabled')).eql('', 'Expect service button disabled attribute to exist while no selections')

  ;
});

