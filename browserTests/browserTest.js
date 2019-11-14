/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';

import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import config from './config';
const { server } = config;

// TODO: move these to the related view folders
fixture`Frontpage tests`
  .page`http://${server.address}:${server.port}/fi`
  .beforeEach(async () => {
    await waitForReact();
  });

const getLocation = ClientFunction(() => document.location.href);


const testFinnish = async (t) => {
  const languageButtons = ReactSelector('Button');
  const title = Selector('.app-title').textContent;
  const text = await languageButtons.nth(1).innerText.then(s => s.toLocaleLowerCase());

  await t
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/en`)
    .expect(title).eql('Service map')
    .expect(text).contains('suomi')
    
    
    .click(languageButtons.nth(1))
    .navigateTo(`http://${server.address}:${server.port}/fi`);
};

test('Language does change', async (t) => {
  const languageButtons = ReactSelector('ButtonBase');
  const title = Selector('.app-title').textContent;
  const text = await languageButtons.nth(2).innerText.then(s => s.toLocaleLowerCase());

  await t
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi`)
    .expect(title).eql('Palvelukartta')
    .expect(text).contains('in english')    
    .click(languageButtons.nth(2))
    .navigateTo(`http://${server.address}:${server.port}/en`);

  testFinnish(t);
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
