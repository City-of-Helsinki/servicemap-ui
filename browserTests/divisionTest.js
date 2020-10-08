/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import config from './config';
const { server } = config;

fixture`Division view test`
  .page`http://${server.address}:${server.port}/fi/embed/division/kunta:helsinki/kaupunginosa:029?level=all`
  .beforeEach(async () => {
    await waitForReact();
  });

/*
TODO: Check that unit markers are drawn on map
test('Unit markers are drawn on map', async (t) => {

  const fetchData = async (t, search = 'uimastadion') => {
    const content = ReactSelector('MapView');

    const data = await content.getReact(({props}) => props.isFetching);

    return data;
  }
  const test = await fetchData();
  console.log(test);

  const markers = await Selector('.leaflet-marker-icon').count;

  await t
    .expect(markers).gt(0, 'no markers found')
});
*/

test('District is drawn on map', async (t) => {
  const district = await Selector('.leaflet-zoom-animated g').hasChildNodes;

  await t
    .expect(district).ok('district not drawn on map');
});
