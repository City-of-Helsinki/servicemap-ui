/* eslint-disable */
import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import { getBaseUrl } from '../utility';
// Tests are based on this documentaion: https://github.com/City-of-Helsinki/servicemap-ui/wiki/Upotusohje

fixture`Embed view test`
  .beforeEach(async () => {
    await waitForReact();
  });

const unitMarkers = Selector('.unitMarker');
const loadingIndicator = Selector('[data-sm="LoadingIndicator"]');

  // Unit view
  test.page`${getBaseUrl()}/fi/embed/unit/51342`
  ('Embedded unit view shows unit marker', async (t) => {
    await t
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).eql(1, 'Only unit marker should be rendered to map')
  })

  test.page`${getBaseUrl()}/fi/embed/unit/68398?services=961,239&distance=100`
  ('Embedded unit view shows nearby services', async (t) => {
    await t
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).gt(1, 'Unit marker and services should be rendered to map')
  });


  // Search view
  test.page`${getBaseUrl()}/fi/embed/search?q=kirjastot&show_list=side`
  ('Embedded search view shows search results', async (t) => {
    const unitList = Selector('#paginatedList-embeddedResults');
    const unitListItem = unitList.child(0);
    const unitListItemTitle = Selector('[data-sm="ResultItemTitle"]').textContent;
    const unitDialogTitle = Selector('#form-dialog-title').textContent;

    await t
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).gt(1, 'Search results markers should be rendered to map')
      .expect(unitList.childElementCount).gt(0, 'Search results list items should be rendered to list')
      .click(unitListItem)
      .expect(unitDialogTitle).eql(await unitListItemTitle, 'Dialog should open and show unit info');
  });

  test.page`${getBaseUrl()}/fi/embed/search?units=64196,45980,8264,32359`
  ('Embedded search view shows specified units', async (t) => {
    await t
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).eql(4, 'Only specified unit markers should be rendered to map')
  });

  test.page`${getBaseUrl()}/fi/embed/search?service_node=1065,1066,1062`
  ('Embedded search view shows service node units', async (t) => {
    await t
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).gt(0, 'Service node unit markers should be rendered to map')
  });

  // This events test is commented out because it is too unstable. The test fails because LinkedEvents API is sometimes too slow

  // test.page`${getBaseUrl()}/fi/embed/search?events=yso:p4354`
  // ('Embedded search view shows event units', async (t) => {
  //   await t
  //     .expect(unitMarkers.count).gt(0, 'Event unit markers should be rendered to map') 
  // });


  // Service view
  test.page`${getBaseUrl()}/fi/embed/service/813`
  ('Embedded service view shows service units', async (t) => {
    await t
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).gt(1, 'Service unit markers should be rendered to map')
  });


  // Address view
  test.page`${getBaseUrl()}/fi/embed/address/helsinki/Eläintarhantie 3/`
  ('Embedded address view shows nearby service units correctly', async (t) => {
    await t
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).gt(1, 'Service unit markers should be rendered to map')
      .navigateTo(`${getBaseUrl()}/fi/embed/address/helsinki/Eläintarhantie 3/?units=none`)
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).eql(0, 'Service unit markers should be removed from map')
  });


  // Area view
  test.page`${getBaseUrl()}/fi/embed/area?selected=health_station_district&lat=60.2049198&lng=24.8995213`
  ('Embedded area view shows service area units correctly', async (t) => {
    await t
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).gt(0, 'Area service unit markers should be rendered to map')
  });

  test.page`${getBaseUrl()}/fi/embed/area?selected=neighborhood&districts=ocd-division/country:fi/kunta:helsinki/kaupunginosa:011,ocd-division/country:fi/kunta:helsinki/kaupunginosa:014&services=239,813`
  ('Embedded area view shows geographical area service units correctly', async (t) => {
    await t
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).gt(1, 'Area geographical service unit markers should be rendered to map')
  });


  // Division url
  test.page`${getBaseUrl()}/fi/embed/division/kunta:helsinki/kaupunginosa:029?level=all`
  ('Division url shows units and area correctly', async (t) => {
    const district = Selector('.leaflet-pane .leaflet-overlay-pane').find('canvas').exists;
    
    await t
      .expect(loadingIndicator.exists).notOk('should load data')
      .expect(unitMarkers.count).gt(1, 'Division url unit markers should be rendered to map')
      .expect(district).ok('Division area should be rendered to map');
  });

const testOodiContactInfo = async (t) => {
  await t
    .expect(Selector('[data-sm="address-info"]').textContent).contains('Töölönlahdenkatu')
    .expect(Selector('[data-sm="phone-info"]').textContent).contains('310 85000')
    .expect(Selector('[data-sm="email-info"]').textContent).contains('Oodi@hel.fi')
    .expect(Selector('[data-sm="website-info"]').textContent).contains('Kotisivu (uusi välilehti)');
};

test.only.page`${getBaseUrl()}/fi/embed/search?service_node=345&city=helsinki&organization=83e74666-0836-4c1d-948a-4b34a8b90301&selectedUnit=51342`
('Should show contact info with service node search', testOodiContactInfo);
test.only.page`${getBaseUrl()}/fi/embed/search?q=oodi&city=helsinki&organization=83e74666-0836-4c1d-948a-4b34a8b90301&selectedUnit=51342`
('Should show contact info with text search', testOodiContactInfo);
