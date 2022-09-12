/* eslint-disable */
import { ReactSelector } from 'testcafe-react-selectors';
import config from '../config';
import { TitleBarTitleSelector } from '../constants';

const { server } = config;


const pages = [
  `http://${server.address}:${server.port}/fi/unit/51342/events`,
  `http://${server.address}:${server.port}/fi/unit/51342/services`,
  `http://${server.address}:${server.port}/fi/unit/51342/reservations`
];

const unitName = 'Keskustakirjasto Oodi';

// Common tests for all list pages
fixture`Unit view extended data title and map tests`
pages.forEach(page => {
  test
    .page(page)
    (`Page: ${page} has correct title`, async (t) => {
      const title = TitleBarTitleSelector();
    
      await t
        .expect(title.textContent).ok('Title text should exist')
        .expect(title.textContent).contains(unitName, 'Title text should contain unit name')
    })
  test
    .page(page)
    (`Page: ${page} displays unit on map`, async (t) => {
      const markers = ReactSelector('MarkerCluster');    
      const markerList = await markers.getReact(({props}) => props.data);
    
      await t
        .expect(markerList.length).gt(0, 'no unit marker on map')
        .expect(markerList.length).lt(2, 'too many unit markers on map')
    })
})

