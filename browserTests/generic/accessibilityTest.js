/* eslint-disable */
import axeCheck from 'axe-testcafe';
import { getBaseUrl } from '../utility';
import focusIndicatorTest from '../utility/focusIndicatorTest';
import componentContrastTest from '../utility/componentContrastTest';

const axeOptions = { rules: { 'label': { enabled: false } } };

const axeCheckHandler = (t) => {
  return axeCheck(t, null, axeOptions)
}

fixture`TestCafe Axe test: frontpage`
  .page`${getBaseUrl()}/fi/`;

  test('Automated accessibility testing', async (t) => {
    await axeCheckHandler(t);
  });

  focusIndicatorTest()
  componentContrastTest('.SMButton');
  componentContrastTest('.SMBackButton');


fixture`TestCafe Axe test: search page`
  .page`${getBaseUrl()}/fi/search?q=kirjasto`;

  test('Automated accessibility testing', async (t) => {
    await axeCheckHandler(t);
  });

  focusIndicatorTest()
  componentContrastTest('.SMButton');
  componentContrastTest('.SMBackButton');


fixture`TestCafe Axe test: unit page`
  .page`${getBaseUrl()}/fi/unit/8215`;

  test('Automated accessibility testing', async (t) => {
    await axeCheckHandler(t);
  });

  focusIndicatorTest()
  componentContrastTest('.SMButton');
  componentContrastTest('.SMBackButton');


fixture`TestCafe Axe test: service page`
  .page`${getBaseUrl()}/fi/service/813`;

  test('Automated accessibility testing', async (t) => {
    await axeCheckHandler(t);
  });

  focusIndicatorTest()
  componentContrastTest('.SMButton');
  componentContrastTest('.SMBackButton');


fixture`TestCafe Axe test: address page`
  .page`${getBaseUrl()}/fi/address/helsinki/Fleminginkatu 1`;

  test('Automated accessibility testing', async (t) => {
    await axeCheckHandler(t);
  });

  focusIndicatorTest()
  componentContrastTest('.SMButton');
  componentContrastTest('.SMBackButton');


fixture`TestCafe Axe test: area page`
  .page`${getBaseUrl()}/fi/area`;

  test('Automated accessibility testing', async (t) => {
    await axeCheckHandler(t);
  });

  focusIndicatorTest()
  componentContrastTest('.SMButton');
  componentContrastTest('.SMBackButton');


fixture`TestCafe Axe test: service tree page`
  .page`${getBaseUrl()}/fi/services`;

  test('Automated accessibility testing', async (t) => {
    await axeCheckHandler(t);
  });

  focusIndicatorTest()
  componentContrastTest('.SMButton');
  componentContrastTest('.SMBackButton');


// This page expires when the event is done
fixture`TestCafe Axe test: event page`
  .page`${getBaseUrl()}/fi/event/helmet:190724`;

  test('Automated accessibility testing', async (t) => {
    await axeCheckHandler(t);
  });

  focusIndicatorTest()
  componentContrastTest('.SMButton');
  componentContrastTest('.SMBackButton');

