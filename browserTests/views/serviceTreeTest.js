import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';

import { acceptCookieConcent, getBaseUrl, getLocation } from '../utility';
import finnish from '../../src/i18n/fi';
import { treeSearchTest, treeViewAccordionTest } from '../utility/TreeViewTest';

const searchBackButton = Selector('#SearchBar .SMBackButton');

/* eslint-disable */
fixture`Service tree page tests`
  .page`${getBaseUrl()}/fi/services`
  .beforeEach(async (t) => {
    await waitForReact();
    await acceptCookieConcent(t);
  });

treeViewAccordionTest();

test('Service tree search works correctly', async (t) => {
  await treeSearchTest(t);

  await t
    .expect(getLocation()).contains('/fi/search?service_node=')
    .expect(searchBackButton.getAttribute('aria-label')).eql(finnish['general.back.serviceTree'])
    .click(searchBackButton)
    .expect(getLocation()).contains('/fi/services')
  ;
});
