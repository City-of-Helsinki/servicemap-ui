/* eslint-disable */
import { Selector } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { viewTitleID } from '../../src/utils/accessibility';

import config from '../config';
import { getLocation } from '../utility';
import paginationTest from '../utility/paginationTest';
import resultOrdererTest from '../utility/resultOrdererTest';
const { server } = config;

const searchPage = `http://${server.address}:${server.port}/fi/search?q=kirjasto`;

fixture`Search view test`
  .page`${searchPage}`
  .beforeEach(async () => {
    await waitForReact();
  });

const searchUnits = async (t, search = 'uimastadion') => {
  const input = Selector('#SearchBar input');

  // Make new search
  await t
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/search`)
    .click(input)
    .pressKey('ctrl+a delete')
    .typeText(input, search)
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
  const input = Selector('#SearchBar input');
  let select = Selector('#result-sorter')
  const listItems = Selector('#paginatedList-Toimipisteet-results li[role="link"]')

  const firstItemText = await listItems.nth(0).textContent;

  await t
    // .click(input)
    // .pressKey('ctrl+a delete')
    .typeText(input, 't')
    .pressKey('tab') // Tabs to cancel button
    .pressKey('tab') // Tabs to search icon button
    .pressKey('tab') // Result orderer
    .pressKey('down')
  ;
  const newFirstItemText = await listItems.nth(0).textContent;
  await t
    .expect(newFirstItemText).notEql(firstItemText)
  ;

  // Test result list navigation
  await t
    .typeText(input, 't')
    .pressKey('tab') // Tabs to cancel button
    .pressKey('tab') // Tabs to search icon button
    .pressKey('tab') // Result orderer
    .pressKey('tab') // First tab
    .pressKey('tab') // Address search
    .pressKey('tab') // Address search clear
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
  const addressInput = Selector('#addressSearchbar');
  const suggestions = Selector('#address-results div[role="option"]');
  const marker = Selector('div[class*="userMarker"]');
  const distanceText = Selector('div[class*="ResultItem-rightColumn"]');

  await t
    .typeText(addressInput, 'mannerheimintie')
    .expect(suggestions.count).gt(0) // Expect address suggestions to render
    .pressKey('enter')
    .expect(marker.count).eql(1) // Expect usermarker to exist
    .expect(distanceText.count).gt(0) // Expect distance text elements to render
    .expect(distanceText.nth(0).innerText).ok() //Expect distance element innerText to exist
  ;
});

test('UnitItem click event takes to unit page', async(t) => {
  const units =  Selector('#paginatedList-Toimipisteet-results li[role="link"]');
  const name = await units.nth(0).find('p[role="textbox"]').textContent;
  const unitTitleSelector = Selector('.TitleText');

  await t
    .click(units.nth(0))
    .expect(unitTitleSelector.textContent).eql(name);
});

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
  const serviceTitle = await (await serviceTitleSelector.textContent).toLowerCase();
  await t
    .expect(serviceTitle).eql(serviceName.toLowerCase())
  ;
});

test('SearchBar accessibility is OK', async(t) => {

  // Check searchbar input accessibility attributes
  const searchbar = await Selector('#SearchBar input');
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
  await searchUnits(t, 'kirjasto');
  const tabs =  Selector('div[role="tablist"] button[role="tab"]');
  const tab1 = await tabs.nth(0);
  const tab2 = await tabs.nth(1);

  await t
    .expect(tab1.getAttribute('aria-label')).ok('Aria label should exists for tab element')
    .expect(tab2.getAttribute('aria-label')).ok('Aria label should exists for tab element')
  ;
});

test('Search has aria-live element', async(t) => {
  await searchUnits(t, 'kirjasto');
  const resultList = ReactSelector('PaginatedList')
  const results = await resultList.getReact(({props}) => props.data || []);
  const unitCount = await results.filter(result => result.object_type === 'unit').length
  const searchInfo = Selector('.SearchInfo').child(0);
  const siText = await searchInfo.innerText;
  const siAriaLive = await searchInfo.getAttribute('aria-live');

  await t
    // Expect info text to contain unit count
    .expect(siText).contains(unitCount)
    // Expect aria live to be set as polite
    .expect(siAriaLive).eql('polite')
  ;
});

test('Search suggestion arrow navigation does loop correctly', async(t) => {
  const expectedBoxShadowColor = 'rgb(71, 131, 235)'; // Focus color

  // Get SearchBar input
  const input = Selector('#SearchBar input');
  await t
    .click(input)
    .pressKey('down');

  // Suggestion items selector
  const items = Selector('#SuggestionList li[role="option"]');
  let maxItemIndex = await items.count - 1;

  await t
    // After first key down we expect focused suggestion to be at first item
    .expect(items.nth(0).getStyleProperty('box-shadow')).contains(expectedBoxShadowColor, 'Focused suggestion index should be set to first item')
    .pressKey('up')
    // After pressing key up on first item expect focused suggestion to loop to last item
    .expect(items.nth(maxItemIndex).getStyleProperty('box-shadow')).contains(expectedBoxShadowColor, 'Focused suggestion index should loop to last item')
    .pressKey('down')
    // After pressing key down on last item expect focused suggestion to loop to first item
    .expect(items.nth(0).getStyleProperty('box-shadow')).contains(expectedBoxShadowColor, 'Focused suggestion index should loop to first item');
});

test('SettingsInfo works correctly', async(t) => {
  // Click settings in link in settings info
  const settingsInfoButton = Selector('#SettingsLink');
  await t
    .expect(settingsInfoButton.textContent).contains('Muuta haku- tai esteettömyysasetuksia')
    .click(settingsInfoButton)
    .wait(500)
  ;

  // Expect title to be focused in settings view
  const title = Selector('.TitleText');
  const backButton = Selector('button[aria-label="Sulje asetukset"]').nth(0);
  await t
    .expect(title.focused).ok('Expected title to be focused on entering settings view')
    .expect(title.innerText).eql('Asetukset')
    .click(backButton)
    .wait(500)
  ;

  // Expect focus to be back at SettingsInfo button when returning to search view
  const settingsButton = Selector('#SettingsLink');
  await t
    .expect(settingsButton.innerText).contains('Muuta haku- tai esteettömyysasetuksia')
    .expect(settingsButton.focused).ok()
  ;
});


test('Search suggestion click works correctly', async(t) => {
  // Get SearchBar input
  const input = Selector('#SearchBar input');

  // Make new search
  await t
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/search`)
    .click(input)
    .pressKey('ctrl+a delete')
    .typeText(input, 'kirjastoa');

  const items = ReactSelector('SuggestionItem');
  const clickedItem = await items.nth(0);
  const text = await clickedItem.getReact(({props}) => props.fullQuery);
  await t
    .click(clickedItem)
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/search?q=${text}`)
    
});