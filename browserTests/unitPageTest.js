import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import config from '../../config';

const { server } = config;

/* eslint-disable */

fixture`Unit page tests`
  .page`http://${server.address}:${server.port}/fi/unit/8215`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Unit marker is drawn on map', async (t) => {
  const markers = ReactSelector('Marker')

  await t
    .expect(await markers.getReact(({props}) => props.className)).eql('unitMarker', 'marker with correct class name is found on map')
    
});
