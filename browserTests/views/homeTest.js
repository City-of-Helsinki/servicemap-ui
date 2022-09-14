/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';

import finnish from '../../src/i18n/fi';
import config from '../config';
import PaperButtonTest from '../components/PaperButton.tc';
import { getLocation } from '../utility';
const { server } = config;

const viewUrl = `http://${server.address}:${server.port}/fi/`;

fixture`Home view test`
  .page`${viewUrl}`
  .beforeEach(async () => {
    await waitForReact();
  });

test('PaperButtons work correctly', async (t) => {
  await PaperButtonTest(t);
});

test('Test home page navigation button clicks take user to correct pages', async (t) => {
  const paperButtons = Selector('div[class*="HomeView-buttonContainer"] button');
  const backButton = Selector(`button[aria-label="${finnish['general.back.home']}"]`)
  
  //Buttons
  const areaButton = paperButtons.nth(0);
  const servicesButton = paperButtons.nth(2);
  const feedbackButton = paperButtons.nth(3);
  const infoButton = paperButtons.nth(4);
  const oldServicemapButton = paperButtons.nth(5);

  await t
    .expect(paperButtons.count).eql(6, 'HomeView should have navigation buttons rendered')
    // Test area button
    .click(areaButton)
    .expect(getLocation()).contains(`${viewUrl}area`)
    .click(backButton)
    // Test services button
    .click(servicesButton)
    .expect(getLocation()).contains(`${viewUrl}services`)
    .click(backButton)
    // Test feedback button
    .click(feedbackButton)
    .expect(getLocation()).contains(`${viewUrl}feedback`)
    .click(backButton)
    // Test info button
    .click(infoButton)
    .expect(getLocation()).contains(`${viewUrl}info`)
    .click(backButton)
    // Test old servicemap link button
    .click(oldServicemapButton)
    .expect(getLocation()).contains('palvelukartta-vanha.hel.fi')
  ;
});

// TODO: update this test
// test('Home view search does take user to search view', async(t) => {
//   const searchInput = Selector('#SearchBar input');
//   const backButton = Selector(`button[aria-label="${finnish['general.back.home']}"]`)
//   const searchButton = Selector('#SearchButton')

//   await t
//     .click(searchInput)
//     .typeText(searchInput, 'kirjasto')
//     .pressKey('enter')
//     .expect(getLocation()).contains(`${viewUrl}search?q=kirjasto`)
//     .click(backButton)
//     .expect(getLocation()).eql(viewUrl)
//     .click(searchButton)
//     .expect(getLocation()).contains(`${viewUrl}search?q=kirjasto`)
//   ;
// });
