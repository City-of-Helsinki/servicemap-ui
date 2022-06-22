/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import config from '../config';
import PaperButtonTest from '../../src/components/PaperButton/__testCafe__/PaperButton.tc';
const { server } = config;

fixture`Home view test`
  .page`http://${server.address}:${server.port}/fi/`
  .beforeEach(async () => {
    await waitForReact();
  });

test('PaperButtons work correctly', async (t) => {
  await PaperButtonTest(t);
});
