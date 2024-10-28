/* eslint-disable */
import { Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { acceptCookieConcent, getBaseUrl, getLocation } from '../utility';
import {
  addressSearchBarInput,
  cityDropdown,
  ESPOO_ORG,
  HELSINKI_ORG, mapToolsButton,
  mobilityDropdown,
  organisationDropdown,
  searchBarInput,
  sensesDropdown,
  setLocalStorageItem,
  settingChip,
  settingsMenuButton,
  settingsMenuPanel,
} from '../utility/pageObjects';
import paginationTest from '../utility/paginationTest';
import resultOrdererTest from '../utility/resultOrdererTest';

const searchPage = `${getBaseUrl()}/fi/search?q=kirjasto`;
const bathUrl = `${getBaseUrl()}/fi/search?q=maauimala`;
const embedBathUrl = `${getBaseUrl()}/fi/embed/search?q=maauimala&search_language=fi&show_list=side`;
const homePage= `${getBaseUrl()}/fi`
const resultItemTitle = Selector('[data-sm="ResultItemTitle"]');
const kumpulaBath = resultItemTitle.withText('Kumpulan maauimala');
const leppavaaraBath = resultItemTitle.withText('Leppävaaran maauimala');
const addressInput = Selector(addressSearchBarInput);

fixture`Search view test`
  .page`${searchPage}`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });

const searchUnits = async (t, search = 'uimastadion') => {
  // Make new search
  await t
    .expect(getLocation()).contains(`${getBaseUrl()}/fi/search`)
    .click(searchBarInput)
    .pressKey('ctrl+a delete')
    .typeText(searchBarInput, search, { replace: true })
    .pressKey('enter');
}

// Test result orderer
resultOrdererTest();

// Test pagination functionality
paginationTest(searchPage);

// Test result orderer
resultOrdererTest();

// Test pagination functionality
paginationTest(searchPage);

test('Navigate search view', async (t) => {
  // Test result orderer navigation
  const unitCount = await searchUnits(t, 'kirjasto');
  const select = Selector('[data-sm="ResultSorterInput"]')
  const listItems = Selector('#paginatedList-Toimipisteet-results li[role="link"]')

  const firstItemText = await listItems.nth(0).textContent;

  await t
    // .click(input)
    // .pressKey('ctrl+a delete')
    .typeText(searchBarInput, 't')
    .click(select)
    .pressKey('down')
    .pressKey('enter');

  const newFirstItemText = await listItems.nth(0).textContent;
  await t
    .expect(newFirstItemText).notEql(firstItemText)
  ;

  // Test result list navigation
  await t
    .typeText(searchBarInput, 't')
    .pressKey('tab') // Tabs to cancel button
    .pressKey('tab') // Tabs to search icon button
    .pressKey('tab') // Address search
    .pressKey('tab') // Address search clear
    .pressKey('tab') // hide settings
    .pressKey('tab') // sense settings
    .pressKey('tab') // mobility settings
    .pressKey('tab') // city settings
    .pressKey('tab') // organization settings
    .pressKey('tab') // Reset settings button
    .pressKey('tab') // Result orderer
    .pressKey('tab') // First tab
    // .pressKey('tab') // TODO should remove thin phantom tab press
    .pressKey('tab') // Tabs to first item in list
    .expect(listItems.nth(0).focused).ok('Tab did move focus to first list item')
    .pressKey('tab')
    .expect(listItems.nth(1).focused).ok('Tab did move focus to second list item')
    .pressKey('shift+tab')
    .expect(listItems.nth(0).focused).ok('Tab did move focus back to first list item');

});

test('Tab navigation works correctly', async (t) => {
  // Test tabs navigation
  await searchUnits(t, 'kirjasto');
  const tabs =  Selector('div[role="tablist"] button[role="tab"]');
  const services =  Selector('#paginatedList-Palvelut-results li[role="link"]');
  const units =  Selector('#paginatedList-Toimipisteet-results li[role="link"]');

  await t
    // Check that clicks work correctly
    .click(tabs.nth(1))
    // Check that services exist
    .expect(services.count).gt(1)
    .click(tabs.nth(0))
    // Check that units exist
    .expect(units.count).gt(1)

    // Check that keyboard navigation works correctly
    // Check that right tab (services tab) works correctly
    .pressKey('right')
    .expect(tabs.nth(1).focused).ok('Right arrow did move focus to second tab item')
    .pressKey('enter')
    .pressKey('tab')
    .expect(services.count).gt(1)
    .expect(services.nth(0).focused).ok('Tab should move focus to first list item')
    .pressKey('shift+tab')
    .expect(tabs.nth(1).focused).ok('Shift+tab should move focus back to second tab')

    // Check that first tab (units tab) works correctly
    .pressKey('left')
    .expect(tabs.nth(0).focused).ok('Left arrow should move focus back to first tab')
    .pressKey('enter')
    .pressKey('tab')
    .expect(units.count).gt(1)
    .expect(units.nth(0).focused).ok('Tab should move focus to first list item')
    .pressKey('shift+tab')
    .expect(tabs.nth(0).focused).ok('Shift+tab should move focus back to second tab'); // Check that units exist
})

