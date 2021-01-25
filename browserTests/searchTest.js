/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { viewTitleID } from '../src/utils/accessibility';

import config from './config';
const { server } = config;

fixture`Search view test`
  .page`http://${server.address}:${server.port}/fi/search?q=uimastadion`
  .beforeEach(async () => {
    await waitForReact();
  });

const getLocation = ClientFunction(() => document.location.href);

const searchUnits = async (t, search = 'uimastadion') => {
  const input = ReactSelector('WithStyles(ForwardRef(InputBase))');

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

test('Navigate search view', async (t) => {
  // Test result orderer navigation
  const unitCount = await searchUnits(t, 'kirjasto');
  const input = ReactSelector('WithStyles(ForwardRef(InputBase))').nth(0);
  let select =  ReactSelector('ResultOrderer WithStyles(ForwardRef(Select))');

  await t
    // .click(input)
    // .pressKey('ctrl+a delete')
    .typeText(input, 't')
    .pressKey('tab') // Tabs to cancel button
    .pressKey('tab') // Tabs to search icon button
    .pressKey('tab') // Result orderer
    .expect(select.getReact(({props}) => props.value)).eql('match-desc')
    .pressKey('down')
    .expect(select.getReact(({props}) => props.value)).eql('alphabetical-desc')
    .pressKey('up')
    .expect(select.getReact(({props}) => props.value)).eql('match-desc');
  // Test result list navigation
  const items =  ReactSelector('TabLists ResultItem');
  // const secondSearchItems = firstSearchItems.nth(1);

  await t
    .typeText(input, 't')
    .pressKey('tab') // Tabs to cancel button
    .pressKey('tab') // Tabs to search icon button
    .pressKey('tab') // Result orderer
    .pressKey('tab') // First tab
    .pressKey('tab') // Address search
    .pressKey('tab') // Address search clear
    .pressKey('tab') // Tabs to first item in list
    .expect(items.nth(0).focused).ok('Tab did move focus to first list item')
    .pressKey('tab')
    .expect(items.nth(1).focused).ok('Tab did move focus to second list item')
    .pressKey('shift+tab')
    .expect(items.nth(0).focused).ok('Tab did move focus back to first list item');

});

test('Tab navigation works correctly', async (t) => {
  // Test tabs navigation
  await searchUnits(t, 'kirjasto');
  const tabs =  ReactSelector('TabLists WithStyles(ForwardRef(Tab))');
  const services =  ReactSelector('TabLists ServiceItem');
  const units =  ReactSelector('TabLists UnitItem');

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
  // const unitCount = await searchUnits(t);
  const searchView = ReactSelector('SearchView')
  await t
    .expect(searchView.getReact(({props}) => props.units.length)).gt(5, `Search didn't get results`);
});

// Check that address search works and draws marker on map
test('Address search does work', async (t) => {
  await searchUnits(t, 'kirjasto');
  const addressInput = ReactSelector('WithStyles(ForwardRef(InputBase))').nth(2);
  const suggestions = ReactSelector('AddressSearchBar WithStyles(ForwardRef(ListItem))');
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
  const tabs =  ReactSelector('TabLists WithStyles(ForwardRef(Tab))');
  const units =  ReactSelector('TabLists UnitItem');
  const id = await units.nth(0).getReact(({props}) => props.unit.id);
  const target = `http://${server.address}:${server.port}/fi/unit/${id}`;

  await t
    .click(units.nth(0))
    .navigateTo(target);
});

test('ServiceItem click event takes to service page', async(t) => {
  await searchUnits(t, 'kirjasto');
  const tabs =  ReactSelector('TabLists WithStyles(ForwardRef(Tab))');

  await t
    .click(tabs.nth(1));

  const services =  ReactSelector('TabLists ServiceItem');
  const id = await services.nth(0).getReact(({props}) => props.service.id);
  const target = `http://${server.address}:${server.port}/fi/service/${id}`;

  await t
    .click(services.nth(0))
    .navigateTo(target);
});

test('Expanded suggestions does open and close correctly', async(t) => {
  const button = await Selector('#ExpandSuggestions');
  await t
    .click(button);
  
  const backButton = await ReactSelector('BackButton');
  await t
    .expect(backButton.focused).ok('Titlebar\'s back button should have focus')
    // Go back to search view
    .click(backButton);

  const viewText = await Selector(`#${viewTitleID}`).innerText;
  const button2 = await Selector('#ExpandSuggestions');
  await t
    // Check that back button takes back to correct view
    .expect(viewText).eql('Hakutulosnäkymä', 'BackButton should take user back to search view')
    // Check that focus is moved correctly when returning to search view
    .expect(button2.focused).ok('ExpandSuggestions button should have focus');

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
  const suggestion = await Selector('#SuggestionList li');
  const suggestionRole = await suggestion.getAttribute('role');
  await t
    // We expect suggestions to open on searchbar click
    .expect(suggestion).ok('Suggestions should appear on search input activation')
    // We expect suggestion list items to have link role
    .expect(suggestionRole).eql('link', 'Suggestion should be considered link');
});

test('ResultList accessibility attributes are OK', async(t) => {
  // Check that result list items have correct accessibility attributes
  const result = await ReactSelector('UnitItem');
  const resultRole = await result.getAttribute('role');
  const resultTabindex = await result.getAttribute('tabindex');
  const resultImageAria = await result.findReact('img').getAttribute('aria-hidden');

  // console.log(resultTitle, resultDistance);
  await t
    // We expect UnitItem role to be link
    .expect(resultRole).eql('link', 'UnitItem should have role=link')
    // We expect UnitItem tabindex to be 0
    .expect(resultTabindex).eql('0', 'UnitItem should have tabindex=0')
    // We expect UnitItem logo image aria-hidden to be true
    .expect(resultImageAria).eql('true', 'UnitItem image icon should be aria-hidden')

  const resultSRText = await result.findReact('p').nth(0); // .innerText;
  await t
    // We expect UnitItem screen reader text to exist
    .expect(resultSRText.hasClass('ResultItem-srOnly')).ok('Expected UnitItem srOnly text to have class ResultItem-srOnly')
    // We expect UnitItem screen reader text to have actual text
    .expect(resultSRText.innerText).ok('Expected ResultItem-srOnly to have text for screen readers');

  const resultTitle = await result.findReact('p').nth(1); // .getAttribute('aria-hidden');
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

test('SuggestionButton accessibility attributes are OK', async(t) => {
    // Check that ExapndSuggestions has correct accessibility attributes
    const expandedSuggestionsButton = await Selector('#ExpandSuggestions');
    const esbRole = await expandedSuggestionsButton.getAttribute('role')
    await t
      // We expect ExpandedSearchButton to have role link since it takes to another view 
      .expect(esbRole).eql('link', 'ExpandedSearchButton should be considered a link');
});

test('Tabs accessibility attributes are OK', async(t) => {
  await searchUnits(t, 'kirjasto');
  const tabs = ReactSelector('WithStyles(ForwardRef(Tab))');
  const tab1 = await tabs.nth(0);
  const tab2 = await tabs.nth(1);

  await t
    .expect(tab1.getAttribute('aria-label')).ok('Aria label should exists for tab element')
    .expect(tab2.getAttribute('aria-label')).ok('Aria label should exists for tab element')
  ;
});

test('Search has aria-live element', async(t) => {
  await searchUnits(t, 'kirjasto');
  const view = ReactSelector('SearchView');
  const units = await view.getReact(({props}) => props.units ? props.units : []);
  const unitCount = await units.filter(unit => unit.object_type === 'unit').length
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
  // Get SearchBar focused suggestion value
  const searchbar = ReactSelector('SearchBar');
  // Get SearchBar input
  const input = ReactSelector('WithStyles(ForwardRef(InputBase))');
  await t
    .click(input)
    .pressKey('down');

  const items = ReactSelector('SuggestionItem');
  let maxItemIndex = await items.count - 1;

  await t
    // After first key down we expect focused suggestion to be at first item
    .expect(searchbar.getReact(({props, state}) => state.focusedSuggestion)).eql(0, 'Focused suggestion index should be set to first item')
    .pressKey('up')
    // After pressing key up on first item expect focused suggestion to loop to last item
    .expect(searchbar.getReact(({props, state}) => state.focusedSuggestion)).eql(maxItemIndex, 'Focused suggestion index should loop to last item')
    .pressKey('down')
    // After pressing key down on last item expect focused suggestion to loop to first item
    .expect(searchbar.getReact(({props, state}) => state.focusedSuggestion)).eql(0, 'Focused suggestion index should loop to first item');
});

test('SettingsInfo works correctly', async(t) => {
  // Click settings in link in settings info
  const settingsInfoButton = await ReactSelector('SettingsInfo WithStyles(ForwardRef(ButtonBase))');
  const siText = await settingsInfoButton.innerText;
  await t
    .expect(siText).contains('Muuta haku- tai esteettömyysasetuksia')
    .click(settingsInfoButton)
    .wait(500)
  ;

  // Expect title to be focused in settings view
  const title = Selector('.SettingsTitle').child(0);
  const backButton = Selector('button[aria-label="Sulje asetukset"]').nth(0);
  await t
    .expect(title.focused).ok('Expected title to be focused on entering settings view')
    .expect(title.innerText).eql('Asetukset')
    .click(backButton)
    .wait(500)
  ;

  // Expect focus to be back at SettingsInfo button when returning to search view
  const settingsButton = ReactSelector('SettingsInfo WithStyles(ForwardRef(ButtonBase))');
  await t
    .expect(settingsButton.innerText).contains('Muuta haku- tai esteettömyysasetuksia')
    .expect(settingsButton.focused).ok()
  ;
});


test('Search suggestion click works correctly', async(t) => {
  // Get SearchBar input
  const input = ReactSelector('WithStyles(ForwardRef(InputBase))');

  // Make new search
  await t
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/search`)
    .click(input)
    .pressKey('ctrl+a delete')
    .typeText(input, 'kirjastoa');

  const items = ReactSelector('SuggestionItem');
  const clickedItem = await items.nth(0);
  const text = await clickedItem.getReact(({props}) => props.text);
  await t
    .click(clickedItem)
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/search?q=${text}`)
    
});
