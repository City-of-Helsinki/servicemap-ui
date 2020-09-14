/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import config from './config';

const { server } = config;


fixture`Settings view tests`
  .page`http://${server.address}:${server.port}/fi/`
  .beforeEach(async () => {
    await waitForReact();
  });

const openSettings = async t => {
  const openButton = Selector('#SettingsButtonaccessibilitySettings');
  await t
    .click(openButton)
  ;
}

test('Settings does opens and closes correctly', async (t) => {
  await openSettings(t);

  const title = ReactSelector('TitleBar').child(0);
  const closeButton = ReactSelector('Settings').findReact('WithStyles(ForwardRef(ButtonBase))');
  await t
    .expect(title.focused).ok()
    .expect(title.innerText).eql('Esteettömyysasetukset')
    .click(closeButton)
    .expect(Selector('.SettingsContainer').exists).notOk()
  ;
});

test('Settings does work like dialog', async (t) => {
  openSettings(t);

  const settingsContainer = Selector('#SettingsContainer');
  const buttons = ReactSelector('Settings').findReact('WithStyles(ForwardRef(ButtonBase))');
  const buttonCount = await buttons.count;
  const closeButton = buttons.nth(0);

  await t
    .expect(settingsContainer.getAttribute('role')).eql('dialog', "Expected container to have role dialog")
    .click(ReactSelector('Settings').find('span').nth(0))
    .pressKey('tab') // Tab to close button
    .pressKey('shift+tab') // Shift tab back to 
    .expect(buttons.nth(buttonCount - 1).focused).ok('Expected dialog to loop backwards to last element of dialog')
    .pressKey('tab')
    .expect(closeButton.focused).ok('Expected close button to be focused after looping back to start')
  ;
});

test('Settings radio and checkbox buttons are grouped', async (t) => {
  openSettings(t);

  const settings = ReactSelector('Settings');
  const checkboxGroup = settings.find('[aria-labelledby=SenseSettings]');
  const checkboxes = checkboxGroup.find('input[type=checkbox]');
  await t
    .expect(checkboxGroup.exists).ok('Checkbox group does exist')
    .expect(checkboxGroup.getAttribute('role')).eql('group')
    .expect(checkboxGroup.getAttribute('aria-labelledby')).ok('Aria-labelleby should exist')
    .expect(checkboxes.count).eql(3, 'Expect 3 checkbox options to exist under sense settings')
  ;

  const radioGroup = settings.find('[aria-label=Liikkumisrajoitteet]');
  const radios = radioGroup.find('input[type=radio]');
  await t
    .expect(radioGroup.exists).ok('Expect mobility settings radiogroup to exist')
    .expect(radioGroup.getAttribute('role')).eql('radiogroup')
    .expect(radioGroup.getAttribute('aria-label')).ok('Aria-label should exist')
    .expect(radios.count).eql(5, 'Expect 5 radio buttons to exist under mobility settings')
  ;
});

test('Settings saves correctly', async (t) => {
  openSettings(t);

  const settings = ReactSelector('Settings');
  const checkboxGroup = settings.find('[aria-labelledby=SenseSettings]');
  const checkboxes = checkboxGroup.find('input[type=checkbox]');
  const saveButton = settings.find('button[aria-label="Tallenna asetukset"]').nth(0);
  const ariaLiveElement = settings.find('span[aria-live=polite]').nth(0);
  await t
    .click(checkboxes.nth(1))
    .expect(checkboxes.nth(1).checked).ok('Expected second checkbox to be checked')
    .expect(ariaLiveElement.innerText).contains(
      'Asetukset muutettu. Muista tallentaa',
      'Expect aria live element to have state information about settings change'
    )
    .click(saveButton)
    .expect(ariaLiveElement.innerText).contains(
      'Asetukset on tallennettu',
      'Expected aria live element to have state information about saved settings'
    )
  ;
})
