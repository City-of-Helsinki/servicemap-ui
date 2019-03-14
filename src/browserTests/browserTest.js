/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';

import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

// TODO: move these to the related view folders
fixture`Frontpage tests`
  .page`http://localhost:2048/fi`
  .beforeEach(async () => {
    await waitForReact();
  });

const getLocation = ClientFunction(() => document.location.href);

test('Language does change', async (t) => {
  const languageButtons = ReactSelector('Button');
  const title =           ReactSelector('FormattedMessage');

  await t
    .expect(getLocation()).contains('http://localhost:2048/fi')
    .expect(title.innerText).eql('Palvelukartta')
    .expect(languageButtons.nth(0).innerText).eql('ENGLISH')
    .expect(languageButtons.nth(1).innerText).eql('SVENSKA')
    
    .click(languageButtons.nth(0))
    .expect(getLocation()).contains('http://localhost:2048/en')
    .expect(title.innerText).eql('Service map')
    .expect(languageButtons.nth(0).innerText).eql('SUOMI')
    .expect(languageButtons.nth(1).innerText).eql('SVENSKA')

    .click(languageButtons.nth(1))
    .expect(getLocation()).contains('http://localhost:2048/sv')
    .expect(title.innerText).eql('Servicekarta')
    .expect(languageButtons.nth(0).innerText).eql('SUOMI')
    .expect(languageButtons.nth(1).innerText).eql('ENGLISH');
});


fixture`Map tests`
  .page`http://localhost:2048/en`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Transit marker visible after zoom', async (t) => {
  const zoomIn  = Selector('.leaflet-control-zoom-in');
  const markers = ReactSelector('Marker');
  
  // Zoom in to make transit markers visible
  for(let i = 0; i < 4; i++) {
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
