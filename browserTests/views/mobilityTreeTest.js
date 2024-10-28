import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';

import finnish from '../../src/i18n/fi';
import { acceptCookieConcent, getBaseUrl, getLocation } from '../utility';
import { treeSearchTest, treeViewAccordionTest } from '../utility/TreeViewTest';

const searchBackButton = Selector('#SearchBar .SMBackButton');

/* eslint-disable */
fixture`Mobility tree page tests`
  .page`${getBaseUrl()}/fi/mobility`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });

  treeViewAccordionTest();

test('Mobility tree search works correctly', async (t) => {
  await treeSearchTest(t);
  await t
    .expect(getLocation()).contains('/fi/search?mobility_node=')
    .expect(searchBackButton.getAttribute('aria-label')).eql(finnish['general.back.mobilityTree'])
    .click(searchBackButton)
    .expect(getLocation()).contains('/fi/mobility')
  ;
});
