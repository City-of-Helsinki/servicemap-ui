import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { Selector } from 'testcafe';
import config from '../../config';

const { server } = config;

/* eslint-disable */

fixture`Unit page tests`
  .page`http://${server.address}:${server.port}/fi/unit/8215`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Unit page has unit information', async (t) => {
  const content = Selector('.Content');
  let nonEmptyElements = 0;

  const divNumber = await content.child('div').count;

  // Filter out empty info elements
  for (let i = 0; i < divNumber; i++) {
    if (await content.child('div').nth(i).child().count > 0) {
      nonEmptyElements++;
    }
  }

  await t
    .expect(nonEmptyElements).gt(1, 'unit page has content in addition to title bar ')
});

test('Unit marker is drawn on map', async (t) => {
  const markers = ReactSelector('Marker')

  await t
    .expect(await markers.getReact(({props}) => props.id)).eql('unitMarker', 'marker with correct id is found on map')
    
});