test('Search does list results', async (t) => {
  const resultList = ReactSelector('ResultList')
  await t
    .expect(resultList.getReact(({props}) => props.resultCount)).gt(0, `Search didn't get results`);
});

// Check that address search works and draws marker on map
test('Address search does work', async (t) => {
  await searchUnits(t, 'kirjasto');
  const suggestions = Selector('#address-results div[role="option"]');
  const marker = Selector('div[class*="MarkerIcon"]');
  const distanceText = Selector('div[data-sm="ResultItemRightColumn"]');

  await t
    .typeText(addressInput, 'mannerheimintie')
    .expect(suggestions.count).gt(0) // Expect address suggestions to render
    .pressKey('enter')
    .expect(marker.count).eql(1) // Expect usermarker to exist
    .expect(distanceText.count).gt(0) // Expect distance text elements to render
    .expect(distanceText.nth(0).innerText).ok() //Expect distance element innerText to exist
  ;
});

// TODO: update this test
// test('UnitItem click event takes to unit page', async(t) => {
//   const units =  Selector('#paginatedList-Toimipisteet-results li[role="link"]');
//   const name = await units.nth(0).find('p[role="textbox"]').textContent;
//   const unitTitleSelector = Selector('.TitleText');

//   await t
//     .click(units.nth(0))
//     .expect(unitTitleSelector.textContent).eql(name);
// });

test('ServiceItem click event takes to service page', async(t) => {
  await searchUnits(t, 'kirjasto');
  const tabs =  Selector('div[role="tablist"] button[role="tab"]');
  const services =  Selector('#paginatedList-Palvelut-results li[role="link"]');
  const serviceTitleSelector = Selector('.TitleText');

  await t
    .click(tabs.nth(1));

  const serviceName = await services.nth(0).textContent;

  await t
    .click(services.nth(0));
  const serviceTitle = await serviceTitleSelector.textContent;
  await t
    .expect(serviceTitle.toLowerCase()).eql(serviceName.toLowerCase())
  ;
});

test('SearchBar accessibility is OK', async(t) => {

  // Check searchbar input accessibility attributes
  const searchbar = await searchBarInput;
  const role = await searchbar.getAttribute('role');
  const placeholder = await searchbar.getAttribute('placeholder');
  await t
    // We expect input to have combobox value because input opus
    .expect(role).eql('combobox', 'SearchBar input should have combobox role')
    // We expect placeholder to be empty because text in search input field is no good for accessibility
    .expect(placeholder).notOk('SearchBar input should not have placeholder text');

  // Check search suggestion accessibility
  await t
    // Click search input to activate suggestions
    .click(searchbar);

  // Check that suggestions have correct accessibility attributes
  const suggestion = Selector('#SuggestionList li');
  await t
    // We expect suggestions to open on searchbar click
    .expect(suggestion.exists).ok('Suggestions should appear on search input activation')
    // We expect suggestion list items to have link role
    .expect(suggestion.getAttribute('role')).eql('option', 'Suggestion should be considered option');
});

