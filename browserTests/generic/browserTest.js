/* eslint-disable */
import { Selector } from 'testcafe';

import { waitForReact } from 'testcafe-react-selectors';

import { paletteDefault, paletteDark } from '../../src/themes'
import { getBaseUrl, getLocation } from '../utility';

const siteRoot = `${getBaseUrl()}`;

// TODO: move these to the related view folders
fixture`General tests`
  .page`${siteRoot}/fi`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Language does change', async (t) => {
  const languageButtons = Selector('header button');
  const title = Selector('.app-title');
  let text = await languageButtons.nth(1).innerText;

  await t
    .expect(getLocation()).contains(`${siteRoot}/fi`)
    .expect(title.textContent).eql('Palvelukartta')
    .expect(text.toLowerCase()).contains('in english')
    // This event doesn't work for test cafe. Using custom navigation
    // WIP: figure out how to make language click event work with testcafe
    // .click(languageButtons.nth(2))
    .navigateTo(`${siteRoot}/en`)
    .expect(getLocation()).contains(`${siteRoot}/en`)
    .expect(title.textContent).eql('Service map')
  ;


  text = await languageButtons.nth(2).innerText;

  await t
    .expect(text.toLowerCase()).contains('på svenska')
    // This event doesn't work for test cafe. Using custom navigation
    // WIP: figure out how to make language click event work with testcafe
    //.click(languageButtons.nth(3))
    .navigateTo(`${siteRoot}/sv`)
    .expect(getLocation()).contains(`${siteRoot}/sv`)
    .expect(title.textContent).eql('Servicekarta')
  ;
});

test('Contrast does change', async (t) => {
  const contrastButton = Selector('#ContrastLink');
  const searchbarContainer = Selector('main').find('.SearchBar');

  await t
    .expect(searchbarContainer.getStyleProperty('background-color')).contains(paletteDefault.primary.main)
    .click(contrastButton)
    .expect(searchbarContainer.getStyleProperty('background-color')).contains(paletteDark.primary.main)
  ;
});
