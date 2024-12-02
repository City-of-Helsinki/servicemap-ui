import { waitForReact } from 'testcafe-react-selectors';
import { Selector } from 'testcafe';
import { acceptCookieConcent, getBaseUrl } from '../utility';

/* eslint-disable */
fixture`Map tests`
  .page`${getBaseUrl()}/fi`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });

test.skip('Transit marker visible after zoom', async (t) => {
  const zoomIn  = Selector('.zoomIn');
  const markers = Selector('.leaflet-marker-icon');
  
  // Zoom in to make transit markers visible
  for(let i = 0; i < 6; i++) {
    await t 
      .click(zoomIn)
      .wait(1000)
  }
  await t
  // Wait for markers to appear
    .wait(2000)

  await t
    .expect(markers.count).gt(0, 'no transit markers found on high zoom')
});

fixture`Search unit geometry test`
  .page`${getBaseUrl()}/fi/search?q=latu`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });

test('Unit geometry is drawn on map', async (t) => {
  const polygon = Selector('.leaflet-pane .leaflet-overlay-pane').find('svg');
  const listItem = Selector('#paginatedList-Toimipisteet-results li[role="link"]').nth(0);
  await t
    .click(listItem)
    .expect(polygon.exists).ok('Unit geometry not drawn on map');
});

fixture`Unit page geometry test`
  .page`${getBaseUrl()}/fi/unit/56544`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });

test('Unit geometry is drawn on map', async (t) => {
  const polygon = Selector('.leaflet-pane .leaflet-overlay-pane').find('svg');
  await t
    .expect(polygon.exists).ok();
});
