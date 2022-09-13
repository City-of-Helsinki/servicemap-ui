import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import config from '../config';
import { getLocation } from '../utility';
import finnish from '../../src/i18n/fi';

const { server } = config;

const searchButton = Selector('#ServiceTreeSearchButton');
const accordion = Selector('div[class*="SMAccordion-accordionContainer"]');
const innerAccordion = (accordion) => accordion.find('div[class*="MuiCollapse-root"] ul li div[class*="SMAccordion-accordionContainer"]');
const accordionCheckbox = (accordion) => accordion.find('input[type="checkbox"]')
const searchBackButton = Selector('#SearchBar .SMBackButton')

/* eslint-disable */
fixture`Service tree page tests`
  .page`http://${server.address}:${server.port}/fi/services`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Accordions work correctly', async (t) => {
  await t
    .expect(innerAccordion(accordion.nth(0)).count).eql(0, 'Accordion shouldn\'t have child items visible')
    .click(accordion.nth(0).find('button'))
    .expect(innerAccordion(accordion.nth(0)).count).gt(0, 'Accordion should have child items visible after selection')
  ;
  
  const firstInnerAccordion = innerAccordion(accordion.nth(0));
  await t
    .expect(innerAccordion(firstInnerAccordion).count).eql(0, 'First inner accordion shouldn\'t have child items visible')
    .click(firstInnerAccordion.find('button'))
    .expect(innerAccordion(firstInnerAccordion).count).gt(0, 'First inner accordion should have child items visible after selection')
});

test('Service tree search works correctly', async (t) => {
  const rootCategory = accordion.nth(4);

  await t
    .expect(searchButton.getAttribute('disabled') !== undefined).ok('Service tree search button should be disabled by default')
    .click(rootCategory)
    .click(accordionCheckbox(innerAccordion(rootCategory).nth(1)))
    .click(accordionCheckbox(innerAccordion(rootCategory).nth(2)))
    .expect(searchButton.getAttribute('disabled')).notOk('Search button should be active after selecting services')
    .click(searchButton)
    .expect(getLocation()).contains('/fi/search?service_node=')
    .expect(searchBackButton.getAttribute('aria-label')).eql(finnish['general.back.serviceTree'])
    .click(searchBackButton)
    .expect(getLocation()).contains('/fi/services')
  ;
});

test('Service tree selection removal works correctly', async (t) => {
  const rootCategory = accordion.nth(4);
  const selectionList = Selector('ul[class*="injectIntl(Connect(ServiceTreeView))-seleectionList"] li')
  const selectionsButton = Selector('button[class*="injectIntl(Connect(ServiceTreeView))-selectionsButton"]')
  const removeSelectionsButton = Selector('button[class*="injectIntl(Connect(ServiceTreeView))-right"]')
  
  // Remove selections works correctly
  await t
    .click(rootCategory)
    .click(accordionCheckbox(innerAccordion(rootCategory).nth(1)))
    .expect(accordionCheckbox(innerAccordion(rootCategory).nth(1)).getAttribute('checked') !== undefined).ok('Checkbox should be checked after selection')
    .click(selectionsButton)
    .click(accordionCheckbox(innerAccordion(rootCategory).nth(2)))
    .expect(accordionCheckbox(innerAccordion(rootCategory).nth(2)).getAttribute('checked') !== undefined).ok('Checkbox should be checked after selection')
    .click(accordionCheckbox(innerAccordion(rootCategory).nth(3)))
    .expect(accordionCheckbox(innerAccordion(rootCategory).nth(3)).getAttribute('checked') !== undefined).ok('Checkbox should be checked after selection')
    .expect(selectionList.count).eql(3, 'Selection list should show selected items')
    .click(selectionList.nth(2).find('button'))
    .expect(accordionCheckbox(innerAccordion(rootCategory).nth(3)).getAttribute('checked')).notOk('Checkbox should be unchecked after clicking remove selections')
    .expect(selectionList.count).eql(2, 'Selection list should show correct number of items after removing one')
    .click(removeSelectionsButton)
    .expect(selectionList.count).eql(0, 'Selection list should be empty after clicking remove all selections')
    .expect(accordionCheckbox(innerAccordion(rootCategory).nth(1)).getAttribute('checked')).notOk('Checkbox should be unchecked after clicking remove selections')
    .expect(accordionCheckbox(innerAccordion(rootCategory).nth(2)).getAttribute('checked')).notOk('Checkbox should be unchecked after clicking remove selections')
  ;
});
