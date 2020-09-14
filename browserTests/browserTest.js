/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';

import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import { paletteDefault, paletteDark } from '../src/themes'
import config from './config';
const { server } = config;

const siteRoot = `http://${server.address}:${server.port}`;

// TODO: move these to the related view folders
fixture`General tests`
  .page`${siteRoot}/fi`
  .beforeEach(async () => {
    await waitForReact();
  });

const getLocation = ClientFunction(() => document.location.href);


test('Language does change', async (t) => {
  const languageButtons = ReactSelector('WithStyles(ForwardRef(ButtonBase))');
  const title = Selector('.app-title');

  await t
    .expect(getLocation()).contains(`${siteRoot}/fi`)
    .expect(title.textContent).eql('Palvelukartta')
    .expect(await languageButtons.nth(2).innerText.then(s => s.toLocaleLowerCase())).contains('in english')
    // This event doesn't work for test cafe. Using custom navigation
    // WIP: figure out how to make language click event work with testcafe
    // .click(languageButtons.nth(2))
    .navigateTo(`${siteRoot}/en`)
    .expect(getLocation()).contains(`${siteRoot}/en`)
    .expect(title.textContent).eql('Service map')
  ;

  await t
    .expect(await languageButtons.nth(3).innerText.then(s => s.toLocaleLowerCase())).contains('på svenska')
    // This event doesn't work for test cafe. Using custom navigation
    // WIP: figure out how to make language click event work with testcafe
    //.click(languageButtons.nth(3))
    .navigateTo(`${siteRoot}/sv`)
    .expect(getLocation()).contains(`${siteRoot}/sv`)
    .expect(title.textContent).eql('Servicekarta')
  ;
});

test('Contrast does change', async (t) => {
  const contrastButton = ReactSelector('WithStyles(ForwardRef(ButtonBase))').nth(4);
  const searchbarContainer = Selector('main').find('.SearchBar');

  await t
    .expect(searchbarContainer.getStyleProperty('background-image')).contains(paletteDefault.background.front)
    .click(contrastButton)
    .expect(searchbarContainer.getStyleProperty('background-image')).contains(paletteDark.background.front)
  ;
});

fixture`Map tests`
  .page`http://${server.address}:${server.port}/fi`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Transit marker visible after zoom', async (t) => {
  const zoomIn  = Selector('.leaflet-control-zoom-in');
  const markers = ReactSelector('Marker');
  
  // Zoom in to make transit markers visible
  for(let i = 0; i < 6; i++) {
    await t 
      .click(zoomIn)
      .wait(100)
  }
  await t
  // Wait for markers to appear
    .wait(2000)

  const markerCount = await markers.count

  await t
    .expect(markerCount).gt(0, 'no transit markers found on high zoom')
});
