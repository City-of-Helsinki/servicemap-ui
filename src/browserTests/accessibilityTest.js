/* eslint-disable */
import axeCheck from 'axe-testcafe';

const axeOptions = { rules: { 'label': { enabled: false } } };

fixture`TestCafe Axe test: frontpage`
  .page`http://localhost:2048/fi/`;

test('Automated accessibility testing', async (t) => {
  await axeCheck(t, null, axeOptions);
});

fixture`TestCafe Axe test: search page`
  .page`http://localhost:2048/fi/search?q=kirjasto`;

test('Automated accessibility testing', async (t) => {
  await axeCheck(t, null, axeOptions);
});

fixture`TestCafe Axe test: unit page`
  .page`http://localhost:2048/fi/unit/8215`;

test('Automated accessibility testing', async (t) => {
  await axeCheck(t);
});

fixture`TestCafe Axe test: service page`
  .page`http://localhost:2048/fi/service/813`;

test('Automated accessibility testing', async (t) => {
  await axeCheck(t);
});