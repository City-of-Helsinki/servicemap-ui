/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import config from '../../config';
const { server } = config;

// Unit id to test - using Kallion kirjasto
const unitID = 8215;

fixture`TitleBar tests`
  .page`http://${server.address}:${server.port}/fi/unit/${unitID}`
  .beforeEach(async () => {
    await waitForReact();
  });

const getLocation = ClientFunction(() => document.location.href);

test('TitleBar title is correctly unit name', async (t) => {
  const titleBar = ReactSelector('TitleBar');
  const unitView = ReactSelector('UnitView');
  const title = await titleBar.getReact(({props}) => props.title);
  const assertionText = await unitView.getReact(({props}) => props.unit.name.fi);

  await t
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/unit/${unitID}`)
    .expect(title).eql(assertionText);
});

test('TitleBar back button works correctly', async (t) => {
  await t
    .navigateTo(`http://${server.address}:${server.port}/fi/search`)
    .navigateTo(`http://${server.address}:${server.port}/fi/unit/${unitID}`);

  const titleBar = ReactSelector('TitleBar');
  const button = await titleBar.findReact('BackButton');

  // Check that back button takes us to previous page /fi/search
  await t
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/unit/${unitID}`)
    .click(button)
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/search`);

});

test('TitleBar home button works correctly', async (t) => {
  const titleBar = ReactSelector('TitleBar');
  const button = await titleBar.findReact('HomeButton');

  // Check that home button takes us to home page /fi/
  await t
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/unit/${unitID}`)
    .click(button)
    .expect(getLocation()).contains(`http://${server.address}:${server.port}/fi/`);

});