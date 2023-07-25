/* eslint-disable */
import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';

import config from '../config';
import { getLocation } from '../utility';
const { server } = config;

const viewUrl = `http://${server.address}:${server.port}/fi/`;

fixture`Home view test`
  .page`${viewUrl}`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Test home page navigation button clicks take user to correct pages', async (t) => {
  const backButton = Selector('[data-sm="BackButton"]');
  //Buttons
  const areaButton = Selector('#AreaPage');
  const servicesButton = Selector('#ServicePage');
  const feedbackButton = Selector('#FeedbackLink');
  const infoButton = Selector('#PageInfoLink');

  await t
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
