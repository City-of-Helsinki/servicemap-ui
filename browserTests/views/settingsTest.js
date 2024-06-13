/* eslint-disable */
import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import { getBaseUrl } from '../utility';
import {
  cityDropdown,
  mapToolsButton,
  mobilityDropdown,
  organisationDropdown,
  sensesDropdown,
} from '../utility/pageObjects';

const sensesDropdownSelector = Selector(sensesDropdown)
const mobilityDropdownSelector = Selector(mobilityDropdown)
const cityDropdownSelector = Selector(cityDropdown)
const organisationDropdownSelector = Selector(organisationDropdown)

fixture`Settings view tests`
  .page`${getBaseUrl()}/fi/`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Settings does opens and closes correctly', async (t) => {
  await t
    .expect(sensesDropdownSelector.visible).notOk()
    .expect(mobilityDropdownSelector.visible).notOk()
    .expect(cityDropdownSelector.visible).notOk()
    .expect(organisationDropdownSelector.visible).notOk()
  ;

  await t
    .click(Selector('[data-sm="SettingsMenuButton"]'))
  ;

  await t
    .expect(sensesDropdownSelector.visible).ok()
    .expect(mobilityDropdownSelector.visible).ok()
    .expect(cityDropdownSelector.visible).ok()
    .expect(organisationDropdownSelector.visible).ok()
  ;
});

test('Map tool menu should contain 3d map link', async (t) => {
  const mapLink = Selector('[data-sm="3dMapLink"]');
  await t
    .expect(mapLink.visible).notOk()
    .click(mapToolsButton)
    .expect(mapLink.visible).ok()
  ;
});

// TODO: fix this unstable test
// test('Settings saves correctly', async (t) => {
//   openSettings(t);
//
//   const settings = Selector('#SettingsContainer');
//   const checkboxGroup = settings.find('[aria-labelledby=SenseSettings]');
//   const checkboxes = checkboxGroup.find('input[type=checkbox]');
//   const topSaveButton = settings.find('button[aria-label="Tallenna"]').nth(0);
//   const bottomSaveButton = settings.find('button[aria-label="Tallenna asetukset"]').nth(0);
//   const ariaLiveElement = settings.find('p[aria-live="polite"]').nth(0);
//   const closeButton = settings.find('button[aria-label="Sulje asetukset"]').nth(1);
//
//   await t
//     .click(checkboxes.nth(1))
//     .expect(checkboxes.nth(1).checked).ok('Expected second checkbox to be checked')
//     .expect(ariaLiveElement.innerText).contains(
//       'Asetukset muutettu. Muista tallentaa',
//       'Expect aria live element to have state information about settings change'
//     )
//     .click(bottomSaveButton)
//     .expect(ariaLiveElement.innerText).contains(
//       'Asetukset on tallennettu',
//       'Expected aria live element to have state information about saved settings'
//     )
//     // Focus should be moved after save in order to avoid loss of focus on mobile
//     .expect(closeButton.focused).ok('Expect focus to move to close button on save')
//   ;
//
//   const title = Selector('.TitleText');
//   await t
//     .click(checkboxes.nth(1))
//     .expect(checkboxes.nth(1).checked).notOk('Expected second checkbox to be unchecked')
//     .expect(ariaLiveElement.innerText).contains(
//       'Asetukset muutettu. Muista tallentaa',
//       'Expect aria live element to have state information about settings change'
//     )
//     .click(topSaveButton)
//     .expect(ariaLiveElement.innerText).contains(
//       'Asetukset on tallennettu',
//       'Expected aria live element to have state information about saved settings'
//     )
//     .expect(title.focused).ok('Expect focus to move to title on confirmation box save')
//   ;
// })
