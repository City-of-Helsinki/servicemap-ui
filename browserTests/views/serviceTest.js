import { Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { acceptCookieConcent, getBaseUrl } from '../utility';

import paginationTest from '../utility/paginationTest';
import resultOrdererTest from '../utility/resultOrdererTest';

const coordinates = ['60.281936', '24.949933'];

/* eslint-disable */
fixture`Service page coordinate tests`
  .page`${getBaseUrl()}/fi/service/813?lat=${coordinates[0]}&lon=${coordinates[1]}`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });

test('User marker is drawn on map based on coordinates', async (t) => {
  const marker = ReactSelector('CoordinateMarker');
  const coords = await marker.getReact(({props}) => props.position);

  await t
    .expect(marker).ok('no marker found')
    .expect(coords).eql(coordinates, 'user marker coordinates do not match parameter coordinates');
});

const servicePage = `${getBaseUrl()}/fi/service/813`;

fixture`Service page tests`
  .page`${servicePage}`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });


paginationTest(servicePage);

resultOrdererTest();

test('Service view list item click takes to correct unit view', async (t) => {
  const units =  Selector('#paginatedList-events li[role="link"]');
  const name = await units.nth(0).find('p[role="textbox"]').textContent;
  const unitTitleSelector = Selector('.TitleText');
  const backToServiceButton = Selector('[data-sm="BackButton"]');
  const servicePageTitle = Selector('#view-title');

  await t
    .click(units.nth(0))
    .expect(unitTitleSelector.textContent).eql(name)
    .click(backToServiceButton)
    .expect(servicePageTitle.focused).ok('Expect service page title to be focused')
  ;
});

