/* eslint-disable */
import axeCheck from 'axe-testcafe';

fixture`TestCafe tests with Axe`
  .page`http://localhost:2048/fi`;

test('Automated accessibility testing', async (t) => {
  await axeCheck(t);
});
