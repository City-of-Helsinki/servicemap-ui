import { waitForReact } from 'testcafe-react-selectors';
import config from './config';
import { Selector } from 'testcafe';

const { server } = config;

/* eslint-disable */

// Re-usable city filter test.
const cityFilteredMarkersTest = (page) => {
  test
    .page `${page}`
    ('Unit count changes when city parameters are changed', async (t) => {
      const zoomOut = await Selector('.zoomOut');
      await t
        .click(zoomOut)
        .click(zoomOut)
        .click(zoomOut)
        .click(zoomOut)

      // Get initial marker count
      const markerCount = await Selector('.unitMarker').count;

      await t
        .navigateTo(`${page}&city=helsinki`)
        .click(zoomOut)
        .click(zoomOut)
        .click(zoomOut)
        .click(zoomOut)

      // Get marker count after adding city parameter
      const newMarkerCount = await Selector('.unitMarker').count;
      
      await t
        .expect(newMarkerCount).lt(markerCount, 'filtering with city does not change number of units')
        .expect(newMarkerCount).gt(1, 'filtering with city did not return new units')
    });
}






// Embedded unit view tests
const unitId = '8158';
fixture`Single embedded unit page tests`
  .page`http://${server.address}:${server.port}/fi/embed/unit/${unitId}`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Embedded unit marker is drawn on map', async (t) => {
  const markers = await Selector('.unitMarker').count;

  await t
    .expect(markers).gt(0, 'no marker found')
    .expect(markers).eql(1, 'multiple markers found, expected single marker');  
});

test
  .page `http://${server.address}:${server.port}/fi/embed/unit/${unitId}?services=813&distance=3000`
  ('Embedded unit marker nearby services are drawn on map', async (t) => {
    const zoomOut = await Selector('.zoomOut');
    await t
      .click(zoomOut)
      .click(zoomOut)
      .click(zoomOut)
      .click(zoomOut)

    const markerCount = await Selector('.unitMarker').count;
    await t
      .expect(markerCount).gt(0, 'no markers found')
      .expect(markerCount).gt(1, 'no service markers found')
      
    // Increase distance
    await t
      .navigateTo(`http://${server.address}:${server.port}/fi/embed/unit/${unitId}?services=813&distance=8000`)
  
    const newMarkerCount = await Selector('.unitMarker').count;

    await t
      .click(zoomOut)
      .click(zoomOut)
      .click(zoomOut)
      .click(zoomOut)
      .expect(newMarkerCount).gt(markerCount, 'distance increase does not change number of units')
    });

// Test city parameter
cityFilteredMarkersTest(`http://${server.address}:${server.port}/fi/embed/unit/${unitId}?services=813&distance=8000`);


// Embedded search view test
const searchQuery = 'kirjasto';
fixture`Embedded search results page tests`
  .page`http://${server.address}:${server.port}/fi/embed/search?q=${searchQuery}`
  .beforeEach(async () => {
    await waitForReact();
  });