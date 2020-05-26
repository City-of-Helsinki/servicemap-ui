/* eslint-disable */
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { ClientFunction } from 'testcafe';
import addressBarTests from '../src/views/AreaView/components/AddressSearchBar/tests';

import config from './config';
const { server } = config;

fixture`Area view test`
  .page`http://${server.address}:${server.port}/fi/area`
  .beforeEach(async () => {
    await waitForReact();
  });

const drawerButtons = ReactSelector('AreaTab ButtonBase');

// test('District lists are fetched and rendered correctly', async (t) => {
//   const listLength = await drawerButtons.count;

//   for(let i = 0; i < listLength; i++) {  
//     await t 
//       .click(drawerButtons.nth(i))
//       .expect(ReactSelector('Collapse List')).ok('District list not rendered correctly')
//       .expect(ReactSelector('Collapse List').childElementCount).gt(0, `Category ${i} did not receive children`)
//       .click(drawerButtons.nth(i))
//   }
// })  

// test('District selection is updated' , async (t) => {
//   // Select radio button to see if data to draw on map on Districts component changes
//   await t
//     .click(drawerButtons.nth(0))
//     .pressKey('tab')
//     .pressKey('space')

//   let districtDataType = ReactSelector('Districts').getReact(({props}) => props.districtData[0].type);
//   let selectionText = ReactSelector('Collapse ListItem');

//   await t
//     .expect(selectionText.classNames).contains(await districtDataType)
//     // Select another radio button to see if data changes
//     .pressKey('tab')
//     .pressKey('space')
//     .pressKey('enter')

//   districtDataType = ReactSelector('Districts').getReact(({props}) => props.districtData[0].type);
//   selectionText = ReactSelector('Collapse ListItem').nth(1);

//   await t
//     .expect(selectionText.classNames).contains(await districtDataType)
// })

// test('Unit list functions correctly' , async (t) => {
//   const tabButtons = ReactSelector('TabLists ButtonBase');
//   const unitList = ReactSelector('UnitTab List').childElementCount;
//   const getLocation = ClientFunction(() => document.location.href);

//   await t
//     .click(drawerButtons.withText('Terveys'))
//     .pressKey('tab')
//     .pressKey('space')
//     .click(tabButtons.nth(1))
//     .expect(unitList).gt(0, 'No units listed for selected district')
//     .expect(test.district).eql(123)
//     .pressKey('tab')
//     .pressKey('enter')
//     .expect(getLocation()).contains(`${server.address}:${server.port}/fi/unit`);
// })

addressBarTests()


