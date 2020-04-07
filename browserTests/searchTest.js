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
    .pressKey('tab') // Tabs to cancel button
    .pressKey('tab') // Tabs to search icon button
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
    .pressKey('tab') // Tabs to cancel button
    .pressKey('tab') // Tabs to search icon button
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

test('Expanded suggestions does open and close correctly', async(t) => {
  const button = await Selector('#ExpandSuggestions');
  await t
    .click(button);
  
  const backButton = await ReactSelector('BackButton');
  await t
    .expect(backButton.focused).ok('Titlebar\'s back button should have focus')
    // Go back to search view
    .click(backButton);

  const viewText = await Selector('#view-title').innerText;
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

test('Search suggestion arrow navigation does loop correctly', async(t) => {
  // Get SearchBar focused suggestion value
  const searchbar = ReactSelector('SearchBar');
  // Get SearchBar input
  const input = ReactSelector('InputBase');
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
