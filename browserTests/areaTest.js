import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { ClientFunction } from 'testcafe';

import config from './config';
const { server } = config;

fixture`Area view test`
  .page`http://${server.address}:${server.port}/fi/area`
  .beforeEach(async () => {
    await waitForReact();
  });

const drawerButtons = ReactSelector('AreaTab ButtonBase');

test('District lists are fetched and rendered correctly', async (t) => {
  const listLength = await drawerButtons.count;

  for(let i = 0; i < listLength; i++) {  
    await t 
      .click(drawerButtons.nth(i))
      .expect(ReactSelector('Collapse List')).ok('District list not rendered correctly')
      .expect(ReactSelector('Collapse List').childElementCount).gt(0, `Category ${i} did not receive children`)
      .click(drawerButtons.nth(i))
  }
})  

test('District selection is updated' , async (t) => {
  // Select radio button to see if data to draw on map on Districts component changes
  // const districtsComponent = ReactSelector('Districts')

  await t
    .click(drawerButtons.nth(0))
    .pressKey('tab')
    .pressKey('space')

  // const componentProps = districtsComponent.getReact();

  // console.log(await componentProps);

  await t
    .expect(ReactSelector('Districts').getReact(({props}) => props.districtData)).ok('Data not set correctly to Districts component')
    // Select another radio button to see if data changes
    .pressKey('tab')
    .pressKey('space')
    .pressKey('enter')

  // const districtDataType = ReactSelector('Districts').getReact(({props}) => props.districtData[0].type);
  const selectedItem = ReactSelector('Collapse ListItem').nth(1);

  await t
    .expect(selectedItem.classNames).contains(await ReactSelector('Districts').getReact(({props}) => props.districtData[0].type), 'Data not updated correctly to Districts component')
})

test('Unit list functions correctly' , async (t) => {
  const tabButtons = ReactSelector('TabLists ButtonBase');
  const unitList = ReactSelector('UnitTab List').childElementCount;
  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click(drawerButtons.withText('Terveys'))
    .pressKey('tab')
    .pressKey('space')
    .click(tabButtons.nth(1))
    .expect(unitList).gt(0, 'No units listed for selected district')
    .pressKey('tab')
    .pressKey('enter')
    .expect(getLocation()).contains(`${server.address}:${server.port}/fi/unit`);
})

test('Address search bar field updates and gets results', async (t, inputText = 'mann') => {
  const addressBar = ReactSelector('AddressSearchBar InputBase');
  const suggestions = ReactSelector('AddressSearchBar ListItem');

  await t
    .typeText(addressBar, inputText)
    .expect(addressBar.getReact(({props}) => props.value)).eql(inputText)
    .expect(suggestions.count).gt(0)

  const suggestion = suggestions.nth(1);

  await t
    .pressKey('down')
    .pressKey('enter')
    .expect(addressBar.getReact(({props}) => props.value)).eql(await suggestion.textContent, 'Address search bar did not update text when suggesttion was selected')
});
