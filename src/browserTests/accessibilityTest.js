/* eslint-disable */
import axeCheck from 'axe-testcafe';

fixture`TestCafe Axe test: frontpage`
  .page`http://localhost:2048/fi/`;

test('Automated accessibility testing', async (t) => {
  await axeCheck(t);
});

fixture`TestCafe Axe test: unit page`
  .page`http://localhost:2048/fi/unit/8215`;

test('Automated accessibility testing', async (t) => {
  await axeCheck(t);
});