test('ResultList accessibility attributes are OK', async(t) => {
  // Check that result list items have correct accessibility attributes
  const result =  await Selector('#paginatedList-Toimipisteet-results li[role="link"]').nth(0);
  const resultRole = await result.getAttribute('role');
  const resultTabindex = await result.getAttribute('tabindex');
  const resultImageAria = await result.find('img').getAttribute('aria-hidden');

  // console.log(resultTitle, resultDistance);
  await t
    // We expect UnitItem role to be link
    .expect(resultRole).eql('link', 'UnitItem should have role=link')
    // We expect UnitItem tabindex to be 0
    .expect(resultTabindex).eql('0', 'UnitItem should have tabindex=0')
    // We expect UnitItem logo image aria-hidden to be true
    .expect(resultImageAria).eql('true', 'UnitItem image icon should be aria-hidden')

  const resultSRText = await result.find('p').nth(0); // .innerText;
  await t
    // We expect UnitItem screen reader text to exist
    .expect(resultSRText.hasClass('ResultItem-srOnly')).ok('Expected UnitItem srOnly text to have class ResultItem-srOnly')
    // We expect UnitItem screen reader text to have actual text
    .expect(resultSRText.innerText).ok('Expected ResultItem-srOnly to have text for screen readers');

  const resultTitle = await result.find('p').nth(1); // .getAttribute('aria-hidden');
  await t
  // We expect UnitItem title text to exist
    .expect(resultTitle.hasClass('ResultItem-title')).ok('Expected distance text to have class ResultItem-title')
    // We expect UnitItem title text to be hidden from screen readers
    .expect(resultTitle.getAttribute('aria-hidden')).eql('true');

/**
 * TODO: Figure out a way to test ResultItem in isolation in order to guarantee
 * values for subtitle and distance texts. Otherwise these nodes don't exist in DOM

  const resultSubtitle = await result.findReact('p').nth(2); // .getAttribute('aria-hidden');
  await t
    .expect(resultSubtitle.hasClass('ResultItem-subtitle')).ok('Expected subtitle text to have class ResultItem-distance')
    .expect(resultSubtitle.getAttribute('aria-hidden')).eql('true');

  const resultDistance = await result.findReact('p').nth(3); // .getAttribute('aria-hidden');
  console.log(await resultDistance.classNames);
  await t
    .expect(resultDistance.hasClass('ResultItem-distance')).ok('Expected distance text to have class ResultItem-distance')
    .expect(resultDistance.getAttribute('aria-hidden')).eql('true');

*/
});

// test('SuggestionButton accessibility attributes are OK', async(t) => {
//     // Check that ExapndSuggestions has correct accessibility attributes
//     const expandedSuggestionsButton = await Selector('#ExpandSuggestions');
//     const esbRole = await expandedSuggestionsButton.getAttribute('role')
//     await t
//       // We expect ExpandedSearchButton to have role link since it takes to another view 
//       .expect(esbRole).eql('link', 'ExpandedSearchButton should be considered a link');
// });

test('Tabs accessibility attributes are OK', async(t) => {
  const tabs =  Selector('div[role="tablist"] button[role="tab"]');
  const tab1 = await tabs.nth(0);
  const tab2 = await tabs.nth(1);

  await t
    .expect(tab1.getAttribute('aria-label')).ok('Aria label should exists for tab element')
    .expect(tab2.getAttribute('aria-label')).ok('Aria label should exists for tab element')
  ;
});


test.skip('Search suggestion arrow navigation does loop correctly', async(t) => {
  const expectedBoxShadowColor = 'rgb(71, 131, 235)'; // Focus color
  // Suggestion items selector
  const items = Selector('#SuggestionList li[role="option"]');
  // Get SearchBar input
  await t
    .click(searchBarInput)
    .expect(Selector('[data-cm="SuggestionsLoading"]').exists).notOk()
    .expect(items.exists).ok()
    .expect(items.count).gt(0)
    .pressKey('down');

  let maxItemCount = await items.count;
  await t
    // After first key down we expect focused suggestion to be at first item
    .expect(items.nth(0).getStyleProperty('box-shadow')).contains(expectedBoxShadowColor, 'Focused suggestion index should be set to first item')
    .pressKey('up')
    // After pressing key up on first item expect focused suggestion to loop to last item
    .expect(items.nth(maxItemCount - 1).getStyleProperty('box-shadow')).contains(expectedBoxShadowColor, 'Focused suggestion index should loop to last item')
    .pressKey('down')
    // After pressing key down on last item expect focused suggestion to loop to first item
    .expect(items.nth(0).getStyleProperty('box-shadow')).contains(expectedBoxShadowColor, 'Focused suggestion index should loop to first item');
});

// TODO: update this test
// test('Search suggestion click works correctly', async(t) => {

//   // Make new search
//   await t
//     .expect(getLocation()).contains(`${getBaseUrl()}/fi/search`)
//     .click(searchBarInput)
//     .pressKey('ctrl+a delete')
//     .typeText(input, 'kirjastoa');

//   const items = ReactSelector('SuggestionItem');
//   const clickedItem = await items.nth(0);
//   const text = await clickedItem.getReact(({props}) => props.fullQuery);
//   await t
//     .click(clickedItem)
//     .expect(getLocation()).contains(`${getBaseUrl()}/fi/search?q=${text}`)
    
// });
const orgChips = Selector(`${organisationDropdown} ${settingChip}`)
const cityChips = Selector(`${cityDropdown} ${settingChip}`);

fixture`Search view custom url with city and org param test`
  .page`${homePage}`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });


