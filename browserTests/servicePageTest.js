import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import config from './config';

const { server } = config;

const coordinates = ['60.281936', '24.949933'];

/* eslint-disable */
fixture`Service page tests`
  .page`http://${server.address}:${server.port}/fi/service/813?latLng=${coordinates[0]},${coordinates[1]}`
  .beforeEach(async () => {
    await waitForReact();
  });

test('User marker is drawn on map based on coordinates', async (t) => {
  const marker = ReactSelector('UserMarker');
  const coords = await marker.getReact(({props}) => props.position);

  await t
    .expect(marker).ok('no marker found')
    .expect(coords).eql(coordinates, 'user marker coordinates do not match parameter coordinates');
});
