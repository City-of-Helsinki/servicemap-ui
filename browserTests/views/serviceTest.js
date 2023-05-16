import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { Selector } from 'testcafe';
import config from '../config';
import paginationTest from '../utility/paginationTest';
import resultOrdererTest from '../utility/resultOrdererTest';

const { server } = config;

const coordinates = ['60.281936', '24.949933'];

/* eslint-disable */
fixture`Service page coordinate tests`
  .page`http://${server.address}:${server.port}/fi/service/813?lat=${coordinates[0]}&lon=${coordinates[1]}`
  .beforeEach(async () => {
    await waitForReact();
  });

test('User marker is drawn on map based on coordinates', async (t) => {
  const marker = ReactSelector('CoordinateMarker');
  const coords = await marker.getReact(({props}) => props.position);

  await t
    .expect(marker).ok('no marker found')
    .expect(coords).eql(coordinates, 'user marker coordinates do not match parameter coordinates');
});

const servicePage = `http://${server.address}:${server.port}/fi/service/813`;

fixture `Service page tests`
  .page`${servicePage}`
  .beforeEach(async () => {
    await waitForReact();
  });


paginationTest(servicePage);

resultOrdererTest();

test('Service view list item click takes to correct unit view', async (t) => {
  const units =  Selector('#paginatedList-events li[role="link"]');
  const name = await units.nth(0).find('p[role="textbox"]').textContent;
  const unitTitleSelector = Selector('.TitleText');
  const backToServiceButton = ReactSelector('BackButton').find('.SMBackButton');
  const servicePageTitle = Selector('#view-title');

  await t
    .click(units.nth(0))
    .expect(unitTitleSelector.textContent).eql(name)
    .click(backToServiceButton)
    .expect(servicePageTitle.focused).ok('Expect service page title to be focused')
  ;
});

