import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import config from '../config';
import { Selector } from 'testcafe';

/* eslint-disable */
const { server } = config;

fixture`Map tests`
  .page`http://${server.address}:${server.port}/fi`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Transit marker visible after zoom', async (t) => {
  const zoomIn  = Selector('.zoomIn');
  const markers = Selector('.leaflet-marker-icon');
  
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

fixture`Search unit geometry test`
  .page`http://${server.address}:${server.port}/fi/search?q=latu`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Unit geometry is drawn on map', async (t) => {
  const polygon = Selector('.leaflet-pane .leaflet-overlay-pane').find('canvas');
  const listItem = Selector('#paginatedList-Toimipisteet-results li[role="link"]').nth(0);
  await t
    .click(listItem)
    .expect(polygon.exists).ok('Unit geometry not drawn on map');
});

fixture`Unit page geometry test`
  .page`http://${server.address}:${server.port}/fi/unit/56544`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Unit geometry is drawn on map', async (t) => {
  const polygon = Selector('.leaflet-pane .leaflet-overlay-pane').find('canvas');
  await t
    .expect(polygon.exists).ok();
});