test('Should override municipality settings by url', async(t) => {
  // the city in url should overwrite settings made by user (and save setting)
  await setLocalStorageItem('SM:espoo', true);
  await t
    .navigateTo(bathUrl)
    .expect(cityChips.count).eql(1)
    .expect(cityChips.textContent).eql('Espoo')
    .expect(leppavaaraBath.exists).ok('Should find bath in Espoo')
    .expect(kumpulaBath.exists).notOk('Should hide baths of Helsinki')
    .navigateTo(`${bathUrl}&city=helsinki`)
    .expect(cityChips.count).eql(1)
    .expect(cityChips.textContent).eql('Helsinki')
    .expect(kumpulaBath.exists).ok('Should find bath in Helsinki')
    .expect(leppavaaraBath.exists).notOk('Should hide baths of Espoo')
    .navigateTo(`${bathUrl}&city=espoo`)
    .expect(cityChips.count).eql(1)
    .expect(cityChips.textContent).eql('Espoo')
    .expect(leppavaaraBath.exists).ok('Should find bath in Espoo')
    .expect(kumpulaBath.exists).notOk('Should hide baths of Helsinki')
  ;
});

test('Should not mess up city settings between embedded and normal view', async(t) => {
  await setLocalStorageItem('SM:espoo', true);
  await t
    .navigateTo(`${embedBathUrl}`)
    .expect(kumpulaBath.exists).ok('Should find bath in Helsinki')
    .expect(leppavaaraBath.exists).ok('Should hide baths in Espoo')
    .navigateTo(`${embedBathUrl}&city=espoo`)
    .expect(kumpulaBath.exists).notOk('Should not find baths in Helsinki')
    .expect(leppavaaraBath.exists).ok('Should find baths in Espoo')
    .navigateTo(`${embedBathUrl}&city=helsinki`)
    .expect(kumpulaBath.exists).ok('Should find baths in Helsinki')
    .expect(leppavaaraBath.exists).notOk('Should not find baths in Espoo')
    // Returning to normal mode, the visit to embedding should not mess up previous settings
    .navigateTo(`${bathUrl}`)
    .expect(kumpulaBath.exists).notOk('Should not find bath in Helsinki')
    .expect(leppavaaraBath.exists).ok('Should find bath in Espoo')
  ;
});

test('Should override organization settings by url', async(t) => {
  await setLocalStorageItem(`SM:${ESPOO_ORG}`, true);
  // the organization in url should overwrite settings made by user (and save setting)
  await t
    .navigateTo(`${bathUrl}`)
    .expect(orgChips.count).eql(1)
    .expect(orgChips.textContent).eql('Espoon kaupunki')
    .expect(leppavaaraBath.exists).ok('Should find bath of Espoo org')
    .expect(kumpulaBath.exists).notOk('Should hide baths of Helsinki org')
    .navigateTo(`${bathUrl}&organization=${HELSINKI_ORG}`)
    .expect(orgChips.count).eql(1)
    .expect(orgChips.textContent).eql('Helsingin kaupunki')
    .expect(kumpulaBath.exists).ok('Should find bath of Helsinki org')
    .expect(leppavaaraBath.exists).notOk('Should hide baths of Espoo org')
    .navigateTo(`${bathUrl}&organization=${ESPOO_ORG}`)
    .expect(orgChips.count).eql(1)
    .expect(orgChips.textContent).eql('Espoon kaupunki')
    .expect(leppavaaraBath.exists).ok('Should find bath of Espoo org')
    .expect(kumpulaBath.exists).notOk('Should hide baths of Helsinki org')
  ;
});

test('Should not mess up organization settings between embedded and normal view', async(t) => {
  await setLocalStorageItem(`SM:${ESPOO_ORG}`, true);
  await t
    .navigateTo(`${embedBathUrl}`)
    .expect(kumpulaBath.exists).ok('Should find bath of Helsinki org')
    .expect(leppavaaraBath.exists).ok('Should hide baths of Espoo org')
    .navigateTo(`${embedBathUrl}&organization=${ESPOO_ORG}`)
    .expect(kumpulaBath.exists).notOk('Should not find baths of Helsinki org')
    .expect(leppavaaraBath.exists).ok('Should find baths of Espoo org')
    .navigateTo(`${embedBathUrl}&organization=${HELSINKI_ORG}`)
    .expect(kumpulaBath.exists).ok('Should find baths of Helsinki org')
    .expect(leppavaaraBath.exists).notOk('Should not find baths of Espoo org')
    // Returning to normal mode, the visit to embedding should not mess up previous settings
    .navigateTo(`${bathUrl}`)
    .expect(kumpulaBath.exists).notOk('Should not find bath of Helsinki org')
    .expect(leppavaaraBath.exists).ok('Should find bath of Espoo org')
  ;
});


