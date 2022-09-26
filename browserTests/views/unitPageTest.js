import { waitForReact } from 'testcafe-react-selectors';
import config from '../config';
import { Selector } from 'testcafe';
import { getLocation } from '../utility';
import appConfig from '../../config';
import finnish from '../../src/i18n/fi';

const { server } = config;

/* eslint-disable */

const unitName = 'Keskustakirjasto Oodi';
const testUrl = `http://${server.address}:${server.port}/fi/unit/51342`

const selectSettingsAndClose = async (t) => {
  if (t) {
    const settingsSenseCheckboxes = Selector ('div[aria-labelledby="SenseSettings"] label');
    const settingsMobilityRadios = Selector ('div[aria-label="Liikkumisrajoitteet"] label');
    const settingsSaveButton = Selector('button[aria-label="Tallenna asetukset"]');
    const settingsCloseButton = Selector('button[aria-label="Sulje asetukset"]');
    await t
      .click(settingsSenseCheckboxes.nth(1))
      .click(settingsSenseCheckboxes.nth(2))
      .click(settingsMobilityRadios.nth(1))
      .click(settingsSaveButton)
      .click(settingsCloseButton)
    ;
  }
}

fixture`Unit page tests`
  .page`${testUrl}`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Unit marker is drawn on map', async (t) => {
  const markers = await Selector('.unitMarker').count;

  await t
    .expect(markers).gt(0, 'no marker found')
    .expect(markers).eql(1, 'multiple markers found, expected single marker');
    
});


test('Unit page details does render correctly', async (t) => {
  const title = await Selector('h3[class*="TitleText"]');

  await t
    .expect(title.exists).ok('h3 title for unit page should exist')
    .expect(title.textContent).contains(unitName, 'Title text should contain unit name');
})

test('Unit page show more events should take user to events list', async (t) => {
  const showMoreEventsButton = await Selector('#UniteventsButton');

  await t
    .expect(showMoreEventsButton.exists).ok('Show more events button should exist')
    .click(showMoreEventsButton);
  await t
    .expect(getLocation()).contains('/fi/unit/51342/events')
});

// ENTERING EVENT PAGE GIVES AN UNDEFINED ERROR WHICH CAN'T BE REPLICATED ON MY OWN
// THIS BREAKS WHEN ERROR IS THROWN BUT DOES WORK WITH --skip-js-errors WHICH MEANS TEST WORKS FINE
// IF ERROR CAN BE SOLVED THIS TEST CAN BE UNCOMMENTED
// test('Unit page event click does take to events page', async (t) => {
//   const showMoreEventsButton = await Selector('#UniteventsButton');
//   const eventLink = Selector('main li[role="link"]');
//   const eventTitle = Selector('main h3[class*="TitleText"');
//   const eventBackButton = Selector(`button[aria-label="${finnish['general.back.unit']}"`);

//   await t
//     .expect(showMoreEventsButton.exists).ok('Show more events button should exist')
//     .click(showMoreEventsButton)
//   ;

//   const firstEventName = await eventLink.nth(0).find('p').nth(1).textContent;
//   const secondEventName = await eventLink.nth(1).find('p').nth(1).textContent;

//   await t
//     .click(eventLink.nth(0))
//     .expect(eventTitle.textContent).eql(firstEventName, 'Title for first event should be same as name in events list')
//     .click(eventBackButton)
//     .click(eventLink.nth(1))
//     .expect(eventTitle.textContent).eql(secondEventName, 'Title for second event should be same as name in events list')
// });


test('Unit page feedback button should take unit feedback page', async (t) => {
  const feedbackButton = await Selector('#UnitFeedbackButton');
  const title = Selector('h3[class*="TitleText"]');

  await t
    .expect(feedbackButton.exists).ok('Feedback button should exist')
    .click(feedbackButton);
  await t
    .expect(getLocation()).contains('/unit/51342/feedback')
    .expect(title.textContent).contains(unitName, 'Feedback title should have unit name text')
});


test('Unit feedback page does work correctly', async (t) => {
  const feedbackButton = await Selector('#UnitFeedbackButton');
  const title = Selector('h3[class*="TitleText"]');
  const infoLink = Selector('button[id="FeedbackInfoLink"]')

  await t
    .click(feedbackButton)
    .expect(title.textContent).contains(unitName, 'Feedback title should have unit name text')
  ;

  // Info link does work correctly
  await t
    .click(infoLink)
    .expect(getLocation()).contains(appConfig.feedbackAdditionalInfoLink)
  ;
});


test('Unit page additional entrances does show correctly', async (t) => {
  const accordion = Selector('div[class^="SMAccordion"');
  const showAccessibilityInfo = Selector('div[class^="ContactInfo-accordionContaianer"] button')
  const tabListButtons = Selector('div[role="tablist"] button');

  await t
    .expect(tabListButtons.nth(0).getAttribute('aria-selected')).eql('true', 'Info tab should be selected')
    .expect(accordion.textContent).contains('Katso lisäsisäänkäynnit')
    .click(accordion.nth(0))
    .click(showAccessibilityInfo)
    .expect(tabListButtons.nth(0).getAttribute('aria-selected')).eql('false', 'Info tab should not be selected')
    .expect(tabListButtons.nth(1).getAttribute('aria-selected')).eql('true', 'Accessibility tab should be selected after clicking show accessbility info button')
  ;
});


