/* eslint-disable */
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
  const tab1 = await ReactSelector('TabLists Tab').nth(0).textContent;
  const tab2 = await ReactSelector('TabLists Tab').nth(1).textContent;
  const tab3 = ReactSelector('TabLists Tab').nth(2);
  const tab3Text = await tab3.textContent;
  
  await t
    .expect(title).eql('Topeliuksenkatu 27, Helsinki')
    .expect(tab1).eql('Palvelut täällä asuville')
    .expect(tab2).eql('Alueet')
    .expect(tab3Text.indexOf('Lähellä')).eql(0, 'Tab text should include text "Lähellä"')
    ;

  const divisions = await ReactSelector('DivisionItem').count;
  await t
    .expect(divisions).gt(1, 'First tab should show divisions')
    .click(tab3)
  ;

  const units = await ReactSelector('UnitItem').count;
  await t
    .expect(units).gt(1, 'Closeby units tab should show unit items')
  ;
})
