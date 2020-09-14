/* eslint-disable */
import { Selector } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import config from './config';
const { server } = config;
fixture`Address view test`
  .page`http://${server.address}:${server.port}/fi/address/helsinki/Topeliuksenkatu/27`
  .beforeEach(async () => {
    await waitForReact();
  });

test('AddressView does render correct view', async (t) => {
  const title = await ReactSelector('TitleBar').getReact(({props}) => props.title);
  const tab1 = await ReactSelector('TabLists WithStyles(ForwardRef(Tab))').nth(0).textContent;
  const tab2 = ReactSelector('TabLists WithStyles(ForwardRef(Tab))').nth(1);
  const tab2Text = await tab2.textContent;
  
  await t
    .expect(title).eql('Topeliuksenkatu 27, Helsinki')
    .expect(tab1).eql('Palvelut täällä asuville')
    .expect(tab2Text.indexOf('Lähellä')).eql(0, 'Tab text should include text "Lähellä"')
    ;

  const divisions = await ReactSelector('DivisionItem').count;
  await t
    .expect(divisions).gt(1, 'First tab should show divisions')
    .click(tab2)
  ;

  const units = await ReactSelector('UnitItem').count;
  await t
    .expect(units).gt(1, 'Closeby units tab should show unit items')
  ;
});

test('AddressView map renders correctly', async (t) => {
  const zoomOut = await Selector('.leaflet-control-zoom-out');
  await t
    .click(zoomOut)
    .click(zoomOut)
    .wait(500)
  ;

  // By default administrative district tab should be open with unit markers
  let markers = await Selector('.unitMarker, .unitClusterMarker').count;
  await t
    .expect(markers).gt(1)
  ;

  // Change to nearby tab and expect markers to appear
  const closebyTab = await ReactSelector('TabLists WithStyles(ForwardRef(Tab))').nth(1);
  await t
    .click(closebyTab)
    .wait(500)
  ;
  markers = await Selector('.unitMarker, .unitClusterMarker').count;
  await t
    // Expect markers to appear
    .expect(markers).gt(1)
  ;
});
