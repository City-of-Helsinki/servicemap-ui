import { waitForReact } from 'testcafe-react-selectors';
import config from './config';
import { Selector } from 'testcafe';

const { server } = config;

/* eslint-disable */

fixture`Unit page tests`
  .page`http://${server.address}:${server.port}/fi/unit/8215`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Unit marker is drawn on map', async (t) => {
  const markers = Selector('.leaflet-marker-icon').count;

  await t
    .expect(markers).gt(0, 'no marker found')
    .expect(markers).eql(1, 'multiple markers found, expected single marker');
    
});
