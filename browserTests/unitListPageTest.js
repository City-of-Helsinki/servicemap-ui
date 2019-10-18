import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import config from './config';

const { server } = config;

/* eslint-disable */

const pages = [
  `http://${server.address}:${server.port}/fi/unit/8215/events`,
  `http://${server.address}:${server.port}/fi/unit/8215/services`,
  `http://${server.address}:${server.port}/fi/unit/8215/reservations`
];

// Common tests for all list pages
fixture`List page title and map tests`
pages.forEach(page => {
  test
    .page(page)
    (`Page: ${page} has correct title`, async (t) => {
      const view = ReactSelector('UnitFullListView');
      const title = ReactSelector('UnitFullListView TitleBar');
    
      const titleText = await title.getReact(({props}) => props.title);
      const unitName = await view.getReact(({props}) => props.unit.name.fi);
    
      await t
        .expect(titleText).notEql(undefined, 'no title text')
        .expect(unitName).notEql(undefined, 'no unit name as props')
        .expect(titleText).eql(unitName, 'title name does not match unit name')
    })
  test
    .page(page)
    (`Page: ${page} displays unit on map`, async (t) => {
      const markers = ReactSelector('UnitMarkers');    
      const markerList = await markers.getReact(({props}) => props.data.units);
    
      await t
        .expect(markerList.length).gt(0, 'no unit marker on map')
        .expect(markerList.length).lt(2, 'too many unit markers on map')
    })
})

// Events list tests
fixture`Unit event list page tests`
  .page`http://${server.address}:${server.port}/fi/unit/8215/events`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Page has list of events', async (t) => {
  const content   = ReactSelector('Events');
  const listItem = ReactSelector('Events ResultItem')

  const eventsData = await content.getReact(({props}) => props.eventsData);
  const listItemCount = await listItem.count

  if (eventsData.events && eventsData.events.length) {
    await t
      .expect(listItemCount).eql(eventsData.events.length, 'list item count does not match event count')
  } else {
    await t
      .expect(eventsData).notEql(undefined, 'data error')
      .expect(eventsData.events).notEql(undefined, 'data error')
  }
})

// Service list tests
fixture`Unit services list page tests`
  .page`http://${server.address}:${server.port}/fi/unit/8215/services`
  .beforeEach(async () => {
    await waitForReact();
  }); 

test('Page has list of services', async (t) => {
  const content     = ReactSelector('Services');
  const listItem = ReactSelector('Services ServiceItem')

  const unitData = await content.getReact(({props}) => props.unit);
  const listItemCount = await listItem.count

  await t
    .expect(unitData).notEql(undefined, 'no unit data on props')
    .expect(unitData.services.length).gt(0, 'no services found on unit data')
    .expect(listItemCount).eql(unitData.services.length, 'list item count does not match prop service count')
})


// Reservations list tests
fixture`Unit reservations list page tests`
  .page`http://${server.address}:${server.port}/fi/unit/8215/reservations`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Page has list of reservations', async (t) => {
  const content   = ReactSelector('Reservations');
  const listItem = ReactSelector('Reservations SimpleListItem')

  const reservationsData = await content.getReact(({props}) => props.reservations);
  const listItemCount = await listItem.count

  if (reservationsData.length) {
    await t
      .expect(listItemCount).eql(reservationsData.length, 'list item count does not match reservation count')
  } else {
    await t
      .expect(reservationsData).notEql(undefined, 'data error')
  }
})