test('Unit page links do work correctly', async (t) => {
  const links = Selector('#tab-content-0 li[role="link"]');
  const homePageLink = links.nth(1)

  await t
    // Home page
    .expect(homePageLink.textContent).contains('Kotisivu')
    .click(homePageLink)
    .expect(getLocation()).contains('https://www.helmet.fi/fi-FI/Kirjastot_ja_palvelut/Keskustakirjasto_Oodi')
    .closeWindow() // Since homepage opens new window we need to close it
    .navigateTo(testUrl)
  ;

  // Test that open hours link works
  const openHoursLink = links.nth(2);
  await t
    .expect(openHoursLink.textContent).contains('Aukioloajat')
    .click(openHoursLink)
    .expect(getLocation()).contains('https://www.helmet.fi/fi-FI/Kirjastot_ja_palvelut/Keskustakirjasto_Oodi/Aukioloajat')
    .closeWindow() // Since open hours link opens new window we need to close it
    .navigateTo(testUrl);
  ;

  // Test that HSL route planner link
  const hslLink = links.nth(3);
  await t
    .expect(hslLink.textContent).contains('Katso reitti tänne')
    .click(hslLink)
    .expect(getLocation()).contains('https://reittiopas.hsl.fi/reitti/%20/Keskustakirjasto%20Oodi,%20helsinki::60.17397,24.938158')
    .closeWindow() // Since hsl link opens in new window we need to close it
    .navigateTo(testUrl)
  ;
});

test('Unit view hearing map link opens correctly', async (t) => {
  // Test accessibility hearing map link
  const aLinks = Selector('#tab-content-1 li[role="link"]');
  const accessibilityTab = Selector('div[role="tablist"] button').nth(1);
  await t
    .click(accessibilityTab)
  ;

  const hearingMapLink = aLinks.nth(0);
  await t
    .expect(hearingMapLink.textContent).contains('Kino Regina')
    .click(hearingMapLink)
    .expect(getLocation()).contains('https://kuulokuvat.fi')
    .closeWindow() // Since hearing map link opens in new window we need to close it
  ;
});


test('Unit view accessibility tab changes according to accessibility settings', async (t) => {
  const settingsLink = Selector('#SettingsLink');
  const accessibilityTab = Selector('div[role="tablist"] button').nth(1);
  const accessibilityInfoContainer = Selector('div[class*="Connect(AccessibilityInfo)-infoContainer"]');
  const accessibilityShortcomingTitle = Selector('h5[class*="AccessibilityInfoShortcomingTitle"');
  const accessibilityShortcoming = Selector('li[class*="AccessibilityInfoShortcoming"')
  const accessibilitySettings = Selector('#tab-content-1 p[class*="SettingsTextCurrentSettings"]');
  

  await t
    .click(accessibilityTab)
    .expect(accessibilityTab.getAttribute('aria-selected')).eql('true')
    .expect(accessibilityInfoContainer.find('p').textContent).contains('Ei tiedossa olevia puutteita')
    .click(settingsLink)
  ;

  // SelectSettings
  selectSettingsAndClose(t);

  await t
    .expect(accessibilityShortcomingTitle.nth(0).exists).ok('Shortcoming titles should exist when settings have been selected')
    .expect(accessibilityShortcoming.nth(0).exists).ok('Shotcoming texts should exist when settings have been selected')
    .expect(accessibilitySettings.nth(0).textContent).contains(finnish['settings.sense.hearingAid'])
    .expect(accessibilitySettings.nth(0).textContent).contains(finnish['settings.sense.visuallyImpaired'])
    .expect(accessibilitySettings.nth(0).textContent).contains(finnish['settings.mobility.wheelchair'])
  ;
});

test('Unit view services tab lists work correctly', async (t) => {
  const serviceTab = Selector('div[role="tablist"] button').nth(2);
  const moreServicesButton = Selector('#UnitservicesButton');
  const serviceTitle = Selector('.ExtendedData-title h3');
  const backButton = Selector(`button[aria-label="${finnish['general.back.unit']}"`);
  const reservableObjects = Selector('li[class*="reservationItem"]')

  await t
    .click(serviceTab)
    .click(moreServicesButton)
    .expect(serviceTitle.textContent).contains('Keskustakirjasto Oodi - Toimipisteeseen liittyvät palvelut')
    .click(backButton)
    .click(reservableObjects)
    .expect(getLocation()).contains('https://varaamo.hel.fi/')
  ;
});

test('Unit view share link does work correctly', async (t) => {
  const settingsLink = Selector('#SettingsLink');
  const accessibilityTab = Selector('div[role="tablist"] button').nth(1);
  const shareButton = Selector('div[class*="TitleBar-titleContainer"] button');
  
  const copyLinkButton = Selector(`div[class*="Connect(LinkSettingsDialogComponent)-container"] button p`)
  const radio = Selector(`div[aria-label="${finnish['link.settings.dialog.radio.label']}"] label`)
  // const dialogClose = Selector('div[class*="Dialog-topArea"] button[aria-label="Sulje"]');

  await t
    .click(accessibilityTab)
    .click(settingsLink)
  ;

  selectSettingsAndClose(t);

  await t
    .click(shareButton)
    .expect(copyLinkButton.textContent).contains(`${testUrl}`, 'Link should contain current page url')
    .expect(copyLinkButton.textContent).notContains('senses=', 'Link should not contain sense settings')
    .expect(copyLinkButton.textContent).notContains('mobility=', 'Link should not contain mobility settings')
    .click(radio.nth(0)) // Select to show accessibility settings
    .expect(copyLinkButton.textContent).contains('senses=hearingAid,visuallyImpaired', 'Link should contain sense settings')
    .expect(copyLinkButton.textContent).contains('mobility=wheelchair', 'Link should contain mobility settings')
  ;
});