fixture`Search view custom url with accessibility param test`
  .page`${homePage}`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });


test('Should override accessibility settings', async(t) => {
  await setLocalStorageItem(`SM:hearingAid`, true);
  const senseChips = Selector(settingsMenuPanel).find(`${sensesDropdown} ${settingChip}`);
  const mobilityInput = Selector(settingsMenuPanel).find(`${mobilityDropdown} input`);
  await t
    .navigateTo(`${bathUrl}&accessibility_setting=visual_impairment,reduced_mobility,colour_blind`)
    .click(settingsMenuButton)
    .expect(senseChips.count).eql(2)
    .expect(senseChips.withText('Minun on vaikea erottaa värejä').exists).ok()
    .expect(senseChips.withText('Olen näkövammainen').exists).ok()
    .expect(mobilityInput.value).eql('Olen liikkumisesteinen')
    .navigateTo(`${bathUrl}&accessibility_setting=`)
    .click(settingsMenuButton)
    .expect(senseChips.exists).notOk()
    .expect(mobilityInput.value).eql('')
  ;
});

fixture`Search view should set settings to url test`
  .page`${homePage}`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });


test('Should set user settings to url', async(t) => {
  // Use local storage as dropdowns are flaky
  await setLocalStorageItem(`SM:hearingAid`, true);
  await setLocalStorageItem(`SM:mobility`, 'rollator');
  await setLocalStorageItem(`SM:${ESPOO_ORG}`, true);
  await setLocalStorageItem('SM:helsinki', true);
  await setLocalStorageItem('SM:kauniainen', true);
  const senseChips = Selector(`${sensesDropdown} ${settingChip}`);
  const mobilityInput = Selector(`${mobilityDropdown} input`);
  await t
    .navigateTo(`${bathUrl}`)
    // Check settings
    .expect(senseChips.count).eql(1)
    .expect(senseChips.withText('Käytän kuulolaitetta').exists).ok()
    .expect(mobilityInput.value).eql('Käytän rollaattoria')
    .expect(cityChips.count).eql(2)
    .expect(cityChips.withText('Helsinki').exists).ok()
    .expect(cityChips.withText('Kauniainen').exists).ok()
    .expect(orgChips.count).eql(1)
    .expect(orgChips.withText('Espoon kaupunki').exists).ok()
    // Check url
    .expect(getLocation()).contains('city=helsinki%2Ckauniainen')
    .expect(getLocation()).contains('organization=520a4492-cb78-498b-9c82-86504de88dce')
    .expect(getLocation()).contains('accessibility_setting=hearing_aid%2Crollator')
  ;
});

fixture`Search view should set home address with url test`
  .page`${homePage}/search?q=maauimala&hcity=helsinki&hstreet=Annankatu+12`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });

// test('Should set home address from url', async(t) => {
//   await t
//     .expect(addressInput.value).contains('Annankatu 12')
//     .expect(addressInput.value).contains('Helsinki')
//   ;
// });

fixture`Search view should set map type with url test`
  .page`${homePage}/search?q=maauimala&hcity=helsinki&map=guidemap`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });

test('Should set map type from url', async(t) => {
  await t
    .click(mapToolsButton)
    .expect(Selector('#servicemap-map-type-radio').checked).eql(false)
    .expect(Selector('#ortographic-map-type-radio').checked).eql(false)
    .expect(Selector('#guidemap-map-type-radio').checked).eql(true)
    .expect(Selector('#accessible_map-map-type-radio').checked).eql(false)
    .navigateTo(`${homePage}/search?q=maauimala&hcity=helsinki&map=ortographic`)
    .click(mapToolsButton)
    .expect(Selector('#servicemap-map-type-radio').checked).eql(false)
    .expect(Selector('#ortographic-map-type-radio').checked).eql(true)
    .expect(Selector('#guidemap-map-type-radio').checked).eql(false)
    .expect(Selector('#accessible_map-map-type-radio').checked).eql(false)
    .navigateTo(`${homePage}/search?q=maauimala&hcity=helsinki&map=accessible_map`)
    .click(mapToolsButton)
    .expect(Selector('#servicemap-map-type-radio').checked).eql(false)
    .expect(Selector('#ortographic-map-type-radio').checked).eql(false)
    .expect(Selector('#guidemap-map-type-radio').checked).eql(false)
    .expect(Selector('#accessible_map-map-type-radio').checked).eql(true);
});
